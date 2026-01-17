import configEnv from '../../configEnv/index.js';

if (!configEnv.dbHost || !configEnv.dbName) {
  throw new Error('MongoDB configuration missing: DB_HOST and DB_NAME are required in .env file');
}

let dbPort = configEnv.dbPort || '27017';

const configMongoDB = configEnv.dbPassword
  ? `mongodb://${configEnv.dbUser}:${encodeURIComponent(configEnv.dbPassword)}@${
      configEnv.dbHost
    }:${dbPort}/${configEnv.dbName}`
  : `mongodb://${configEnv.dbHost}:${dbPort}/${configEnv.dbName}`;

export { configMongoDB };
