require("dotenv").config();

const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/database");
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

require("./models/user");
require("./models/customer");
require("./models/room");
require("./models/reservation");

const app = express();

app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    rolling: true, // Each request resets the maxAge
  })
);

// Auth Routes
app.use("/auth", authRoutes);

// Protected API Routes
app.use(
  "/api",
  (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  },
  apiRoutes
);

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
