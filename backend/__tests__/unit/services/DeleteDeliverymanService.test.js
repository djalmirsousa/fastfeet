/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../../src/App/Models/Deliveryman');
jest.mock('../../../src/App/Models/Delivery');

import DeleteDeliverymanService from '../../../src/App/Services/DeleteDeliverymanService';

import Deliveryman from '../../../src/App/Models/Deliveryman';
import Delivery from '../../../src/App/Models/Delivery';

describe('Delete Deliveryman Service', () => {
  it('Should be able to delete Deliveryman', async () => {
    try {
      Deliveryman.findByPk.mockResolvedValue({
        destroy: () => true,
      });
      Delivery.update.mockResolvedValue(true);
      await DeleteDeliverymanService.run({});
      expect(true).toBe(true);
    } catch (err) {
      expect('ocorreu um erro.').toBe('nao ocorra erro.');
    }
  });

  it('Should not be delete a Deliveryman with invalid id', async () => {
    try {
      Deliveryman.findByPk.mockResolvedValue(false);
      Delivery.update.mockResolvedValue(true);
      await DeleteDeliverymanService.run({});
      expect('ocorreu um erro.').toBe('ocorra erro.');
    } catch (err) {
      expect(err.message).toBe('Invalid deliveryman id.');
    }
  });
});
