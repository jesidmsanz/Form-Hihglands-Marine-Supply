const db = require('./conn');
const setupModel = require('../../components/users/model');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const Model = setupModel(db);

const data = [
  {
    uuid: uuid.v4(),
    username: 'admin',
    password: bcrypt.hashSync('ASD123*-', 10),
    firstName: 'Admin',
    lastName: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

class UsersSeeder {
  async shouldRun() {
    return Model.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Model.create(data);
  }
}

module.exports = UsersSeeder;
