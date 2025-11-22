const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./auth.routes');
const customerRoutes = require('./customer.routes');
const userRoutes = require('./user.routes');

// Usar rutas
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/users', userRoutes);

// Ruta de información de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API ISP Management System',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      users: '/api/users'
    }
  });
});

module.exports = router;