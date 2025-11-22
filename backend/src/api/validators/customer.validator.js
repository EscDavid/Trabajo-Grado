const { body, param, query, validationResult } = require('express-validator');

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

// Validación para crear cliente
exports.createCustomerValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('phonePrimary')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono debe contener solo números y caracteres válidos'),
  
  body('phoneSecondary')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono debe contener solo números y caracteres válidos'),
  
  body('documentType')
    .optional()
    .isIn(['cc', 'ce', 'nit', 'passport', 'other']).withMessage('Tipo de documento inválido'),
  
  body('documentNumber')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('El número de documento no puede exceder 30 caracteres'),
  
  body('billingAddress')
    .trim()
    .notEmpty().withMessage('La dirección de facturación es requerida'),
  
  body('serviceAddress')
    .optional()
    .trim(),
  
  body('notes')
    .optional()
    .trim(),
  
  handleValidationErrors
];

// Validación para actualizar cliente
exports.updateCustomerValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de cliente inválido'),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('phonePrimary')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono debe contener solo números y caracteres válidos'),
  
  body('phoneSecondary')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono debe contener solo números y caracteres válidos'),
  
  body('documentType')
    .optional()
    .isIn(['cc', 'ce', 'nit', 'passport', 'other']).withMessage('Tipo de documento inválido'),
  
    body('status')
    .optional()
    .isIn(['active', 'suspended'])
    .withMessage('Estado inválido. Debe ser: active o suspended'),
  
  handleValidationErrors
];

// Validación para obtener cliente por ID
exports.getCustomerByIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de cliente inválido'),
  
  handleValidationErrors
];

// Validación para cambiar estado
exports.changeStatusValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de cliente inválido'),
  
    body('status')
    .notEmpty().withMessage('El estado es requerido')
    .isIn(['active', 'suspended'])
    .withMessage('Estado inválido. Debe ser: active o suspended'),
  
  
  handleValidationErrors
];

// Validación para query de listado
exports.getCustomersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
  
    query('status')
    .optional()
    .isIn(['active', 'suspended'])
    .withMessage('Estado inválido. Debe ser: active o suspended'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'firstName', 'lastName', 'email', 'status'])
    .withMessage('Campo de ordenamiento inválido'),
  
  query('order')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Orden inválido'),
  
  handleValidationErrors
];