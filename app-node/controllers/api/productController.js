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
        resultProducts = resultProducts.filter(
          (p) => p.Value.is_delete == false
        );
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

const getAllProductPagedAPI = (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  let type = req.query.type ? req.query.type : "";
  let manufacturer = req.query.manufacturer ? req.query.manufacturer : "";
  let page = req.query.page ? req.query.page : 1;
  let search = req.query.keyword ? req.query.keyword : "";
  let filter = req.query.filter ? req.query.filter : "";
  if (org) {
    try {
      let products = helper.getAllProduct(org);
      products.then((data) => {
        let resultProducts = JSON.parse(data != null ? data.toString() : "{}");
        resultProducts = resultProducts.filter(
          (p) => p.Value.is_delete == false
        );
        let skip = (page - 1) * 9;
        let total = resultProducts.length;
        let take = skip + 9 > total ? total - skip : 9;
        let pageProducts = [];
        if (total > 0) {
          let tempProducts = resultProducts;
          if (search.length > 0) {
            tempProducts = tempProducts.filter((product) =>
              product.Value.name.toLowerCase().includes(search)
            );
          }
          if (type.length > 0) {
            tempProducts = tempProducts.filter(
              (product) => product.Value.type == type
            );
          }
          if (manufacturer.length > 0) {
            tempProducts = tempProducts.filter(
              (product) => product.Value.manufactororId == manufacturer
            );
          }
          switch (filter) {
            case "az":
              tempProducts = tempProducts.sort(compareAZ);
              break;
            case "za":
              tempProducts = tempProducts.sort(compareZA);
              break;
            case "dprice":
              tempProducts = tempProducts.sort(compareDescPrice);
              break;
            case "aprice":
              tempProducts = tempProducts.sort(compareAscPrice);
              break;
          }
          total = tempProducts.length;
          pageProducts = tempProducts.slice(skip, skip + take);
        }
        let listProductReturn = [];
        let productReturnItem = undefined;
        let manufactureres = helper.getAllManufacturer(org);
        manufactureres.then((dataManufactureres) => {
          let resultManufactureres = JSON.parse(
            dataManufactureres != null ? dataManufactureres.toString() : "{}"
          );
          if (resultManufactureres) {
            pageProducts.forEach((product) => {
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
            page: page,
            total: total,
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
        res.json({ status: true });
      });
    } catch (error) {
      res
        .status(500)
        .json("Cannot initialize data for Product. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Org field not found in system");
  }
};

const compareAZ = (product, otherProduct) => {
  if (product.Value.name < otherProduct.Value.name) return -1;
  if (product.Value.name > otherProduct.Value.name) return 1;
  return 0;
};

const compareZA = (product, otherProduct) => {
  if (product.Value.name < otherProduct.Value.name) return 1;
  if (product.Value.name > otherProduct.Value.name) return -1;
  return 0;
};

const compareDescPrice = (product, otherProduct) => {
  if (parseInt(product.Value.price) < parseInt(otherProduct.Value.price))
    return 1;
  if (parseInt(product.Value.price) > parseInt(otherProduct.Value.price))
    return -1;
  return 0;
};

const compareAscPrice = (product, otherProduct) => {
  if (parseInt(product.Value.price) < parseInt(otherProduct.Value.price))
    return -1;
  if (parseInt(product.Value.price) > parseInt(otherProduct.Value.price))
    return 1;
  return 0;
};

module.exports = {
  getProductAPI,
  getAllProductAPI,
  initializeDataProduct,
  getAllProductPagedAPI,
};
