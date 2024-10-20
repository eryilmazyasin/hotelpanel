const express = require("express");
const router = express.Router();
const { Room, Reservation, Customer } = require("../models/associations");

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: {
        model: Reservation,
        as: "Reservations",
        where: { status: "active" }, // Sadece aktif rezervasyonları getir
        required: false,
        attributes: [
          "id",
          "check_in_date",
          "check_out_date",
          "num_of_guests",
          "total_price",
          "price_per_night",
          "createdAt", // Sıralama için kullanacağız
        ],
        include: [
          {
            model: Customer,
            as: "reservationCustomers",
            through: { attributes: [] },
            attributes: [
              "id",
              "first_name",
              "last_name",
              "phone_number",
              "national_id",
            ],
          },
        ],
        order: [["createdAt", "DESC"]], // Rezervasyonları createdAt'e göre sıralıyoruz
      },
    });

    const roomAvailability = rooms.map((room) => {
      const roomData = room.get({ plain: true });

      // Eğer oda rezerve değilse, müşteri ve rezervasyon bilgilerini boş döndür
      if (!roomData.is_reserved) {
        return {
          ...roomData,
          Reservation: null,
          Customers: [],
        };
      }

      // Oda rezerve ise, en güncel rezervasyonu ve müşteri bilgilerini döndür
      const roomResponse = {
        id: roomData.id,
        room_number: roomData.room_number,
        room_type: roomData.room_type,
        description: roomData.description,
        price_per_night: roomData.price_per_night,
        is_available: roomData.is_available,
        is_reserved: roomData.is_reserved,
        Reservation: null,
        Customers: [],
      };

      if (roomData.Reservations.length > 0) {
        const firstReservation = roomData.Reservations[0]; // En güncel rezervasyon

        roomResponse.Reservation = {
          id: firstReservation.id,
          room_id: firstReservation.room_id,
          check_in_date: firstReservation.check_in_date,
          check_out_date: firstReservation.check_out_date,
          num_of_guests: firstReservation.num_of_guests,
          total_price: firstReservation.total_price,
          price_per_night: firstReservation.price_per_night,
        };

        firstReservation.reservationCustomers.forEach((customer) => {
          roomResponse.Customers.push({
            id: customer.id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone_number: customer.phone_number,
            national_id: customer.national_id,
          });
        });
      }

      return roomResponse;
    });

    res.json(roomAvailability);
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
    const room = await Room.findByPk(req.params.id, {
      include: {
        model: Reservation,
        as: "Reservations",
        where: { status: "active" }, // Sadece aktif rezervasyonları kontrol et
        required: false,
      },
    });

    if (room && room.Reservations.length > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete a room with active reservations." });
    }

    if (room) {
      await room.destroy(); // Eğer aktif rezervasyon yoksa oda silinir
      res.json({ message: "Room deleted" });
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
