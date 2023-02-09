const loggedIn = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/users/login')
    }
    next();
}

const loggedOut = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/users/signup')
    }
    next();
}

module.exports = {
    loggedIn,
    loggedOut
}