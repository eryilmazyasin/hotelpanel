const Room = require("./room");
const Reservation = require("./reservation");

// İlişkileri burada tanımlıyoruz
Room.hasMany(Reservation, { foreignKey: "room_id", as: "Reservations" });
Reservation.belongsTo(Room, { foreignKey: "room_id", as: "Room" });

module.exports = { Room, Reservation };
