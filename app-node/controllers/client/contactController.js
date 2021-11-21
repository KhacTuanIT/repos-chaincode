const contact = (req, res, next) => {
    res.render('client/contact', { layout: 'client-layout', page_name: 'contact' });
}

module.exports = {
    contact
}