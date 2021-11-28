const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const homeRoutes = require('./routes/home-routes');
const { body, validationResult } = require("express-validator");

const app = express();

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(homeRoutes.routes);

app.listen(3003, () => console.log("App is listening on url http://localhost:3003"));