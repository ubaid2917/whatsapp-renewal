require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const ejs = require("ejs");

const bodyParser = require("body-parser");
const db = require("./db/db");

const staticPath = path.join(__dirname, "public");
const viewPath = path.join(__dirname, "views");

app.set("view engine", "ejs");
app.set("views", viewPath);

app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// logins routes
const authRoutes = require('./routes/auth/authRoute.js');

app.use('/', authRoutes);

// admin Routes 
const adminRoutes = require('./routes/admin/adminRoute.js');

app.use('/', adminRoutes)

app.listen(port, function (req, res) {
    console.log('listening on port', port);
})