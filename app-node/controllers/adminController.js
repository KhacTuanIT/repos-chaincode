const indexView = (req, res, next) => {
    res.render('admin/home');
}

const iconsView = (req, res, next) => {
    res.render('admin/icons');
}

const mapView = (req, res, next) => {
    res.render('admin/map');
}

const loginView = (req, res, next) => {
    res.render('admin/login', { layout: false });
}

const registerView = (req, res, next) => {
    res.render('admin/register', { layout: false });
}

const profileView = (req, res, next) => {
    res.render('admin/profile');
}

const tablesView = (req, res, next) => {
    res.render('admin/tables');
}

module.exports = {
    indexView,
    iconsView,
    mapView,
    loginView,
    registerView,
    profileView,
    tablesView
}