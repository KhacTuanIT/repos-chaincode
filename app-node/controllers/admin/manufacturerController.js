const helper = require("../../utils/helperv2");
const { body, validationResult } = require("express-validator");

const addManufacurerAdmin = async (req, res, next) => {
  const { name, manufactororId } = req.body;
  const manufacturer = {
    name,
    manufactororId,
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

const editManufacurerAdmin = async (req, res, next) => {
  const { name, manufactororId } = req.body;
  const manufacturer = {
    name,
    manufactororId,
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
};

const validateManufacturerAdmin = (method) => {
  switch (method) {
    case "addManufacurerAdmin":
    case "editManufacurerAdmin": {
      return [
        body("name", "Manufacturer name is required").notEmpty(),
        body("manufactororId", "Manufacturer Id is required").notEmpty(),
      ];
    }
  }
};

module.exports = {
  validateManufacturerAdmin,
  manufacturerAdminView,
  editManufacturerAdminView,
  addManufacurerAdmin,
  editManufacurerAdmin,
  addManufacturerAdminView,
};
