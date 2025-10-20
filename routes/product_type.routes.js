// routes/product_type.routes.js
const express = require('express');
const router = express.Router();
const productTypeController = require('../controllers/product_type.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.get('/', productTypeController.getAll);
router.get('/:id', productTypeController.getById);
router.post('/', productTypeController.create);
router.put('/:id', productTypeController.update);
router.delete('/:id', productTypeController.remove);

module.exports = router;
