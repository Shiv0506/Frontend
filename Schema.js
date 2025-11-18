// Schema.js
const mongoose = require("mongoose");

const seatsSchema = new mongoose.Schema({
  A1: { type: Number, default: 0 },
  A2: { type: Number, default: 0 },
  A3: { type: Number, default: 0 },
  A4: { type: Number, default: 0 },
  D1: { type: Number, default: 0 },
  D2: { type: Number, default: 0 }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  movie: { type: String, required: true },
  seats: { type: seatsSchema, required: true },
  slot: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
