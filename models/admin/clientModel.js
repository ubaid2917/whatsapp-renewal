const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    requird: true,
    unique: true,
  },
  client_agent: {
    enum: [
      "Bilal Tariq",
      "Afaq Ahmed",
      "Muhammad Hadi",
      "Muhammad Musa",
      "Ari Akash",
    ],
    type: String,
    required: true,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
  },
  business_name: {
    type: String,
    required: true,
  },
  status: {
    enum: ["Active", "Inactive", "Expired"],
    type: String,
    default: "Active",
  }, 

  expiredMessage:{
    type: Number,
    default: 0,
  },
  soonExpiredMessage:{
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
    required: true,
    get: (timestamp) => timestamp.getTime(),
    set: (timestamp) => new Date(timestamp),
  },
});

const clientModel = mongoose.model("Client", clientSchema);
module.exports = clientModel;
