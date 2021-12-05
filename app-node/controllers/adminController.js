const path = require('path');
const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, '../public/images/'));
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now() + "." + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("primaryImage");

const indexView = (req, res, next) => {
  res.render("admin/home", { page_name: "dashboard" });
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
    res.json({ status: true, filename: res.req.file.filename});
  });
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
};
