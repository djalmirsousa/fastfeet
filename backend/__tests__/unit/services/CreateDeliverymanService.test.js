/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../../src/App/Models/Deliveryman');
import CreateDeliverymanService from '../../../src/App/Services/CreateDeliverymanService';
import Deliveryman from '../../../src/App/Models/Deliveryman';

describe('Create Deliveryman Service', () => {
  it('Should be create an Deliveryman', async () => {
    Deliveryman.create.mockResolvedValue(true);
    Deliveryman.findOne.mockResolvedValue(false);

    expect(await CreateDeliverymanService.run({})).toBe(true);
  });

  it('Should not be create an Deliveryman with used email', async () => {
    try {
      Deliveryman.findOne.mockResolvedValue(true);
      await CreateDeliverymanService.run({});
      expect(false).toBe(error);
    } catch (err) {
      expect(err.message).toBe('Deliveryman Email already in use.');
    }
  });
});
