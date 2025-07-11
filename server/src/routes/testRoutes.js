const express = require("express");
const router = express.Router();

// Bu sadə route işləməlidir
router.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Server işləyir!" });
});

module.exports = router;
