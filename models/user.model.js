// models/user.model.js
const db = require('../config/db');

exports.update = async (id, data) => {
  // Permite actualizar también el campo active (soft delete)

  const current = await db.execute('SELECT * FROM users WHERE id = ?', [id]).then(([rows]) => rows[0]);
  if (!current) throw new Error('Usuario no encontrado');

  const username = data.username ?? current.username;
  const email = data.email ?? current.email;
  const role = data.role ?? current.role;
  const active = typeof data.active === 'boolean' ? data.active : current.active;

  await db.execute(
    'UPDATE users SET username = ?, email = ?, role = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [username, email, role, active, id]
  );
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT id, username, email, role, active FROM users');
  return rows;
};

exports.createUser = async ({ username, password, email, role }) => {
  const [result] = await db.execute(
    'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
    [username, password, email, role || 'viewer']
  );
  return { id: result.insertId, username, email, role: role || 'viewer' };
};

exports.softDelete = async (id) => {
  await db.execute('UPDATE users SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.findByUsername = async (username) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};
