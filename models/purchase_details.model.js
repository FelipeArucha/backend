const db = require('../config/db');

exports.create = async (purchase_id, details) => {
  // details: array de objetos { product_id, quantity, price, tax_rate, discount }
  const values = details.map(d => [purchase_id, d.product_id, d.quantity, d.price, d.tax_rate, d.discount]);
  await db.query(
    'INSERT INTO purchase_details (purchase_id, product_id, quantity, price, tax_rate, discount) VALUES ?',[values]
  );
};

exports.getByPurchaseId = async (purchase_id) => {
  const [rows] = await db.query(`
    SELECT pd.*, p.name AS product_name
    FROM purchase_details pd
    LEFT JOIN products p ON pd.product_id = p.id
    WHERE pd.purchase_id = ?
  `, [purchase_id]);
  return rows;
};

exports.removeByPurchaseId = async (purchase_id) => {
  await db.query('DELETE FROM purchase_details WHERE purchase_id = ?', [purchase_id]);
};
