// controllers/supplier.controller.js
const supplierModel = require('../models/supplier.model');

exports.getAll = async (req, res, next) => {
  try {
    const suppliers = await supplierModel.getAll();
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const supplier = await supplierModel.getById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const supplier = await supplierModel.create(req.body);
    res.status(201).json({ message: 'Supplier created', supplier });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const supplier = await supplierModel.update(req.params.id, req.body);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier updated', supplier });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await supplierModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    next(err);
  }
};
