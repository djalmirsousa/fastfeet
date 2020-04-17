import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../Config/auth';

import User from '../Models/User';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const { id } = await promisify(jwt.verify)(token, authConfig.secret);

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(401).json({ error: 'Token invalid.' });
    }

    req.auth = user;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
};
