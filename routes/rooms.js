const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const { Room, Reservation } = require("../models/associations");
const Customer = require("../models/customer");

// Artık Room ve Reservation modellerini ve ilişkilerini kullanabilirsiniz

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: {
        model: Reservation,
        as: "Reservations",
        required: false,
        attributes: [
          "id",
          "check_in_date",
          "check_out_date",
          "num_of_guests",
          "total_price",
          "price_per_night",
          "customer_id", // customer_id'yi de ekliyoruz
        ],
      },
    });

    // Tüm odaları ve rezervasyonları işle
    const roomAvailability = await Promise.all(
      rooms.map(async (room) => {
        let reservation = null;
        let customer = null;

        if (room.Reservations.length > 0) {
          reservation = room.Reservations[0].get({ plain: true });

          // İlgili müşteri bilgilerini getiriyoruz
          customer = await Customer.findOne({
            where: { id: reservation.customer_id },
            attributes: [
              "first_name",
              "last_name",
              "phone_number",
              "national_id",
            ],
          });
        }

        const roomData = room.get({ plain: true });
        delete roomData.Reservations; // Reservations alanını siliyoruz

        return {
          ...roomData,
          isReserved: !!reservation,
          Reservation: reservation,
          Customer: customer || null, // Müşteri bilgileri yoksa null döner
        };
      })
    );

    res.json(roomAvailability);
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
