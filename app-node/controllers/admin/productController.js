const helper = require("../../utils/helperv2");
const { body, validationResult } = require("express-validator");

const addProductAdmin = async (req, res, next) => {
  const {
    name,
    code,
    manufactororId,
    color,
    price,
    cpu,
    ram,
    screen,
    keyboard,
    storage,
    network,
    usb,
    origin,
    yearOrigin,
    owner,
    primaryImage,
    subImage,
    description,
    updated_by,
  } = req.body;
  const product = {
    name,
    code,
    manufactororId,
    color,
    price,
    cpu,
    ram,
    screen,
    keyboard,
    storage,
    network,
    usb,
    origin,
    yearOrigin,
    owner: owner ? owner : "",
    primaryImage: primaryImage ? primaryImage : "",
    subImage: subImage ? subImage : "",
    description: description ? description : "",
    updated_by: updated_by ? updated_by : "",
  };
  const org = req.body.org ? req.body.org : "supply";
  if (org) {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
      await helper.addProduct(product, org);
      await res.json({
        message: `Add product for ${org} successfully!`,
        product: product,
      });
    } catch (error) {
      console.log(error);
      await res
        .status(500)
        .json({ message: "Add product failed! ERR: " + error.message });
    }
  } else {
    await res
      .status(400)
      .json({ message: "Add product failed! ERR: data not appropriate" });
  }
};

const editProductAdmin = async (req, res, next) => {
  const {
    name,
    code,
    manufactororId,
    color,
    price,
    cpu,
    ram,
    screen,
    keyboard,
    storage,
    network,
    usb,
    origin,
    yearOrigin,
    owner,
    primaryImage,
    subImage,
    description,
    updated_by,
  } = req.body;
  const product = {
    name,
    code,
    manufactororId,
    color,
    price,
    cpu,
    ram,
    screen,
    keyboard,
    storage,
    network,
    usb,
    origin,
    yearOrigin,
    owner: owner ? owner : "",
    primaryImage: primaryImage ? primaryImage : "",
    subImage: subImage ? subImage : "",
    description: description ? description : "",
    updated_by: updated_by ? updated_by : "admin",
  };
  const org = req.body.org ? req.body.org : "supply";
  if (org) {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
      await helper.editProduct(product, org);
      await res.json({
        message: `Edit product for ${org} successfully!`,
        product: product,
      });
    } catch (error) {
      console.log(error);
      await res
        .status(500)
        .json({ message: "Edit product failed! ERR: " + error.message });
    }
  } else {
    await res
      .status(400)
      .json({ message: "Edit product failed! ERR: data not appropriate" });
  }
};

const deleteProductAdmin = async (req, res, next) => {
  const { productCode } = req.body;
  const org = req.body.org ? req.body.org : "supply";
  let updated_by = "admin";
  if (org) {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
      const result = await helper.deleteProduct(productCode, updated_by, org);
      await res.json({
        message: `Delete product for ${org} successfully!`,
        product: result,
        status: true,
      });
    } catch (error) {
      console.log(error);
      await res.status(500).json({
        message: "Delete product failed! ERR: " + error.message,
        status: false,
      });
    }
  } else {
    await res.status(400).json({
      message: "Delete product failed! ERR: data not appropriate",
      status: false,
    });
  }
};

const productAdminView = (req, res, next) => {
  res.render("admin/products/products", {
    layout: "layout",
    page_name: "product",
  });
};

const addProductAdminView = (req, res, next) => {
  res.render("admin/products/add", {
    layout: "layout",
    page_name: "product",
  });
};

const editProductAdminView = async (req, res, next) => {
  let productCode = req.params.id;
  let org = req.params.org ? req.params.org : "supply";
  if (org) {
    try {
      let types = await helper.getAllProductType(org);
      let manufactureres = await helper.getAllManufacturer(org);
      let product = helper.getProduct(org, productCode);
      product.then((data) => {
        console.log(JSON.parse(data.toString()));
        res.render("admin/products/edit", {
          layout: "layout",
          page_name: "product",
          product: data
            ? JSON.parse(data.toString())
            : { productCode: "", name: "" },
          types: JSON.parse(types.toString()),
          manufactureres: JSON.parse(manufactureres.toString()),
        });
      });
    } catch (error) {
      res.render("404");
    }
  } else {
    res.render("404");
  }
};

const getHistoryProductAdmin = (req, res, next) => {
  let productId = req.params.id;

  let org = req.params.org ? req.params.org : "supply";
  if (org) {
    try {
      const history = helper.getProductHistory(productId, org);
      history.then((historyResult) => {
        if (historyResult) {
          console.log(historyResult);
          res.json({
            history: JSON.parse(historyResult.toString()),
            status: true,
          });
        } else {
          res.status(404).json({
            status: false,
            message: `Not found result for ${productId}`,
          });
        }
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error });
    }
  } else {
    res
      .status(404)
      .json({ status: false, message: "Failure to get data without org" });
  }
};

const validateProductAdmin = (method) => {
  switch (method) {
    case "addProductAdmin":
    case "editProductAdmin": {
      return [
        body("name", "product name doesn't exists").notEmpty(),
        body("code", "product code does not exists").notEmpty(),
        body("manufactororId", "manufactororId does not exists").notEmpty(),
        body("price", "price does not exists").notEmpty(),
      ];
    }
    case "deleteProductAdmin": {
      return [body("productCode", "product code does not exists").notEmpty()];
    }
  }
};

function getBase64(file) {
  var reader = new window.FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    return reader.result;
  };
  reader.onerror = function (error) {
    return null;
  };
}

module.exports = {
  addProductAdmin,
  validateProductAdmin,
  productAdminView,
  getHistoryProductAdmin,
  addProductAdminView,
  editProductAdmin,
  editProductAdminView,
  deleteProductAdmin,
};
