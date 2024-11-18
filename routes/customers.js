const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Customer = require("../models/customer");
const Reservation = require("../models/reservation"); // Reservation modelini ekleyin
const Room = require("../models/room"); // Room modelini ekleyin

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all customers with their reservation and room details
router.get("/with-reservations", async (req, res) => {
  const { search, page = 1 } = req.query; // Sayfa numarası ve arama terimi
  const limit = 50; // Her sayfada 50 kayıt dönecek
  const offset = (page - 1) * limit; // Sayfaya göre ofset hesaplama

  try {
    const whereCondition = search
      ? {
          [Op.or]: [
            { first_name: { [Op.like]: `%${search}%` } },
            { phone_number: { [Op.like]: `%${search}%` } },
            { national_id: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { rows: customers, count: total } = await Customer.findAndCountAll({
      where: whereCondition,
      offset,
      limit,
      include: [
        {
          model: Reservation,
          as: "customerReservations",
          include: [
            {
              model: Room,
              as: "room",
              attributes: ["room_number", "room_type"],
            },
          ],
          attributes: [
            "check_in_date",
            "check_out_date",
            "price_per_night",
            "total_price",
          ],
        },
      ],
    });

    res.json({
      data: customers,
      total, // Toplam müşteri sayısı
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single customer by ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create multiple customers (or a single one)
router.post("/", async (req, res) => {
  try {
    // Eğer veri diziyse toplu ekleme, değilse tek ekleme yapar.
    if (Array.isArray(req.body)) {
      // Toplu müşteri ekleme
      const customers = await Customer.bulkCreate(req.body, {
        validate: true, // Doğrulama işlemini yap
        ignoreDuplicates: true, // Aynı TC kimlik numarası varsa atla
      });
      res.status(201).json(customers);
    } else {
      // Tek müşteri ekleme
      const customer = await Customer.create(req.body);
      res.status(201).json(customer);
    }
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "National ID must be unique" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Update multiple customers or a single customer by ID
router.put("/", async (req, res) => {
  try {
    // Eğer gelen veri bir dizi değilse, tekli güncelleme yapar
    if (!Array.isArray(req.body)) {
      const customer = await Customer.findByPk(req.body.id);
      if (!customer) {
        return res.status(404).json({ error: `Customer not found` });
      }
      await customer.update(req.body);
      return res.json(customer);
    }

    // Bir dizi varsa, toplu güncelleme yapar
    const updatePromises = req.body.map(async (customerData) => {
      const customer = await Customer.findByPk(customerData.id);
      if (customer) {
        return customer.update(customerData);
      } else {
        return Promise.reject(`Customer with id ${customerData.id} not found`);
      }
    });

    const updatedCustomers = await Promise.all(updatePromises);
    res.json(updatedCustomers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a customer by ID
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.destroy();
      res.json({ message: "Customer deleted" });
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
