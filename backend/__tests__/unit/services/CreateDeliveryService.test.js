/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../../src/App/Models/Delivery');
jest.mock('../../../src/App/Models/Recipient');
jest.mock('../../../src/App/Models/Deliveryman');
jest.mock('../../../src/Lib/Queue');

import CreateDeliveryService from '../../../src/App/Services/CreateDeliveryService';
import Delivery from '../../../src/App/Models/Delivery';
import Deliveryman from '../../../src/App/Models/Deliveryman';
import Recipient from '../../../src/App/Models/Recipient';
import Queue from '../../../src/Lib/Queue';

describe('Create Delivery Service', () => {
  it('Should be create an Delivery', async () => {
    Deliveryman.findByPk.mockResolvedValue(true);
    Recipient.findByPk.mockResolvedValue(true);
    Delivery.create.mockResolvedValue(true);

    expect(await CreateDeliveryService.run({})).toBe(true);
    expect(Queue.add.mock.calls.length).toBe(1);
  });

  it('Should not be create an Delivery without valid Deliveryman id.', async () => {
    try {
      Deliveryman.findByPk.mockResolvedValue(false);

      await CreateDeliveryService.run({});
      expect(false).toBe(error);
    } catch (err) {
      expect(err.message).toBe('Invalid Deliveryman id.');
    }
  });

  it('Should not be create an Delivery without valid Deliveryman id.', async () => {
    try {
      Deliveryman.findByPk.mockResolvedValue(true);
      Recipient.findByPk.mockResolvedValue(false);

      await CreateDeliveryService.run({});
      expect(false).toBe(error);
    } catch (err) {
      expect(err.message).toBe('Invalid Recipient id.');
    }
  });
});
