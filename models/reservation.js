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
        model: Room,
        key: "id",
      },
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
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
  },
  {
    tableName: "reservations",
    timestamps: true,
  }
);

// İlişkileri tanımlama
Reservation.belongsTo(Room, { foreignKey: "room_id" });
Reservation.belongsTo(Customer, { foreignKey: "customer_id" });

module.exports = Reservation;
