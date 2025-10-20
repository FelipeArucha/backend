// controllers/purchase.controller.js
const purchaseModel = require('../models/purchase.model');
const purchaseDetailsModel = require('../models/purchase_details.model');
const productModel = require('../models/product.model');

exports.getAll = async (req, res, next) => {
  try {
    const purchases = await purchaseModel.getAll();
    res.json(purchases);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const purchase = await purchaseModel.getById(req.params.id);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    const details = await purchaseDetailsModel.getByPurchaseId(req.params.id);
    res.json({ ...purchase, details });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { details, ...purchaseData } = req.body;
    const purchase = await purchaseModel.create(purchaseData);
    if (details && Array.isArray(details) && details.length > 0) {
      await purchaseDetailsModel.create(purchase.id, details);
      // Actualizar stock de productos (aumentar)
      for (const item of details) {
        await productModel.updateStock(item.product_id, item.quantity, 'increase');
      }
    }
    const fullPurchase = { ...purchase, details: details || [] };
    res.status(201).json({ message: 'Purchase created', purchase: fullPurchase });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const purchase = await purchaseModel.update(req.params.id, req.body);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    res.json({ message: 'Purchase updated', purchase });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await purchaseModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Purchase not found' });
    res.json({ message: 'Purchase deleted' });
  } catch (err) {
    next(err);
  }
};
