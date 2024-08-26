const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    room_type: {
      type: DataTypes.ENUM("deluxe", "standard"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "rooms",
    timestamps: true,
  }
);

module.exports = Room;
