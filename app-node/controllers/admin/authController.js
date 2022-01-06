const helper = require("./../../utils/helperv2");
const { body, validationResult } = require("express-validator");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const getKeys = (id) => {
  const filePath = path.join(__dirname, "../../public/keys/" + id);
  var result = undefined;
  fs.readFile(filePath, { encoding: "utf-8" }, function (err, data) {
    if (!err) {
      result = data;
    } else {
      console.log(err);
    }
  });
  console.log(fs);
  return result;
};

const registerAdmin = async (req, res, next) => {
  const {
    username,
    firstname,
    middlename,
    lastname,
    password,
    confirmPassword,
    email,
    org,
  } = req.body;
  const user = {
    username,
    firstname,
    middlename,
    lastname,
    password,
    email,
    org,
  };
  if (org) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    if (password != confirmPassword) {
      await res.status(500).json({
        message: "Registry new account fail!",
        errors: [
          { msg: "Confirm password not match!", param: "confirmPassword" },
        ],
      });
    } else {
      try {
        const existUserResult = await helper.getUserByUsername(user);
        const existUser = JSON.stringify(existUserResult.toString());
        if (existUser.username != "") {
          user.userId = uuid.v4();
          user.role = "admin";
          user.manager = "";
          user.updated_by = "";
          user.address = "";
          const enroll = await helper.registerAndGetSecret(
            user.userId,
            "admin",
            user.org
          );
          if (enroll.success == true) {
            const result = await helper.addUserForOrg(user);
            const wallet = await helper.getWallet(user.org, user.userId);
            const filePath = path.join(
              __dirname,
              "../../public/keys/" + user.userId
            );
            fs.writeFileSync(
              filePath,
              JSON.stringify(wallet, null, 2),
              "utf-8"
            );
            req.session.adminUserId = user.userId;
            req.session.email = existUser.email;
            await res.json({
              message: `Add user for ${org} successfully!`,
              data: JSON.parse(result.toString()),
              result: enroll,
              wallet: wallet,
            });
          } else {
            await res.status(500).json({
              message: enroll.message,
            });
          }
        } else {
          await res.status(500).json({
            message: "Add user failed! ERR: username is exists in system!",
          });
        }
      } catch (error) {
        console.log(error);
        await res.status(500).json({
          message: "Add user failed! ERR: " + JSON.stringify(error.message),
        });
      }
    }
  } else {
    await res
      .status(400)
      .json({ message: "Add user failed! ERR: data not appropriate" });
  }
};

const loginAdmin = async (req, res, next) => {
  const { username, password, org, fileid } = req.body;
  let user = {
    username,
    password,
    org,
  };
  if (org) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    try {
      const existUserResult = await helper.getUserByUsername(user);
      const existUser = JSON.parse(existUserResult.toString());
      if (existUser) {
        user.userId = existUser.userId;
        const result = await helper.loginUser(user);
        const userParse = JSON.parse(result.toString());

        if (userParse.status) {
          const wallet = await helper.getWallet(
            existUser.org,
            existUser.userId
          );
          const filePath = path.join(
            __dirname,
            "../../public/validate-keys/" + fileid
          );
          fs.readFile(
            filePath,
            { encoding: "utf-8" },
            async function (err, data) {
              if (!err) {
                const key = JSON.parse(data);
                if (JSON.stringify(key) === JSON.stringify(wallet)) {
                  if (existUser.role == "admin") {
                    req.session.adminUserId = user.userId;
                    req.session.email = existUser.email;
                    await res.json({
                      status: true,
                      message: `Login successfully!`,
                      data: "",
                    });
                  } else {
                    await res.status(500).json({
                      status: false,
                      message: `Authorize fail! Your are have not permission!`,
                      data: null,
                      errors: [
                        {
                          param: "key",
                          msg: "Authorize fail! Your are have not permission!",
                        },
                      ],
                    });
                  }
                } else {
                  await res.status(500).json({
                    status: false,
                    message: `Authorize fail! Your credentials incorrect!`,
                    data: null,
                    errors: [
                      {
                        param: "key",
                        msg: "Authorize fail! Your credentials incorrect!",
                      },
                    ],
                  });
                }
              } else {
                console.log(err);
              }
            }
          );
        } else {
          await res.status(500).json({
            status: false,
            message: `Username or password incorrect!`,
            data: null,
            errors: [
              { param: "password", msg: "Username or password incorrect" },
            ],
          });
        }
      } else {
        await res.status(500).json({
          status: false,
          message: `Username or password incorrect!`,
          data: null,
          errors: [{ password: "Username or password incorrect" }],
        });
      }
    } catch (error) {
      await res.status(500).json({
        status: false,
        message: `${error.message}`,
        errors: [
          {
            param: "password",
            msg: "Username or password does not exists, please create one!",
          },
        ],
      });
    }
  } else {
    await res.status(400).json({
      status: false,
      message: "Login failed! ERR: data not appropriate",
    });
  }
};

const logoutAdmin = (req, res, next) => {
  if (req.session.adminUserId) {
    delete req.session.adminUserId;
    delete req.session.email;
  }
  return res.redirect("/admin/login");
};

const validateAccountAdmin = (method) => {
  switch (method) {
    case "registerAdmin": {
      return [
        body("username", "User name is required").notEmpty(),
        body("firstname", "First name is required").notEmpty(),
        body("lastname", "Last name is required").notEmpty(),
        body("email", "Email is required").notEmpty(),
        body("password", "Password is required").notEmpty(),
        body("confirmPassword", "Confirm password is required").notEmpty(),
      ];
    }
    case "loginAdmin": {
      return [
        body("username", "User name is required").notEmpty(),
        body("password", "Password is required").notEmpty(),
      ];
    }
    case "changePassword": {
      return [
        body("password", "Password is required").notEmpty(),
        body("confirmPassword", "Confirm password is required").notEmpty(),
      ];
    }
    case "changeUserInformation": {
      return [
        body("firstname", "First name is required").notEmpty(),
        body("lastname", "Last name is required").notEmpty(),
        body("email", "Email is required").notEmpty(),
      ];
    }
  }
};

const isAuthorizedAdmin = async function (req, res, next) {
  let org = req.query.org ? req.query.org : "supply";
  if (req.session.adminUserId) {
    try {
      let user = await helper.getUser(org, req.session.adminUserId);
      if (user === null) {
        return res.redirect("/admin/login");
      } else {
        return next();
      }
    } catch (error) {
      return res.redirect("/admin/login");
    }
  } else {
    return res.redirect("/admin/login");
  }
};

module.exports = {
  validateAccountAdmin,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  isAuthorizedAdmin,
};
