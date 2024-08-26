const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
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

// Create a new customer
router.post("/", async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a customer by ID
router.put("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.update(req.body);
      res.json(customer);
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
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
