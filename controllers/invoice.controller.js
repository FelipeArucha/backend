// controllers/invoice.controller.js
const invoiceModel = require('../models/invoice.model');

exports.getAll = async (req, res, next) => {
  try {
    const invoices = await invoiceModel.getAll();
    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const invoice = await invoiceModel.getById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const invoice = await invoiceModel.create(req.body);
    res.status(201).json({ message: 'Invoice created', invoice });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const invoice = await invoiceModel.update(req.params.id, req.body);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice updated', invoice });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await invoiceModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    next(err);
  }
};
