const Register = require("../../models/auth/registerModel");
const bcrypt = require("bcrypt");
const config = require("../../config/config");
const nodemailer = require("nodemailer"); 
const randomstring = require("randomstring");

async function securePassword(password) {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (error) {
    console.log(error.message);
  }
}


async function resetpasswordMail(name, email, token) {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "For Reset Password",
      html:
        "<p> Hi " +
        "<b>" +
        name +
        "</b>" +
        ' <br> please click here to <a href="http://admin.oncloudapis.com/resetpassword?token=' +
        token +
        '"> Reset </a> your password</p>',
    };
    transport.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email has been sent", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
  
async function userRegister(req, res) {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const password = req.body.password;
    const cPassword = req.body.cPassword;

    if (!name || !email || !number || !password || !cPassword) {
      res.status(200).render("auth/register.ejs", {
        message: "All fields are required",
        success: false,
      });
    }

    const checkEmail = await Register.findOne({ email: email });
    const checkNumber = await Register.findOne({ number: number });

    if (checkEmail) {
      res.status(200).render("auth/register.ejs", {
        message: "Email already exists",
        success: false,
      });
    }

    if (checkNumber) {
      res.status(200).render("auth/register.ejs", {
        message: "Number already exists",
        success: false,
      });
    }

    if (password !== cPassword) {
      res.status(200).render("auth/register.ejs", {
        message: "Both password must be same",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const userRegister = new Register({
      name,
      email,
      number,
      password: hashPassword,
      cPassword,
    });

    userRegister.save();

    res.status(200).redirect("/");
  } catch (error) {
    console.log(error.message);
  }
}

// login
async function loginUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // If the credentials do not match a teacher, check the Register model
    const user = await Register.findOne({email:  email });

    if (user) {
      const matchPassword = await bcrypt.compare(password, user.password);
      if (matchPassword) {
        req.session.user_id = user._id;
        // Redirect to the appropriate dashboard based on the user's role
        res.redirect("/dashboard");
      } else {
        console.log("Invalid credentials for user");
      }
    }

    // If no matching user or teacher found, render login page with error message
    console.log("No matching user found");
    return res.status(200).render("auth/login.ejs", {
      message: "Invalid Credentials",
      success: false,
    });
  } catch (error) {
    console.log("Error:", error.message);
    // Handle other errors as needed
  }
} 


// forget and reset
async function loadforgetpassword(req, res) {
   try {
     res.render("auth/forget-password.ejs");
   } catch (error) {
     console.log(error.message);
   }
} 

async function forgetPassword(req, res) {
  try {
    const email = req.body.email;

    const checkEmail = await Register.findOne({ email: email });

    if (checkEmail) {
      const randomString = randomstring.generate();
      await Register.updateOne({ email: email }, { $set: { token: randomString } });
      resetpasswordMail(checkEmail.name, checkEmail.email, randomString);
      res.render("auth/forget-password.ejs", {
        success: true,
        message: "Please check you email to reset password",
      });
    } else {
      res.render("auth/forget-password.ejs", {
        success: false,
        message: "Email not found",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

// reset password
async function loadResetPassword(req, res) {
   try {
     const token = req.query.token;
     const tokenData = await Register.findOne({ token: token });

     if (tokenData) {
       res.render("auth/reset-password.ejs", { user_id: tokenData._id });
     } else {
       res.send("Invalid token");
     }
   } catch (error) {
     console.log(error.message);
   }
} 


async function resetpassword(req, res) {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;
    const securepassword = await securePassword(password);
    await Register.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          password: securepassword,
          token: "",
        },
      }
    );

    const token = req.query.token;
    const tokenData = await Register.findOne({ token: token });

    if (tokenData) {
      res.render("auth/reset-password.ejs", { user_id: tokenData._id });
    } else {
      res
        .status(200)
        .redirect('/login')
    }
  } catch (error) {
    console.log(error.message);
  }
}


// logout user
async function logoutUser(req, res) {
   try {
     req.session.destroy();
     res.redirect("/");
   } catch (error) {
     console.log(error.message);
   }
}

module.exports = {
  userRegister,
  loginUser,
  logoutUser,
  loadforgetpassword,
  forgetPassword,
  loadResetPassword,
  resetpassword,
};
