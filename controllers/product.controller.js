// controllers/product.controller.js
const productModel = require('../models/product.model');

exports.getAll = async (req, res, next) => {
  try {
    const products = await productModel.getAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    // category_id y product_type_id pueden venir en req.body
    const product = await productModel.create(req.body);
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    // category_id y product_type_id pueden venir en req.body
    const product = await productModel.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    next(err);
  }
};

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  // Ruta relativa desde la raíz del backend
  const imageUrl = `/uploads/products/${req.file.filename}`;
  res.status(201).json({ message: 'Image uploaded', image_url: imageUrl });
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await productModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
