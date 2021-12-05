const helper = require("../../utils/helperv2");

const initializeDataProductType = (req, res, next) => {
  let org = req.body.org ? req.body.org : "supply";
  if (org) {
    try {
      let products = helper.initDataProductType(org);
      products.then((data) => {
        console.log(JSON.stringify(data));
        res.json({ status: true });
      });
      res.json({ status: true });
    } catch (error) {
      res
        .status(500)
        .json("Cannot initialize data for ProductType. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Org field not found in system");
  }
};

const getProductTypeAPI = (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  let productTypeId = req.query.productTypeId;
  if (org) {
    try {
      let productType = helper.getProductType(org, productTypeId);
      productType.then((data) => {
        let resultProductType = JSON.parse(
          data != null ? data.toString() : "{}"
        );

        res.json({
          productType: resultProductType,
        });
      });
    } catch (error) {
      res.status(500).json("Cannot get product type. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Not fould any records");
  }
};

const getAllProductTypeAPI = (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  if (org) {
    try {
      let productTypes = helper.getAllProductType(org);
      productTypes.then((data) => {
        let resultProductTypes = JSON.parse(
          data != null ? data.toString() : "{}"
        );
        res.json({
          productTypes: resultProductTypes,
        });
      });
    } catch (error) {
      res.status(500).json("Cannot get product types. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Not fould any records");
  }
};

module.exports = {
  initializeDataProductType,
  getAllProductTypeAPI,
  getProductTypeAPI,
};
