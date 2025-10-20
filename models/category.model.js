// models/category.model.js
const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM categories');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { name, description, active } = data;
  const [result] = await db.execute(
    'INSERT INTO categories (name, description, active) VALUES (?, ?, ?)',
    [name, description, active !== undefined ? active : true]
  );
  return { id: result.insertId, name, description, active };
};

exports.update = async (id, data) => {
  // Obtener datos actuales
  const current = await exports.getById(id);
  if (!current) throw new Error('Categoría no encontrada');

  const name = data.name ?? current.name;
  const description = data.description ?? current.description;
  const active = typeof data.active === 'boolean' ? data.active : current.active;

  await db.execute(
    'UPDATE categories SET name = ?, description = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, active, id]
  );
  return exports.getById(id);
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
