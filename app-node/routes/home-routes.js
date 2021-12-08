const express = require("express");
const { body, validationResult } = require("express-validator");

const {
  indexView,
  iconsView,
  profileView,
  mapView,
  tablesView,
  loginView,
  registerView,
  uploadFile,
} = require("../controllers/adminController");
const {
  about,
  account,
  cart,
  contact,
  home,
  payment,
  product,
  getProduct,
  getAllProduct,
  register,
  registerClientView,
  loginClient,
  loginClientView,
} = require("../controllers/client/index");
const {
  enrollAdmin,
  addProduct,
  addUser,
} = require("../controllers/admin/enrollController");
const {
  addProductAdmin,
  productAdminView,
  getHistoryProductAdmin,
  addProductAdminView,
  editProductAdmin,
  deleteProductAdmin,
  validateProductAdmin,
  editProductAdminView,
} = require("../controllers/admin/productController");
const {
  getProductAPI,
  getAllProductAPI,
  initializeDataProduct,
  getAllProductPagedAPI,
} = require("../controllers/api/productController");
const {
  initializeDataManufacturer,
  getManufacturerAPI,
  getAllManufacturerAPI,
} = require("../controllers/api/manufacturerController");
const {
  initializeDataProductType,
  getProductTypeAPI,
  getAllProductTypeAPI,
} = require("../controllers/api/productTypeController");
const { initializeDataUser } = require("../controllers/api/userController");
const {
  manufacturerAdminView,
  editManufacturerAdminView,
  validateManufacturerAdmin,
  addManufacturerAdminView,
  getHistoryManufacturerAdmin,
  deleteManufacturerAdmin,
  editManufacturerAdmin,
  addManufacturerAdmin,
} = require("../controllers/admin/manufacturerController");
const {
  productTypeAdminView,
  getHistoryProductTypeAdmin,
  editProductTypeAdmin,
  addProductTypeAdmin,
  editProductTypeAdminView,
  deleteProductTypeAdmin,
  validateProductTypeAdmin,
  addProductTypeAdminView,
} = require("../controllers/admin/productTypeController");
const bodyParser = require("body-parser");
const { productDetail } = require("../controllers/client/productController");
const router = express.Router();

// #### client ####

router.get("/", home);
router.get("/about", about);
router.get("/account", account);
router.get("/cart", cart);
router.get("/contact", contact);
router.get("/payment", payment);
router.get("/products", product);
router.get("/product-details/:id", productDetail);

// register

router.get("/register", registerClientView);
router.post("/register", register);

// login

router.get("/login", loginClientView);
router.post("/login", loginClient);

// #### admin ####

router.get("/admin", indexView);
router.get("/admin/icons", iconsView);
router.get("/admin/profile", profileView);
router.get("/admin/map", mapView);
router.get("/admin/tables", tablesView);
router.get("/admin/login", loginView);
router.get("/admin/register", registerView);

router.post("/admin/upload", uploadFile);

// manufacturer

router.get("/admin/manufactureres", manufacturerAdminView);
router.get("/admin/manufactureres/add", addManufacturerAdminView);

router.post(
  "/admin/manufactureres/add",
  validateManufacturerAdmin("addManufacturerAdmin"),
  addManufacturerAdmin
);

router.get("/admin/manufactureres/edit/:id", editManufacturerAdminView);
router.post(
  "/admin/manufactureres/edit",
  validateManufacturerAdmin("editManufacturerAdmin"),
  editManufacturerAdmin
);

router.post(
  "/admin/manufactureres/delete",
  validateManufacturerAdmin("deleteManufacturerAdmin"),
  deleteManufacturerAdmin
);

// product type

router.get("/admin/product-types", productTypeAdminView);
router.get("/admin/product-types/add", addProductTypeAdminView);

router.post(
  "/admin/product-types/add",
  validateProductTypeAdmin("addProductTypeAdmin"),
  addProductTypeAdmin
);

router.get("/admin/product-types/edit/:id", editProductTypeAdminView);
router.post(
  "/admin/product-types/edit",
  validateProductTypeAdmin("editProductTypeAdmin"),
  editProductTypeAdmin
);

router.post(
  "/admin/product-types/delete",
  validateProductTypeAdmin("deleteProductTypeAdmin"),
  deleteProductTypeAdmin
);

// product
router.get("/admin/products", productAdminView);
router.get("/admin/products/add", addProductAdminView);

router.post(
  "/admin/products/add",
  validateProductAdmin("addProductAdmin"),
  addProductAdmin
);

router.get("/admin/products/edit/:id", editProductAdminView);
router.post(
  "/admin/products/edit",
  validateProductAdmin("editProductAdmin"),
  editProductAdmin
);

router.post(
  "/admin/products/delete",
  validateProductAdmin("deleteProductAdmin"),
  deleteProductAdmin
);

// #### api ####

router.post("/api/enroll-admin", enrollAdmin);
router.post("/api/registry-user", addUser);

// product api

router.get("/api/products", getAllProductAPI);
router.get("/api/products-paged", getAllProductPagedAPI);
router.get("/api/product", getProductAPI);
router.post("/api/product", addProduct);
router.get("/api/get-product-history/:id", getHistoryProductAdmin);

// product type

router.get("/api/product-type", getProductTypeAPI);
router.get("/api/product-types", getAllProductTypeAPI);
router.get("/api/get-product-type-history/:id", getHistoryProductTypeAdmin);

// manufacturer

router.get("/api/manufacturer", getManufacturerAPI);
router.get("/api/manufactureres", getAllManufacturerAPI);
router.get("/api/get-manufacturer-history/:id", getHistoryManufacturerAdmin);

//

router.post("/api/init-manufacturer", initializeDataManufacturer);
router.post("/api/init-product", initializeDataProduct);
router.post("/api/init-user", initializeDataUser);
router.post("/api/init-product-type", initializeDataProductType);

module.exports = {
  routes: router,
};
