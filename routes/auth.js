const express = require("express");
const router = express.Router();
const User = require("../models/user"); // User modelini içe aktar

// Login route
router.post("/login", async (req, res) => {
  console.log("Login route hit");
  const { name, password } = req.body;

  console.log({ req, res });

  try {
    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    req.session.userId = user.id;
    console.log("User authenticated, session created");

    return res.json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Logout successful" });
  });
});

module.exports = router;
