import { MongoClient } from "mongodb";

// ✅ Use your environment variable from .env.local
const uri = process.env.MONGODB_URI || "";
if (!uri) throw new Error("Missing MONGODB_URI in environment variables");

// ✅ Create client with global caching for hot reload safety
const client = new MongoClient(uri, { socketTimeoutMS: 10000 });
let clientPromise: Promise<MongoClient>;

if (!(global as any)._mongoClientPromise) {
  (global as any)._mongoClientPromise = client.connect();
}
clientPromise = (global as any)._mongoClientPromise;

// ✅ Helper to get an active client
export async function getClient() {
  return clientPromise;
}

/**
 * Removes a specific plate number from the scans array based on the provided lot ID.
 */
export async function scanPlateOut(plateNumber: string, lotID: string) {
  const client = await getClient();
  const lotsColl = client.db("ParkingApp").collection("lots");
  await lotsColl.updateOne(
    { lotID },
    { $pull: { scans: { plateNumber } } } as any
  );
}

/**
 * Adds a plate to the scans list for a lot (with a timestamp).
 */
export async function scanPlateIn(plateNumber: string, lotID: string) {
  const client = await getClient();
  const lotsColl = client.db("ParkingApp").collection("lots");

  const newScan = {
    plateNumber,
    timestamp: new Date(), // standardized field name
  };

  // Prevent duplicates
  await scanPlateOut(plateNumber, lotID);

  const result = await lotsColl.findOneAndUpdate(
    { lotID },
    { $push: { scans: newScan } } as any,
    { returnDocument: "after" }
  );

  console.log("Scan added:", result);
  return result;
}

/**
 * Returns summary data for all parking lots, including scan counts.
 */
export async function getLotData() {
  const client = await getClient();
  const lotsColl = client.db("ParkingApp").collection("lots");

  const result = await lotsColl
    .aggregate([
      {
        $project: {
          lotID: 1,
          title: 1,
          allows: 1,
          capacity: 1,
          scanCount: { $size: { $ifNull: ["$scans", []] } },
        },
      },
    ])
    .toArray();

  console.log("Fetched lots:", result.length);
  return result;
}

/**
 * Finds unregistered plates that have been parked for more than 15 minutes.
 * Uses `timestamp` instead of old `timeEntered`.
 */
export async function findUnauthorizedPlatesOverTime() {
  const client = await getClient();
  const db = client.db("ParkingApp");

  const carsColl = db.collection("cars"); // registered vehicles
  const lotsColl = db.collection("lots");

  const registered = await carsColl.find({}).toArray();
  const registeredPlates = new Set(registered.map((c) => c.plate));

  const lots = await lotsColl.find({}).toArray();
  const now = new Date();

  const alerts: Array<{ plateNumber: string; lotID: string; minutesParked: number }> = [];

  for (const lot of lots) {
    if (!Array.isArray(lot.scans)) continue;

    for (const scan of lot.scans) {
      const { plateNumber, timestamp } = scan;
      if (!plateNumber || !timestamp) continue;

      const enteredAt = new Date(timestamp);
      const diffMinutes = (now.getTime() - enteredAt.getTime()) / 60000;

      // alert only if plate unregistered + >15min parked
      if (!registeredPlates.has(plateNumber) && diffMinutes >= 15) {
        alerts.push({
          plateNumber,
          lotID: lot.lotID,
          minutesParked: Math.floor(diffMinutes),
        });
      }
    }
  }

  console.log("Unauthorized alerts:", alerts.length);
  return alerts;
}
