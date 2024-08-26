const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservation");
const Room = require("../models/room");

// Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single reservation by ID
router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new reservation
router.post("/", async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    await Room.update(
      { is_available: false },
      { where: { id: req.body.room_id } }
    );
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a reservation by ID
router.put("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (reservation) {
      await reservation.update(req.body);
      res.json(reservation);
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a reservation by ID
router.delete("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (reservation) {
      await reservation.destroy();
      res.json({ message: "Reservation deleted" });
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
