import { Op } from 'sequelize';
import Deliveryman from '../Models/Deliveryman';

// import Cache from '../../Lib/Cache';

export default {
  async run({ page = 1, quantity = 20, q: name = '' } = {}, { url } = {}) {
    // const cacheKey = url ? `deliverymen:${url}` : false;

    // if (cacheKey) {
    //   const cached = await Cache.get(cacheKey);

    //   if (cached) {
    //     return cached;
    //   }
    // }

    const { rows: data, count } = await Deliveryman.findAndCountAll({
      limit: quantity,
      offset: (page - 1) * quantity,
      where: {
        [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
      },
      order: [['updated_at', 'DESC']],
    });

    const result = { data, count, totalPages: Math.ceil(count / quantity) };

    // if (cacheKey) {
    //   Cache.set(cacheKey, result);
    // }

    return result;
  },
};
