const db = require('../config/db');

exports.create = async (sale_id, details) => {
  // details: array de objetos { product_id, quantity, price, tax_rate, discount }
  const values = details.map(d => [sale_id, d.product_id, d.quantity, d.price, d.tax_rate, d.discount]);
  await db.query(
    'INSERT INTO sales_details (sale_id, product_id, quantity, price, tax_rate, discount) VALUES ?',[values]
  );
};

exports.getBySaleId = async (sale_id) => {
  const [rows] = await db.query(`
    SELECT sd.*, p.name AS product_name
    FROM sales_details sd
    LEFT JOIN products p ON sd.product_id = p.id
    WHERE sd.sale_id = ?
  `, [sale_id]);
  return rows;
};

exports.removeBySaleId = async (sale_id) => {
  await db.query('DELETE FROM sales_details WHERE sale_id = ?', [sale_id]);
};
