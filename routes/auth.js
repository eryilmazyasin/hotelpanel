const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Login route
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Kullanıcıyı doğrula ve JWT oluştur
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  // JWT'yi tarayıcıdan kaldırmak için sadece frontend tarafında token'ı silmek yeterli
  return res.json({ message: "Logout successful" });
});

module.exports = router;
