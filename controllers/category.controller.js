// controllers/category.controller.js
const categoryModel = require('../models/category.model');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const category = await categoryModel.getById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const category = await categoryModel.create(req.body);
    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const category = await categoryModel.update(req.params.id, req.body);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category updated', category });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const success = await categoryModel.remove(req.params.id);
    if (!success) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
