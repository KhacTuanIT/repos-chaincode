const helper = require("../../utils/helperv2");

const initializeDataUser = (req, res, next) => {
  let org = req.body.org ? req.body.org : "supply";
  if (org) {
    try {
      let products = helper.initDataUser(org);
      products.then((data) => {
        console.log(JSON.stringify(data));
        res.json({ status: true });
      });
    } catch (error) {
      res
        .status(500)
        .json("Cannot initialize data for User. ERR: " + error.message);
    }
  } else {
    res.status(404).json("Org field not found in system");
  }
};

const getUserById = async (req, res, next) => {
  let org = req.body.org ? req.body.org : "supply";
  let userId = req.params.id;
  if (org) {
    try {
      let user = await helper.getUser(org, userId);
      let userPr = JSON.parse(user.toString());
      let userParse = JSON.parse(Buffer.from(userPr.data).toString("utf-8"));
      await res.json({
        status: true,
        user: userParse,
      });
    } catch (error) {
      await res
        .status(500)
        .json("Cannot initialize data for User. ERR: " + error.message);
    }
  } else {
    await res.status(404).json("Org field not found in system");
  }
};

module.exports = {
  initializeDataUser,
  getUserById,
};
