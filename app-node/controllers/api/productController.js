const helper = require('../../utils/helperv2');

const getProductAPI = (req, res, next) => {
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

const getAllProductAPI = (req, res, next) => {
    let org = req.query.org;
    if (org) {
        try {
            let products = helper.getAllProduct(org);
            products.then(data => res.json({ products: JSON.parse(data.toString()) }));
        } catch (error) {
            res.status(500).json('Cannot get product. ERR: ' + error.message);
        }
    }
    else {
        res.status(404).json('Not fould any records');
    }
}

module.exports = {
    getProductAPI,
    getAllProductAPI
}