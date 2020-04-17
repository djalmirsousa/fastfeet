import Sequelize from 'sequelize';

import User from '../App/Models/User';
import Admin from '../App/Models/Admin';
import Deliveryman from '../App/Models/Deliveryman';
import Recipient from '../App/Models/Recipient';
import Delivery from '../App/Models/Delivery';
import File from '../App/Models/File';
import Problem from '../App/Models/Problem';

import databaseConfig from '../Config/database';

const models = [User, Recipient, Admin, Deliveryman, Delivery, File, Problem];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(
        model =>
          model && model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
