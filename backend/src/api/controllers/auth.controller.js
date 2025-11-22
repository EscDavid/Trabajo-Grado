const jwt = require('jsonwebtoken');
const db = require('../../database/models');
const { User, Role, UserSession, RefreshToken } = db;

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_in_production';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d';
const crypto = require('crypto');
const emailService = require('../../services/email.service');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario del sistema (solo ADMIN)
 * @access  Private (Solo ADMIN)
 */
exports.register = async (req, res) => {
  try {
    const {
      username,
      password,
      fullName,
      email,
      phone,
      role // 'admin', 'tecnico', 'contador'
    } = req.body;

    // Validar que el rol sea válido
    const validRoles = ['admin', 'tecnico', 'contador'];
    if (!validRoles.includes(role?.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser: admin, tecnico o contador'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El usuario o email ya está registrado'
      });
    }

    // Obtener el roleId según el rol
    const roleMap = {
      'admin': 1,
      'tecnico': 2,
      'contador': 3
    };

    const roleId = roleMap[role.toLowerCase()];

    // Crear usuario
    const newUser = await User.create({
      username,
      passwordHash: password, // El hook lo hasheará
      fullName,
      email,
      phone,
      roleId,
      role: role.toLowerCase(),
      isActive: true,
      isVerified: true
    });

    // Registrar en auditoría
    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, details_after, ip_address, user_agent, created_at)
       VALUES (?, 'User', ?, 'USER_CREATED', ?, ?, ?, NOW())`,
      {
        replacements: [
          req.user.id,
          newUser.id,
          JSON.stringify({
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          }),
          req.ip,
          req.get('user-agent')
        ]
      }
    );

    // Retornar usuario sin datos sensibles
    const userResponse = newUser.toSafeObject();

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: userResponse
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    const user = await User.findOne({
      where: { username },
      include: [{
        model: Role,
        as: 'roleDetails',
        attributes: ['id', 'name', 'description']
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Cuenta bloqueada temporalmente por múltiples intentos fallidos',
        lockedUntil: user.lockedUntil
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      await user.incrementLoginAttempts();

      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        attemptsRemaining: 5 - user.failedLoginAttempts
      });
    }

    await user.resetLoginAttempts();

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await UserSession.create({
      userId: user.id,
      token: accessToken,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, ip_address, user_agent, created_at)
       VALUES (?, 'User', ?, 'USER_LOGIN', ?, ?, NOW())`,
      {
        replacements: [user.id, user.id, req.ip, req.get('user-agent')]
      }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: user.toSafeObject(),
        accessToken,
        refreshToken,
        expiresIn: JWT_ACCESS_EXPIRY
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Refrescar access token
 * @access  Public
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token es requerido'
      });
    }

    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: [{
        model: User,
        as: 'user',
        include: [{
          model: Role,
          as: 'roleDetails'
        }]
      }]
    });

    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    if (tokenRecord.isExpired()) {
      await tokenRecord.destroy();
      return res.status(401).json({
        success: false,
        message: 'Refresh token expirado'
      });
    }

    try {
      jwt.verify(refreshToken, JWT_SECRET);
    } catch (error) {
      await tokenRecord.destroy();
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    const user = tokenRecord.user;

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    const newAccessToken = generateAccessToken(user);

    await UserSession.create({
      userId: user.id,
      token: newAccessToken,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    res.json({
      success: true,
      message: 'Token refrescado exitosamente',
      data: {
        accessToken: newAccessToken,
        expiresIn: JWT_ACCESS_EXPIRY
      }
    });

  } catch (error) {
    console.error('Error en refreshToken:', error);
    res.status(500).json({
      success: false,
      message: 'Error al refrescar el token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    await UserSession.destroy({
      where: { 
        userId: req.user.id,
        token
      }
    });

    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, ip_address, user_agent, created_at)
       VALUES (?, 'User', ?, 'USER_LOGOUT', ?, ?, NOW())`,
      {
        replacements: [req.user.id, req.user.id, req.ip, req.get('user-agent')]
      }
    );

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario autenticado
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Role,
        as: 'roleDetails',
        attributes: ['id', 'name', 'description']
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user.toSafeObject()
    });

  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Funciones auxiliares
function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    type: 'access'
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY
  });
}

function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    type: 'refresh'
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY
  });
}
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    const user = await User.findOne({ where: { email } });

    // Por seguridad, siempre retornamos el mismo mensaje
    // aunque el usuario no exista
    if (!user) {
      return res.json({
        success: true,
        message: 'Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña'
      });
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en la base de datos
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry
    });

    // Enviar email
    const emailResult = await emailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.fullName
    );

    if (!emailResult.success) {
      console.error('Error al enviar email:', emailResult.error);
      return res.status(500).json({
        success: false,
        message: 'Error al enviar el email de recuperación'
      });
    }

    // Registrar en auditoría
    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, ip_address, user_agent, created_at)
       VALUES (?, 'User', ?, 'PASSWORD_RESET_REQUESTED', ?, ?, NOW())`,
      {
        replacements: [user.id, user.id, req.ip, req.get('user-agent')]
      }
    );

    res.json({
      success: true,
      message: 'Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña'
    });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Restablecer contraseña usando token
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token y nueva contraseña son requeridos'
      });
    }

    // Buscar usuario con token válido
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Actualizar contraseña (el hook la hasheará)
    await user.update({
      passwordHash: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      failedLoginAttempts: 0,
      lockedUntil: null
    });

    // Invalidar todas las sesiones del usuario
    await UserSession.destroy({
      where: { userId: user.id }
    });

    await RefreshToken.destroy({
      where: { userId: user.id }
    });

    // Enviar email de confirmación
    await emailService.sendPasswordChangedEmail(user.email, user.fullName);

    // Registrar en auditoría
    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, ip_address, user_agent, created_at)
       VALUES (?, 'User', ?, 'PASSWORD_RESET_COMPLETED', ?, ?, NOW())`,
      {
        replacements: [user.id, user.id, req.ip, req.get('user-agent')]
      }
    );

    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente. Puedes iniciar sesión con tu nueva contraseña'
    });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al restablecer la contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   POST /api/auth/change-password
 * @desc    Cambiar contraseña (usuario autenticado)
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    await user.update({
      passwordHash: newPassword
    });

    // Invalidar todas las sesiones excepto la actual
    await UserSession.destroy({
      where: {
        userId: user.id,
        token: { [db.Sequelize.Op.ne]: req.token }
      }
    });

    await RefreshToken.destroy({
      where: { userId: user.id }
    });

    // Enviar email de confirmación
    await emailService.sendPasswordChangedEmail(user.email, user.fullName);

    // Registrar en auditoría
    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, ip_address, user_agent, created_at)
       VALUES (?, 'User', ?, 'PASSWORD_CHANGED', ?, ?, NOW())`,
      {
        replacements: [user.id, user.id, req.ip, req.get('user-agent')]
      }
    );

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error en changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar la contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};