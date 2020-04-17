import Sequelize, { Model } from 'sequelize';
import adress from './Traits/adress';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        ...adress(Sequelize),
      },
      {
        sequelize,
        tableName: 'recipients',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Delivery, {
      foreignKey: 'recipient_id',
    });
  }
}

export default Recipient;
