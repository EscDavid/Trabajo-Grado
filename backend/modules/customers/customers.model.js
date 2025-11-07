"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {

    static associate(models) {
      this.hasMany(models.CustomerService, {
        foreignKey: "customer_id",
        as: "customerServices",
      });
      this.hasMany(models.Invoice, {
        foreignKey: "customer_id",
        as: "invoices",
      });
      this.hasMany(models.Payment, {
        foreignKey: "customer_id",
        as: "payments",
      });

      // Relación opcional al usuario del portal (si el cliente tiene login)
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "portalUser",
        allowNull: true,
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }
  }

  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        unique: {
          name: "customers_user_id_unique",
          msg: "Este usuario ya está asignado a otro cliente para el acceso al portal.",
        },
        comment:
          "ID del usuario (con rol de portal) asociado a este cliente para login.",
      },

      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: "El nombre no puede estar vacío." },
        },
      },

      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: "El apellido no puede estar vacío." },
        },
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          name: "customers_email_unique",
          msg: "El correo electrónico ya está registrado.",
        },
        validate: {
          isEmail: { msg: "Debe proporcionar un correo electrónico válido." },
        },
      },

      phone_primary: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      phone_secondary: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      document_type: {
        type: DataTypes.ENUM("cc", "ce", "nit", "passport", "other"),
        allowNull: true,
      },

      document_number: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: {
          name: "customers_document_number_unique",
          msg: "El número de documento ya está registrado.",
        },
      },

      billing_address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "La dirección de facturación no puede estar vacía.",
          },
        },
      },

      service_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      registration_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: { msg: "La fecha de registro debe ser una fecha válida." },
        },
      },

      status: {
        type: DataTypes.ENUM(
          "pending_activation",
          "active",
          "suspended_nonpayment",
          "suspended_admin",
          "cancelled",
          "delinquent"
        ),
        allowNull: false,
        defaultValue: "pending_activation",
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "Customers",
      timestamps: true,
      underscored: true,
      comment: "Información de los clientes del ISP",
    }
  );

  return Customer;
};
