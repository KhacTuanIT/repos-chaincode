const helper = require('../../utils/helperv2');

const initializeDataManufacturer = (req, res, next) => {
    let org = req.body.org;
    if (org) {
        try {
            let products = helper.getProduct(org, productCode);
            products.then(data => res.json({ product: JSON.parse(data.toString()) }));
        } catch (error) {
            res.status(500).json('Cannot initialize data for manufacturer. ERR: ' + error.message);
        }
    }
    else {
        res.status(404).json('Org field not found in system');
    }
}