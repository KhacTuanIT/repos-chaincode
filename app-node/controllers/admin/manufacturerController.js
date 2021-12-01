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
    org,
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
    owner,
    primaryImage,
    subImage,
  };
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

const manufacturerAdminView = (req, res, next) => {
  res.render("admin/manufactureres/manufactureres", {
    layout: "layout",
    page_name: "manufacturer",
  });
};

const validateProductAdmin = (method) => {
  switch (method) {
    case "addProductAdmin": {
      return [
        body("name", "product name doesn't exists").exists(),
        body("code", "product code does not exists").exists(),
        body("manufactororId", "manufactororId does not exists").exists(),
        body("price", "price does not exists").exists(),
      ];
    }
  }
};

module.exports = {
  addProductAdmin,
  validateProductAdmin,
  manufacturerAdminView,
};
