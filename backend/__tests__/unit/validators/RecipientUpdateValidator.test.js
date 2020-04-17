/* eslint-disable no-undef */
import RecipientUpdateValidator from '../../../src/App/Validators/RecipientUpdateValidator';
import { factory } from '../../utils';

describe('Recipient Update Validator', () => {
  it('Happy Way', async () => {
    const recipient = await factory.attrs('Recipient');

    const res = await RecipientUpdateValidator(
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

  it('Should be return errors (required body)', async () => {
    const res = await RecipientUpdateValidator(
      { body: null },
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
    expect(res.messages.length).toBe(1);
  });

  it('Should be return errors (invalid)', async () => {
    const res = await RecipientUpdateValidator(
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
