// controllers/sale.controller.js
const saleModel = require("../models/sale.model");
const salesDetailsModel = require("../models/sales_details.model");
const productModel = require("../models/product.model");
const clientModel = require("../models/client.model");
const { sendEmail } = require("../utils/email");

exports.getAll = async (req, res, next) => {
  try {
    const sales = await saleModel.getAll();
    res.json(sales);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const sale = await saleModel.getById(req.params.id);
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    const details = await salesDetailsModel.getBySaleId(req.params.id);
    res.json({ ...sale, details });
  } catch (err) {
    next(err);
  }
};

// exports.create = async (req, res, next) => {
//   try {
//     const { details, ...saleData } = req.body;
//     const sale = await saleModel.create(saleData);
//     if (details && Array.isArray(details) && details.length > 0) {
//       await salesDetailsModel.create(sale.id, details);
//       // Actualizar stock de productos (disminuir)
//       for (const item of details) {
//         await productModel.updateStock(item.product_id, item.quantity, 'decrease');
//       }
//     }
//     const fullSale = { ...sale, details: details || [] };

//     // Buscar email del cliente
//     let clientEmail = null;
//     if (sale.client_id) {
//       const client = await clientModel.getById(sale.client_id);
//       clientEmail = client && client.email ? client.email : null;
//     }

//     // Enviar email si hay correo de cliente
//     if (clientEmail) {
//       try {
//         const saleReceiptTemplate = require('../templates/sale_receipt.template');
//         // Obtener datos reales de business_info
//         const businessInfoModel = require('../models/business_info.model');
//         const info = await businessInfoModel.get();
//         // Armar logo absoluto si es relativo
//         let logoUrl = '';
//         if (info && info.logo_url) {
//           logoUrl = info.logo_url.startsWith('http') ? info.logo_url : `http://localhost:3000${info.logo_url}`;
//         }
//         const businessInfo = {
//           name: info?.name || '',
//           address: info?.address || '',
//           phone: info?.phone || '',
//           tax_id: info?.fiscal_id || '',
//           logoUrl
//         };
//         const client = await clientModel.getById(sale.client_id);
//         const html = saleReceiptTemplate({ sale, client, details: details || [], businessInfo });
//         await sendEmail({
//           to: clientEmail,
//           subject: 'Comprobante de venta',
//           text: `Gracias por su compra. Total: $${sale.total}`,
//           html
//         });
//       } catch (err) {
//         // No bloquear la venta si falla el email
//         console.error('Error enviando email:', err.message);
//       }
//     }

//     res.status(201).json({ message: 'Sale created', sale: fullSale });
//   } catch (err) {
//     next(err);
//   }
// };
exports.create = async (req, res, next) => {
  try {
    const { details = [], ...saleData } = req.body;

    // 1️⃣ Crear venta
    const sale = await saleModel.create(saleData);

    // 2️⃣ Crear detalles + actualizar stock
    if (details.length > 0) {
      await salesDetailsModel.create(sale.id, details);

      // Actualizar stock EN PARALELO
      await Promise.all(
        details.map((item) =>
          productModel.updateStock(item.product_id, item.quantity, "decrease")
        )
      );
    }

    const fullSale = { ...sale, details };

    // 3️⃣ RESPONDER INMEDIATAMENTE
    res.status(201).json({
      message: "Sale created",
      sale: fullSale,
    });

    // 4️⃣ EMAIL EN BACKGROUND (NO BLOQUEA)
    setImmediate(async () => {
      try {
        if (!sale.client_id) return;

        // Obtener cliente (UNA sola vez)
        const client = await clientModel.getById(sale.client_id);
        if (!client || !client.email) return;

        // Obtener info del negocio
        const businessInfoModel = require("../models/business_info.model");
        const info = await businessInfoModel.get();

        let logoUrl = "";
        if (info?.logo_url) {
          logoUrl = info.logo_url.startsWith("http")
            ? info.logo_url
            : `${process.env.APP_URL || "http://localhost:3000"}${
                info.logo_url
              }`;
        }

        const businessInfo = {
          name: info?.name || "",
          address: info?.address || "",
          phone: info?.phone || "",
          tax_id: info?.fiscal_id || "",
          logoUrl,
        };

        const saleReceiptTemplate = require("../templates/sale_receipt.template");
        const html = saleReceiptTemplate({
          sale,
          client,
          details,
          businessInfo,
        });

        await sendEmail({
          to: client.email,
          subject: "Comprobante de venta",
          text: `Gracias por su compra. Total: $${sale.total}`,
          html,
        });
      } catch (err) {
        console.error("Error enviando email:", err.message);
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const sale = await saleModel.update(req.params.id, req.body);
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.json({ message: "Sale updated", sale });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await saleModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: "Sale not found" });
    res.json({ message: "Sale deleted" });
  } catch (err) {
    next(err);
  }
};

// Anula una venta, restaura stock y controla errores
// Registrar venta desde el catálogo tras pago exitoso de PayPal
exports.createFromPaypal = async (req, res, next) => {
  try {
    const { client, details, paypal, total, total_tax, total_discount } =
      req.body;
    // Buscar o crear cliente por email
    let client_id = null;
    if (client && client.email) {
      let dbClient = await clientModel.getByEmail(client.email);
      if (!dbClient) {
        dbClient = await clientModel.create({
          name: client.name || "",
          email: client.email,
          tax_id: client.tax_id || null,
          address: client.address || null,
          phone: client.phone || null,
          active: true,
        });
      }
      client_id = dbClient.id;
    }
    // Registrar venta
    const saleData = {
      client_id: client_id,
      user_id: null, // venta desde catálogo
      total,
      total_tax: total_tax || 0,
      total_discount: total_discount || 0,
      sale_date: new Date(),
      status: "completed",
      paypal_id: paypal && paypal.id ? paypal.id : null,
    };
    const sale = await saleModel.create(saleData);
    if (details && Array.isArray(details) && details.length > 0) {
      await salesDetailsModel.create(sale.id, details);
      // Actualizar stock de productos (disminuir)
      for (const item of details) {
        await productModel.updateStock(
          item.product_id,
          item.quantity,
          "decrease"
        );
      }
    }
    // Enviar email de comprobante si hay email
    if (client && client.email) {
      try {
        const saleReceiptTemplate = require("../templates/sale_receipt.template");
        // Obtener datos reales de business_info
        const businessInfoModel = require("../models/business_info.model");
        const info = await businessInfoModel.get();
        let logoUrl = "";
        if (info && info.logo_url) {
          logoUrl = info.logo_url.startsWith("http")
            ? info.logo_url
            : `http://localhost:3000${info.logo_url}`;
        }
        const businessInfo = {
          name: info?.name || "",
          address: info?.address || "",
          phone: info?.phone || "",
          tax_id: info?.fiscal_id || "",
          logoUrl,
        };
        const html = saleReceiptTemplate({
          sale,
          client,
          details: details || [],
          businessInfo,
        });
        await sendEmail({
          to: client.email,
          subject: "Comprobante de venta",
          text: `Gracias por su compra. Total: $${sale.total}`,
          html,
        });
      } catch (err) {
        console.error("Error enviando email:", err.message);
      }
    }
    res.status(201).json({ message: "Venta registrada", sale });
  } catch (err) {
    next(err);
  }
};

// exports.annulSale = async (req, res, next) => {
//   try {
//     const saleId = req.params.id;
//     const userId = req.user.id;
//     // 1. Buscar detalles de la venta
//     const details = await salesDetailsModel.getBySaleId(saleId);
//     // 2. Marcar como anulada (si no lo está)
//     await saleModel.annul(saleId, userId);
//     // 3. Restaurar stock de productos
//     for (const item of details) {
//       await productModel.updateStock(
//         item.product_id,
//         item.quantity,
//         "increase"
//       );
//     }
//     // --------- Enviar email al cliente si tiene email ---------
//     // Buscar venta y cliente
//     const sale = await saleModel.getById(saleId);
//     let clientEmail = null;
//     let client = null;
//     if (sale && sale.client_id) {
//       client = await clientModel.getById(sale.client_id);
//       clientEmail = client && client.email ? client.email : null;
//     }
//     if (clientEmail) {
//       try {
//         const saleReceiptCancelledTemplate = require("../templates/sale_receipt_cancelled.template");
//         const businessInfo = {
//           name: "Mi Empresa",
//           address: "Dirección de la empresa",
//           phone: "0000-0000",
//           tax_id: "",
//           logoUrl: "",
//         };
//         const html = saleReceiptCancelledTemplate({
//           sale,
//           client,
//           details,
//           businessInfo,
//         });
//         await sendEmail({
//           to: clientEmail,
//           subject: "Aviso: Venta anulada",
//           text: `Le informamos que la venta #${sale.id} ha sido ANULADA. Si tiene dudas, contáctenos.`,
//           html,
//         });
//       } catch (err) {
//         console.error("Error enviando email de venta anulada:", err.message);
//       }
//     }
//     // ----------------------------------------------------------
//     res.json({ message: "Venta anulada y stock restaurado" });
//   } catch (err) {
//     next(err);
//   }
// };
exports.annulSale = async (req, res, next) => {
  try {
    const saleId = req.params.id;
    const userId = req.user.id;

    // 1. Obtener detalles de la venta
    const details = await salesDetailsModel.getBySaleId(saleId);

    // 2. Anular la venta
    await saleModel.annul(saleId, userId);

    // 3. Restaurar stock EN PARALELO
    if (details && details.length > 0) {
      await Promise.all(
        details.map((item) =>
          productModel.updateStock(item.product_id, item.quantity, "increase")
        )
      );
    }

    // 4. Responder rápido al frontend
    res.json({ message: "Venta anulada y stock restaurado" });

    // --------------------------------------------------
    // 5. EMAIL EN BACKGROUND (NO BLOQUEANTE)
    // --------------------------------------------------
    (async () => {
      try {
        const sale = await saleModel.getById(saleId);
        if (!sale || !sale.client_id) return;

        const client = await clientModel.getById(sale.client_id);
        if (!client?.email) return;

        const saleReceiptCancelledTemplate = require("../templates/sale_receipt_cancelled.template");
        const businessInfoModel = require("../models/business_info.model");
        const info = await businessInfoModel.get();

        const businessInfo = {
          name: info?.name || "",
          address: info?.address || "",
          phone: info?.phone || "",
          tax_id: info?.fiscal_id || "",
          logoUrl: info?.logo_url || "",
        };

        const html = saleReceiptCancelledTemplate({
          sale,
          client,
          details,
          businessInfo,
        });

        await sendEmail({
          to: client.email,
          subject: "Aviso: Venta anulada",
          text: `Le informamos que la venta #${sale.id} ha sido ANULADA.`,
          html,
        });
      } catch (err) {
        console.error("Error enviando email de venta anulada:", err.message);
      }
    })();
  } catch (err) {
    next(err);
  }
};
