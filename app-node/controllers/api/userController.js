const helper = require("../../utils/helperv2");

const initializeDataUser = (req, res, next) => {
  let org = req.body.org ? req.body.org : "supply";
  if (org) {
    try {
      let products = helper.initDataUser(org);
      products.then((data) =>
        res.json({ product: JSON.parse(data ? data.toString() : "") })
      );
      res.json({ status: true });
    } catch (error) {
      res
        .status(500)
        .json("Cannot initialize data for User. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Org field not found in system");
  }
};

module.exports = {
  initializeDataUser,
};
