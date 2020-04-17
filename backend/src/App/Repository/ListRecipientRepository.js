import { Op } from 'sequelize';
import Recipient from '../Models/Recipient';

// import Cache from '../../Lib/Cache';

export default {
  async run({ page = 1, quantity = 20, q: name = '' } = {}, { url } = {}) {
    // const cacheKey = url ? `recipients:${url}` : false;

    // if (cacheKey) {
    //   const cached = await Cache.get(cacheKey);

    //   if (cached) {
    //     return cached;
    //   }
    // }

    const { rows: data, count } = await Recipient.findAndCountAll({
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
