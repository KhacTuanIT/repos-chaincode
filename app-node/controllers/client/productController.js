const helper = require("../../utils/helperv2");

const product = (req, res, next) => {
  res.render("client/product", {
    layout: "client-layout",
    page_name: "product",
  });
};

const getProduct = (req, res, next) => {
  let org = req.query.org;
  let productCode = req.query.productCode;
  if (org) {
    try {
      let products = helper.getProduct(org, productCode);
      products.then((data) =>
        res.json({ product: JSON.parse(data.toString()) })
      );
    } catch (error) {
      res.status(500).json("Cannot get product. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Not fould any records");
  }
};

const getAllProduct = (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  if (org) {
    try {
      let products = helper.getAllProduct(org);
      let result = undefined;
      products.then((data) => (result = JSON.parse(data.toString())));
      console.log(result);
      res.render("client/product", {
        layout: "client-layout",
        page_name: "product",
        products: result,
      });
    } catch (error) {
      res.status(500).json("Cannot get product. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Not fould any records");
  }
};

module.exports = {
  product,
  getProduct,
  getAllProduct,
};
