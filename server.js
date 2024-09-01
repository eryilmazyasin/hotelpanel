require("dotenv").config();

const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/database");
const cors = require("cors"); // CORS paketini ekliyoruz
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

require("./models/user");
require("./models/customer");
require("./models/room");
require("./models/reservation");

const app = express();

// CORS ayarları
app.use(
  cors({
    origin: "http://localhost:3000", // React uygulamanızın çalıştığı adres
    credentials: true, // Tarayıcıdan gelen session cookie'lerinin gönderilebilmesi için gerekli
  })
);

// Tüm yollar için CORS ayarları ile OPTIONS isteklerini yanıtlar
app.options("*", cors());

// Preflight istekler için yanıtlar
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Preflight istek için başarılı bir yanıt gönderiyoruz
  }

  next();
});

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
      sameSite: "None", // çapraz kaynaklı istekler için gerekli
      secure: false, // HTTPS kullanıyorsanız true yapmalısınızmaxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    rolling: true, // Her istek cookie maxAge süresini sıfırlar
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

const PORT = process.env.PORT || 5001;

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
