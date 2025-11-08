import mongoose from "mongoose";

//to be changed depending on schema
const ParkingLotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalCapacity: { type: Number, required: true },
  latitude: Number,
  longitude: Number,
  type: { type: String, enum: ["STUDENT", "FACULTY", "GENERAL"], default: "GENERAL" }
});

export default mongoose.models.ParkingLot || mongoose.model("ParkingLot", ParkingLotSchema);
