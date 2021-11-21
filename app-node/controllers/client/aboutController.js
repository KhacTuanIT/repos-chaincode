const about = (req, res, next) => {
    res.render('client/about', { layout: 'client-layout', page_name: 'about' });
}

module.exports = {
    about
}