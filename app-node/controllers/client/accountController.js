const helper = require("./../../utils/helperv2");

const account = (req, res, next) => {
  res.render("client/account", {
    layout: "client-layout",
    page_name: "account",
  });
};

const registerClientView = (req, res, next) => {
  res.render("client/register", {
    layout: "client-layout",
    page_name: "register",
  });
};

const register = async (req, res, next) => {
  const {
    userId,
    username,
    fullname,
    password,
    email,
    address,
    role,
    manager,
    updated_by,
    org,
  } = req.body;
  const user = {
    userId,
    username,
    fullname,
    password,
    email,
    address,
    role,
    manager,
    org,
    updated_by,
  };
  if (org) {
    try {
      const result = await helper.addUserForOrg(user);
      await res.json({
        message: `Add user for ${org} successfully!`,
        data: result.toString(),
      });
    } catch (error) {
      await res.status(500).json({
        message: "Add user failed! ERR: " + JSON.stringify(error.message),
      });
    }
  } else {
    await res
      .status(400)
      .json({ message: "Add user failed! ERR: data not appropriate" });
  }
};

const loginClientView = (req, res, next) => {
  res.render("client/login", { layout: "client-layout", page_name: "login" });
};

const loginClient = async (req, res, next) => {
  const {
    userId,
    username,
    fullname,
    password,
    email,
    address,
    role,
    manager,
    org,
    updated_by,
  } = req.body;
  const user = {
    userId,
    username,
    fullname,
    password,
    email,
    address,
    role,
    manager,
    org,
    updated_by,
  };
  if (org) {
    try {
      const result = await helper.addUserForOrg(user);
      await res.json({
        message: `Add user for ${org} successfully!`,
        data: result.toString(),
      });
    } catch (error) {
      await res.status(500).json({
        message: "Add user failed! ERR: " + JSON.stringify(error.message),
      });
    }
  } else {
    await res
      .status(400)
      .json({ message: "Add user failed! ERR: data not appropriate" });
  }
};

module.exports = {
  account,
  register,
  registerClientView,
  loginClient,
  loginClientView,
};
