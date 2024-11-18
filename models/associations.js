const Room = require("./room");
const Reservation = require("./reservation");
const Customer = require("./customer");
const ReservationCustomer = require("./reservationCustomer");

// Room - Reservation İlişkisi
Room.hasMany(Reservation, {
  as: "Reservations", // Alias olarak 'Reservations' kullanılıyor
  foreignKey: "room_id",
  onDelete: "SET NULL",
});
Reservation.belongsTo(Room, {
  as: "room", // Tekil oda için alias 'Room' kullanılıyor
  foreignKey: "room_id",
  onDelete: "SET NULL",
});

// Reservation - Customer İlişkisi (Çoktan çoğa ilişki)
Reservation.belongsToMany(Customer, {
  through: ReservationCustomer,
  as: "reservationCustomers", // Alias 'reservationCustomers' olarak kullanılıyor
  foreignKey: "reservation_id",
});
Customer.belongsToMany(Reservation, {
  through: ReservationCustomer,
  as: "customerReservations", // Alias 'customerReservations' olarak kullanılıyor
  foreignKey: "customer_id",
});

module.exports = {
  Room,
  Reservation,
  Customer,
  ReservationCustomer,
};
