require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_DB_URI; 

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB bağlantısı uğurla quruldu");
  })
  .catch((err) => {
    console.error("MongoDB bağlantı xətası:", err);
  });

const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
