

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Error:", err));


const Booking = require("./models/booking.model");


const flights = require("./data/flights.json");
const seatMaps = require("./data/seat-maps.json");
const promos = require("./data/promos.json");
const airports = require("./data/airports.json");


app.get("/api/flights", (req, res) => {
  try {
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});


app.get("/api/seats", (req, res) => {
  try {
    res.json(seatMaps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seat maps" });
  }
});


app.get("/api/promos", (req, res) => {
  try {
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch promos" });
  }
});


app.get("/api/airports", (req, res) => {
  try {
    res.json(airports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch airports" });
  }
});


app.get("/api/airports/search", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const results = airports.filter((a) =>
    a.code.toLowerCase().includes(query) ||
    a.city.toLowerCase().includes(query) ||
    a.name.toLowerCase().includes(query)
  );

  res.json(results);
});


app.post("/api/book", async (req, res) => {
  try {
    const bookingData = req.body;

    if (!bookingData.flight || !bookingData.passengers || !bookingData.seats) {
      return res.status(400).json({
        error: "Invalid booking data"
      });
    }

    const booking = new Booking(bookingData);

    await booking.save();

    res.json({
      success: true,
      message: "Booking saved successfully",
      booking
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to save booking"
    });
  }
});


app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch bookings"
    });
  }
});


app.get("/", (req, res) => {
  res.send("🚀 SkyVoyage Backend with MongoDB is running!");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});