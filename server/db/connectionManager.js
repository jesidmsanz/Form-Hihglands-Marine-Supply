/**
 * Database Connection Manager (Singleton Pattern)
 * Manages database connections to avoid saturating connections in Serverless environments
 */

import mongoose from 'mongoose';

let mongoConnection = null;

// MongoDB Connection Singleton
function getMongoConnection(config) {
  if (!mongoConnection) {
    mongoConnection = mongoose.createConnection(config);

    // Handle connection events
    mongoConnection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      mongoConnection = null; // Reset on error
    });

    mongoConnection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      mongoConnection = null;
    });
  }

  return mongoConnection;
}

// Close all connections (useful for cleanup)
async function closeAllConnections() {
  if (mongoConnection) {
    await mongoConnection.close();
    mongoConnection = null;
  }
}

// Reset connections (useful for testing or reconnection)
function resetConnections() {
  mongoConnection = null;
}

export { getMongoConnection, closeAllConnections, resetConnections };
