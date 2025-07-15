const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongo db connected sucessfully");
  } catch (err) {
    console.error("mongodb connection falied,err");
    process.exit(1);
  }
};

module.exports = connectDB;
