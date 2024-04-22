const express = require("express");
const app = express();
const path = require("path");
const registerController = require("../../controller/auth/registerController");
const multer = require("multer");

const auth = require("../../middlewares/userMiddleware");
const config = require("../../config/config");
const session = require("express-session");
app.use(express.static("public"));

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../../public/images"));
//   },
//   filename: function (req, file, cb) {
//     const name = Date.now() + "-" + file.originalname;
//     cb(null, name);
//   },
// });
// const upload = multer({ storage: storage });

app.use(
  session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);

// register
app.get('/register', (req, res) => {
  res.render('auth/register.ejs')
})
app.post("/register", registerController.userRegister);


// login
app.get('/', auth.isLogout , (req, res) => {
  res.render('auth/login.ejs')
})
app.post('/login', registerController.loginUser);


// forget password 
app.get("/forgetpassword",  registerController.loadforgetpassword);
app.post("/forgetpassword",  registerController.forgetPassword);


// reset password
app.get("/resetpassword", registerController.loadResetPassword);
app.post("/resetpassword", registerController.resetpassword); 


// logout
app.get('/logout', auth.isLogin , registerController.logoutUser);



module.exports = app;