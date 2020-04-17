import jwt from 'jsonwebtoken';
import User from '../Models/User';

import authConfig from '../../Config/auth';

import Exception from '../Exceptions/ServiceException';

export default {
  async run({ email, password }) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Exception('User not found.');
    }

    if (!(await user.checkPassword(password))) {
      throw new Exception('Password does not match.');
    }

    const { name, id } = user;

    return {
      user: {
        email,
        name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    };
  },
};
