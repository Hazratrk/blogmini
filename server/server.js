// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path"); 

const app = express();


app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// ROUTES
const categoryRoutes = require("./src/routes/categoryRoute");
const blogRoutes = require("./src/routes/blogRoutes");
const authRoutes = require("./src/routes/authRoutes"); 

// USE ROUTES
app.use("/api/categories", categoryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes); 

app.get("/", (req, res) => {
  res.send("Server running");
});

// MongoDB 
const PORT = process.env.PORT || 5450; 

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server is running on port", PORT));
  })
  .catch((err) => console.error("MongoDB connection error:", err));