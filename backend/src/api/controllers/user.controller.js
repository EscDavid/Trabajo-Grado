const db = require('../../database/models');
const { User, Role } = db;
const { Op } = db.Sequelize;

/**
 * @route   GET /api/users
 * @desc    Listar usuarios internos con filtros
 * @access  Private (ADMIN)
 */
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      status
    } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (role) {
      where.role = role.toLowerCase();
    }

    if (status) {
      where.isActive = status === 'active';
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Role,
        as: 'roleDetails',
        attributes: ['id', 'name', 'description']
      }]
    });

    const safeUsers = rows.map((user) => user.toSafeObject());

    res.json({
      success: true,
      data: {
        users: safeUsers,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error en getUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar datos del usuario
 * @access  Private (ADMIN)
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      phone,
      role,
      isActive
    } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: id }
        }
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otro usuario con ese email'
        });
      }
    }

    // Validar rol si se está cambiando
    if (role) {
      const validRoles = ['admin', 'tecnico', 'contador'];
      if (!validRoles.includes(role.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Rol inválido. Debe ser: admin, tecnico o contador'
        });
      }

      const roleMap = {
        'admin': 1,
        'tecnico': 2,
        'contador': 3
      };

      user.roleId = roleMap[role.toLowerCase()];
      user.role = role.toLowerCase();
    }

    await user.update({
      fullName: fullName || user.fullName,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      isActive: typeof isActive === 'boolean' ? isActive : user.isActive
    });

    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'roleDetails',
        attributes: ['id', 'name', 'description']
      }]
    });

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: updatedUser.toSafeObject()
    });
  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   PATCH /api/users/:id/status
 * @desc    Cambiar estado del usuario (activar/desactivar)
 * @access  Private (ADMIN)
 */
exports.changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await user.update({ isActive });

    res.json({
      success: true,
      message: 'Estado del usuario actualizado',
      data: {
        id: user.id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error en changeUserStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


