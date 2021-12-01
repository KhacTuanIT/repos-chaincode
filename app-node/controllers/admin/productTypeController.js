const helper = require("../../utils/helperv2");

const productTypeAdminView = (req, res, next) => {
  res.render("admin/productTypes/productTypes", {
    layout: "layout",
    page_name: "product-type",
  });
};

module.exports = {
  productTypeAdminView,
};
