const express = require("express");
const router = express.Router();
const User = require("../models/user"); // User modelini içe aktar

// Login route
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Düz metin şifreyi karşılaştırma
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Kullanıcı doğrulandı, oturum oluştur
    req.session.userId = user.id;

    return res.json({ message: "Login successful" });
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
