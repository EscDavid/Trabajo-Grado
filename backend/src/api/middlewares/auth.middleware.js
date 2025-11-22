const jwt = require('jsonwebtoken');
const db = require('../../database/models');
const { User, UserSession } = db;

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_in_production';

/**
 * Middleware para verificar el token JWT
 */
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.substring(7);

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar si la sesión existe y está activa
    const session = await UserSession.findOne({
      where: {
        userId: decoded.id,
        token: token,
        expiresAt: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Sesión no válida o expirada'
      });
    }

    // Obtener usuario
    const user = await User.findByPk(decoded.id, {
      include: [{
        model: db.Role,
        as: 'roleDetails',
        attributes: ['id', 'name', 'description']
      }]
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }

    // Agregar usuario a la request
    req.user = user;
    req.session = session;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        expired: true
      });
    }

    console.error('Error en authenticate:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en la autenticación'
    });
  }
};

/**
 * Middleware para verificar roles permitidos
 * @param {Array<string>} allowedRoles - Roles permitidos ['ADMIN', 'TECNICO', 'CONTADOR']
 */
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const userRole = req.user.role?.toUpperCase();

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
        requiredRoles: allowedRoles,
        yourRole: userRole
      });
    }

    next();
  };
};

/**
 * Middleware solo para ADMIN
 */
exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  if (req.user.role?.toUpperCase() !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Solo administradores pueden realizar esta acción'
    });
  }

  next();
};