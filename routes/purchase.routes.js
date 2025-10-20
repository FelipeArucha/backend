// routes/purchase.routes.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');
const auth = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
router.use(auth);

router.get('/', purchaseController.getAll);
router.get('/:id', purchaseController.getById);
router.post('/', purchaseController.create);
router.put('/:id', purchaseController.update);
router.delete('/:id', purchaseController.remove);

module.exports = router;
