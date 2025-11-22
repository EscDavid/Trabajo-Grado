const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, adminOnly } = require('../middlewares/auth.middleware');
const { 
  registerValidation, 
  loginValidation, 
  refreshTokenValidation 
} = require('../validators/auth.validator');
const {
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation
} = require('../validators/password.validator');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario (solo ADMIN)
 * @access  Private (Solo ADMIN)
 */
router.post(
  '/register',
  authenticate,
  adminOnly,
  registerValidation,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post(
  '/login',
  loginValidation,
  authController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refrescar access token
 * @access  Public
 */
router.post(
  '/refresh',
  refreshTokenValidation,
  authController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario autenticado
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar recuperación de contraseña
 * @access  Public
 */
router.post(
  '/forgot-password',
  forgotPasswordValidation,
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Restablecer contraseña con token
 * @access  Public
 */
router.post(
  '/reset-password',
  resetPasswordValidation,
  authController.resetPassword
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Cambiar contraseña (usuario autenticado)
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  authController.changePassword
);

module.exports = router;