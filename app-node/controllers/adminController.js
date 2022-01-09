const path = require("path");
const multer = require("multer");
const helper = require("../utils/helperv2");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now() + "." + file.originalname);
  },
});
var storageKey = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/validate-keys/"));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

var upload = multer({ storage: storage }).single("primaryImage");
var uploadKey = multer({ storage: storageKey }).single("key");

const indexView = async (req, res, next) => {
  try {
    let org = "supply";
    const productAsBytes = await helper.getAllProduct(org);
    const allProducts = JSON.parse(productAsBytes.toString());
    const orderAsBytes = await helper.queryAllOrders(org);
    const allOrders = JSON.parse(orderAsBytes.toString());
    let income = 0;
    for (var i = 0; i < allOrders.length; i++) {
      income += parseInt(allOrders[i].Value.price);
    }
    const userAsBytes = await helper.getAllUser(org, "");
    const allUsers = JSON.parse(userAsBytes.toString());
    await res.render("admin/home", {
      page_name: "dashboard",
      allOrders: allOrders,
      allProducts: allProducts,
      allUsers: allUsers,
      income: income,
    });
  } catch (error) {
    await res.render("404-admin", {
      page_name: "dashboard",
      message: error.message,
    });
  }
};

const iconsView = (req, res, next) => {
  res.render("admin/icons", { page_name: "icons" });
};

const mapView = (req, res, next) => {
  res.render("admin/map", { page_name: "map" });
};

const loginView = (req, res, next) => {
  res.render("admin/login", { layout: false, page_name: "login" });
};

const registerView = (req, res, next) => {
  res.render("admin/register", { layout: false, page_name: "register" });
};

const profileView = (req, res, next) => {
  res.render("admin/profile", { page_name: "profile" });
};

const tablesView = (req, res, next) => {
  res.render("admin/tables", { page_name: "tables" });
};

const uploadFile = async (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Error uploading file.");
    }
    res.json({ status: true, filename: res.req.file.filename });
  });
};

const uploadFileClient = async (req, res, next) => {
  try {
    uploadKey(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.end("Error uploading file.");
      }
      if (res.req.file) {
        res.json({ status: true, filename: res.req.file.filename });
      } else {
        return res.status(500).json({
          status: false,
          message: `Your credentials not obtain`,
          data: null,
          errors: [{ param: "key", msg: "Your credentials not obtain" }],
        });
      }
    });
  } catch (error) {
    await res.status(500).json({
      status: false,
      message: `Your credentials not obtain`,
      data: null,
      errors: [{ param: "key", msg: "Your credentials not obtain" }],
    });
  }
};

module.exports = {
  indexView,
  iconsView,
  mapView,
  loginView,
  registerView,
  profileView,
  tablesView,
  uploadFile,
  uploadFileClient,
};
