export default ({ auth }, res, next) => {
  if (!auth || !auth.isAdmin) {
    return res.status(401).json({ error: 'Not permited, only for admins.' });
  }
  return next();
};
