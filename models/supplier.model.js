// models/supplier.model.js
const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM suppliers');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM suppliers WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { name, email, phone, address, tax_id } = data;
  const [result] = await db.execute(
    'INSERT INTO suppliers (name, email, phone, address, tax_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, address, tax_id]
  );
  return { id: result.insertId, name, email, phone, address, tax_id };
};

exports.update = async (id, data) => {
  // Obtener datos actuales
  const current = await exports.getById(id);
  if (!current) throw new Error('Proveedor no encontrado');

  // Usar los datos nuevos si vienen, si no, dejar los actuales
  const name = data.name ?? current.name;
  const email = data.email ?? current.email;
  const phone = data.phone ?? current.phone;
  const address = data.address ?? current.address;
  const tax_id = data.tax_id ?? current.tax_id;
  const active = typeof data.active === 'boolean' ? data.active : current.active;

  await db.execute(
    'UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ?, tax_id = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, email, phone, address, tax_id, active, id]
  );
  return exports.getById(id);
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM suppliers WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
