// routes/quote.routes.js
const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote.controller');
const auth = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
router.use(auth);

router.get('/', quoteController.getAll);
router.get('/:id', quoteController.getById);
router.post('/', quoteController.create);
router.put('/:id', quoteController.update);
router.delete('/:id', quoteController.remove);

module.exports = router;
