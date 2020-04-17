import User from '../Models/User';

import Exception from '../Exceptions/ServiceException';

export default {
  async run({ userId: id, auth }, { name, password }) {
    // const dialectIsProtgres = process.env.DB_DIALECT === 'postgres';

    // const result = await User.update(
    //   { name, password },
    //   { where: { id }, returning: dialectIsProtgres }
    // );

    // if (result[0] < 1) {
    //   throw new Exception('Invalid User id.');
    // }

    // if (!dialectIsProtgres) {
    //   return User.findByPk(id);
    // }

    // return result[1][0];

    if (!auth.isAdmin && String(auth.id) !== id) {
      throw new Exception('Invalid User id.');
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw new Exception('Invalid User id.');
    }

    return user.update({ name, password });
  },
};
