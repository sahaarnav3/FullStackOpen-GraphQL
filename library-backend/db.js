const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectToDatabase = async (uri) => {
  console.log("connecting to database URI");
  try {
    await mongoose.connect(uri);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase