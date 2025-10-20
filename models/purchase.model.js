// models/purchase.model.js
const db = require('../config/db');

const purchaseDetailsModel = require('./purchase_details.model');

exports.getAll = async () => {
  const [rows] = await db.execute(`
    SELECT 
      p.id,
      p.supplier_id,
      s.name AS supplier_name,
      p.total,
      p.purchase_date,
      p.created_at,
      p.updated_at,
      'activa' AS status
    FROM purchases p
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    ORDER BY p.created_at DESC
  `);
  // Para cada compra, obtener los detalles
  for (const purchase of rows) {
    purchase.details = await purchaseDetailsModel.getByPurchaseId(purchase.id);
  }
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM purchases WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  // Usar supplier_id, nunca pasar undefined
  const supplier_id = data.supplier_id !== undefined ? data.supplier_id : null;
  const total = data.total !== undefined ? data.total : null;
  const purchase_date = data.purchase_date || new Date();
  const [result] = await db.execute(
    'INSERT INTO purchases (supplier_id, total, purchase_date) VALUES (?, ?, ?)',
    [supplier_id, total, purchase_date]
  );
  return { id: result.insertId, supplier_id, total, purchase_date };
};

exports.update = async (id, data) => {
  const supplier_id = data.supplier_id !== undefined ? data.supplier_id : null;
  const total = data.total !== undefined ? data.total : null;
  const purchase_date = data.purchase_date || new Date();
  await db.execute(
    'UPDATE purchases SET supplier_id = ?, total = ?, purchase_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [supplier_id, total, purchase_date, id]
  );
  return exports.getById(id);
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM purchases WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
