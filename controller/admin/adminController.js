const Register = require("../../models/auth/registerModel");
const Plan = require("../../models/admin/planModel");
const Client = require("../../models/admin/clientModel");
const Template = require("../../models/admin/apiModel");
const ExistMessage = require("../../models/admin/existMessageModel");

const axios = require("axios");
require("dotenv").config();
const moment = require("moment");

async function accountCreationMessage(client) {
  try {
    const apiUrl = "https://apps.oncloudapis.com/api/wpbox/sendtemplatemessage";

    const templateData = await Template.find({
      template_type: "account_created",
    });

    console.log("template data", templateData);
    const clientNumber = client.number;
    const clientname = client.name;
    const pkg = await Plan.findById({ _id: client.plan });
    const clientpkg = pkg.planName;
    const clientAgent = client.client_agent;
    const business_name = client.business_name;

    const template_name = templateData.template_name;

    if (templateData.length > 0) {
      const template = templateData[0];

      let formattedDate = "";
      const timestamp = new Date(client.timestamp);
      const date = timestamp.getDate();
      const month = timestamp.getMonth() + 1; // Adding 1 because month index starts from 0
      const year = timestamp.getFullYear();
      formattedDate = `${date}/${month}/${year}`;

      const requestBody = {
        token: "S7qFHAfW5XwIeYgKnYs7uz26Xpm4N7SvA7vrdvD4093914b5",
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
                text: business_name,
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
  } catch (error) {}
}

async function accountActivationMessage(client) {
  try {
    const apiUrl = "https://apps.oncloudapis.com/api/wpbox/sendtemplatemessage";

    const templateData = await Template.find({
      template_type: "account_activated",
    });

    console.log("template data", templateData);
    const clientNumber = client.number;
    const clientname = client.name;
    const pkg = await Plan.findById({ _id: client.plan });
    const clientpkg = pkg.planName;
    const clientAgent = client.client_agent;
    const business_name = client.business_name;

    const template_name = templateData.template_name;

    if (templateData.length > 0) {
      const template = templateData[0];

      let formattedDate = "";
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
                text: business_name,
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
  } catch (error) {}
}

async function sendExpiredMessage(clients) {
  try {
    const apiUrl = "https://apps.oncloudapis.com/api/wpbox/sendtemplatemessage";
    const templateData = await Template.find({ template_type: "expired" });

    for (const client of clients) {
      // Check if the client has an existing message and if the expiredMessage field is not already set to 1
      const shouldUpdateExpiredMessage = await Client.findOne({
        _id: client._id,
      }); // Corrected query here

      console.log("Should update expired message:", shouldUpdateExpiredMessage);

      const currentDate = new Date();
      const clientDate = new Date(client.timestamp);
      const next30Days = new Date(clientDate);
      next30Days.setDate(next30Days.getDate() + 30);

      const timeDiff = next30Days.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (
        shouldUpdateExpiredMessage &&
        shouldUpdateExpiredMessage.status === "Expired" &&
        shouldUpdateExpiredMessage.expiredMessage === 0
      ) {
        const clientName = client.name;
        const clientNumber = client.number;
        const business_name = client.business_name;

        if (templateData.length > 0) {
          const template = templateData[0];

          const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
          const requestBody = {
            token: "S7qFHAfW5XwIeYgKnYs7uz26Xpm4N7SvA7vrdvD4093914b5",
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
                    text: business_name,
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

          // Update or insert existClientMessage
          await Client.findOneAndUpdate(
            { _id: client._id },
            { $set: { expiredMessage: 1 } },
            { new: true }
          );

          console.log(response);
        } else {
          console.log("No template data found");
        }
      } else {
        console.log(
          "Conditions not met for hitting the API for client:",
          client._id
        );
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

// send expired soon message
async function sendExpiredSoonMessage(clients) {
  try {
    const apiUrl = "https://apps.oncloudapis.com/api/wpbox/sendtemplatemessage";
    const templateData = await Template.find({ template_type: "expired_soon" });

    for (const client of clients) {
      // Check if the client has an existing message and if the expiredMessage field is not already set to 1
      const shouldUpdateExpiredMessage = await Client.findOne({
        _id: client._id,
      }); // Corrected query here

      console.log("Should update expired message:", shouldUpdateExpiredMessage);
   

      const clientDate = new Date(client.timestamp);
      const next3Days = new Date(clientDate);
      next3Days.setDate(next3Days.getDate() + 3);

      // Formatting the date to "dd/mm/yyyy" format
      // const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      // const formattedDate = next3Days.toLocaleDateString("en-GB", options);
      // console.log(formattedDate); 


      // time stamp 
      console.log(client.timestamp);

      const day = clientDate.getDate();
const month = clientDate.getMonth() + 1; // Month is zero-based, so we add 1
const year = clientDate.getFullYear();

// Formatting the date
const formattedDate = `${day}/${month}/${year}`;
console.log( 'formatted date ', formattedDate);

      if (
        shouldUpdateExpiredMessage &&
        shouldUpdateExpiredMessage.status === "Expired_soon" &&
        shouldUpdateExpiredMessage.soonExpiredMessage === 0
      ) {
        const clientName = client.name;
        const clientNumber = client.number;
        const business_name= client.business_name;

        if (templateData.length > 0) {
          const template = templateData[0];

          const requestBody = {
            token: "S7qFHAfW5XwIeYgKnYs7uz26Xpm4N7SvA7vrdvD4093914b5",
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
                    text: business_name,
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

          // Update or insert existClientMessage
          await Client.findOneAndUpdate(
            { _id: client._id },
            { $set: { soonExpiredMessage: 1 } },
            { new: true }
          );

          console.log(response);
        } else {
          console.log("No template data found");
        }
      } else {
        console.log(
          "Conditions not met for hitting the API for client:",
          client._id
        );
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

// dashboard
async function adminDashboard(req, res) {
  try {
    const userId = req.session.user_id;
    const user = await Register.findOne({ _id: userId });

    const totalClient = await Client.countDocuments({});
    const activeClient = await Client.countDocuments({ status: "Active" });
    const expiredClient = await Client.countDocuments({ status: "Expired" });
    const expiredSoonClient = await Client.countDocuments({
      status: "Expired_soon",
    });

    const countSendExpiredMessage = await Client.countDocuments({
      expiredMessage: 1,
    });

    const countSendExpiredSoonMessage = await Client.countDocuments({
      soonExpiredMessage: 1,
    });

  

    const todayExpiredClients = await Client.find({ status: "Expired" }).populate('plan'); 

    const currentDate = new Date();

    // Calculate remaining days for each client within the next 30 days
    const clientsWithRemainingDays = todayExpiredClients.filter((client) => {
      const clientCreationDate = new Date(client.timestamp);
      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(currentDate.getDate() - 31); // Calculate 30 days ago
    
      // Check if the client's creation date is equal to thirty days ago
      return clientCreationDate.toDateString() === thirtyDaysAgo.toDateString();
    }).map((client) => {
      const clientCreationDate = new Date(client.timestamp);
    
      const formattedDate = clientCreationDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    
      const thirtyDaysLater = new Date(clientCreationDate);
      thirtyDaysLater.setDate(clientCreationDate.getDate() + 29); // Calculate 30 days later
      const timeDiff = thirtyDaysLater.getTime() - currentDate.getTime();
      const remainingDays = Math.max(
        0,
        Math.ceil(timeDiff / (1000 * 3600 * 24))
      ); 

     
    
      return { ...client.toObject(), remainingDays,  formattedDate }; // Update client object with remainingDays and status
    }); 

    sendExpiredMessage(todayExpiredClients);
    
    res.render("admin/dashboard.ejs", {
      todayExpiredClients: clientsWithRemainingDays,
      user,
      totalClient,
      activeClient,
      expiredClient,
      expiredSoonClient,
      countSendExpiredMessage,
      countSendExpiredSoonMessage,
    
    });
  } catch (error) {
    console.log(error.message);
  }
}

// client code start
// load add client
async function loadAddClient(req, res) {
  try {
    const userId = req.session.user_id;
    const user = await Register.findOne({ _id: userId });

    const plans = await Plan.find({});
    res.render("admin/addClient.ejs", { plans , user});
  } catch (error) {
    console.log(error.message);
  }
}

// add client
async function addClient(req, res) {
  try { 

    const userId = req.session.user_id;
    const user = await Register.findOne({ _id: userId });

    const plans = await Plan.find({});

    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const client_agent = req.body.client_agent;
    const plan = req.body.plan;
    const business_name = req.body.business_name;


    const clientData = new Client({
      name,
      email,
      number,
      client_agent,
      plan,
      business_name,
    });

    await clientData.save();
    accountCreationMessage(clientData);
    return res.status(200).render("admin/addClient.ejs", {
      message: "Client added successfully",
      success: true,
      plans,
      user
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
    const clientsWithRemainingDays = clients.map((client) => {
      const clientCreationDate = new Date(client.timestamp);
      const formattedDate = clientCreationDate.toLocaleDateString("en-US", {
        // Change 'en-US' to your desired locale
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const thirtyDaysLater = new Date(clientCreationDate);
      thirtyDaysLater.setDate(clientCreationDate.getDate() + 30); // Calculate 30 days later
      const timeDiff = thirtyDaysLater.getTime() - currentDate.getTime();
      const remainingDays = Math.max(
        0,
        Math.ceil(timeDiff / (1000 * 3600 * 24))
      ); // Convert milliseconds to days, ensure non-negative

      // Update status if remaining days is less than or equal to 3
      let status;
      if (remainingDays === 0) {
        status = "Expired";
        Client.findByIdAndUpdate(
          client._id,
          { status: status },
          { new: true }
        ).exec();
      } else if (remainingDays <= 3) {
        status = "Expired_soon";

        Client.findByIdAndUpdate(
          client._id,
          { status: status },
          { new: true }
        ).exec();
      } else {
        status = client.status;
      }

      return { ...client.toObject(), remainingDays, status, formattedDate }; // Update client object with remainingDays and status
    });

    // sendExpiredMessage(clients);
    // sendExpiredSoonMessage(clients);

    res.render("admin/showClients.ejs", {
      user,
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
      status: "Active",
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
      status: "Active",
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
    const clientsWithRemainingDays = clients.map((client) => {
      const clientCreationDate = new Date(client.timestamp);
      const formattedDate = clientCreationDate.toLocaleDateString("en-US", {
        // Change 'en-US' to your desired locale
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const thirtyDaysLater = new Date(clientCreationDate);
      thirtyDaysLater.setDate(clientCreationDate.getDate() + 29); // Calculate 30 days later
      const timeDiff = thirtyDaysLater.getTime() - currentDate.getTime();
      const remainingDays = Math.max(
        0,
        Math.ceil(timeDiff / (1000 * 3600 * 24))
      ); // Convert milliseconds to days, ensure non-negative

      // Update status if remaining days is less than or equal to 3
      let status;
      if (remainingDays === 0) {
        status = "Expired";
        Client.findByIdAndUpdate(
          client._id,
          { status: status },
          { new: true }
        ).exec();
      } else if (remainingDays <= 3) {
        status = "Expired_soon";

        Client.findByIdAndUpdate(
          client._id,
          { status: status },
          { new: true }
        ).exec();
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
      user,
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

async function showExpiredSoonClient(req, res) {
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
    const clientsWithRemainingDays = clients.map((client) => {
      const clientCreationDate = new Date(client.timestamp);

      const formattedDate = clientCreationDate.toLocaleDateString("en-US", {
        // Change 'en-US' to your desired locale
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const thirtyDaysLater = new Date(clientCreationDate);
      thirtyDaysLater.setDate(clientCreationDate.getDate() + 30); // Calculate 30 days later
      const timeDiff = thirtyDaysLater.getTime() - currentDate.getTime();
      const remainingDays = Math.max(
        0,
        Math.ceil(timeDiff / (1000 * 3600 * 24))
      ); // Convert milliseconds to days, ensure non-negative

      // Update status if remaining days is less than or equal to 3
      let status;
      if (remainingDays === 0) {
        status = "Expired";
        Client.findByIdAndUpdate(
          client._id,
          { status: status },
          { new: true }
        ).exec();
      } else if (remainingDays <= 3) {
        status = "Expired_soon";

        Client.findByIdAndUpdate(
          client._id,
          { status: status },
          { new: true }
        ).exec();
      } else {
        status = client.status;
      }

      return { ...client.toObject(), remainingDays, status, formattedDate }; // Update client object with remainingDays and status
    });

    sendExpiredSoonMessage(clients);

    res.render("admin/showExpiredSoonClient.ejs", {
      user,
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

async function showExpiredClient(req, res) {
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
    const clientsWithRemainingDays = clients.map((client) => {
      const clientCreationDate = new Date(client.timestamp);

      const formattedDate = clientCreationDate.toLocaleDateString("en-US", {
        // Change 'en-US' to your desired locale
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const thirtyDaysLater = new Date(clientCreationDate);
      thirtyDaysLater.setDate(clientCreationDate.getDate() + 30); // Calculate 30 days later
      const timeDiff = thirtyDaysLater.getTime() - currentDate.getTime();
      const remainingDays = Math.max(
        0,
        Math.ceil(timeDiff / (1000 * 3600 * 24))
      ); // Convert milliseconds to days, ensure non-negative

      // Update status if remaining days is less than or equal to 3
      let status;
      if (remainingDays === 0) {
        status = "Expired";
        Client.findByIdAndUpdate(
          client._id,
          { status: status },
          { new: true }
        ).exec();
      } else if (remainingDays <= 3) {
        status = "Expired_soon";

        Client.findByIdAndUpdate(
          client._id,
          { status: status },
          { new: true }
        ).exec();
      } else {
        status = client.status;
      }

      return { ...client.toObject(), remainingDays, status, formattedDate }; 
    });

    sendExpiredMessage(clients);

    res.render("admin/showExpireedClients.ejs", {
      clients: clientsWithRemainingDays,
      user,
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
    const userId = req.session.user_id;
    const user = await Register.findOne({ _id: userId });

    const clientId = req.params.id;

    const client = await Client.findById({ _id: clientId });

    const plans = await Plan.find({});

    res.render("admin/editClient.ejs", {user, client, plans });
  } catch (error) {
    console.log(error.message);
  }
}

async function updateClient(req, res) {
  try { 
    const userId = req.session.user_id;
    const user = await Register.findOne({ _id: userId });

    const clientId = req.params.id;

    const { name, email, number, plan, client_agent, business_name, status } =
      req.body;

    const cDate = new Date();
    const expiredMessage = status === "Active" ? 0 : 1;
    const updateAccountMessage = status === "Active" ? 1 : (status === "Expired" ? 0 : undefined);

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
        expiredMessage: expiredMessage,
        updateAccountMessage: updateAccountMessage
      },
      { new: true }
    );

    if (req.body.status === "Active") {
      accountActivationMessage(client);
    }
      
   


    // if(req.body.status === "Expired"){
    //   sendExpiredMessage(client);
    // }

    res.status(200).redirect("/showClients");
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteClient(req, res) {
  try {
    const clientId = req.params.id;

    const client = await Client.findByIdAndDelete(clientId);

    res.status(200).redirect("/showClients");
  } catch (error) {
    console.log(error.message);
  }
}

// load template
async function loadTemplate(req, res) {
  try {
    const userId = req.session.user_id;
    const user = await Register.findOne({ _id: userId });

    res.render("admin/template.ejs", {user});
  } catch (error) {
    console.log(error.message);
  }
}

async function addTemplate(req, res) {
  try { 
    const userId = req.session.user_id;
    const user = await Register.findOne({ _id: userId });

    const { template_lang, template_name, template_type } = req.body;

    const existTemplate = await Template.findOne({ template_name });

    if (existTemplate) {
      return res.render("admin/template.ejs", {
        message: "Template already exists",
        success: false,
        existTemplate,
        user,
      });
    }
    const templateData = new Template({
      template_name,
      template_lang,
      template_type,
      user,
    });

    await templateData.save();

    return res.render("admin/template.ejs", {
      message: "Template created successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
  }
}

// show template
async function showTemplate(req, res) {
  try {
    //  const user = await Register.findOne({ _id: req.session.user_id });
    const userId = req.session.user_id;
    const user = await Register.findOne({ _id: userId });

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
     user,
      search,
      page,
      user,
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

    res.redirect("/showTemplates");
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
