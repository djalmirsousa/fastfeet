import Deliveryman from '../Models/Deliveryman';
import Exception from '../Exceptions/ServiceException';

// import Cache from '../../Lib/Cache';

export default {
  async run({ name, email, avatar_id }) {
    if (await Deliveryman.findOne({ where: { email } })) {
      throw new Exception('Deliveryman Email already in use.');
    }

    const deliveryman = await Deliveryman.create({ name, email, avatar_id });

    // await Cache.invalidatePrefixes(['deliverymen']);

    return deliveryman;
  },
};
