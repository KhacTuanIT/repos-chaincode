const cart = (req, res, next) => {
    res.render('client/cart', { layout: 'client-layout', page_name: 'cart' });
}

module.exports = {
    cart
}