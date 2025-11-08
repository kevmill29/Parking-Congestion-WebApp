import mongoose from "mongoose";

//to be changed depending on schema
const RegisteredPlateSchema = new mongoose.Schema({
  plateNumber: { type: String, unique: true, required: true },
  type: { type: String, enum: ["STUDENT", "FACULTY", "GENERAL"], default: "GENERAL" }
});

export default mongoose.models.RegisteredPlate || mongoose.model("RegisteredPlate", RegisteredPlateSchema);
