const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validación para registro de usuario
exports.registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  body('fullName')
    .trim()
    .notEmpty().withMessage('El nombre completo es requerido')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre completo debe tener entre 3 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono debe contener solo números y caracteres válidos'),
  
  body('role')
    .notEmpty().withMessage('El rol es requerido')
    .isIn(['admin', 'tecnico', 'contador']).withMessage('El rol debe ser: admin, tecnico o contador'),
  
  handleValidationErrors
];

// Validación para login
exports.loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es requerido'),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  
  handleValidationErrors
];

// Validación para refresh token
exports.refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('El refresh token es requerido')
    .isString().withMessage('El refresh token debe ser una cadena de texto'),
  
  handleValidationErrors
];