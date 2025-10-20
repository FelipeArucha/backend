// controllers/quote.controller.js
const quoteModel = require('../models/quote.model');

exports.getAll = async (req, res, next) => {
  try {
    const quotes = await quoteModel.getAll();
    res.json(quotes);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const quote = await quoteModel.getById(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const quote = await quoteModel.create(req.body);
    res.status(201).json({ message: 'Quote created', quote });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const quote = await quoteModel.update(req.params.id, req.body);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json({ message: 'Quote updated', quote });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await quoteModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Quote not found' });
    res.json({ message: 'Quote deleted' });
  } catch (err) {
    next(err);
  }
};
