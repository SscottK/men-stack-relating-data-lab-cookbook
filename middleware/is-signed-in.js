const isSignedIn = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/suth/sign-in')
}

module.exports = isSignedIn