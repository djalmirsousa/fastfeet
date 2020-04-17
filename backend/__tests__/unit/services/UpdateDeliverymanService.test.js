/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../../src/App/Models/Deliveryman');

import UpdateDeliverymanService from '../../../src/App/Services/UpdateDeliverymanService';

import Deliveryman from '../../../src/App/Models/Deliveryman';

describe('Update Deliveryman Service', () => {
  it('Should be able to update Deliveryman (not postgres)', async () => {
    Deliveryman.findByPk.mockResolvedValue({ update: () => true });

    expect(await UpdateDeliverymanService.run(1, {})).toBe(true);
  });

  it('Should not be update a Deliveryman with invalid id (not postgres)', async () => {
    try {
      Deliveryman.findByPk.mockResolvedValue(false);
      await UpdateDeliverymanService.run(-1, {});
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toBe('Invalid Deliveryman id.');
    }
  });
});
