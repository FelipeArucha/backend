// controllers/product_type.controller.js
const productTypeModel = require('../models/product_type.model');

exports.getAll = async (req, res, next) => {
  try {
    const types = await productTypeModel.getAll();
    res.json(types);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const type = await productTypeModel.getById(req.params.id);
    if (!type) return res.status(404).json({ error: 'Product type not found' });
    res.json(type);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const type = await productTypeModel.create(req.body);
    res.status(201).json({ message: 'Product type created', type });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const type = await productTypeModel.update(req.params.id, req.body);
    if (!type) return res.status(404).json({ error: 'Product type not found' });
    res.json({ message: 'Product type updated', type });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const success = await productTypeModel.remove(req.params.id);
    if (!success) return res.status(404).json({ error: 'Product type not found' });
    res.json({ message: 'Product type deleted' });
  } catch (err) {
    next(err);
  }
};
