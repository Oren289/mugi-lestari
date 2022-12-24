const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const { DB_URI } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
