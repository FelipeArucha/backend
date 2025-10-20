// models/client.model.js
const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM clients');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [id]);
  return rows[0];
};

exports.getByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM clients WHERE email = ?', [email]);
  return rows[0];
};

exports.create = async (data) => {
  // Evitar undefined en parámetros SQL
  const name = data.name ?? null;
  const email = data.email ?? null;
  const phone = data.phone ?? null;
  const address = data.address ?? null;
  const tax_id = data.tax_id ?? null;
  const [result] = await db.execute(
    'INSERT INTO clients (name, email, phone, address, tax_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, address, tax_id]
  );
  return { id: result.insertId, name, email, phone, address, tax_id };
};

// exports.update = async (id, data) => {
//   const { name, email, phone, address, tax_id } = data;
//   await db.execute(
//     'UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, tax_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//     [name, email, phone, address, tax_id, id]
//   );
//   return exports.getById(id);
// };
exports.update = async (id, data) => {
  // Obtener datos actuales
  const current = await exports.getById(id);
  if (!current) throw new Error('Cliente no encontrado');

  // Usar los datos nuevos si vienen, si no, dejar los actuales
  const name = data.name ?? current.name;
  const email = data.email ?? current.email;
  const phone = data.phone ?? current.phone;
  const address = data.address ?? current.address;
  const tax_id = data.tax_id ?? current.tax_id;
  const active = typeof data.active === 'boolean' ? data.active : current.active;

  await db.execute(
    'UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, tax_id = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, email, phone, address, tax_id, active, id]
  );
  return exports.getById(id);
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM clients WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
