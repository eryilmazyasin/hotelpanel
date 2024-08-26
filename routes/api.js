const express = require("express");
const router = express.Router();

const usersRoutes = require("./users");
const customersRoutes = require("./customers");
const roomsRoutes = require("./rooms");
const reservationsRoutes = require("./reservations");

// Users API
router.use("/users", usersRoutes);

// Customers API
router.use("/customers", customersRoutes);

// Rooms API
router.use("/rooms", roomsRoutes);

// Reservations API
router.use("/reservations", reservationsRoutes);

module.exports = router;
