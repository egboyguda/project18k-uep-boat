module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    //req.flash('error', 'you must log in');
    return res.redirect('/login');
  }

  next();
};
module.exports.isAdminL = async (req, res, next) => {
  if (!req.user.isAdmin) {
    await res.send('your not authorize to enter');
    //res.redirect('/login');
  }
  next();
};
