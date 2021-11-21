const express = require('express');

const { indexView, iconsView, profileView, mapView, tablesView, loginView, registerView } = require('../controllers/adminController');
const { about, account, cart, contact, home, payment, product, getProduct, getAllProduct } = require('../controllers/client/index');
const { enrollAdmin, addProduct, addUser } = require('../controllers/admin/enrollController');
const router = express.Router();

router.get('/', home);
router.get('/about', about);
router.get('/account', account);
router.get('/cart', cart);
router.get('/contact', contact);
router.get('/payment', payment);
router.get('/products', product);
router.get('/admin', indexView);
router.get('/admin/icons', iconsView);
router.get('/admin/profile', profileView);
router.get('/admin/map', mapView);
router.get('/admin/tables', tablesView);
router.get('/admin/login', loginView);
router.get('/admin/register', registerView);

router.post('/api/enroll-admin', enrollAdmin);
router.post('/api/registry-user', addUser);
router.get('/api/products', getAllProduct);
router.get('/api/product', getProduct);
router.post('/api/product', addProduct);

module.exports = {
    routes: router
}