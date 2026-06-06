/**
 * Middleware that checks if a user is authenticated.
 * If authentication fails, redirects to /login.
 * Otherwise, lets the request proceed.
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

module.exports = requireAuth;
