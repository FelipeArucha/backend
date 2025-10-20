const express = require('express');
const router = express.Router();
const productModel = require('../models/product.model');
const clientModel = require('../models/client.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// GET /public/products - Solo productos activos, sin autenticación
router.get('/products', async (req, res) => {
  try {
    const products = await productModel.getAll();
    // Solo productos activos
    const publicProducts = products.filter(p => p.active);
    res.json(publicProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos públicos', error: error.message });
  }
});

// Registro de cliente
router.post('/client-register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    // Revisar si ya existe ese email
    const existing = await clientModel.getByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }
    // Crear cliente (sin password)
    const client = await clientModel.create({ name, email });
    // Guardar hash de password en tabla client_passwords
    const hash = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO client_passwords (client_id, password_hash) VALUES (?, ?)', [client.id, hash]);
    res.status(201).json({ message: 'Cliente registrado', client });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar cliente', error: error.message });
  }
});

// Login de cliente
router.post('/client-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    const client = await clientModel.getByEmail(email);
    if (!client) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
    // Buscar hash de password
    const [rows] = await db.execute('SELECT password_hash FROM client_passwords WHERE client_id = ?', [client.id]);
    if (!rows[0]) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
    // Crear JWT
    const token = jwt.sign({ client_id: client.id, name: client.name, email: client.email }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.json({ token, client: { id: client.id, name: client.name, email: client.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

module.exports = router;
