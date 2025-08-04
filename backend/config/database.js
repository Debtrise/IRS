const { Sequelize } = require('sequelize');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

class DatabaseManager {
  constructor() {
    this.secretClient = new SecretManagerServiceClient();
    this.sequelize = null;
  }

  async initialize() {
    try {
      const dbConfig = await this.getSecrets();
      
      // Configure Sequelize based on environment
      const config = {
        dialect: 'postgres',
        logging: (msg) => logger.debug(msg),
        pool: {
          max: 20,
          min: 5,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: true,
          underscored: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      };

      // Production configuration with Cloud SQL
      if (process.env.NODE_ENV === 'production') {
        config.host = `/cloudsql/${dbConfig.connectionName}`;
        config.dialectOptions = {
          socketPath: `/cloudsql/${dbConfig.connectionName}`,
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        };
      } else {
        // Development configuration
        config.host = process.env.DB_HOST || 'localhost';
        config.port = process.env.DB_PORT || 5432;
      }

      this.sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        config
      );

      // Test connection
      await this.sequelize.authenticate();
      logger.info('Database connection has been established successfully.');

      return this.sequelize;
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  async getSecrets() {
    if (process.env.NODE_ENV !== 'production') {
      // Use environment variables in development
      return {
        connectionName: process.env.CLOUD_SQL_CONNECTION_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      };
    }

    // Fetch from Google Secret Manager in production
    try {
      const [dbPassword] = await this.secretClient.accessSecretVersion({
        name: `projects/${process.env.GCP_PROJECT_ID}/secrets/db-password/versions/latest`,
      });

      return {
        connectionName: process.env.CLOUD_SQL_CONNECTION_NAME,
        username: process.env.DB_USER,
        password: dbPassword.payload.data.toString('utf8'),
        database: process.env.DB_NAME,
      };
    } catch (error) {
      logger.error('Failed to fetch database secrets:', error);
      throw error;
    }
  }

  getSequelize() {
    if (!this.sequelize) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.sequelize;
  }

  async close() {
    if (this.sequelize) {
      await this.sequelize.close();
      logger.info('Database connection closed.');
    }
  }
}

// Create singleton instance
const databaseManager = new DatabaseManager();

// Initialize and export
let sequelize;
(async () => {
  try {
    sequelize = await databaseManager.initialize();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();

module.exports = { sequelize, databaseManager };