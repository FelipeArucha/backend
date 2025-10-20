// controllers/user.controller.js
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.register = async (req, res, next) => {
  try {
    console.log('Registro de usuario - payload:', req.body);
    const { username, password, email, role } = req.body;
    console.log('Campo role recibido:', role);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ username, password: hashedPassword, email, role });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updated = await userModel.update(id, req.body);
    res.json({ message: 'Usuario actualizado', user: updated });
  } catch (err) {
    next(err);
  }
};

exports.softDelete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await userModel.softDelete(id);
    res.json({ message: 'Usuario desactivado', user: deleted });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ message: 'Login successful', token });
  } catch (err) {
    next(err);
  }
};
