import Sequelize, { Model } from 'sequelize';
import _ from 'lodash';
import userAttrs from './Traits/userAttrs';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        avatar_id: Sequelize.STRING,
        avatar_url: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.avatar ? this.avatar.get('url') : null;
          },
        },
        ...userAttrs(Sequelize),
      },
      {
        sequelize,
        tableName: 'deliverymen',
        defaultScope: { include: ['avatar'] },
      }
    );

    return this;
  }

  toJSON() {
    const values = _.cloneDeep(
      this.get({
        plain: true,
      })
    );

    delete values.avatar;

    return values;
  }

  static associate(models) {
    this.hasMany(models.Delivery, {
      foreignKey: 'deliveryman_id',
      as: 'Deliveries',
    });

    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Deliveryman;
