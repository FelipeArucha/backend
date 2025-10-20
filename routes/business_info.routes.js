// routes/business_info.routes.js
const express = require('express')
const router = express.Router()
const { getInfo, updateInfo, createInfo, uploadLogo } = require('../controllers/business_info.controller')
const auth = require('../middlewares/auth.middleware')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/business'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})
const upload = multer({ storage })

router.use(auth)

// Subir logo de negocio
router.post('/upload-logo', upload.single('logo'), uploadLogo)
// Obtener info de negocio (solo admin o seller)
router.get('/',  getInfo)
// Actualizar info (solo admin)
router.put('/', updateInfo)
// Crear info (solo admin, normalmente solo una vez)
router.post('/', createInfo)

module.exports = router
