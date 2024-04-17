const Register = require("../../models/auth/registerModel");
const Plan = require("../../models/admin/planModel");

async function loadPlan(req, res) {
  try {
    res.render("admin/addPlan.ejs");
  } catch (error) {
    console.log(error.message);
  }
}

async function addPlan(req, res) {
  try {
    const planName = req.body.planName;
    const price = req.body.price;

    const existPlan = await Plan.findOne({ planName });

    if (existPlan) {
      return res
        .status(200)
        .render("admin/addPlan.ejs", {
          message: "Plan already exists",
          success: false,
        });
    }

    const planData = new Plan({
      planName,
      price,
    });

    await planData.save();

    return res.status(200).render("admin/addPlan.ejs", {
      message: "Plan created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function showPlans(req, res) {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    var page = "1";
    if (req.query.page) {
      page = req.query.page;
    }

    const limit = "10";

    const plans = await Plan.find({
      $or: [{ planName: { $regex: ".*" + search + ".*", $options: "i" } }],
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Plan.find({
      $or: [{ planName: { $regex: ".*" + search + ".*", $options: "i" } }],
    }).countDocuments();

    res.render("admin/showPlans.ejs", {
      plans,
      search,
      page,
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


async function updatePlan(req, res) {
    try {
         
        const planId = req.params.id;

        if (!planId) {
            return res.status(200).send("Plan not found");
        } 

        const planName = req.body.planName;
        const price = req.body.price;

        const plan = await Plan.findByIdAndUpdate(planId, {
            planName,
            price,
        }, { new: true });

        res.status(200).redirect("/showPlans");
    } catch (error) {
        console.log(error.message);
    }
}

async function deletePlan(req, res) {
    try {

        const planId = req.params.id;

        if (!planId) {
            return res.status(404).send('Plan id not found')
        } 

        const deletePlan = await Plan.findByIdAndDelete(planId);

        res.status(200).redirect("/showPlans");
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
  loadPlan,
  addPlan,
  showPlans,
  updatePlan,
  deletePlan,
};
