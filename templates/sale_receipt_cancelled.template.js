// Devuelve HTML profesional para comprobante de venta ANULADA
module.exports = function saleReceiptCancelledTemplate({ sale, client, details, businessInfo }) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#fff;color:#222;padding:24px;border:1px solid #eee;position:relative;">
    <tr>
      <td>
        <div style="text-align:center;margin-bottom:12px;">
          <span style="display:inline-block;background:#d32f2f;color:#fff;font-size:22px;font-weight:bold;padding:8px 32px;border-radius:6px;letter-spacing:2px;">VENTA ANULADA</span>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="70" valign="top">
              ${businessInfo.logoUrl ? `<img src="${businessInfo.logoUrl}" alt="Logo" style="height:56px;max-width:70px;display:block;" />` : ''}
            </td>
            <td valign="top">
              <div style="font-size:18px;font-weight:bold;">${businessInfo.name || 'Mi Empresa'}</div>
              <div>${businessInfo.address || ''}</div>
              <div>${businessInfo.phone || ''}</div>
              <div>${businessInfo.tax_id ? 'NIT: ' + businessInfo.tax_id : ''}</div>
            </td>
          </tr>
        </table>
        <hr style="border:0;border-top:1px solid #ccc;margin:16px 0;" />
        <div style="font-size:20px;font-weight:bold;text-align:center;margin:16px 0 12px 0;">Comprobante de venta ANULADA</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
          <tr>
            <td><strong>Fecha:</strong> ${new Date(sale.sale_date).toLocaleDateString()}</td>
            <td align="right"><strong>Folio:</strong> #${sale.id || ''}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Cliente:</strong> ${client.name || ''}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Usuario:</strong> ${sale.user_name || ''}</td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr>
              <th style="border:1px solid #ddd;padding:6px 4px;background:#f5f5f5;font-size:14px;">Producto</th>
              <th style="border:1px solid #ddd;padding:6px 4px;background:#f5f5f5;font-size:14px;">Cantidad</th>
              <th style="border:1px solid #ddd;padding:6px 4px;background:#f5f5f5;font-size:14px;">Precio</th>
              <th style="border:1px solid #ddd;padding:6px 4px;background:#f5f5f5;font-size:14px;">Impuesto</th>
              <th style="border:1px solid #ddd;padding:6px 4px;background:#f5f5f5;font-size:14px;">Descuento</th>
              <th style="border:1px solid #ddd;padding:6px 4px;background:#f5f5f5;font-size:14px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${details.map(item => `
              <tr>
                <td style="border:1px solid #ddd;padding:6px 4px;font-size:13px;">${item.product_name || item.product_id}</td>
                <td style="border:1px solid #ddd;padding:6px 4px;text-align:center;font-size:13px;">${item.quantity}</td>
                <td style="border:1px solid #ddd;padding:6px 4px;text-align:right;font-size:13px;">$${Number(item.price || 0).toFixed(2)}</td>
                <td style="border:1px solid #ddd;padding:6px 4px;text-align:center;font-size:13px;">${Number(item.tax_rate || 0)}%</td>
                <td style="border:1px solid #ddd;padding:6px 4px;text-align:right;font-size:13px;">$${Number(item.discount || 0).toFixed(2)}</td>
                <td style="border:1px solid #ddd;padding:6px 4px;text-align:right;font-size:13px;">$${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
          <tr>
            <td align="right"><strong>Total:</strong> $${Number(sale.total || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td align="right"><strong>Impuestos:</strong> $${Number(sale.total_tax || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td align="right"><strong>Descuento:</strong> $${Number(sale.total_discount || 0).toFixed(2)}</td>
          </tr>
        </table>
        <div style="margin-top:24px;text-align:center;font-size:13px;color:#d32f2f;font-weight:bold;">Esta venta ha sido ANULADA. Si tiene dudas, contáctenos.</div>
      </td>
    </tr>
  </table>
  `
}
