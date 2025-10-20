// controllers/business_info.controller.js
const businessInfoModel = require('../models/business_info.model')

const getInfo = async (req, res, next) => {
  try {
    const info = await businessInfoModel.get()
    res.json(info)
  } catch (err) {
    next(err)
  }
}

const updateInfo = async (req, res, next) => {
  try {
    const updated = await businessInfoModel.update(req.body)
    res.json({ message: 'Business info updated', info: updated })
  } catch (err) {
    next(err)
  }
}

const createInfo = async (req, res, next) => {
  try {
    const created = await businessInfoModel.create(req.body)
    res.status(201).json({ message: 'Business info created', info: created })
  } catch (err) {
    next(err)
  }
}

const uploadLogo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' })
  }
  // Guardar la ruta relativa para logo_url
  const url = `/uploads/business/${req.file.filename}`
  res.json({ url, filename: req.file.filename })
}

module.exports = { getInfo, updateInfo, createInfo, uploadLogo }
