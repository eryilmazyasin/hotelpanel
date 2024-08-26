const express = require("express");
const app = express();
const apiRoutes = require("./routes/api");
const sequelize = require("./config/database");
require("dotenv").config();

app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
