import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/booking-flow", (req, res) => {
  res.json({
    selectedFlight: req.session.selectedFlight ?? null,
    selectedDate: req.session.selectedDate ?? null,
    bookingData: req.session.bookingData ?? null,
  });
});

router.put("/booking-flow", (req, res) => {
  const { selectedFlight, selectedDate, bookingData } = req.body;
  if (selectedFlight !== undefined) {
    req.session.selectedFlight = selectedFlight;
  }
  if (selectedDate !== undefined) {
    req.session.selectedDate = selectedDate;
  }
  if (bookingData !== undefined) {
    req.session.bookingData = bookingData;
  }
  res.json({
    selectedFlight: req.session.selectedFlight ?? null,
    selectedDate: req.session.selectedDate ?? null,
    bookingData: req.session.bookingData ?? null,
  });
});

router.delete("/booking-flow", (req, res) => {
  delete req.session.selectedFlight;
  delete req.session.selectedDate;
  delete req.session.bookingData;
  res.json({ ok: true });
});

export default router;
