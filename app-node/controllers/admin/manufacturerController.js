const helper = require("../../utils/helperv2");
const { body, validationResult } = require("express-validator");

const addManufacturerAdmin = async (req, res, next) => {
  const { name, manufactororId } = req.body;
  const manufacturer = {
    name,
    manufactororId,
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
      await helper.addManufacturer(manufacturer, org);
      await res.json({
        message: `Add manufacturer for ${org} successfully!`,
        manufacturer: manufacturer,
        status: true,
      });
    } catch (error) {
      console.log(error);
      await res.status(500).json({
        message: "Add manufacturer failed! ERR: " + error.message,
        status: false,
      });
    }
  } else {
    await res.status(400).json({
      message: "Add manufacturer failed! ERR: data not appropriate",
      status: false,
    });
  }
};

const editManufacturerAdmin = async (req, res, next) => {
  const { name, manufactororId } = req.body;
  let updated_by = "admin";
  const manufacturer = {
    name,
    manufactororId,
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
      await helper.editManufacturer(manufacturer, org);
      await res.json({
        message: `Edit manufacturer for ${org} successfully!`,
        manufacturer: manufacturer,
        status: true,
      });
    } catch (error) {
      console.log(error);
      await res.status(500).json({
        message: "Edit manufacturer failed! ERR: " + error.message,
        status: false,
      });
    }
  } else {
    await res.status(400).json({
      message: "Edit manufacturer failed! ERR: data not appropriate",
      status: false,
    });
  }
};

const deleteManufacturerAdmin = async (req, res, next) => {
  const { manufactororId } = req.body;
  const org = req.body.org ? req.body.org : "supply";
  let updated_by = "admin";
  if (org) {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
      const result = await helper.deleteManufacturer(
        manufactororId,
        updated_by,
        org
      );
      await res.json({
        message: `Delete manufacturer for ${org} successfully!`,
        manufacturer: result,
        status: true,
      });
    } catch (error) {
      console.log(error);
      await res.status(500).json({
        message: "Delete manufacturer failed! ERR: " + error.message,
        status: false,
      });
    }
  } else {
    await res.status(400).json({
      message: "Delete manufacturer failed! ERR: data not appropriate",
      status: false,
    });
  }
};

const getHistoryManufacturerAdmin = (req, res, next) => {
  let manufactororId = req.params.id;

  let org = req.params.org ? req.params.org : "supply";
  if (org) {
    try {
      const history = helper.getHistoryManufacturer(manufactororId, org);
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
            message: `Not found result for ${manufactororId}`,
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

const manufacturerAdminView = (req, res, next) => {
  res.render("admin/manufactureres/manufactureres", {
    layout: "layout",
    page_name: "manufacturer",
  });
};

const addManufacturerAdminView = (req, res, next) => {
  res.render("admin/manufactureres/add", {
    layout: "layout",
    page_name: "manufacturer",
  });
};

const editManufacturerAdminView = (req, res, next) => {
  let manufactororId = req.params.id;
  let org = req.params.org ? req.params.org : "supply";
  if (org) {
    try {
      let manufacturer = helper.getManufacturer(org, manufactororId);
      manufacturer.then((data) => {
        console.log(JSON.parse(data.toString()));
        res.render("admin/manufactureres/edit", {
          layout: "layout",
          page_name: "manufacturer",
          manufacturer: data
            ? JSON.parse(data.toString())
            : { manufactororId: "", name: "" },
        });
      });
    } catch (error) {
      res.render("404");
    }
  } else {
    res.render("404");
  }
};

const validateManufacturerAdmin = (method) => {
  switch (method) {
    case "addManufacturerAdmin":
    case "editManufacturerAdmin": {
      return [
        body("name", "Manufacturer name is required").notEmpty(),
        body("manufactororId", "Manufacturer Id is required").notEmpty(),
      ];
    }
    case "deleteManufacturerAdmin": {
      return [body("manufactororId", "Manufacturer Id is required").notEmpty()];
    }
  }
};

module.exports = {
  validateManufacturerAdmin,
  manufacturerAdminView,
  editManufacturerAdminView,
  addManufacturerAdmin,
  editManufacturerAdmin,
  addManufacturerAdminView,
  deleteManufacturerAdmin,
  getHistoryManufacturerAdmin,
};
