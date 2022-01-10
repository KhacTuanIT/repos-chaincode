const helper = require("../../utils/helperv2");
const { body, validationResult } = require("express-validator");

const addProductTypeAdmin = async (req, res, next) => {
  const { name, productTypeId } = req.body;
  const productType = {
    name,
    productTypeId,
    updated_by: "admin",
  };
  const org = req.body.org ? req.body.org : "supply";
  if (org) {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
      await helper.addProductType(productType, org);
      await res.json({
        message: `Add productType for ${org} successfully!`,
        productType: productType,
        status: true,
      });
    } catch (error) {
      console.log(error);
      await res.status(500).json({
        message: "Add productType failed! ERR: " + error.message,
        status: false,
      });
    }
  } else {
    await res.status(400).json({
      message: "Add productType failed! ERR: data not appropriate",
      status: false,
    });
  }
};

const editProductTypeAdmin = async (req, res, next) => {
  const { name, productTypeId } = req.body;
  const productType = {
    name,
    productTypeId,
    updated_by: "admin",
  };
  const org = req.body.org ? req.body.org : "supply";
  if (org) {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
      await helper.editProductType(productType, org);
      await res.json({
        message: `Edit productType for ${org} successfully!`,
        productType: productType,
        status: true,
      });
    } catch (error) {
      console.log(error);
      await res.status(500).json({
        message: "Edit productType failed! ERR: " + error.message,
        status: false,
      });
    }
  } else {
    await res.status(400).json({
      message: "Edit productType failed! ERR: data not appropriate",
      status: false,
    });
  }
};

const deleteProductTypeAdmin = async (req, res, next) => {
  const { productTypeId } = req.body;
  const org = req.body.org ? req.body.org : "supply";
  let updated_by = "admin";
  if (org) {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
      const result = await helper.deleteProductType(
        productTypeId,
        updated_by,
        org
      );
      await res.json({
        message: `Delete productType for ${org} successfully!`,
        productType: result,
        status: true,
      });
    } catch (error) {
      console.log(error);
      await res.status(500).json({
        message: "Delete productType failed! ERR: " + error.message,
        status: false,
      });
    }
  } else {
    await res.status(400).json({
      message: "Delete productType failed! ERR: data not appropriate",
      status: false,
    });
  }
};

const productTypeAdminView = (req, res, next) => {
  res.render("admin/productTypes/productTypes", {
    layout: "layout",
    page_name: "product-type",
  });
};

const addProductTypeAdminView = (req, res, next) => {
  res.render("admin/productTypes/add", {
    layout: "layout",
    page_name: "product-type",
  });
};

const editProductTypeAdminView = (req, res, next) => {
  let productTypeId = req.params.id;
  let org = req.params.org ? req.params.org : "supply";
  if (org) {
    try {
      let productType = helper.getProductType(org, productTypeId);
      productType.then((data) => {
        console.log(JSON.parse(data.toString()));
        res.render("admin/productTypes/edit", {
          layout: "layout",
          page_name: "product-type",
          productType: data
            ? JSON.parse(data.toString())
            : { productTypeId: "", name: "" },
        });
      });
    } catch (error) {
      res.render("404");
    }
  } else {
    res.render("404");
  }
};

const getHistoryProductTypeAdmin = (req, res, next) => {
  let productTypeId = req.params.id;

  let org = req.params.org ? req.params.org : "supply";
  if (org) {
    try {
      const history = helper.getHistoryProductType(productTypeId, org);
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
            message: `Not found result for ${productTypeId}`,
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

const validateProductTypeAdmin = (method) => {
  switch (method) {
    case "addProductTypeAdmin":
    case "editProductTypeAdmin": {
      return [
        body("name", "ProductType name is required").notEmpty(),
        body("productTypeId", "ProductType Id is required").notEmpty(),
      ];
    }
    case "deleteProductTypeAdmin": {
      return [body("productTypeId", "ProductType Id is required").notEmpty()];
    }
  }
};

module.exports = {
  productTypeAdminView,
  getHistoryProductTypeAdmin,
  addProductTypeAdmin,
  addProductTypeAdminView,
  editProductTypeAdmin,
  editProductTypeAdminView,
  validateProductTypeAdmin,
  deleteProductTypeAdmin,
};
