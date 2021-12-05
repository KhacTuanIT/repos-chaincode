const helper = require("../../utils/helperv2");

const enrollAdmin = async (req, res, next) => {
  const org = req.body.org;
  console.log(org);
  if (org) {
    try {
      await helper.enrollAdmin(org);
      await res.json({ message: `Enroll admin for ${org} successfully!` });
    } catch (error) {
      await res
        .status(500)
        .json({
          message: "Enroll admin failed! ERR: " + JSON.stringify(error.message),
        });
    }
  } else {
    await res
      .status(400)
      .json({ message: "Enroll admin failed! ERR: org field is required" });
  }
};

const addUser = async (req, res, next) => {
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
    updated_by,
    org,
  };
  console.log(org);
  if (org) {
    try {
      const result = await helper.addUserForOrg(user);
      await res.json({
        message: `Add user for ${org} successfully!`,
        data: result.toString(),
      });
    } catch (error) {
      await res
        .status(500)
        .json({
          message: "Add user failed! ERR: " + JSON.stringify(error.message),
        });
    }
  } else {
    await res
      .status(400)
      .json({ message: "Add user failed! ERR: data not appropriate" });
  }
};

const addProduct = async (req, res, next) => {
  const {
    name,
    code,
    manufactororId,
    color,
    price,
    cpu,
    ram,
    screen,
    keyboard,
    storage,
    network,
    usb,
    origin,
    description,
    yearOrigin,
    owner,
    primaryImage,
    subImage,
    updated_by,
    org,
  } = req.body;
  const product = {
    name,
    code,
    manufactororId,
    color,
    price,
    cpu,
    ram,
    screen,
    keyboard,
    storage,
    network,
    usb,
    origin,
    description,
    yearOrigin,
    owner,
    primaryImage,
    subImage,
    updated_by,
  };
  if (org) {
    try {
      await helper.addProduct(product, org);
      await res.json({ message: `Add product for ${org} successfully!` });
    } catch (error) {
      console.log(error);
      await res
        .status(500)
        .json({ message: "Add product failed! ERR: " + error.message });
    }
  } else {
    await res
      .status(400)
      .json({ message: "Add product failed! ERR: data not appropriate" });
  }
};

module.exports = {
  enrollAdmin,
  addUser,
  addProduct,
};
