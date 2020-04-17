/* eslint-disable no-undef */
import UserStoreValidator from '../../../src/App/Validators/UserStoreValidator';

describe('User Store Validator', () => {
  it('Happy Way', async () => {
    const user = {
      name: 'teste',
      email: 'teste@email.com',
      password: '123456',
      passwordConfirm: '123456',
    };

    const res = await UserStoreValidator(
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
    const res = await UserStoreValidator(
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
    expect(res.messages.length).toBe(4);
  });

  it('Should be return errors (invalid)', async () => {
    const res = await UserStoreValidator(
      {
        body: {
          name: '',
          password: true,
          passwordConfirm: false,
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
    expect(res.messages.length).toBe(5);
  });
});
