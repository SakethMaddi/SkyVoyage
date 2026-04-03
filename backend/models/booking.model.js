const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  flight: Object,
  passengers: Array,
  seats: Array,
  baseFare: Number,
  seatUpgrade: Number,
  totalPrice: Number,
  selectedDate: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);