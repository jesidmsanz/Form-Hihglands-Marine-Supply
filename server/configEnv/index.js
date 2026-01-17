import 'dotenv/config';

const configEnv = {
  // MongoDB Configuration
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,

  // JWT Configuration
  authJwtSecret: process.env.AUTH_JWT_SECRET || 'AUTH_JWT_SECRET',
  jwtSessionExpire: process.env.JWT_SESSION_EXPIRE || '1d',
};

export default configEnv;
