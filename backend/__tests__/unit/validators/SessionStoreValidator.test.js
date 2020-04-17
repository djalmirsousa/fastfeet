/* eslint-disable no-undef */
import SessionStoreValidator from '../../../src/App/Validators/SessionStoreValidator';

describe('User Store Validator', () => {
  it('Happy Way', async () => {
    const user = {
      email: 'teste@email.com',
      password: '123456',
    };

    const res = await SessionStoreValidator(
      { body: user },
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
    const res = await SessionStoreValidator(
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
    const res = await SessionStoreValidator(
      {
        body: {
          password: true,
          email: 8784514545,
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
