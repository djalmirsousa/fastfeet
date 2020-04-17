export default (req, res, next) => {
  if (
    req.body &&
    Object.entries(req.body).length === 0 &&
    req.body.constructor === Object
  ) {
    req.body = null;
  }
  return next();
};
