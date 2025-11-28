const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger.json");
const { initializeSchedulers } = require("./src/cron");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./src/routes/authRoutes");
const todoRoutes = require("./src/routes/todoRoutes");
const calendarRoutes = require("./src/routes/calendarRoutes");
const syncRoutes = require("./src/routes/syncRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/cron", require("./src/routes/cronRoutes"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    // Initialize cron schedulers
    initializeSchedulers();
  });
}

module.exports = app; // For testing
