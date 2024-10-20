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
        required: false,
        attributes: [
          "id", // Reservation ID'yi burada dahil ediyoruz
          "check_in_date",
          "check_out_date",
          "num_of_guests",
          "total_price",
          "price_per_night",
        ],
        include: [
          {
            model: Customer,
            as: "reservationCustomers", // ReservationCustomer bağlantısını ekliyoruz
            through: { attributes: [] }, // Ara tabloyu atlıyoruz
            attributes: [
              "id", // Müşteri ID'sini buraya ekliyoruz
              "first_name",
              "last_name",
              "phone_number",
              "national_id",
            ],
          },
        ],
      },
    });

    // Verileri işleyip istenen yapıya dönüştürme
    const roomAvailability = rooms.map((room) => {
      const roomData = room.get({ plain: true });

      // Oda bilgileri
      const roomResponse = {
        id: roomData.id,
        room_number: roomData.room_number,
        room_type: roomData.room_type,
        description: roomData.description,
        price_per_night: roomData.price_per_night,
        is_available: roomData.is_available,
        isReserved: roomData.Reservations.length > 0, // Rezervasyon var mı?
        Reservation: null, // İlk rezervasyonu buraya ekleyeceğiz
        Customers: [], // Rezervasyonlardaki müşteriler buraya eklenecek
      };

      // Tüm rezervasyonları eklemek yerine sadece ilk rezervasyonu alacağız
      if (roomData.Reservations.length > 0) {
        const firstReservation = roomData.Reservations[0];

        // İlk rezervasyonu ekliyoruz
        roomResponse.Reservation = {
          id: firstReservation.id,
          room_id: firstReservation.room_id,
          check_in_date: firstReservation.check_in_date,
          check_out_date: firstReservation.check_out_date,
          num_of_guests: firstReservation.num_of_guests,
          total_price: firstReservation.total_price,
          price_per_night: firstReservation.price_per_night,
        };

        // Bu rezervasyona ait tüm müşterileri ekliyoruz
        firstReservation.reservationCustomers.forEach((customer) => {
          roomResponse.Customers.push({
            id: customer.id, // Müşteri ID'sini buraya ekliyoruz
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

// Get a single room by ID
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
        ],
        include: [
          {
            model: Customer,
            as: "reservationCustomers", // ReservationCustomer bağlantısını ekliyoruz
            through: { attributes: [] }, // Ara tabloyu atlıyoruz
            attributes: [
              "first_name",
              "last_name",
              "phone_number",
              "national_id",
            ],
          },
        ],
      },
    });

    // Tüm odaları ve rezervasyonları işliyoruz
    const roomAvailability = rooms.map((room) => {
      const roomData = room.get({ plain: true });

      if (roomData.Reservations.length > 0) {
        const reservation = roomData.Reservations[0];
        delete roomData.Reservations; // Gereksiz alanları silelim

        return {
          ...roomData,
          isReserved: true, // Oda rezerve edilmiş mi?
          Reservation: reservation, // Rezervasyonu ekle
        };
      } else {
        return {
          ...roomData,
          isReserved: false, // Rezervasyon yoksa false döner
          Reservation: null,
        };
      }
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
