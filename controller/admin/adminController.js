const Register = require("../../models/auth/registerModel");
const Plan = require("../../models/admin/planModel");
const Client = require("../../models/admin/clientModel");
const Template = require("../../models/admin/apiModel");
const ExistMessage = require('../../models/admin/existMessageModel');

const axios = require("axios");
require("dotenv").config();
const moment = require("moment");

async function accountCreationMessage(client) {
  try {
    const apiUrl = "https://apps.oncloudapis.com/api/wpbox/sendtemplatemessage";
      
    const templateData = await Template.find({ template_type: "account_created" });
       
    console.log('template data', templateData);
    const clientNumber = client.number;
    const clientname = client.name;
    const pkg = await Plan.findById({ _id: client.plan}); 
    const clientpkg = pkg.planName; 
    const clientAgent = client.client_agent;

    const template_name = templateData.template_name;

   if (templateData.length > 0) {
     const template = templateData[0];
    
     let formattedDate = '';
     const timestamp = new Date(client.timestamp);
        const date = timestamp.getDate();
        const month = timestamp.getMonth() + 1; // Adding 1 because month index starts from 0
        const year = timestamp.getFullYear();
        formattedDate = `${date}/${month}/${year}`;

     const requestBody = {
       token: process.env.api_token,
       phone: client.number, // Assuming this is a hardcoded phone number for testing
       template_name: template.template_name,
       template_language: template.template_lang,
       components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: clientname,
            },
            {
              type: "text",
              text: clientpkg,
            },
            {
              type: "text",
              text: clientAgent,
            },
            {
              type: "text",
              text: formattedDate,
            },
          ],
        },
      ],  
     };

     
    const response = await axios.post(apiUrl, requestBody);
    console.log(response);
   } else {
     console.log("No template data found");
   }
   
  } catch (error) {
    
  }
} 

async function accountActivationMessage(client) {
  try {
    const apiUrl = "https://apps.oncloudapis.com/api/wpbox/sendtemplatemessage";
      
    const templateData = await Template.find({ template_type: "account_activated" });
       
    console.log('template data', templateData);
    const clientNumber = client.number;
    const clientname = client.name;
    const pkg = await Plan.findById({ _id: client.plan}); 
    const clientpkg = pkg.planName; 
    const clientAgent = client.client_agent;

    const template_name = templateData.template_name;

   if (templateData.length > 0) {
     const template = templateData[0];
    
     let formattedDate = '';
     const timestamp = new Date(client.timestamp);
        const date = timestamp.getDate();
        const month = timestamp.getMonth() + 1; // Adding 1 because month index starts from 0
        const year = timestamp.getFullYear();
        formattedDate = `${date}/${month}/${year}`;

     const requestBody = {
       token: process.env.api_token,
       phone: client.number, // Assuming this is a hardcoded phone number for testing
       template_name: template.template_name,
       template_language: template.template_lang,
       components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: clientname,
            },
            {
              type: "text",
              text: formattedDate,
            },
          ],
        },
      ],  
     };

     
    const response = await axios.post(apiUrl, requestBody);
    console.log(response);
   } else {
     console.log("No template data found");
   }
   
  } catch (error) {
    
  }
} 


async function sendExpiredMessage(clients) {
  try {
    const apiUrl = "https://apps.oncloudapis.com/api/wpbox/sendtemplatemessage";
    const templateData = await Template.find({ template_type: "expired" });  
    
    for (const client of clients) {
      // Check if the client has an existing message and if the expiredMessage field is not already set to 1
      const shouldUpdateExpiredMessage = await Client.findOne({ _id: client._id }); // Corrected query here

      console.log("Should update expired message:", shouldUpdateExpiredMessage);

      const currentDate = new Date();
      const clientDate = new Date(client.timestamp);
      const next30Days = new Date(clientDate);
      next30Days.setDate(next30Days.getDate() + 30);

      const timeDiff = next30Days.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (shouldUpdateExpiredMessage && 
          shouldUpdateExpiredMessage.status === "Expired" && 
          shouldUpdateExpiredMessage.expiredMessage === 0 
         ) {
        
        const clientName = client.name;
        const clientNumber = client.number;

        if (templateData.length > 0) {
          const template = templateData[0];

          const requestBody = {
            token: process.env.api_token,
            phone: client.number,
            template_name: template.template_name,
            template_language: template.template_lang,
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: clientName,
                  },
                  {
                    type: "text",
                    text: "17/4/2024", // You can replace this with formattedDate if needed
                  },
                ],
              },
            ],
          };

          const response = await axios.post(apiUrl, requestBody); 

          // Update or insert existClientMessage
          await Client.findOneAndUpdate(
            { _id: client._id },
            { $set: { expiredMessage: 1 } },
            { new: true  }
          );

          console.log(response);
        } else {
          console.log("No template data found");
        }
      } else {
        console.log("Conditions not met for hitting the API for client:", client._id);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}


async function sendExpiredSoonMessage(clients) {
  try {
    const apiUrl = "https://apps.oncloudapis.com/api/wpbox/sendtemplatemessage";
    const templateData = await Template.find({ template_type: "expired_soon" });  
    
    for (const client of clients) {
      // Check if the client has an existing message and if the expiredMessage field is not already set to 1
      const shouldUpdateExpiredMessage = await Client.findOne({ _id: client._id }); // Corrected query here

      console.log("Should update expired message:", shouldUpdateExpiredMessage);

      const currentDate = new Date();
      const clientDate = new Date(client.timestamp);
      const next30Days = new Date(clientDate);
      next30Days.setDate(next30Days.getDate() + 30);

      const timeDiff = next30Days.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (shouldUpdateExpiredMessage && 
          shouldUpdateExpiredMessage.status === "Expired_soon" && 
          shouldUpdateExpiredMessage.soonExpiredMessage === 0 
         ) {
        
        const clientName = client.name;
        const clientNumber = client.number;

        if (templateData.length > 0) {
          const template = templateData[0];

          const requestBody = {
            token: process.env.api_token,
            phone: client.number,
            template_name: template.template_name,
            template_language: template.template_lang,
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: clientName,
                  },
                  {
                    type: "text",
                    text: "17/4/2024", // You can replace this with formattedDate if needed
                  },
                ],
              },
            ],
          };

          const response = await axios.post(apiUrl, requestBody); 

          // Update or insert existClientMessage
          await Client.findOneAndUpdate(
            { _id: client._id },
            { $set: { expiredMessage: 1 } },
            { new: true  }
          );

          console.log(response);
        } else {
          console.log("No template data found");
        }
      } else {
        console.log("Conditions not met for hitting the API for client:", client._id);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}







async function adminDashboard(req, res) {
  try {
    const userId = req.session.user_id;
    const user = await Register.findOne({_id: userId }); 

    const totalClient = await Client.countDocuments({});
    const activeClient = await Client.countDocuments({ status: "Active" });
    const expiredClient = await Client.countDocuments({ status: "Expired" });
    const expiredSoonClient = await Client.countDocuments({ status: "Expired_soon" });
    res.render("admin/dashboard.ejs", { user, totalClient, activeClient, expiredClient, expiredSoonClient });
  } catch (error) {
    console.log(error.message);
  }
}

// client code start
// load add client
async function loadAddClient(req, res) {
  try {
    const plans = await Plan.find({});
    res.render("admin/addClient.ejs", { plans });
  } catch (error) {
    console.log(error.message);
  }
}

// add client
async function addClient(req, res) {
  try {
    const plans = await Plan.find({});

    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const client_agent = req.body.client_agent;
    const plan = req.body.plan;
    const business_name = req.body.business_name;

    const existEmail = await Client.findOne({ email: email });

    if (existEmail) {
      return res.status(200).render("admin/addClient", {
        message: "Client email is already exist",
        success: false,
        plans,
      });
    }

    const existNumber = await Client.findOne({ number: number });

    if (existNumber) {
      return res.status(200).render("admin/addClient", {
        message: "Client number is already exist",
        success: false,
        plans,
      });
    }

    const clientData = new Client({
      name,
      email,
      number,
      client_agent,
      plan,
      business_name,
    });
     
    accountCreationMessage(clientData);
    await clientData.save();

    return res
      .status(200)
      .render("admin/addClient.ejs", {
        message: "Client added successfully",
        success: true,
        plans,
      });
  } catch (error) {
    console.log(error.message);
  }
}

async function showClient(req, res) {
  try {
    const user = await Register.findOne({ _id: req.session.user_id });

    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    var page = "1";
    if (req.query.page) {
      page = req.query.page;
    }

    const limit = "20";

    const clients = await Client.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { client_agent: { $regex: ".*" + search + ".*", $options: "i" } },
        { business_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { number: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .populate("plan")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

     

    const count = await Client.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { client_agent: { $regex: ".*" + search + ".*", $options: "i" } },
        { business_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { number: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .populate("plan")
      .countDocuments();

    const plans = await Plan.find({});

    const currentDate = new Date();

    // Calculate remaining days for each client within the next 30 days
    const clientsWithRemainingDays = clients.map(client => {
      const clientCreationDate = new Date(client.timestamp);
      const formattedDate = clientCreationDate.toLocaleDateString('en-US', { // Change 'en-US' to your desired locale
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const thirtyDaysLater = new Date(clientCreationDate);
      thirtyDaysLater.setDate(clientCreationDate.getDate() + 30); // Calculate 30 days later
      const timeDiff = thirtyDaysLater.getTime() - currentDate.getTime();
      const remainingDays = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24))); // Convert milliseconds to days, ensure non-negative
      
      // Update status if remaining days is less than or equal to 3
      let status;
      if (remainingDays === 0) {
        status = "Expired";
        Client.findByIdAndUpdate(client._id, { status: status }, { new: true }).exec();
      } else if (remainingDays <= 3) {

        status = "Expired_soon";

        Client.findByIdAndUpdate(client._id, { status: status }, { new: true }).exec();
      } else {
        status = client.status;
      }



      return { ...client.toObject(), remainingDays, status, formattedDate }; // Update client object with remainingDays and status
    });
   
  sendExpiredMessage(clients); 
    

    res.render("admin/showClients.ejs", {
      clients: clientsWithRemainingDays,
      search,
      page,
      plans,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
      search,
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function showActiveClients(req, res) {
  try {
    const user = await Register.findOne({ _id: req.session.user_id });

    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    var page = "1";
    if (req.query.page) {
      page = req.query.page;
    }

    const limit = "20";

    const clients = await Client.find({
      status: 'Active',
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { client_agent: { $regex: ".*" + search + ".*", $options: "i" } },
        { business_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { number: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .populate("plan")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Client.find({ status: 'Active',
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { client_agent: { $regex: ".*" + search + ".*", $options: "i" } },
        { business_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { number: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .populate("plan")
      .countDocuments();

    const plans = await Plan.find({});

    const currentDate = new Date();

    // Calculate remaining days for each client within the next 30 days
    const clientsWithRemainingDays = clients.map(client => {
      const clientCreationDate = new Date(client.timestamp);
      const formattedDate = clientCreationDate.toLocaleDateString('en-US', { // Change 'en-US' to your desired locale
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const thirtyDaysLater = new Date(clientCreationDate);
      thirtyDaysLater.setDate(clientCreationDate.getDate() + 30); // Calculate 30 days later
      const timeDiff = thirtyDaysLater.getTime() - currentDate.getTime();
      const remainingDays = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24))); // Convert milliseconds to days, ensure non-negative
      
      // Update status if remaining days is less than or equal to 3
      let status;
      if (remainingDays === 0) {
        status = "Expired";
      } else if (remainingDays <= 3) {
        status = "Expired_soon";
      } else {
        status = client.status;
      }

      return { ...client.toObject(), remainingDays, status, formattedDate }; // Update client object with remainingDays and status
    });

    

    res.render("admin/showActiveClient.ejs", {
      clients: clientsWithRemainingDays,
      search,
      page,
      plans,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
      search,
    });
  } catch (error) {
    console.log(error.message);
  }
} 

async function showExpiredSoonClient(req,res){
  try {
    const user = await Register.findOne({ _id: req.session.user_id });

    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    var page = "1";
    if (req.query.page) {
      page = req.query.page;
    }

    const limit = "20";

    const clients = await Client.find({
      status: "Expired_soon",
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { client_agent: { $regex: ".*" + search + ".*", $options: "i" } },
        { business_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { number: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .populate("plan")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Client.find({ 
      status: "Expired_soon",
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { client_agent: { $regex: ".*" + search + ".*", $options: "i" } },
        { business_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { number: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .populate("plan")
      .countDocuments();

    const plans = await Plan.find({});

    const currentDate = new Date();

    // Calculate remaining days for each client within the next 30 days
    const clientsWithRemainingDays = clients.map(client => {
      const clientCreationDate = new Date(client.timestamp);

      const formattedDate = clientCreationDate.toLocaleDateString('en-US', { // Change 'en-US' to your desired locale
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      
      const thirtyDaysLater = new Date(clientCreationDate);
      thirtyDaysLater.setDate(clientCreationDate.getDate() + 30); // Calculate 30 days later
      const timeDiff = thirtyDaysLater.getTime() - currentDate.getTime();
      const remainingDays = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24))); // Convert milliseconds to days, ensure non-negative
      
      // Update status if remaining days is less than or equal to 3
      let status;
      if (remainingDays === 0) {
        status = "Expired";
      } else if (remainingDays <= 3) {
        status = "Expired_soon";
      } else {
        status = client.status;
      }

      return { ...client.toObject(), remainingDays, status, formattedDate }; // Update client object with remainingDays and status
    });

    

    res.render("admin/showExpiredSoonClient.ejs", {
      clients: clientsWithRemainingDays,
      search,
      page,
      plans,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
      search,
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function showExpiredClient(req,res){
  try {
    const user = await Register.findOne({ _id: req.session.user_id });

    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    var page = "1";
    if (req.query.page) {
      page = req.query.page;
    }

    const limit = "20";

    const clients = await Client.find({
      status: "Expired",
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { client_agent: { $regex: ".*" + search + ".*", $options: "i" } },
        { business_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { number: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .populate("plan")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Client.find({ 
      status: "Expired",
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { client_agent: { $regex: ".*" + search + ".*", $options: "i" } },
        { business_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { number: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })
      .populate("plan")
      .countDocuments();
 
      // sendExpiredMessage(clients);
    const plans = await Plan.find({});

    const currentDate = new Date();

    // Calculate remaining days for each client within the next 30 days
    const clientsWithRemainingDays = clients.map(client => {
      const clientCreationDate = new Date(client.timestamp); 


      const formattedDate = clientCreationDate.toLocaleDateString('en-US', { // Change 'en-US' to your desired locale
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const thirtyDaysLater = new Date(clientCreationDate);
      thirtyDaysLater.setDate(clientCreationDate.getDate() + 30); // Calculate 30 days later
      const timeDiff = thirtyDaysLater.getTime() - currentDate.getTime();
      const remainingDays = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24))); // Convert milliseconds to days, ensure non-negative
      
      // Update status if remaining days is less than or equal to 3
      let status;
      if (remainingDays === 0) {
        status = "Expired";
      } else if (remainingDays <= 3) {
        status = "Expired_soon";
      } else {
        status = client.status;
      }

      return { ...client.toObject(), remainingDays, status, formattedDate }; // Update client object with remainingDays and status
    });

    

    res.render("admin/showExpireedClients.ejs", {
      clients: clientsWithRemainingDays,
      search,
      page,
      plans,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
      search,
    });
  } catch (error) {
    console.log(error.message);
  } 
}


async function editClient(req, res) {
  try {
    const clientId = req.params.id;

    const client = await Client.findById({ _id: clientId });

    const plans = await Plan.find({});

    res.render("admin/editClient.ejs", { client, plans });
  } catch (error) {
    console.log(error.message);
  }
}

async function updateClient(req, res) {
  try {
    const clientId = req.params.id;

    const { name, email, number, plan, client_agent, business_name, status } =
      req.body;

    const cDate = new Date();
    const expiredMessage = status === "Active" ? 0 : 1;

    const client = await Client.findByIdAndUpdate(
      { _id: clientId },
      {
        name,
        email,
        number,
        plan,
        client_agent,
        business_name,
        status,
        timestamp: new Date(cDate.getTime()),
        expiredMessage:expiredMessage
      },
      { new: true }
    );   
  
    // if (req.body.status === "Active") {
    //   accountActivationMessage(client);
    // }
    

    if(req.body.status === "Expired"){
      sendExpiredMessage(client);
    }

    res.status(200).redirect("/showClients");
  } catch (error) {
    console.log(error.message);
  }
}   


async function deleteClient(req, res) {
  try {
    const clientId = req.params.id;

    const client = await Client.findByIdAndDelete(clientId);

    res.status(200).redirect('/showClients');
  } catch (error) {
    console.log(error.message);
  }
} 


// load template 
async function loadTemplate(req, res) {
  try {
     res.render('admin/template.ejs')
  } catch (error) {
    console.log(error.message);
  }
} 

async function addTemplate(req, res) {
  try {
    const { template_lang, template_name, template_type} = req.body;

    const existTemplate = await Template.findOne({ template_name });

    if (existTemplate) {
      return res.render("admin/template.ejs", {
        message: "Template already exists",
        success: false,
        existTemplate,
      });
    }
    const templateData = new Template({
      template_name,
      template_lang,
      template_type,
    });

    await templateData.save();

      return res.render("admin/template.ejs", {
        message: "Template created successfully",
        success: true,
       
      });

    
  } catch (error) {
    console.log(error.message);
  }
}

// show template 
async function showTemplate(req, res) {
   try {
    //  const user = await Register.findOne({ _id: req.session.user_id });

     var search = "";
     if (req.query.search) {
       search = req.query.search;
     }

     var page = "1";
     if (req.query.page) {
       page = req.query.page;
     }

     const limit = "10";

     const templates = await Template.find({
       $or: [
         { template_name: { $regex: ".*" + search + ".*", $options: "i" } },
         { template_lang: { $regex: ".*" + search + ".*", $options: "i" } },
       ],
     })
       .limit(limit * 1)
       .skip((page - 1) * limit)
       .exec();

     const count = await Template.find({
       $or: [
         { template_name: { $regex: ".*" + search + ".*", $options: "i" } },
         { template_lang: { $regex: ".*" + search + ".*", $options: "i" } }, 
       ],
     })
      
       .countDocuments();

     

     
     res.render("admin/showTemplates.ejs", {
       search,
       page,
       templates,
       count,
       totalPages: Math.ceil(count / limit),
       currentPage: page,
       limit,
       search,
     });
   } catch (error) {
     console.log(error.message);
   }
}  

async function deleteTemplate(req, res) {
  try {
    const templateId = req.params.id;

    const template = await Template.findByIdAndDelete(templateId);
     

    res.redirect('/showTemplates')
  } catch (error) {
    console.log(error.message);
  }
}

// client code end
module.exports = {
  adminDashboard,
  loadAddClient,
  addClient,
  showClient,
  showActiveClients,
  showExpiredClient,
  showExpiredSoonClient,
  editClient,
  updateClient,
  deleteClient,
  loadTemplate,
  addTemplate,
  showTemplate,
  deleteTemplate,
};
