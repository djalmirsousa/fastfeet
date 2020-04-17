import User from '../Models/User';
import Exception from '../Exceptions/ServiceException';

export default {
  async run({ name, email, password }) {
    if (await User.findOne({ where: { email } })) {
      throw new Exception('User Email already in use.');
    }

    return User.create({ name, email, password });
  },
};
