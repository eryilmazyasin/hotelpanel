const Room = require("./room");
const Reservation = require("./reservation");
const Customer = require("./customer");
const ReservationCustomer = require("./reservationCustomer");

// Room - Reservation İlişkisi (Bir oda birden fazla rezervasyona sahip olabilir)
Room.hasMany(Reservation, {
  as: "Reservations",
  foreignKey: "room_id",
  onDelete: "SET NULL", // Oda silindiğinde room_id NULL olacak
});
Reservation.belongsTo(Room, {
  foreignKey: "room_id",
  onDelete: "SET NULL", // Oda silindiğinde room_id NULL olacak
});

// Reservation - Customer İlişkisi
Reservation.belongsToMany(Customer, {
  through: ReservationCustomer,
  as: "reservationCustomers",
  foreignKey: "reservation_id",
});
Customer.belongsToMany(Reservation, {
  through: ReservationCustomer,
  as: "customerReservations",
  foreignKey: "customer_id",
});

module.exports = {
  Room,
  Reservation,
  Customer,
  ReservationCustomer,
};
