/* eslint-disable no-undef */
import DeliverymanStoreValidator from '../../../src/App/Validators/DeliverymanStoreValidator';

describe('Deliveryman Store Validator', () => {
  it('Happy Way', async () => {
    const deliveryman = {
      name: 'teste',
      email: 'teste@email.com',
      avatar_id: '12345',
    };

    const res = await DeliverymanStoreValidator(
      { body: deliveryman },
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
    const res = await DeliverymanStoreValidator(
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
    expect(res.messages.length).toBe(2);
  });

  it('Should be return errors (invalid)', async () => {
    const res = await DeliverymanStoreValidator(
      {
        body: {
          name: '',
          email: 8784514545,
          avatar_id: null,
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
    expect(res.messages.length).toBe(4);
  });
});
