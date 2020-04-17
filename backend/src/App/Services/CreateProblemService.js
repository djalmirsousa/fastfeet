import Problem from '../Models/Problem';
import Delivery from '../Models/Delivery';

import Exception from '../Exceptions/ServiceException';

// import Cache from '../../Lib/Cache';

export default {
  async run({ delivery_id, description }) {
    if (!(await Delivery.findByPk(delivery_id))) {
      throw new Exception('Invalid Delivery id.');
    }

    const problem = await Problem.create({ delivery_id, description });

    // await Cache.invalidatePrefixes(['problems']);

    return problem;
  },
};
