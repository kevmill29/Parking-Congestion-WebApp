import mongoose from "mongoose";

//to be changed depending on schema
const ParkingEventSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true },
  lot: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingLot" },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
});

export default mongoose.models.ParkingEvent || mongoose.model("ParkingEvent", ParkingEventSchema);
