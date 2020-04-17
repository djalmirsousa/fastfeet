import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

import userAttrs from './Traits/userAttrs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        ...userAttrs(Sequelize),
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        isAdmin: {
          type: Sequelize.VIRTUAL,
          get() {
            return !!this.Admin;
          },
        },
      },
      {
        sequelize,
        defaultScope: { include: ['Admin'] },
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    this.addHook('beforeUpdate', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  toJSON() {
    const values = _.cloneDeep(
      this.get({
        plain: true,
      })
    );

    delete values.password_hash;
    delete values.password;

    return values;
  }

  static associate(models) {
    this.hasOne(models.Admin, { foreignKey: 'user_id' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
