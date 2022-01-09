const express = require("express");
const { body, validationResult } = require("express-validator");

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

const {
  indexView,
  iconsView,
  profileView,
  mapView,
  tablesView,
  loginView,
  registerView,
  uploadFile,
  uploadFileClient,
} = require("../controllers/adminController");
const {
  about,
  account,
  contact,
  home,
  payment,
  product,
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
  getProductNameAPI,
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
const {
  getCartItems,
  addProductToCart,
  removeProductFromCart,
  minusProductFromCart,
  createShipment,
  receiveShipment,
  receiveOrder,
  assignShipper,
  transitShipment,
} = require("../controllers/api/orderController");
const {
  cartView,
  addOrder,
  queryOrder,
  queryOrderHistory,
} = require("../controllers/client/cartController");
const {
  validateAccount,
  logout,
  changePassword,
  changeUserInformation,
  downloadCertificate,
} = require("../controllers/client/accountController");
const { isAuthorized } = require("../controllers/client/authController");
const { queryOrderByUserId } = require("../controllers/client/cartController");
const {
  orderAdminView,
  queryAllOrderAdmin,
  getHistoryOrderAdmin,
} = require("../controllers/admin/orderController");
const {
  validateAccountAdmin,
  loginAdmin,
  registerAdmin,
  isAuthorizedAdmin,
  logoutAdmin,
} = require("../controllers/admin/authController");
const { getUserById } = require("../controllers/api/userController");
const router = express.Router();

//

// #### client ####

router.get("/", home);
router.get("/about", about);
router.get("/account", isAuthorized, account);
router.get("/account/download-cert", isAuthorized, downloadCertificate);
router.post("/account/change-password", isAuthorized, changePassword);
router.post("/account/change-user-info", isAuthorized, changeUserInformation);

router.get("/cart", isAuthorized, cartView);
router.get("/contact", contact);
router.get("/payment", payment);
router.get("/products", product);
router.get("/product-details/:id", productDetail);

// order

router.get("/orders/", isAuthorized, queryOrderByUserId);
router.get("/orders/order-history/:id", isAuthorized, queryOrderHistory);
router.get("/orders/:id", isAuthorized, queryOrder);
router.post("/orders/", isAuthorized, addOrder);
router.post("/orders/receive-order", isAuthorized, receiveOrder);

// register

router.get("/register", registerClientView);
router.post("/register", validateAccount("register"), register);

// login

router.get("/login", loginClientView);
// router.post("/login", validateAccount("loginClient"), loginClient);
router.post(
  "/login",
  upload.single("key"),
  validateAccount("loginClient"),
  loginClient
);

// logout

router.get("/logout", logout);

// #### admin ####

router.get("/admin", isAuthorizedAdmin, indexView);
router.get("/admin/icons", isAuthorizedAdmin, iconsView);
router.get("/admin/profile", isAuthorizedAdmin, profileView);
router.get("/admin/map", isAuthorizedAdmin, mapView);
router.get("/admin/tables", isAuthorizedAdmin, tablesView);

router.get("/admin/logout", logoutAdmin);

router.get("/admin/login", loginView);
router.post("/admin/login", validateAccountAdmin("loginAdmin"), loginAdmin);

router.get("/admin/register", registerView);
router.post(
  "/admin/register",
  validateAccountAdmin("registerAdmin"),
  registerAdmin
);

router.post("/admin/upload", uploadFile);
router.post("/upload-keys", uploadFileClient);

// manufacturer

router.get("/admin/manufactureres", isAuthorizedAdmin, manufacturerAdminView);
router.get(
  "/admin/manufactureres/add",
  isAuthorizedAdmin,
  addManufacturerAdminView
);

router.post(
  "/admin/manufactureres/add",
  isAuthorizedAdmin,
  validateManufacturerAdmin("addManufacturerAdmin"),
  addManufacturerAdmin
);

router.get(
  "/admin/manufactureres/edit/:id",
  isAuthorizedAdmin,
  editManufacturerAdminView
);
router.post(
  "/admin/manufactureres/edit",
  isAuthorizedAdmin,
  validateManufacturerAdmin("editManufacturerAdmin"),
  editManufacturerAdmin
);

router.post(
  "/admin/manufactureres/delete",
  isAuthorizedAdmin,
  validateManufacturerAdmin("deleteManufacturerAdmin"),
  deleteManufacturerAdmin
);

// product type

router.get("/admin/product-types", isAuthorizedAdmin, productTypeAdminView);
router.get(
  "/admin/product-types/add",
  isAuthorizedAdmin,
  addProductTypeAdminView
);

router.post(
  "/admin/product-types/add",
  isAuthorizedAdmin,
  validateProductTypeAdmin("addProductTypeAdmin"),
  addProductTypeAdmin
);

router.get(
  "/admin/product-types/edit/:id",
  isAuthorizedAdmin,
  editProductTypeAdminView
);
router.post(
  "/admin/product-types/edit",
  isAuthorizedAdmin,
  validateProductTypeAdmin("editProductTypeAdmin"),
  editProductTypeAdmin
);

router.post(
  "/admin/product-types/delete",
  isAuthorizedAdmin,
  validateProductTypeAdmin("deleteProductTypeAdmin"),
  deleteProductTypeAdmin
);

// product
router.get("/admin/products", isAuthorizedAdmin, productAdminView);
router.get("/admin/products/add", addProductAdminView);

router.post(
  "/admin/products/add",
  isAuthorizedAdmin,
  validateProductAdmin("addProductAdmin"),
  addProductAdmin
);

router.get("/admin/products/edit/:id", isAuthorizedAdmin, editProductAdminView);
router.post(
  "/admin/products/edit",
  isAuthorizedAdmin,
  validateProductAdmin("editProductAdmin"),
  editProductAdmin
);

router.post(
  "/admin/products/delete",
  isAuthorizedAdmin,
  validateProductAdmin("deleteProductAdmin"),
  deleteProductAdmin
);

// orders
router.get("/admin/orders", isAuthorizedAdmin, orderAdminView);
router.post("/admin/orders/create-shipment", isAuthorizedAdmin, createShipment);
router.post("/admin/orders/assign-shipment", isAuthorizedAdmin, assignShipper);
router.post(
  "/admin/orders/receive-shipment",
  isAuthorizedAdmin,
  receiveShipment
);
router.post(
  "/admin/orders/transit-shipment",
  isAuthorizedAdmin,
  transitShipment
);
// router.post("/admin/orders/close-order", isAuthorizedAdmin, orderClose);

// #### api ####

router.post("/api/enroll-admin", enrollAdmin);
router.post("/api/registry-user", addUser);
router.get("/api/users/:id", isAuthorizedAdmin, getUserById);

// product api

router.get("/api/products", getAllProductAPI);
router.get("/api/products-paged", getAllProductPagedAPI);
router.get("/api/product", getProductAPI);
router.get("/api/product-name", getProductNameAPI);
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

// order

router.get("/api/orders", queryAllOrderAdmin);
router.get("/api/get-cart-items", getCartItems);
router.post("/api/add-cart-item/:id", addProductToCart);
router.post("/api/remove-cart-item/:id", removeProductFromCart);
router.post("/api/minus-cart-item/:id", minusProductFromCart);
router.get("/api/get-order-history/:id", getHistoryOrderAdmin);

router.post("/api/orders/create-shipment/:id", createShipment);
router.post("/api/orders/receiver-shipment/:id", receiveShipment);
router.post("/api/orders/receive-order/:id", receiveOrder);
router.post("/api/orders/assign-shipment/:id", assignShipper);
router.post("/api/orders/transit-shipment/:id", transitShipment);

//

router.post("/api/init-manufacturer", initializeDataManufacturer);
router.post("/api/init-product", initializeDataProduct);
router.post("/api/init-user", initializeDataUser);
router.post("/api/init-product-type", initializeDataProductType);

module.exports = {
  routes: router,
};
