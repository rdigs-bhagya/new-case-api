const express = require("express");
const app = express();
const cors = require("cors");

// DB Connection
require("./api/connection");

// Routes
const contactRoutes = require("./api/routes/ContactRoutes");
const claimRoutes = require("./api/routes/Claim");

// ------------------------------
// MIDDLEWARES
// ------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// CORS HEADERS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "*");
    return res.status(200).json({});
  }
  next();
});

// ------------------------------
// CLIENT INFO MIDDLEWARE
// ------------------------------
app.use((req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "Unknown";

  const userAgent = req.headers["user-agent"] || "";

  let browser = "Unknown";
  let os = "Unknown";

  // Browser detection
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Edg")) browser = "Edge";

  // OS detection
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "MacOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone")) os = "iOS";

  req.clientInfo = {
    ip,
    userAgent,
    browser,
    os,
  };

  next();
});

// ------------------------------
// DEFAULT ROUTE
// ------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Claim Your Claim API." });
});

// ------------------------------
// API ROUTES
// ------------------------------
app.use("/contact", contactRoutes);
app.use("/claims", claimRoutes);

// ------------------------------
// ERROR HANDLER
// ------------------------------
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: {
      message: error.message || "Internal Server Error",
    },
  });
});

module.exports = app;
