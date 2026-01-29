const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

function injectDefaultUser(req, res, next) {
  req.user = { id: DEFAULT_USER_ID };
  next();
}

module.exports = { injectDefaultUser, DEFAULT_USER_ID };
