import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'Place' },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  numberOfGuests: String,
  price: Number,
});

const BookingModel = mongoose.model("Booking", BookingSchema);

export default BookingModel;
