const { getMongoConnection } = require('../connectionManager');

/**
 * Setup MongoDB connection (deprecated - use connectionManager instead)
 * @deprecated Use getMongoConnection from connectionManager
 */
module.exports = function setupDatabase(config) {
  // Use connectionManager for singleton pattern
  return getMongoConnection(config);
};
