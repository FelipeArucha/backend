// models/invoice.model.js
const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM invoices');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM invoices WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { sale_id, invoice_number, issue_date, total, total_tax, total_discount, status } = data;
  const [result] = await db.execute(
    'INSERT INTO invoices (sale_id, invoice_number, issue_date, total, total_tax, total_discount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [sale_id, invoice_number, issue_date || new Date(), total, total_tax, total_discount, status || 'pending']
  );
  return { id: result.insertId, sale_id, invoice_number, issue_date, total, total_tax, total_discount, status };
};

exports.update = async (id, data) => {
  const { sale_id, invoice_number, issue_date, total, total_tax, total_discount, status } = data;
  await db.execute(
    'UPDATE invoices SET sale_id = ?, invoice_number = ?, issue_date = ?, total = ?, total_tax = ?, total_discount = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [sale_id, invoice_number, issue_date, total, total_tax, total_discount, status, id]
  );
  return exports.getById(id);
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM invoices WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
