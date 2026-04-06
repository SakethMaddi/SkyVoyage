import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import { generateBookingReference } from "../utils/bookingRef.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const list = await Booking.find({ userId: req.session.userId })
      .sort({ createdAt: -1 })
      .lean();
    const out = list.map((b) => ({
      reference: b.reference,
      flight: b.flight,
      passengers: b.passengers,
      seats: b.seats,
      totalPrice: b.totalPrice,
      selectedDate: b.selectedDate,
      createdAt: b.createdAt,
    }));
    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { flight, passengers, seats, totalPrice, selectedDate } = req.body;
    if (!flight || !passengers || !seats || totalPrice == null || !selectedDate) {
      return res.status(400).json({ error: "Missing booking fields" });
    }
    let reference = generateBookingReference();
    for (let i = 0; i < 5; i++) {
      const exists = await Booking.findOne({ reference });
      if (!exists) break;
      reference = generateBookingReference();
    }
    const booking = await Booking.create({
      userId: req.session.userId,
      reference,
      flight,
      passengers,
      seats,
      totalPrice: Number(totalPrice),
      selectedDate,
    });
    delete req.session.selectedFlight;
    delete req.session.selectedDate;
    delete req.session.bookingData;
    res.status(201).json({
      booking: {
        reference: booking.reference,
        flight: booking.flight,
        passengers: booking.passengers,
        seats: booking.seats,
        totalPrice: booking.totalPrice,
        selectedDate: booking.selectedDate,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

export default router;
