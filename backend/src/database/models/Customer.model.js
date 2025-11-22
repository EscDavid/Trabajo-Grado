const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'user_id',
      comment: 'Usuario portal (si el cliente tiene acceso)'
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    phonePrimary: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'phone_primary'
    },
    phoneSecondary: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'phone_secondary'
    },
    documentType: {
      type: DataTypes.ENUM('cc', 'ce', 'nit', 'passport', 'other'),
      allowNull: true,
      field: 'document_type'
    },
    documentNumber: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: true,
      field: 'document_number'
    },
    billingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'billing_address'
    },
    serviceAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'service_address'
    },
    registrationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'registration_date'
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended'),
      defaultValue: 'active',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }, {
    tableName: 'customers',
    timestamps: true
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Customer;
};