module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Null for OAuth users
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[\d\s\-\+\(\)]+$/,
      },
    },
    ssn: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Encrypted SSN',
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_of_birth',
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'JSON object with street, city, state, zip',
    },
    authProvider: {
      type: DataTypes.ENUM('local', 'google', 'facebook'),
      defaultValue: 'local',
      field: 'auth_provider',
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: 'google_id',
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_picture',
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'email_verified',
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'email_verification_token',
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'two_factor_enabled',
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'two_factor_secret',
    },
    role: {
      type: DataTypes.ENUM('client', 'admin', 'tax_professional', 'support'),
      defaultValue: 'client',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending'),
      defaultValue: 'pending',
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login',
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'refresh_token',
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'password_reset_token',
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'password_reset_expires',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional user metadata',
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        language: 'en',
        timezone: 'America/New_York',
      },
    },
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Soft deletes
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['google_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['role'],
      },
    ],
    scopes: {
      active: {
        where: {
          status: 'active',
        },
      },
      withoutPassword: {
        attributes: {
          exclude: ['password', 'refreshToken', 'twoFactorSecret'],
        },
      },
    },
    hooks: {
      beforeSave: async (user) => {
        // Ensure email is lowercase
        if (user.email) {
          user.email = user.email.toLowerCase();
        }
      },
    },
  });

  // Instance methods
  User.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  User.prototype.toSafeObject = function() {
    const { password, refreshToken, twoFactorSecret, ssn, ...safeUser } = this.toJSON();
    return safeUser;
  };

  User.prototype.canAccessCase = async function(caseId) {
    const caseCount = await this.countCases({
      where: { id: caseId },
    });
    return caseCount > 0 || this.role === 'admin';
  };

  // Class methods
  User.findByEmail = async function(email) {
    return this.findOne({
      where: { email: email.toLowerCase() },
    });
  };

  User.createFromOAuth = async function(profile) {
    return this.create({
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      googleId: profile.sub,
      profilePicture: profile.picture,
      emailVerified: profile.email_verified,
      authProvider: 'google',
      status: 'active',
    });
  };

  return User;
};