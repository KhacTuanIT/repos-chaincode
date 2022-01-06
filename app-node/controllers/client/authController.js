const helper = require("../../utils/helperv2");
module.exports.isAuthorized = async function (req, res, next) {
  let org = req.query.org ? req.query.org : "supply";
  if (req.session.userId) {
    try {
      let user = await helper.getUser(org, req.session.userId);
      if (user === null) {
        return res.render("client/login", {
          layout: "client-layout",
          page_name: "login",
          message: "Not found user in system",
        });
      } else {
        return next();
      }
    } catch (error) {
      return res.render("client/login", {
        layout: "client-layout",
        page_name: "login",
        message: "You are unauthorized! Please login to continue.",
      });
    }
  } else {
    return res.render("client/login", {
      layout: "client-layout",
      page_name: "login",
      message: "You are unauthorized! Please login to continue.",
    });
  }
};

