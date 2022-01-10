const helper = require("./../../utils/helperv2");
const { body, validationResult } = require("express-validator");
var nodemailer = require("nodemailer");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const { log } = require("console");
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

var smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "tuantk1506@gmail.com",
    pass: "Kt0985204903",
  },
});
var rand, mailOptions, host, link;

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
        const existUserResult = await helper.getAllUser("supply", "");
        const existUserParse = JSON.parse(existUserResult.toString());
        let existUser = undefined;
        let existEmail = undefined;
        for (var i = 0; i < existUserParse.length; i++) {
          if (existUserParse[i].Value.email === email)
            existEmail = existUserParse[i].Value;
          if (existUserParse[i].Value.username === username)
            existUser = existUserParse[i].Value;
        }
        console.log(email, username);
        console.log(existEmail, existUser);
        if (!existUser && !existEmail) {
          user.userId = uuid.v4();
          user.role = "client";
          user.manager = "";
          user.updated_by = "";
          user.address = "";
          const enroll = await helper.registerAndGetSecret(
            user.userId,
            "client",
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
            req.session.userId = user.userId;
            req.session.usernameS = user.username;
            req.session.email = user.email;
            rand = helper.uuidv4();
            host = req.get("host");
            link = "http://" + host + "/verify?id=" + rand;
            mailOptions = {
              from: "TECO .Inc",
              to: user.email,
              subject: "Please confirm your Email account",
              html:
                "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
                link +
                ">Click here to verify</a>",
            };
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function (error, response) {
              if (error) {
                req.session.error = error.message;
                res.status(500).json({
                  redirect: true,
                  message: error.message,
                });
              } else {
                res.json({
                  message: `Add user for ${org} successfully!`,
                  data: JSON.parse(result.toString()),
                });
              }
            });
          } else {
            await res.status(500).json({
              message: enroll.message,
            });
          }
        } else {
          if (existUser) {
            await res.status(500).json({
              errors: [
                { msg: "Username is exists in system!", param: "username" },
              ],
              message: "Add user failed! ERR: username is exists in system!",
            });
          } else if (existEmail) {
            await res.status(500).json({
              message: "Add user failed! ERR: email is exists in system!",
              errors: [{ msg: "Email is exists in system!", param: "email" }],
            });
          }
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

const verifyEmail = async (req, res, next) => {
  try {
    if (req.protocol + "://" + req.get("host") == "http://" + host) {
      console.log("Domain is matched. Information is from Authentic email");
      if (req.query.id == rand) {
        let userResult = await helper.getUser("supply", req.session.userId);
        let user = JSON.parse(userResult.toString());
        let userParse = JSON.parse(Buffer.from(user.data).toString("utf-8"));
        console.log(userParse);
        const {
          userId,
          firstName,
          middleName,
          lastName,
          email,
          address,
          org,
          is_verify,
          updated_by,
        } = userParse;
        let userVerify = {
          userId,
          email,
          address,
          org,
          is_verify,
          updated_by,
        };
        userVerify.firstname = firstName;
        userVerify.middlename = middleName;
        userVerify.lastname = lastName;
        console.log(userVerify);
        await helper.changeUserInformation(userVerify);
        res.render("client/verify", {
          layout: "client-layout",
          page_name: "verify",
          isVerify: true,
          message:
            "Email " +
            mailOptions.to +
            " is been Successfully verified. Please download certificate file in personal page to login in next time!",
        });
      } else {
        await res.render("client/verify", {
          layout: "client-layout",
          page_name: "verify",
          isVerify: false,
          message: "Email is not verified",
        });
      }
    } else {
      await res.render("404", {
        layout: "client-layout",
        page_name: "error",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginClientView = (req, res, next) => {
  res.render("client/login", {
    layout: "client-layout",
    page_name: "login",
    message: "Please save the certificate file to use for login!",
  });
};

const beforeVerifyClientView = (req, res, next) => {
  res.render("client/beforeConfirm", {
    layout: "client-layout",
    page_name: "verify",
  });
};

const loginClient = async (req, res, next) => {
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

const downloadCertificate = (req, res, next) => {
  const filePath = path.join(
    __dirname,
    "../../public/keys/" + req.session.userId
  );
  res.download(filePath);
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
      is_verify: true,
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
  downloadCertificate,
  verifyEmail,
  beforeVerifyClientView,
};
