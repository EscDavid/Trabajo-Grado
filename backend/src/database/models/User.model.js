const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'full_name'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'role_id'
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'is_active'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'is_verified'
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'verification_token'
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'reset_password_token'
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reset_password_expires'
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'failed_login_attempts'
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'locked_until'
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: false,  // ← AGREGAR ESTO EXPLÍCITAMENTE
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash && !user.passwordHash.startsWith('$2')) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
      beforeUpdate: async (user) => {
        // Verificar si passwordHash cambió y no está hasheado
        if (user.changed('passwordHash')) {
          const passwordValue = user.passwordHash;
          // Si la contraseña no está hasheada (no empieza con $2), hashearla
          if (passwordValue && !passwordValue.startsWith('$2')) {
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(passwordValue, salt);
          }
        }
      },
      beforeSave: async (user) => {
        // Asegurar que la contraseña siempre esté hasheada antes de guardar
        if (user.passwordHash && !user.passwordHash.startsWith('$2')) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      }
    }
  });

  User.prototype.comparePassword = async function(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.passwordHash);
    } catch (error) {
      throw new Error('Error al comparar contraseñas');
    }
  };

  User.prototype.isLocked = function() {
    return this.lockedUntil && this.lockedUntil > new Date();
  };

  User.prototype.incrementLoginAttempts = async function() {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    if (this.updatedAt < twoHoursAgo) {
      this.failedLoginAttempts = 1;
    } else {
      this.failedLoginAttempts += 1;
    }

    if (this.failedLoginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.save();
  };

  User.prototype.resetLoginAttempts = async function() {
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
    await this.save();
  };

  User.prototype.toSafeObject = function() {
    const { passwordHash, verificationToken, resetPasswordToken, ...safeUser } = this.toJSON();
    return safeUser;
  };

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'roleDetails'
    });

    User.hasMany(models.UserSession, {
      foreignKey: 'user_id',
      as: 'sessions'
    });

    User.hasMany(models.RefreshToken, {
      foreignKey: 'user_id',
      as: 'refreshTokens'
    });
  };

  return User;
};