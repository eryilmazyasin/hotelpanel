"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("rooms", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      room_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      room_type: {
        type: Sequelize.ENUM("deluxe", "standard"),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price_per_night: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("rooms");
  },
};
