const path = require("node:path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dns = require("node:dns");

const authRoutes = require("./routes/auth.js");
const employeeRoutes = require("./routes/employee.js");
const departmentRoutes = require("./routes/department.js");
const leadRoutes = require("./routes/leadRoutes.js");
const ivrRoutes = require("./routes/ivrRoutes.js");
const dashboardRoutes = require("./routes/dashboard.js");

const meetingRoute = require("./routes/ZoomRoutes/meetingRoute.js");

const googleRoute = require("./routes/ZoomRoutes/googleMeetRoute.js");
const ZoomRoute = require("./routes/ZoomRoutes/zoomRoute.js");
const deviceRoutes = require("./routes/deviceRoute/device.js");
const goalRoutes = require("./routes/goalRoutes/goal.js");
const redisClient = require("./config/redisClient.js");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const app = express();
const PORT = process.env.PORT || 8001;

// Morgan logging
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// Body parsers (with proper limits)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/ivr", ivrRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/create", meetingRoute);

app.use("/api/v1", googleRoute);
app.use("/api/meeting", ZoomRoute);
app.use("/api/devices", deviceRoutes);
app.use("/api/goals", goalRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
