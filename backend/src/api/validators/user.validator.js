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

exports.getUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),

  query('role')
    .optional()
    .isIn(['admin', 'tecnico', 'contador']).withMessage('Rol inválido'),

  query('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Estado inválido'),

  query('search')
    .optional()
    .isLength({ max: 100 }).withMessage('La búsqueda no puede exceder 100 caracteres'),

  handleValidationErrors
];

exports.updateUserValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de usuario inválido'),

  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Debe ser un correo válido')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono contiene caracteres inválidos'),

  body('role')
    .optional()
    .isIn(['admin', 'tecnico', 'contador']).withMessage('Rol inválido'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('El estado debe ser booleano'),

  handleValidationErrors
];

exports.changeUserStatusValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de usuario inválido'),

  body('isActive')
    .isBoolean().withMessage('El estado es requerido y debe ser booleano'),

  handleValidationErrors
];


