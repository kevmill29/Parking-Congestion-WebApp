import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;


export async function getLotData() {
  const client = await clientPromise;
  const db = client.db("parking-app");
  const lots = await db.collection("lots").find({}).toArray();
  return lots;
}

// ✅ Add database functions
export async function scanPlateIn(plateNumber: string, lotID: string) {
  const client = await clientPromise;
  const db = client.db("parking-app");

  // Find the lot
  const lot = await db.collection("lots").findOne({ lotID });
  if (!lot) throw new Error("Lot not found");

  // Prevent duplicate scans
  const alreadyScanned = lot.scans?.some(
    (scan: { plateNumber: string }) => scan.plateNumber === plateNumber
  );
  if (alreadyScanned) return;

  // Add plate to the scans list
  await db.collection("lots").updateOne(
    { lotID },
    { $push: { scans: { plateNumber } } } as any
  );

  // Optionally update lotStatus collection as well
  await db.collection("lotStatus").updateOne(
    { lotNumber: lotID },
    { $push: { scans: { plateNumber } } } as any, 
    { upsert: true }
  );
}

export async function scanPlateOut(plateNumber: string, lotID: string) {
  const client = await clientPromise;
  const db = client.db("parking-app");

  // Remove plate from scans in both collections
  await db.collection("lots").updateOne(
    { lotID },
    { $pull: { scans: { plateNumber } } } as any
  );

  await db.collection("lotStatus").updateOne(
    { lotNumber: lotID },
    { $pull: { scans: { plateNumber } } } as any
  );
}
