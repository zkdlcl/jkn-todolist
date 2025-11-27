const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger.json");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./src/routes/authRoutes");
const todoRoutes = require("./src/routes/todoRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app; // For testing
