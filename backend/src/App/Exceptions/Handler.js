import Youch from 'youch';

export default async (err, req, res, next) => {
  if (err.name === 'ServiceException') {
    return res.status(err.status).json({ ...err.error, message: err.message });
  }

  if (process.env.NODE_ENV === 'production') {
    const errors = await new Youch(err, req).toJSON();

    return res.status(500).json(errors);
  }

  if (
    process.env.NODE_ENV === 'test' ||
    process.env.NODE_ENV === 'development'
  ) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  return res.status(500).json({ error: 'Internal server error' });
};
