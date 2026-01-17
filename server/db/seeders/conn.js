const setupDatabase = require("../lib/mongodb");
const { configMongoDB } = require("../config");
const db = setupDatabase(configMongoDB);
module.exports = db;
