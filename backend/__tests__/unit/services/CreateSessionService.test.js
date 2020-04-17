/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../../src/App/Models/User');
jest.mock('../../../src/App/Models/Admin');
jest.mock('../../../src/App/Models/Deliveryman');

import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import authConfig from '../../../src/Config/auth';

import User from '../../../src/App/Models/User';

import CreateSessionService from '../../../src/App/Services/CreateSessionService';

describe('Create Session Service', () => {
  it('Should be create a Session', async () => {
    const email = 'teste email';
    const name = 'test name';
    const id = '5e2cc2e12db45420819c438c';

    User.findOne.mockResolvedValue({
      name,
      id,
      checkPassword: () => true,
    });

    const newSession = await CreateSessionService.run({
      email,
    });

    expect(newSession).toHaveProperty('user', { email, name });
    expect(newSession).toHaveProperty('token');

    const { token } = newSession;
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    expect(id).toBe(decoded.id);
  });

  it('Should not be create an Session without valid user', async () => {
    try {
      User.findOne.mockResolvedValue(false);
      await CreateSessionService.run({});
    } catch (err) {
      expect(err.message).toBe('User not found.');
    }
  });

  it('Should not be create an Session without valid password', async () => {
    try {
      User.findOne.mockResolvedValue({ checkPassword: () => false });
      await CreateSessionService.run({});
    } catch (err) {
      expect(err.message).toBe('Password does not match.');
    }
  });
});
