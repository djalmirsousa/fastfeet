import jwt from 'jsonwebtoken';
import factory from './factories';

import authConfig from '../../src/Config/auth';

export default async ({ isAdmin = false } = {}) => {
  let id = null;

  if (isAdmin) {
    const admin = await factory.create('Admin');
    id = admin.user_id;
  } else {
    id = (await factory.create('User')).id;
  }

  return jwt.sign({ id }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
};
