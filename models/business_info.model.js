// models/business_info.model.js
const db = require('../config/db')

exports.get = async () => {
  const [rows] = await db.execute('SELECT * FROM business_info LIMIT 1')
  return rows[0] || null
}

exports.update = async (data) => {
  // Solo hay un registro, id=1
  const current = await exports.get()
  if (!current) throw new Error('No hay registro de business_info')
  // Convertir undefined a null en todos los campos para evitar errores de bind
  const toNull = v => v === undefined ? null : v
  const { name, logo_url, address, phone, email, website, fiscal_id } = data
  await db.execute(
    'UPDATE business_info SET name=?, logo_url=?, address=?, phone=?, email=?, website=?, fiscal_id=?, updated_at=NOW() WHERE id=1',
    [toNull(name), toNull(logo_url), toNull(address), toNull(phone), toNull(email), toNull(website), toNull(fiscal_id)]
  )
  return exports.get()
}

exports.create = async (data) => {
  const { name, logo_url, address, phone, email, website, fiscal_id } = data
  const [result] = await db.execute(
    'INSERT INTO business_info (name, logo_url, address, phone, email, website, fiscal_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, logo_url, address, phone, email, website, fiscal_id]
  )
  return { id: result.insertId, ...data }
}
