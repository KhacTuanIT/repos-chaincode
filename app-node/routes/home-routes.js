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
const productAdmin = require("../controllers/admin/productController");
const {
  addProductAdmin,
  productAdminView,
} = require("../controllers/admin/productController");
const {
  getProductAPI,
  getAllProductAPI,
  initializeDataProduct,
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
  editManufacurerAdmin,
  addManufacturerAdminView,
  addManufacurerAdmin,
  getHistoryManufacturerAdmin,
  deleteManufacturerAdmin,
} = require("../controllers/admin/manufacturerController");
const {
  productTypeAdminView,
} = require("../controllers/admin/productTypeController");
const bodyParser = require("body-parser");
const router = express.Router();

// #### client ####

router.get("/", home);
router.get("/about", about);
router.get("/account", account);
router.get("/cart", cart);
router.get("/contact", contact);
router.get("/payment", payment);
router.get("/products", product);

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

// manufacturer

router.get("/admin/manufactureres", manufacturerAdminView);
router.get("/admin/manufactureres/add", addManufacturerAdminView);

router.post(
  "/admin/manufactureres/add",
  validateManufacturerAdmin("addManufacurerAdmin"),
  addManufacurerAdmin
);

router.get("/admin/manufactureres/edit/:id", editManufacturerAdminView);
router.post(
  "/admin/manufactureres/edit",
  validateManufacturerAdmin("editManufacurerAdmin"),
  editManufacurerAdmin
);

router.post(
  "/admin/manufactureres/delete",
  validateManufacturerAdmin("deleteManufacturerAdmin"),
  deleteManufacturerAdmin
);

// product type

router.get("/admin/product-types", productTypeAdminView);

// product
router.get("/admin/products", productAdminView);
router.post(
  "/admin/product",
  productAdmin.validateProductAdmin("addProductAdmin"),
  addProductAdmin
);

// #### api ####

router.post("/api/enroll-admin", enrollAdmin);
router.post("/api/registry-user", addUser);

// product api

router.get("/api/products", getAllProductAPI);
router.get("/api/product", getProductAPI);
router.post("/api/product", addProduct);

// product type

router.get("/api/product-type", getProductTypeAPI);
router.get("/api/product-types", getAllProductTypeAPI);

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
