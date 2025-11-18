const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  movie: { type: String, required: true },
  seats: { type: Object, required: true }, // e.g., {A1: 2, A2: 1, ...}
  slot: { type: String, required: true },
}, { timestamps: true }); // Adds createdAt for sorting last booking

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;