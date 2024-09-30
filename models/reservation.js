const Room = require("./room");
const Customer = require("./customer");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reservation = sequelize.define(
  "Reservation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Room, // Room modeline referans
        key: "id",
      },
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer, // Customer modeline referans
        key: "id",
      },
    },
    check_in_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    check_out_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    num_of_guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "reservations",
    timestamps: true,
  }
);

module.exports = Reservation;
