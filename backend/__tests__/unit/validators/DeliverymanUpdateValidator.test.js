/* eslint-disable no-undef */
import DeliverymanUpdateValidator from '../../../src/App/Validators/DeliverymanUpdateValidator';
import { factory } from '../../utils';

describe('Deliveryman Update Validator', () => {
  it('Happy Way', async () => {
    const recipient = await factory.attrs('Deliveryman');

    const res = await DeliverymanUpdateValidator(
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
    const res = await DeliverymanUpdateValidator(
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
    const res = await DeliverymanUpdateValidator(
      {
        body: {
          name: '1',
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
    expect(res.messages.length).toBe(1);
  });
});
