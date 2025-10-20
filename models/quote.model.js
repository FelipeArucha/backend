// models/quote.model.js
const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM quotes');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM quotes WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { client_id, user_id, quote_date, total, total_tax, total_discount, status } = data;
  const [result] = await db.execute(
    'INSERT INTO quotes (client_id, user_id, quote_date, total, total_tax, total_discount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [client_id, user_id, quote_date || new Date(), total, total_tax, total_discount, status || 'pending']
  );
  return { id: result.insertId, client_id, user_id, quote_date, total, total_tax, total_discount, status };
};

exports.update = async (id, data) => {
  const { client_id, user_id, quote_date, total, total_tax, total_discount, status } = data;
  await db.execute(
    'UPDATE quotes SET client_id = ?, user_id = ?, quote_date = ?, total = ?, total_tax = ?, total_discount = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [client_id, user_id, quote_date, total, total_tax, total_discount, status, id]
  );
  return exports.getById(id);
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM quotes WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
