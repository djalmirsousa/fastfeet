import Delivery from '../Models/Delivery';
import Deliveryman from '../Models/Deliveryman';
import Recipient from '../Models/Recipient';
import Exception from '../Exceptions/ServiceException';

import Queue from '../../Lib/Queue';
import DeliveryAvailableMail from '../Jobs/deliveryAvailableMail';

// import Cache from '../../Lib/Cache';

export default {
  async run({ product, recipient_id, deliveryman_id }) {
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    if (!deliveryman) {
      throw new Exception('Invalid Deliveryman id.');
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      throw new Exception('Invalid Recipient id.');
    }

    const delivery = await Delivery.create({
      product,
      recipient_id,
      deliveryman_id,
    });

    await Promise.all([
      Queue.add(DeliveryAvailableMail.key, {
        delivery,
        recipient,
        deliveryman,
      }),
      // Cache.invalidatePrefixes(['deliveries']),
    ]);

    return delivery;
  },
};
