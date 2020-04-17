import CreateDeliveryman from '../Services/CreateDeliverymanService';
import UpdateDeliveryman from '../Services/UpdateDeliverymanService';
import DeleteDeliveryman from '../Services/DeleteDeliverymanService';

import ListDeliveryman from '../Repository/ListDeliverymanRepository';

import Deliveryman from '../Models/Deliveryman';

export default {
  async index({ query, url }, res) {
    return res.json(await ListDeliveryman.run(query, { url }));
  },

  async show({ params: { deliverymanId: id } }, res) {
    const deliveryman = await Deliveryman.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ message: 'Invalid deliveryman id.' });
    }
    return res.json(deliveryman);
  },

  async store({ body, url }, res, next) {
    return res.json(await CreateDeliveryman.run(body, { url }));
  },

  async update({ params, body, fileId, url }, res) {
    return res.json(
      await UpdateDeliveryman.run(
        params,
        {
          ...body,
          avatar_id: fileId,
        },
        { url }
      )
    );
  },

  async delete({ params, url }, res) {
    await DeleteDeliveryman.run(params, { url });
    return res.send();
  },
};
