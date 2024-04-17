const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://wolftechs266:KPjKyASeF4jPjmgG@cluster0.mcte5wx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Error connecting to the database:", error);
});

db.once("open", () => {
  console.log("Connection successful");
});

module.exports = db;
