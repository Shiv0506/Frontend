const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./connection');
const Booking = require('./Schema');

const app = express();
const PORT = 8080;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST /api/booking: Create a new booking
app.post('/api/booking', async (req, res) => {
  try {
    const { movie, seats, slot } = req.body;
    if (!movie || !seats || !slot) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Validate seats: Ensure at least one seat type has a positive number
    const hasSeats = Object.values(seats).some(count => count > 0);
    if (!hasSeats) {
      return res.status(400).json({ message: 'At least one seat must be selected' });
    }
    const newBooking = new Booking({ movie, seats, slot });
    await newBooking.save();
    res.status(200).json({ message: 'Booking successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/booking: Retrieve the last booking
app.get('/api/booking', async (req, res) => {
  try {
    const lastBooking = await Booking.findOne().sort({ createdAt: -1 });
    if (!lastBooking) {
      return res.status(200).json({ message: 'no previous booking found' });
    }
    res.status(200).json({
      movie: lastBooking.movie,
      seats: lastBooking.seats,
      slot: lastBooking.slot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});