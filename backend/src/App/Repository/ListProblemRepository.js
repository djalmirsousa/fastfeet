import Problem from '../Models/Problem';

// import Cache from '../../Lib/Cache';

export default {
  async run(
    { deliveryId },
    { page = 1, quantity = 20, scopes = [] } = {},
    { url } = {}
  ) {
    // const cacheKey = url ? `problems:${url}` : false;

    // if (cacheKey) {
    //   const cached = await Cache.get(cacheKey);

    //   if (cached) {
    //     return cached;
    //   }
    // }

    const { rows: data, count } = await Problem.scope(scopes).findAndCountAll({
      limit: quantity,
      offset: (page - 1) * quantity,
      where: !deliveryId ? {} : { delivery_id: deliveryId },
      order: [['updated_at', 'DESC']],
    });

    const result = { data, count, totalPages: Math.ceil(count / quantity) };

    // if (cacheKey) {
    //   Cache.set(cacheKey, result);
    // }

    return result;
  },
};
