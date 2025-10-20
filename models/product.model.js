// models/product.model.js
const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.execute(`
    SELECT p.*, c.name AS category_name, t.name AS product_type_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_type t ON p.product_type_id = t.id
  `);
  return rows;
};

// Solo productos activos para catálogo público
exports.getAllActive = async () => {
  const [rows] = await db.execute(`
    SELECT p.*, c.name AS category_name, t.name AS product_type_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_type t ON p.product_type_id = t.id
    WHERE p.active = 1
  `);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute(`
    SELECT p.*, c.name AS category_name, t.name AS product_type_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_type t ON p.product_type_id = t.id
    WHERE p.id = ?
  `, [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { name, description, price, tax_rate, discount, stock, category_id, product_type_id, image_url } = data;
  const [result] = await db.execute(
    'INSERT INTO products (name, description, price, tax_rate, discount, stock, category_id, product_type_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, tax_rate, discount, stock, category_id || null, product_type_id || null, image_url || null]
  );
  return exports.getById(result.insertId);
};

exports.update = async (id, data) => {
  // Obtener datos actuales
  const current = await exports.getById(id);
  if (!current) throw new Error('Producto no encontrado');

  // Usar los datos nuevos si vienen, si no, dejar los actuales
  const name = data.name ?? current.name;
  const description = data.description ?? current.description;
  const price = data.price ?? current.price;
  const tax_rate = data.tax_rate ?? current.tax_rate;
  const discount = data.discount ?? current.discount;
  const stock = data.stock ?? current.stock;
  const category_id = data.category_id ?? current.category_id;
  const product_type_id = data.product_type_id ?? current.product_type_id;
  const active = typeof data.active === 'boolean' ? data.active : current.active;
  const image_url = data.image_url ?? current.image_url;

  await db.execute(
    'UPDATE products SET name = ?, description = ?, price = ?, tax_rate = ?, discount = ?, stock = ?, category_id = ?, product_type_id = ?, active = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, price, tax_rate, discount, stock, category_id, product_type_id, active, image_url, id]
  );
  return exports.getById(id);
};

// Cambia el stock de un producto. op puede ser 'increase' o 'decrease'.
exports.updateStock = async (product_id, quantity, op = 'decrease') => {
  // op: 'increase' para compras, 'decrease' para ventas
  const product = await exports.getById(product_id);
  if (!product) throw new Error('Producto no encontrado');
  let newStock = product.stock;
  if (op === 'increase') {
    newStock += quantity;
  } else if (op === 'decrease') {
    newStock -= quantity;
    if (newStock < 0) newStock = 0;
  }
  await db.execute('UPDATE products SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStock, product_id]);
  return newStock;
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
