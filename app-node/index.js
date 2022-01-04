const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const { secret } = require("./utils/config/credentials");
const path = require("path");
const bodyParser = require("body-parser");
const homeRoutes = require("./routes/home-routes");
const { body, validationResult } = require("express-validator");

const sessionOptions = {
  secret: secret,
  cookie: {
    expires: new Date(Date.now() + 60 * 60 * 5 * 1000),
    maxAge: 60 * 60 * 5 * 1000,
  },
  saveUninitialized: true,
  resave: true,
};

const app = express();
app.use(session(sessionOptions));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 1000000,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(homeRoutes.routes);
app.get("/admin/*", function (req, res, next) {
  res.render("404-admin", {
    layout: "layout",
    page_name: "product",
  });
});
app.get("*", function (req, res, next) {
  res.render("404", {
    layout: "client-layout",
    page_name: "product",
  });
});
app.listen(3003, () =>
  console.log("App is listening on url http://localhost:3003")
);
