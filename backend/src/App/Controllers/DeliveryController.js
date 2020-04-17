import CreateDelivery from '../Services/CreateDeliveryService';
import UpdateDelivery from '../Services/UpdateDeliveryService';
import CancelDelivery from '../Services/CancelDeliveryService';
import DeleteDelivery from '../Services/DeleteDeliveryService';

import ListDelivery from '../Repository/ListDeliveryRepository';

import Delivery from '../Models/Delivery';

export default {
  async index({ params, query, url }, res) {
    const { page, quantity, scopes, delivered } = query;
    const scopesJson = scopes ? JSON.parse(scopes) : undefined;

    return res.json(
      await ListDelivery.run(
        { ...params },
        { page, quantity, scopes: scopesJson, delivered },
        { url }
      )
    );
  },

  async show({ params: { deliveryId: id } }, res) {
    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      return res.status(400).json({ message: 'Invalid delivery id.' });
    }
    return res.json(delivery);
  },

  async store({ body, url }, res) {
    return res.json(await CreateDelivery.run(body, { url }));
  },

  async update({ params, body, fileId, url }, res) {
    return res.json(
      await UpdateDelivery.run(
        params,
        { ...body, signature_id: fileId },
        { url }
      )
    );
  },

  async delete({ params: { problemId, deliveryId } }, res) {
    if (problemId) {
      await CancelDelivery.run({ problemId });
    } else {
      await DeleteDelivery.run({ deliveryId });
    }
    return res.send();
  },
};
