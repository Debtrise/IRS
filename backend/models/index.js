const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Import model definitions
const defineUserModel = require('./user.model');
const defineCaseModel = require('./case.model');
const defineDocumentModel = require('./document.model');
const defineAssessmentModel = require('./assessment.model');
const defineFormModel = require('./form.model');
const definePaymentModel = require('./payment.model');
const defineNotificationModel = require('./notification.model');
const defineActivityLogModel = require('./activityLog.model');

// Initialize models
const User = defineUserModel(sequelize, DataTypes);
const Case = defineCaseModel(sequelize, DataTypes);
const Document = defineDocumentModel(sequelize, DataTypes);
const Assessment = defineAssessmentModel(sequelize, DataTypes);
const Form = defineFormModel(sequelize, DataTypes);
const Payment = definePaymentModel(sequelize, DataTypes);
const Notification = defineNotificationModel(sequelize, DataTypes);
const ActivityLog = defineActivityLogModel(sequelize, DataTypes);

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Case, { foreignKey: 'user_id', as: 'cases' });
  User.hasMany(Document, { foreignKey: 'user_id', as: 'documents' });
  User.hasMany(Assessment, { foreignKey: 'user_id', as: 'assessments' });
  User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
  User.hasMany(ActivityLog, { foreignKey: 'user_id', as: 'activities' });

  // Case associations
  Case.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Case.hasMany(Document, { foreignKey: 'case_id', as: 'documents' });
  Case.hasMany(Form, { foreignKey: 'case_id', as: 'forms' });
  Case.hasMany(Payment, { foreignKey: 'case_id', as: 'payments' });
  Case.hasOne(Assessment, { foreignKey: 'case_id', as: 'assessment' });

  // Document associations
  Document.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Document.belongsTo(Case, { foreignKey: 'case_id', as: 'case' });

  // Assessment associations
  Assessment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Assessment.belongsTo(Case, { foreignKey: 'case_id', as: 'case' });

  // Form associations
  Form.belongsTo(Case, { foreignKey: 'case_id', as: 'case' });
  Form.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Payment associations
  Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Payment.belongsTo(Case, { foreignKey: 'case_id', as: 'case' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Activity Log associations
  ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
};

// Initialize associations
defineAssociations();

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Case,
  Document,
  Assessment,
  Form,
  Payment,
  Notification,
  ActivityLog,
};