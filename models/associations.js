const Room = require("./room");
const Reservation = require("./reservation");
const Customer = require("./customer");
const ReservationCustomer = require("./reservationCustomer");

// Room ve Reservation arasında One-to-Many ilişkisi
Room.hasMany(Reservation, { foreignKey: "room_id", as: "Reservations" });
Reservation.belongsTo(Room, { foreignKey: "room_id", as: "Room" });

// Reservation ve Customer arasında Many-to-Many ilişkisi
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

module.exports = { Room, Reservation, Customer, ReservationCustomer };
