/* eslint-disable no-undef */
import RecipientStoreValidator from '../../../src/App/Validators/RecipientStoreValidator';
import { factory } from '../../utils';

describe('Recipient Store Validator', () => {
  it('Happy Way', async () => {
    const recipient = await factory.attrs('Recipient');

    const res = await RecipientStoreValidator(
      { body: recipient },
      {
        status: status => ({
          status,
          json: v => v,
        }),
      },
      () => true
    );

    expect(res).toBe(true);
  });

  it('Should be return errors (required)', async () => {
    const res = await RecipientStoreValidator(
      { body: {} },
      {
        status: status => ({
          status,
          json: v => ({ ...v, status }),
        }),
      },
      () => true
    );

    expect(res.status).toBe(400);
    expect(res.error).toBe('Validation fails');
    expect(res.messages.length).toBe(7);
  });

  it('Should be return errors (invalid)', async () => {
    const res = await RecipientStoreValidator(
      {
        body: {
          name: '1',
          street: null,
          number: null,
          complement: null,
          state: null,
          city: null,
          zip: 'invalid',
        },
      },
      {
        status: status => ({
          status,
          json: v => ({ ...v, status }),
        }),
      },
      () => true
    );

    expect(res.status).toBe(400);
    expect(res.error).toBe('Validation fails');
    expect(res.messages.length).toBe(7);
  });
});
