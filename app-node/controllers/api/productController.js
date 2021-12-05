const helper = require("../../utils/helperv2");

const getProductAPI = (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  let productCode = req.query.productCode;
  if (org) {
    try {
      let product = helper.getProduct(org, productCode);
      product.then((data) => {
        let resultProduct = JSON.parse(data != null ? data.toString() : "{}");
        let manufactureres = helper.getAllManufacturer(org);
        manufactureres.then((dataManufactureres) => {
          let resultManufactureres = JSON.parse(
            dataManufactureres != null ? dataManufactureres.toString() : "{}"
          );
          if (resultManufactureres) {
            resultProduct.manufacturer = resultManufactureres.filter((item) => {
              if (item.Value.manufactororId === resultProduct.manufactororId)
                return item.Value.name;
            });
          }
          res.json({
            product: resultProduct,
          });
        });
      });
    } catch (error) {
      res.status(500).json("Cannot get product. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Not fould any records");
  }
};

const getAllProductAPI = (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  if (org) {
    try {
      let products = helper.getAllProduct(org);
      products.then((data) => {
        let resultProducts = JSON.parse(data != null ? data.toString() : "{}");
        let listProductReturn = [];
        let productReturnItem = undefined;
        let manufactureres = helper.getAllManufacturer(org);
        manufactureres.then((dataManufactureres) => {
          let resultManufactureres = JSON.parse(
            dataManufactureres != null ? dataManufactureres.toString() : "{}"
          );
          if (resultManufactureres) {
            resultProducts.forEach((product) => {
              productReturnItem = product;
              productReturnItem.Value.manufacturer =
                resultManufactureres.filter((item) => {
                  if (
                    item.Value.manufactororId === product.Value.manufactororId
                  )
                    return item.Value.name;
                });
              listProductReturn.push(productReturnItem);
            });
          }
          res.json({
            products: listProductReturn,
          });
        });
      });
    } catch (error) {
      res.status(500).json("Cannot get product. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Not fould any records");
  }
};

const initializeDataProduct = (req, res, next) => {
  let org = req.body.org ? req.body.org : "supply";
  if (org) {
    try {
      let products = helper.initDataProduct(org);
      products.then((data) => {
        console.log(JSON.stringify(data));
        res.json({ status: true });
      });
      res.json({ status: true });
    } catch (error) {
      res
        .status(500)
        .json("Cannot initialize data for Product. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Org field not found in system");
  }
};

module.exports = {
  getProductAPI,
  getAllProductAPI,
  initializeDataProduct,
};
