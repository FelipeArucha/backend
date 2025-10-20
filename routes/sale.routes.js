// routes/sale.routes.js
const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const auth = require('../middlewares/auth.middleware');

// Endpoint público para registrar venta desde PayPal (catálogo)
router.post('/paypal', saleController.createFromPaypal);

// Todas las rutas requieren autenticación
router.use(auth);

router.get('/', saleController.getAll);
router.get('/:id', saleController.getById);
router.post('/', saleController.create);
router.put('/:id', saleController.update);
router.put('/:id/annul', saleController.annulSale);
router.delete('/:id', saleController.remove);

module.exports = router;
