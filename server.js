// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./connection");
const Booking = require("./Schema");

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

// POST /api/booking - create booking
app.post("/api/booking", async (req, res) => {
  try {
    const { movie, seats, slot } = req.body;
    if (!movie || !slot || !seats) {
      return res.status(400).json({ message: "movie, seats and slot are required" });
    }
    const booking = new Booking({ movie, seats, slot });
    await booking.save();
    return res.status(200).json({ message: "booking successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

// GET /api/booking - return last booking
app.get("/api/booking", async (req, res) => {
  try {
    const last = await Booking.findOne().sort({ createdAt: -1 }).lean();
    if (!last) return res.json({ message: "no previous booking found" });
    return res.json({ movie: last.movie, seats: last.seats, slot: last.slot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

// any other route invalid
app.all("*", (req, res) => {
  res.status(404).json({ message: "Invalid endpoint" });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
