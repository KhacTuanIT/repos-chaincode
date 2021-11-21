const { home } = require('./homeController');
const { account } = require('./accountController');
const { about } = require('./aboutController');
const { cart } = require('./cartController');
const { contact } = require('./contactController');
const { payment } = require('./paymentController');
const { product, getProduct, getAllProduct } = require('./productController');

module.exports = {
    about,
    account,
    cart,
    contact,
    home,
    payment,
    product,
    getProduct,
    getAllProduct
}