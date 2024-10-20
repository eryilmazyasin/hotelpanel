module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Room-Reservation ilişkisini güncelleme
    await queryInterface.changeColumn("reservations", "room_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // NULL olmasına izin ver
      onDelete: "SET NULL", // Oda silindiğinde room_id NULL olacak
    });

    // ReservationCustomer ilişkisini güncelleme
    await queryInterface.changeColumn(
      "reservationCustomers",
      "reservation_id",
      {
        type: Sequelize.INTEGER,
        allowNull: true, // NULL olmasına izin ver
        onDelete: "SET NULL", // Rezervasyon silindiğinde reservation_id NULL olacak
      }
    );

    await queryInterface.changeColumn("reservationCustomers", "customer_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // NULL olmasına izin ver
      onDelete: "SET NULL", // Müşteri silindiğinde customer_id NULL olacak
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Geri dönüş işlemleri
  },
};
