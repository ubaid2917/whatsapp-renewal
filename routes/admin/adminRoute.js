const express = require("express");
const app = express();
const path = require("path");
const adminController = require("../../controller/admin/adminController");
const planController = require('../../controller/admin/planController');
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
  

app.get('/dashboard',  auth.isLogin , adminController.adminDashboard);

//* client routes start
app.get('/addClient',   auth.isLogin ,  adminController.loadAddClient);
app.post('/addClient',   auth.isLogin ,  adminController.addClient);
app.get('/showClients' ,  auth.isLogin ,   adminController.showClient);

// active clients 
app.get('/activeClients',  auth.isLogin, adminController.showActiveClients);
// expired clients 
app.get('/expiredSoonClients',  auth.isLogin, adminController.showExpiredSoonClient);
app.get('/expiredClients',  auth.isLogin, adminController.showExpiredClient);

// edit and update client
app.get('/editClient/:id', auth.isLogin, adminController.editClient);
app.post('/editClient/:id', auth.isLogin, adminController.updateClient);


// delete client
app.get("/delteClient/:id", auth.isLogin,  adminController.deleteClient);



//* client routes end




//* plans route
app.get("/addPlan", auth.isLogin,  planController.loadPlan);
app.post("/addPlan", auth.isLogin, planController.addPlan); 

app.get('/showPlans', auth.isLogin, planController.showPlans);
app.post('/updatePlan/:id', auth.isLogin, planController.updatePlan);
app.get("/deletePlan/:id", auth.isLogin, planController.deletePlan);
//* plans route end


// template messafe route 
app.get('/loadTemplate', auth.isLogin, adminController.loadTemplate);
app.post('/addTemplate', auth.isLogin,  adminController.addTemplate); 

app.get('/showTemplates', auth.isLogin, adminController.showTemplate);
app.get("/deleteTemplate/:id", auth.isLogin, adminController.deleteTemplate);
// template messafe route 
module.exports = app;