const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());


const categoryRoutes = require("./src/routes/categoryRoute");
const blogRoutes = require("./src/routes/blogRoutes"); 

app.use("/api/categories", categoryRoutes);
app.use("/api/blogs", blogRoutes); 

app.get("/", (req, res) => {
  res.send("Server running");
});

// MongoDB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT , () => console.log("Server is running on port", PORT));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
