// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

const auth = require('../middlewares/auth.middleware');

// Solo admin puede registrar usuarios
router.post('/register', auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  userController.register(req, res, next);
});

// Login público
router.post('/login', userController.login);

// Listar todos los usuarios (solo admin)
router.get('/', auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  userController.getAll(req, res, next);
});

// Actualizar usuario (solo admin)
router.put('/:id', auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  userController.update(req, res, next);
});

// Eliminar usuario (soft delete, solo admin)
router.delete('/:id', auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  userController.softDelete(req, res, next);
});

// Ejemplo de ruta protegida (requiere token)
router.get('/profile', auth, (req, res) => {
  res.json({ message: 'User profile', user: req.user });
});

module.exports = router;
