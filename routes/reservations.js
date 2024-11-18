const express = require("express");
const router = express.Router();
const {
  Reservation,
  Room,
  Customer,
  ReservationCustomer,
} = require("../models/associations");

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
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [
        {
          model: Room,
          as: "Room", // Alias 'Room' kullanılıyor
          attributes: ["room_number", "room_type"],
        },
        {
          model: Customer,
          as: "reservationCustomers", // Alias 'reservationCustomers' kullanılıyor
          through: { attributes: [] },
          attributes: ["first_name", "last_name"],
        },
      ],
    });

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
  const { reservationData, customersData } = req.body;

  try {
    // 1. Rezervasyonu oluştur
    const reservation = await Reservation.create(reservationData);

    // 2. Oda durumunu güncelle (oda artık rezerve)
    await Room.update(
      { is_reserved: true },
      { where: { id: reservationData.room_id } }
    );

    // 3. Mevcut müşteri ilişkilerini sil (ReservationCustomer'daki ilişkileri temizle)
    await ReservationCustomer.destroy({
      where: { reservation_id: reservation.id },
    });

    // 4. Müşterileri ekle veya güncelle
    const customerPromises = customersData.map(async (customerData) => {
      let customer;

      if (customerData.id) {
        // Eğer ID varsa müşteriyi bul ve güncelle
        customer = await Customer.findByPk(customerData.id);
        if (customer) {
          await customer.update(customerData);
        } else {
          // Eğer müşteri ID varsa ama veritabanında yoksa, yeni müşteri oluştur
          customer = await Customer.create(customerData);
        }
      } else {
        // Eğer ID yoksa, yeni müşteri oluştur
        customer = await Customer.create(customerData);
      }

      // ReservationCustomer tablosunda ilişkiyi oluştur
      await ReservationCustomer.create({
        reservation_id: reservation.id,
        customer_id: customer.id,
      });
    });

    await Promise.all(customerPromises);

    res.status(201).json({
      message: "Reservation and customers created/linked successfully",
      reservation,
    });
  } catch (err) {
    console.error("Rezervasyon ve müşteri oluşturulamadı:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update a reservation by ID
router.put("/:id", async (req, res) => {
  const { reservationData, customersData } = req.body;

  try {
    // 1. Mevcut rezervasyonu bul
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // 2. Rezervasyon verisini güncelle
    await reservation.update(reservationData);

    // 3. Mevcut müşteri ilişkilerini sil (ReservationCustomer'daki ilişkileri temizle)
    await ReservationCustomer.destroy({
      where: { reservation_id: reservation.id },
    });

    // 4. Müşterileri güncelle veya ekle
    const customerPromises = customersData.map(async (customerData) => {
      let customer;

      if (customerData.id) {
        // Eğer müşteri ID mevcutsa, veritabanında bu ID'yi bul ve güncelle
        customer = await Customer.findByPk(customerData.id);
        if (customer) {
          await customer.update(customerData);
        } else {
          // Eğer ID var ama veritabanında bulunmuyorsa, yeni müşteri oluştur
          customer = await Customer.create(customerData);
        }
      } else {
        // Eğer müşteri ID yoksa yeni müşteri oluştur
        customer = await Customer.create(customerData);
      }

      // ReservationCustomer tablosunda ilişkiyi yeniden oluştur
      await ReservationCustomer.create({
        reservation_id: reservation.id,
        customer_id: customer.id,
      });
    });

    await Promise.all(customerPromises);

    res.json({
      message: "Reservation and customers updated/linked successfully",
      reservation,
    });
  } catch (err) {
    console.error("Rezervasyon ve müşteri güncellenemedi:", err);
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

// Checkout işlemi - Odayı boşalt
router.post("/:id/checkout", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // 1. Oda durumunu güncelle (oda boşaltıldı)
    await Room.update(
      { is_reserved: false },
      { where: { id: reservation.room_id } }
    );

    // 2. Rezervasyonun durumunu "completed" olarak değiştiriyoruz
    await reservation.update({ status: "completed" });

    res.json({ message: "Room is now available (Checkout completed)" });
  } catch (err) {
    console.error("Checkout işlemi başarısız:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
