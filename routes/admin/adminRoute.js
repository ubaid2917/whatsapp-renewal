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
  

app.get('/dashboard',  adminController.adminDashboard);

//* client routes start
app.get('/addClient',   adminController.loadAddClient);
app.post('/addClient',  adminController.addClient);
app.get('/showClients',  adminController.showClient);

// active clients 
app.get('/activeClients', adminController.showActiveClients);
// expired clients 
app.get('/expiredSoonClients',  adminController.showExpiredSoonClient);
app.get('/expiredClients',  adminController.showExpiredClient);

// edit and update client
app.get('/editClient/:id',  adminController.editClient);
app.post('/editClient/:id',  adminController.updateClient);


// delete client
app.get("/delteClient/:id",  adminController.deleteClient);



//* client routes end




//* plans route
app.get("/addPlan",  planController.loadPlan);
app.post("/addPlan", planController.addPlan); 

app.get('/showPlans', planController.showPlans);
app.post('/updatePlan/:id', planController.updatePlan);
app.get("/deletePlan/:id", planController.deletePlan);
//* plans route end


// template messafe route 
app.get('/loadTemplate', adminController.loadTemplate);
app.post('/addTemplate', adminController.addTemplate); 

app.get('/showTemplates', adminController.showTemplate);
app.get("/deleteTemplate/:id", adminController.deleteTemplate);
// template messafe route 
module.exports = app;