const helper = require("../../utils/helperv2");

const initializeDataManufacturer = (req, res, next) => {
  let org = req.body.org ? req.body.org : "supply";
  if (org) {
    try {
      let products = helper.initDataManufacturer(org);
      console.log(products.toString());
      products.then((data) => {
        console.log(JSON.stringify(data));
        res.json({ status: true });
      });
    } catch (error) {
      res
        .status(500)
        .json("Cannot initialize data for manufacturer. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Org field not found in system");
  }
};

const getManufacturerAPI = (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  let manufactororId = req.params.id;
  if (org) {
    try {
      let manufacturer = helper.getManufacturer(org, manufactororId);
      manufacturer.then((data) => {
        let resultManufacturer = JSON.parse(
          data != null ? data.toString() : "{}"
        );

        res.json({
          manufacturer: resultManufacturer,
        });
      });
    } catch (error) {
      res.status(500).json("Cannot get manufacturer. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Not fould any records");
  }
};

const getAllManufacturerAPI = (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  if (org) {
    try {
      let manufactureres = helper.getAllManufacturer(org);
      manufactureres.then((data) => {
        let resultManufactureres = JSON.parse(
          data != null ? data.toString() : "{}"
        );

        res.json({
          manufactureres: resultManufactureres,
        });
      });
    } catch (error) {
      res.status(500).json("Cannot get manufactureres. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Not fould any records");
  }
};

module.exports = {
  initializeDataManufacturer,
  getAllManufacturerAPI,
  getManufacturerAPI,
};
