/* eslint-disable import/first */
/* eslint-disable no-undef */
jest.mock('../../../src/App/Models/User');
import CreateUserService from '../../../src/App/Services/CreateUserService';
import User from '../../../src/App/Models/User';

describe('Create User Service', () => {
  it('Should be create an User', async () => {
    User.create.mockResolvedValue(true);
    User.findOne.mockResolvedValue(false);

    expect(await CreateUserService.run({})).toBe(true);
  });

  it('Should not be create an User with used email', async () => {
    try {
      User.findOne.mockResolvedValue(true);
      await CreateUserService.run({});
      expect(false).toBe(error);
    } catch (err) {
      expect(err.message).toBe('User Email already in use.');
    }
  });
});
