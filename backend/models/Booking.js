import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reference: { type: String, required: true, unique: true },
    flight: { type: mongoose.Schema.Types.Mixed, required: true },
    passengers: { type: [mongoose.Schema.Types.Mixed], required: true },
    seats: { type: mongoose.Schema.Types.Mixed, required: true },
    totalPrice: { type: Number, required: true },
    selectedDate: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
