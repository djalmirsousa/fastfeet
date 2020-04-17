import { isAfter, isBefore, parseISO } from 'date-fns';
import Delivery from '../Models/Delivery';
import Deliveryman from '../Models/Deliveryman';
import Recipient from '../Models/Recipient';
import File from '../Models/File';

import Exception from '../Exceptions/ServiceException';

// import Cache from '../../Lib/Cache';

export default {
  async admin(
    { deliveryId },
    { product, deliveryman_id, recipient_id },
    { dialectIsProtgres }
  ) {
    if (deliveryman_id && !(await Deliveryman.findByPk(deliveryman_id))) {
      throw new Exception('Invalid Deliveryman id.');
    }

    if (recipient_id && !(await Recipient.findByPk(recipient_id))) {
      throw new Exception('Invalid Recipient id.');
    }

    return Delivery.update(
      { product, deliveryman_id, recipient_id },
      { where: { id: deliveryId }, returning: dialectIsProtgres }
    );
  },

  async finish(
    { deliverymanId, deliveryId },
    { signature_id },
    { dialectIsProtgres }
  ) {
    if (signature_id && !(await File.findByPk(signature_id))) {
      throw new Exception('Invalid File id.');
    }

    return Delivery.update(
      { end_date: new Date(), signature_id },
      {
        where: { id: deliveryId, deliveryman_id: deliverymanId },
        returning: dialectIsProtgres,
      }
    );
  },

  async withdraw(
    { deliverymanId, deliveryId },
    { start_date },
    { dialectIsProtgres }
  ) {
    const startDate = parseISO(start_date);

    if (
      (await Delivery.scope('withdrawToday').count({
        where: {
          deliveryman_id: deliverymanId,
        },
      })) >= 5
    ) {
      throw new Exception('Maximum withdrawals exceeded.');
    }

    if (isBefore(startDate, new Date().setHours(8, 0, 0))) {
      throw new Exception('Time not allowed.');
    }

    if (isAfter(startDate, new Date().setHours(18, 0, 0))) {
      throw new Exception('Time not allowed.');
    }

    return Delivery.update(
      { start_date },
      {
        where: { id: deliveryId, deliveryman_id: deliverymanId },
        returning: dialectIsProtgres,
      }
    );
  },

  async deliveryman(
    { deliverymanId, deliveryId },
    { start_date, signature_id },
    { dialectIsProtgres }
  ) {
    if (!(await Deliveryman.findByPk(deliverymanId))) {
      throw new Exception('Invalid Deliveryman id.');
    }

    if (signature_id) {
      return this.finish(
        { deliverymanId, deliveryId },
        { signature_id },
        { dialectIsProtgres }
      );
    }

    return this.withdraw(
      { deliverymanId, deliveryId },
      { start_date },
      { dialectIsProtgres }
    );
  },

  async run(
    { deliverymanId, deliveryId },
    { product, deliveryman_id, start_date, signature_id, recipient_id }
  ) {
    const dialectIsProtgres = process.env.DB_DIALECT === 'postgres';

    const result = deliverymanId
      ? await this.deliveryman(
          { deliverymanId, deliveryId },
          { start_date, signature_id },
          { dialectIsProtgres }
        )
      : await this.admin(
          { deliveryId },
          { product, deliveryman_id, recipient_id },
          { dialectIsProtgres }
        );

    if (result[0] < 1) {
      throw new Exception('Invalid Delivery id.');
    }

    // await Cache.invalidatePrefixes(['deliveries']);

    if (!dialectIsProtgres) {
      return Delivery.findByPk(deliveryId);
    }

    return result[1][0];
  },
};
