import Sequelize, { Model, Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        status: {
          type: Sequelize.VIRTUAL,
          get() {
            if (this.canceledAt) {
              return 'CANCELADA';
            }
            if (this.end_date) {
              return 'ENTREGUE';
            }
            if (this.start_date) {
              return 'RETIRADA';
            }
            return 'PENDENTE';
          },
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        deletedAt: 'canceledAt',
        scopes: {
          deliverymanId(id) {
            return !id ? {} : { where: { deliveryman_id: id } };
          },
          delivered(is) {
            return is
              ? {
                  paranoid: false,
                  where: {
                    end_date: { [Op.ne]: null },
                  },
                }
              : {
                  paranoid: false,
                  where: {
                    end_date: null,
                  },
                };
          },
          withdrawToday: {
            where: {
              start_date: {
                [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
              },
            },
          },
        },
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      source: 'id',
    });
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      source: 'id',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });

    this.addScope('defaultScope', {
      include: [
        {
          model: models.Recipient,
          attributes: ['id', 'name'],
          required: false,
        },
        { model: models.Deliveryman, attributes: ['id', 'name'] },
      ],
    });

    this.addScope('recipient', {
      include: [
        {
          model: models.Recipient,
          attributes: ['name', 'city', 'state', 'street', 'number', 'zip'],
          required: false,
        },
      ],
    });

    this.addScope('deliveryman', {
      include: [
        {
          model: models.Deliveryman,
          attributes: ['name'],
        },
      ],
    });

    this.addScope('signature', {
      include: [
        {
          model: models.File,
          as: 'signature',
          attributes: ['url'],
        },
      ],
    });
  }
}

export default Delivery;
