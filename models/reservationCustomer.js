// models/reservationCustomer.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // Doğru sequelize nesnesi

const ReservationCustomer = sequelize.define("ReservationCustomer", {
  reservation_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "reservations",
      key: "id",
    },
    onDelete: "SET NULL", // Silme işlemi yapılırsa, ilişkili alan null yapılır
  },
  customer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "customers",
      key: "id",
    },
    onDelete: "SET NULL", // Silme işlemi yapılırsa, ilişkili alan null yapılır
  },
});

module.exports = ReservationCustomer;
