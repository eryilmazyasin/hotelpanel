const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // Doğru sequelize nesnesi

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
      allowNull: true,
    },
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING, // Veya ENUM olarak tanımlayabilirsiniz
      allowNull: false,
      defaultValue: "active", // Varsayılan olarak 'active'
    },
  },
  {
    tableName: "reservations",
    timestamps: true,
  }
);

module.exports = Reservation;
