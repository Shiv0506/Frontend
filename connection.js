// connection.js
const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/bookmyshow";
const options = { useNewUrlParser: true, useUnifiedTopology: true };

async function connectDB() {
  try {
    await mongoose.connect(uri, options);
    console.log("Connected to MongoDB at", uri);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
