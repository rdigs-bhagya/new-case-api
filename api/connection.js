const mongoose = require("mongoose");
require("dotenv").config();

const {
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_CLUSTER,
  MONGODB_DB
} = process.env;

// Encode password safely (important if it contains @ or special characters)
const encodedPassword = encodeURIComponent(MONGODB_PASSWORD);

// Build MongoDB URI
const databaseURL = `mongodb+srv://${MONGODB_USERNAME}:${encodedPassword}@${MONGODB_CLUSTER}/${MONGODB_DB}?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose
  .connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connection Success"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

module.exports = mongoose;
