import { Op } from 'sequelize';
import Deliveryman from '../Models/Deliveryman';
import Delivery from '../Models/Delivery';
import Exception from '../Exceptions/ServiceException';

// import Cache from '../../Lib/Cache';

export default {
  async run({ deliverymanId: id }) {
    const deliveryman = await Deliveryman.findByPk(id, {
      include: [
        {
          model: Delivery.unscoped(),
          as: 'Deliveries',
          attributes: ['id'],
          where: {
            start_date: { [Op.not]: null },
            end_date: null,
            canceledAt: null,
          },
          required: false,
        },
      ],
    });

    if (!deliveryman) {
      throw new Exception('Invalid deliveryman id.');
    }

    const deliveriesId = deliveryman.Deliveries
      ? deliveryman.Deliveries.map(delivery => delivery.id)
      : [];

    if (deliveriesId.length > 0) {
      await Delivery.update(
        { start_date: null },
        {
          where: {
            id: deliveriesId,
            start_date: { [Op.not]: null },
            end_date: null,
            canceledAt: null,
          },
        }
      );
    }

    // await Cache.invalidatePrefixes(['deliverymen']);

    return true;
  },
};
