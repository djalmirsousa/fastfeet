/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../../src/App/Models/Recipient');

import UpdateRecipientService from '../../../src/App/Services/UpdateRecipientService';

import Recipient from '../../../src/App/Models/Recipient';

describe('Update Recipient Service', () => {
  it('Should be able to update Recipient (not postgres)', async () => {
    Recipient.update.mockResolvedValue([1]);

    Recipient.findByPk.mockResolvedValue(true);

    expect(await UpdateRecipientService.run(1, {})).toBe(true);
  });

  it('Should not be update a Recipient with invalid id (not postgres)', async () => {
    try {
      Recipient.update.mockResolvedValue([0]);
      await UpdateRecipientService.run(-1, {});
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toBe('Invalid Recipient id.');
    }
  });
});
