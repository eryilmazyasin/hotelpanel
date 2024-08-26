const express = require("express");
const router = express.Router();
const Room = require("../models/room");

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single room by ID
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new room
router.post("/", async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a room by ID
router.put("/:id", async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (room) {
      await room.update(req.body);
      res.json(room);
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a room by ID
router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (room) {
      await room.destroy();
      res.json({ message: "Room deleted" });
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
