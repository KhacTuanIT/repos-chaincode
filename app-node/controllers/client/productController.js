const helper = require("../../utils/helperv2");

const product = (req, res, next) => {
  res.render("client/product", {
    layout: "client-layout",
    page_name: "product",
  });
};

const productDetail = async (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  let productCode = req.params.id;
  if (productCode) {
    try {
      let result = helper.getProduct(org, productCode);
      result
        .then(async (data) => {
          let product = JSON.parse(data.toString());
          let type = await helper.getProductType(org, product.type);
          let manufacturerResult = await helper.getManufacturer(
            org,
            product.manufactororId
          );
          let manufacturer = manufacturerResult
            ? JSON.parse(manufacturerResult.toString())
            : null;
          let productRelates = [];
          if (manufacturer) {
            let productResults = await helper.getAllProduct(org);
            let products = productResults
              ? JSON.parse(productResults.toString())
              : null;
            if (products) {
              products.forEach((pro) => {
                if (manufacturer.manufactororId == pro.Value.manufactororId) {
                  productRelates.push(pro);
                }
              });
            }
          }
          console.log(productRelates);
          res.render("client/product-detail", {
            layout: "client-layout",
            page_name: "product",
            product: product ? product : { code: "", name: "" },
            type: type ? JSON.parse(type.toString()) : null,
            manufacturer: manufacturer,
            productRelates: productRelates,
          });
        })
        .error((err) => {
          res.render("404", {
            layout: "client-layout",
            page_name: "product",
          });
        });
    } catch (error) {
      console.log(err);
    }
  } else {
    res.render("404", {
      layout: "client-layout",
      page_name: "product",
    });
  }
};

const getProduct = (req, res, next) => {
  let org = req.query.org;
  let productCode = req.query.productCode;
  if (org) {
    try {
      let products = helper.getProduct(org, productCode);
      products
        .then((data) => res.json({ product: JSON.parse(data.toString()) }))
        .error((err) => {
          console.log(err);
        });
    } catch (error) {
      res.status(500).json("Cannot get product. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Not fould any records");
  }
};

const getAllProduct = async (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  if (org) {
    try {
      let products = helper.getAllProduct(org);
      let result = undefined;
      products
        .then((data) => (result = JSON.parse(data.toString())))
        .error((err) => {
          console.log(err);
        });
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
  productDetail,
};
