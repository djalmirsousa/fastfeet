/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../../src/App/Models/Recipient');

import CreateRecipientService from '../../../src/App/Services/CreateRecipientService';

import Recipient from '../../../src/App/Models/Recipient';

describe('Create Recipient Service', () => {
  it('Should be able to create Recipient', async () => {
    Recipient.create.mockResolvedValue(true);

    expect(await CreateRecipientService.run({})).toBe(true);
  });
});
