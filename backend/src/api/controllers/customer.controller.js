const db = require('../../database/models');
const { Customer, User } = db;
const { Op } = require('sequelize');

/**
 * @route   GET /api/customers
 * @desc    Obtener todos los clientes con paginación y filtros
 * @access  Private
 */
exports.getAllCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // Construir condiciones de búsqueda
    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { documentNumber: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status) {
      whereConditions.status = status;
    }

    const { count, rows } = await Customer.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }]
    });

    res.json({
      success: true,
      data: {
        customers: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error en getAllCustomers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los clientes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   GET /api/customers/:id
 * @desc    Obtener un cliente por ID
 * @access  Private
 */
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'fullName']
      }]
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Error en getCustomerById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   POST /api/customers
 * @desc    Crear un nuevo cliente
 * @access  Private
 */
exports.createCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phonePrimary,
      phoneSecondary,
      documentType,
      documentNumber,
      billingAddress,
      serviceAddress,
      notes
    } = req.body;

    // Verificar si el email ya existe
    const existingCustomer = await Customer.findOne({
      where: { email }
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un cliente con este email'
      });
    }

    // Verificar si el documento ya existe
    if (documentNumber) {
      const existingDocument = await Customer.findOne({
        where: { documentNumber }
      });

      if (existingDocument) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe un cliente con este número de documento'
        });
      }
    }

    const newCustomer = await Customer.create({
      firstName,
      lastName,
      email,
      phonePrimary,
      phoneSecondary,
      documentType,
      documentNumber,
      billingAddress,
      serviceAddress: serviceAddress || billingAddress,
      registrationDate: new Date(),
      status: 'active',
      notes
    });

    // Registrar en auditoría
    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, details_after, ip_address, user_agent, created_at)
       VALUES (?, 'Customer', ?, 'CUSTOMER_CREATED', ?, ?, ?, NOW())`,
      {
        replacements: [
          req.user.id,
          newCustomer.id,
          JSON.stringify(newCustomer.toJSON()),
          req.ip,
          req.get('user-agent')
        ]
      }
    );

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: newCustomer
    });

  } catch (error) {
    console.error('Error en createCustomer:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   PUT /api/customers/:id
 * @desc    Actualizar un cliente
 * @access  Private
 */
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phonePrimary,
      phoneSecondary,
      documentType,
      documentNumber,
      billingAddress,
      serviceAddress,
      status,
      notes
    } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Guardar datos anteriores para auditoría
    const oldData = customer.toJSON();

    // Verificar si el email ya existe en otro cliente
    if (email && email !== customer.email) {
      const existingEmail = await Customer.findOne({
        where: {
          email,
          id: { [Op.ne]: id }
        }
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otro cliente con este email'
        });
      }
    }

    // Verificar si el documento ya existe en otro cliente
    if (documentNumber && documentNumber !== customer.documentNumber) {
      const existingDocument = await Customer.findOne({
        where: {
          documentNumber,
          id: { [Op.ne]: id }
        }
      });

      if (existingDocument) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otro cliente con este número de documento'
        });
      }
    }

    // Actualizar el cliente
    await customer.update({
      firstName: firstName || customer.firstName,
      lastName: lastName || customer.lastName,
      email: email || customer.email,
      phonePrimary: phonePrimary !== undefined ? phonePrimary : customer.phonePrimary,
      phoneSecondary: phoneSecondary !== undefined ? phoneSecondary : customer.phoneSecondary,
      documentType: documentType || customer.documentType,
      documentNumber: documentNumber !== undefined ? documentNumber : customer.documentNumber,
      billingAddress: billingAddress || customer.billingAddress,
      serviceAddress: serviceAddress !== undefined ? serviceAddress : customer.serviceAddress,
      status: status || customer.status,
      notes: notes !== undefined ? notes : customer.notes
    });

    // Registrar en auditoría
    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, details_before, details_after, ip_address, user_agent, created_at)
       VALUES (?, 'Customer', ?, 'CUSTOMER_UPDATED', ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          req.user.id,
          customer.id,
          JSON.stringify(oldData),
          JSON.stringify(customer.toJSON()),
          req.ip,
          req.get('user-agent')
        ]
      }
    );

    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: customer
    });

  } catch (error) {
    console.error('Error en updateCustomer:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   DELETE /api/customers/:id
 * @desc    Eliminar (cancelar) un cliente
 * @access  Private
 */
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Guardar datos anteriores para auditoría
    const oldData = customer.toJSON();

    // Cambiar estado a cancelado en lugar de eliminar
    await customer.update({
      status: 'cancelled'
    });

    // Registrar en auditoría
    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, details_before, details_after, ip_address, user_agent, created_at)
       VALUES (?, 'Customer', ?, 'CUSTOMER_CANCELLED', ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          req.user.id,
          customer.id,
          JSON.stringify(oldData),
          JSON.stringify({ status: 'cancelled' }),
          req.ip,
          req.get('user-agent')
        ]
      }
    );

    res.json({
      success: true,
      message: 'Cliente cancelado exitosamente'
    });

  } catch (error) {
    console.error('Error en deleteCustomer:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar el cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   PATCH /api/customers/:id/status
 * @desc    Cambiar estado de un cliente
 * @access  Private
 */
exports.changeCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'suspended'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser: active o suspended',
        validStatuses
      });
    }

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    const oldStatus = customer.status;

    await customer.update({ status });

    // Registrar en auditoría
    await db.sequelize.query(
      `INSERT INTO auditlog (user_id, entity_type, entity_id, action_type, details_before, details_after, ip_address, user_agent, created_at)
       VALUES (?, 'Customer', ?, 'CUSTOMER_STATUS_CHANGED', ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          req.user.id,
          customer.id,
          JSON.stringify({ status: oldStatus }),
          JSON.stringify({ status }),
          req.ip,
          req.get('user-agent')
        ]
      }
    );

    res.json({
      success: true,
      message: 'Estado del cliente actualizado exitosamente',
      data: {
        id: customer.id,
        oldStatus,
        newStatus: status
      }
    });

  } catch (error) {
    console.error('Error en changeCustomerStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   GET /api/customers/stats
 * @desc    Obtener estadísticas de clientes
 * @access  Private
 */
exports.getCustomerStats = async (req, res) => {
  try {
    const stats = await Customer.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const total = await Customer.count();

    res.json({
      success: true,
      data: {
        total,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat.status] = parseInt(stat.dataValues.count);
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Error en getCustomerStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};