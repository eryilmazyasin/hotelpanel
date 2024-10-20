require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const sequelize = require("./config/sequelize"); // config/database.js değil!

const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

// Modelleri içe aktarıyoruz
require("./models/user");
require("./models/customer");
require("./models/room");
require("./models/reservation");
require("./models/associations"); // İlişkiler buraya tanımlanmış olmalı
require("./models/reservationCustomer"); // ReservationCustomer modelini de buraya ekliyoruz

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.options("*", cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// JWT Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded;
    next();
  });
};

app.use("/auth", authRoutes);
app.use("/api", authMiddleware, apiRoutes);

const PORT = process.env.PORT || 5001;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync({ alter: true }); // Tablo oluşturma işlemi burada gerçekleşir
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
