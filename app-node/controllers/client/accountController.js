const helper = require("./../../utils/helperv2");
const { body, validationResult } = require("express-validator");

const uuid = require("uuid");

const account = async (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userResult = await helper.getUser(org, req.session.userId);
    let user = JSON.parse(userResult.toString());
    console.log(user);
    let userParse = JSON.parse(Buffer.from(user.data).toString("utf-8"));
    console.log(userParse);
    res.render("client/account", {
      layout: "client-layout",
      page_name: "account",
      user: userParse,
    });
  } catch (error) {
    console.log(error);
    res.render("404", {
      layout: "client-layout",
      page_name: "404",
    });
  }
};

const registerClientView = (req, res, next) => {
  res.render("client/register", {
    layout: "client-layout",
    page_name: "register",
  });
};

const register = async (req, res, next) => {
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
          user.role = "client";
          user.manager = "";
          user.updated_by = "";
          user.address = "";
          console.log(user);
          const enroll = await helper.registerAndGetSecret(
            user.userId,
            "client",
            user.org
          );
          if (enroll.success == true) {
            const result = await helper.addUserForOrg(user);
            await res.json({
              message: `Add user for ${org} successfully!`,
              data: JSON.parse(result.toString()),
              result: enroll,
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

const loginClientView = (req, res, next) => {
  res.render("client/login", {
    layout: "client-layout",
    page_name: "login",
    message: null,
  });
};

const loginClient = async (req, res, next) => {
  const { username, password, org } = req.body;
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
      console.log(existUserResult);
      const existUser = JSON.parse(existUserResult.toString());
      console.log(existUser);
      if (existUser) {
        user.userId = existUser.userId;
        const result = await helper.loginUser(user);
        const userParse = JSON.parse(result.toString());
        if (userParse.status) {
          req.session.userId = user.userId;
          req.session.email = existUser.email;
          await res.json({
            status: true,
            message: `Login successfully!`,
            data: "",
          });
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

const changePassword = async (req, res, next) => {
  const { confirmPassword, password, userId } = req.body;
  let org = req.body.org ? req.body.org : "supply";
  if (confirmPassword != password) {
    await res.status(500).json({
      status: false,
      message: "Login failed! ERR: " + JSON.stringify(error.message),
      errors: [{ password: "Username or password incorrect" }],
    });
  } else {
    try {
      let user = {
        userId,
        password,
        org,
        updated_by: "admin",
      };
      let result = await helper.changePassword(user);
      let userParse = JSON.parse(result.toString());
      if (userParse) {
        await res.json({
          status: true,
          message: "Change password successfully",
          errors: null,
        });
      } else {
        await res.status(404).json({
          status: false,
          message: "Not found any user to change password",
          errors: null,
        });
      }
    } catch (error) {
      await res.status(500).json({
        status: false,
        message: "Fail to change password. Err: " + error.message,
        errors: null,
      });
    }
  }
};

const changeUserInformation = async (req, res, next) => {
  const { firstname, middlename, lastname, userId, email, address } = req.body;
  let org = req.body.org ? req.body.org : "supply";
  try {
    let user = {
      userId,
      firstname,
      middlename,
      lastname,
      email,
      address,
      org,
      updated_by: "admin",
    };
    let result = await helper.changeUserInformation(user);
    let userParse = JSON.parse(result.toString());
    if (userParse) {
      await res.json({
        status: true,
        message: "Change user information successfully",
        errors: null,
      });
    } else {
      await res.status(404).json({
        status: false,
        message: "Not found any user to change user information",
        errors: null,
      });
    }
  } catch (error) {
    await res.status(500).json({
      status: false,
      message: "Fail to change user information. Err: " + error.message,
      errors: null,
    });
  }
};

const logout = (req, res, next) => {
  if (req.session.userId) {
    delete req.session.userId;
    delete req.session.email;
  }
  return res.redirect("/");
};

const validateAccount = (method) => {
  switch (method) {
    case "register": {
      return [
        body("username", "User name is required").notEmpty(),
        body("firstname", "First name is required").notEmpty(),
        body("lastname", "Last name is required").notEmpty(),
        body("email", "Email is required").notEmpty(),
        body("password", "Password is required").notEmpty(),
        body("confirmPassword", "Confirm password is required").notEmpty(),
      ];
    }
    case "loginClient": {
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

module.exports = {
  account,
  register,
  registerClientView,
  loginClient,
  loginClientView,
  validateAccount,
  logout,
  changeUserInformation,
  changePassword,
};
