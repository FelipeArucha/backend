// controllers/client.controller.js
const clientModel = require('../models/client.model');

exports.getAll = async (req, res, next) => {
  try {
    const clients = await clientModel.getAll();
    res.json(clients);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const client = await clientModel.getById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const client = await clientModel.create(req.body);
    res.status(201).json({ message: 'Client created', client });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const client = await clientModel.update(req.params.id, req.body);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client updated', client });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await clientModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    next(err);
  }
};
