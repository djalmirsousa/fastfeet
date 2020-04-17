import Delivery from '../Models/Delivery';
import Problem from '../Models/Problem';
import Exception from '../Exceptions/ServiceException';

import Queue from '../../Lib/Queue';
import DeliveryCancelledMail from '../Jobs/deliveryCancelledMail';

// import Cache from '../../Lib/Cache';

export default {
  async run({ problemId }) {
    const problem = await Problem.findByPk(problemId, {
      include: ['Delivery'],
      paranoid: false,
    });

    if (!problem || !problem.delivery_id) {
      throw new Exception('Invalid Problem.');
    }

    if (!problem.Delivery) {
      throw new Exception('Delivery alread been canceled.');
    }

    if (!(await Delivery.destroy({ where: { id: problem.delivery_id } }))) {
      throw new Exception('Invalid Delivery id.');
    }

    await Promise.all([
      Queue.add(DeliveryCancelledMail.key, {
        problem: problem.toJSON(),
      }),
      // Cache.invalidatePrefixes(['deliveries']),
    ]);

    return true;
  },
};
