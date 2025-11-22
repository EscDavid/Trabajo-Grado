const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { authenticate, checkRole } = require('../middlewares/auth.middleware');
const {
  createCustomerValidation,
  updateCustomerValidation,
  getCustomerByIdValidation,
  changeStatusValidation,
  getCustomersValidation
} = require('../validators/customer.validator');

/**
 * @route   GET /api/customers/stats
 * @desc    Obtener estadísticas de clientes
 * @access  Private (Todos los usuarios autenticados)
 */
router.get(
  '/stats',
  authenticate,
  customerController.getCustomerStats
);

/**
 * @route   GET /api/customers
 * @desc    Obtener todos los clientes
 * @access  Private (Todos los usuarios autenticados)
 */
router.get(
  '/',
  authenticate,
  getCustomersValidation,
  customerController.getAllCustomers
);

/**
 * @route   GET /api/customers/:id
 * @desc    Obtener un cliente por ID
 * @access  Private (Todos los usuarios autenticados)
 */
router.get(
  '/:id',
  authenticate,
  getCustomerByIdValidation,
  customerController.getCustomerById
);

/**
 * @route   POST /api/customers
 * @desc    Crear un nuevo cliente
 * @access  Private (ADMIN, TECNICO)
 */
router.post(
  '/',
  authenticate,
  checkRole(['ADMIN', 'TECNICO']),
  createCustomerValidation,
  customerController.createCustomer
);

/**
 * @route   PUT /api/customers/:id
 * @desc    Actualizar un cliente
 * @access  Private (ADMIN, TECNICO)
 */
router.put(
  '/:id',
  authenticate,
  checkRole(['ADMIN', 'TECNICO']),
  updateCustomerValidation,
  customerController.updateCustomer
);

/**
 * @route   DELETE /api/customers/:id
 * @desc    Cancelar un cliente
 * @access  Private (Solo ADMIN)
 */
router.delete(
  '/:id',
  authenticate,
  checkRole(['ADMIN']),
  getCustomerByIdValidation,
  customerController.deleteCustomer
);

/**
 * @route   PATCH /api/customers/:id/status
 * @desc    Cambiar estado de un cliente (activo/suspendido)
 * @access  Private (ADMIN, TECNICO)
 */
router.patch(
  '/:id/status',
  authenticate,
  checkRole(['ADMIN', 'TECNICO']),
  changeStatusValidation,
  customerController.changeCustomerStatus
);

module.exports = router;