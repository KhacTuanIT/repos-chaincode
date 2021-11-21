const home = (req, res, next) => {
    res.render('client/home', { layout: 'client-layout', page_name: 'home' });
}

module.exports = {
    home
}