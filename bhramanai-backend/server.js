const express = require("express");
const cors = require("cors");
const tripRoutes = require("./routes/planTrip");
require("dotenv").config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL ,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => res.json({ 
  status: "running",
  version: "1.0.0" 
}));

// Use the trip planning routes
app.use("/api/planTrip", tripRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌍 CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
});
