// models/sale.model.js
const db = require('../config/db');

const salesDetailsModel = require('./sales_details.model');

exports.getAll = async () => {
  const [rows] = await db.execute(`
  SELECT 
    s.id,
    s.client_id,
    c.name AS client_name,
    s.user_id,
    u.username AS user_name,
    s.total,
    s.total_tax,
    s.total_discount,
    s.sale_date,
    s.created_at,
    s.updated_at,
    s.status AS status
  FROM sales s
  LEFT JOIN clients c ON s.client_id = c.id
  LEFT JOIN users u ON s.user_id = u.id
  ORDER BY s.created_at DESC
  `);
  // Para cada venta, obtener los detalles
  for (const sale of rows) {
    sale.details = await salesDetailsModel.getBySaleId(sale.id);
  }
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM sales WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { client_id, user_id, total, total_tax, total_discount, sale_date } = data;
  const [result] = await db.execute(
    'INSERT INTO sales (client_id, user_id, total, total_tax, total_discount, sale_date) VALUES (?, ?, ?, ?, ?, ?)',
    [client_id, user_id, total, total_tax, total_discount, sale_date || new Date()]
  );
  return { id: result.insertId, client_id, user_id, total, total_tax, total_discount, sale_date };
};

exports.update = async (id, data) => {
  const { client_id, user_id, total, total_tax, total_discount, sale_date } = data;
  await db.execute(
    'UPDATE sales SET client_id = ?, user_id = ?, total = ?, total_tax = ?, total_discount = ?, sale_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [client_id, user_id, total, total_tax, total_discount, sale_date, id]
  );
  return exports.getById(id);
};

// Anula la venta: status = 'anulada', guarda fecha y usuario anulador
exports.annul = async (id, annulled_by = null) => {
  // Verificar si ya está anulada
  const [rows] = await db.execute('SELECT status FROM sales WHERE id = ?', [id]);
  if (!rows[0]) throw new Error('Venta no encontrada');
  if (rows[0].status === 'anulada') throw new Error('La venta ya está anulada');
  await db.execute('UPDATE sales SET status = ?, annulled_at = CURRENT_TIMESTAMP, annulled_by = ? WHERE id = ?', ['anulada', annulled_by, id]);
  return true;
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM sales WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
