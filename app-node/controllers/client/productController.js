const helper = require('../../utils/helperv2');
const query = require('../../utils/query');
const product = (req, res, next) => {
    res.render('client/product', { layout: 'client-layout', page_name: 'product' });
}

const getProduct = (req, res, next) => {
    let org = req.query.org;
    let productCode = req.query.productCode;
    console.log(productCode);
    if (org) {
        try {
            let products = helper.getProduct(org, productCode);
            products.then(data => res.json({ product: JSON.parse(data.toString()) }));
        } catch (error) {
            res.status(500).json('Cannot get product. ERR: ' + error.message);
        }
    }
    else {
        res.status(404).json('Not fould any records');
    }
}

const getAllProduct = (req, res, next) => {
    let org = req.query.org;
    if (org) {
        try {
            let products = helper.getAllProduct(org);
            products.then(data => res.json({ product: JSON.parse(data.toString()) }));
        } catch (error) {
            res.status(500).json('Cannot get product. ERR: ' + error.message);
        }
    }
    else {
        res.status(404).json('Not fould any records');
    }
}

module.exports = {
    product,
    getProduct,
    getAllProduct
}