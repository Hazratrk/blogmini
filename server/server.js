const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

const categoryRoutes = require("./src/routes/categoryRoute");

app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT , () => console.log("Server is running on port", PORT));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
