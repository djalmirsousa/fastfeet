import { Op } from 'sequelize';

import Delivery from '../Models/Delivery';

// import Cache from '../../Lib/Cache';

import Exception from '../Exceptions/ServiceException';

export default {
  scopeValidate(scope) {
    const validScopes = ['deliveryman', 'recipient', 'signature'];
    if (scope[0] && !validScopes.some(r => scope.indexOf(r) >= 0)) {
      throw new Exception('Invalid scopes.');
    }
  },

  async run(
    { deliverymanId },
    { page = 1, quantity = 20, delivered, q: product = '', scopes = [] } = {},
    { url } = {}
  ) {
    // const cacheKey = url ? `deliveries:${url}` : false;

    // // await Cache.invalidatePrefixes(['*']);

    // if (cacheKey) {
    //   const cached = await Cache.get(cacheKey);

    //   if (cached) {
    //     return cached;
    //   }
    // }

    if (deliverymanId) {
      const { rows: data, count } = await Delivery.scope([
        {
          method: ['deliverymanId', deliverymanId],
        },
        {
          method: ['delivered', delivered],
        },
      ]).findAndCountAll({
        limit: quantity,
        offset: (page - 1) * quantity,
        where: {
          product: {
            [Op.like]: `%${product}%`,
          },
        },
        order: [['updated_at', 'DESC']],
      });

      const result = { data, count, totalPages: Math.ceil(count / quantity) };

      // if (cacheKey) {
      //   Cache.set(cacheKey, result);
      // }

      return result;
    }

    this.scopeValidate(scopes);

    const { rows: data, count } = await Delivery.scope(scopes).findAndCountAll({
      paranoid: false,
      limit: quantity,
      offset: (page - 1) * quantity,
      order: [['updated_at', 'DESC']],
      where: {
        product: {
          [Op.like]: `%${product}%`,
        },
      },
    });

    const result = { data, count, totalPages: Math.ceil(count / quantity) };

    // if (cacheKey) {
    //   Cache.set(cacheKey, result);
    // }

    return result;
  },
};
