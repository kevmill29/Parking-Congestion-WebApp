import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("parking-app"); // database name in your cluster

    // Fetch all lots
    const lots = await db.collection("lots").find({}).toArray();

    // Optionally compute available spaces (if not stored)
    const withAvailability = lots.map((lot) => {
      const capacity = lot.capacity ?? 0;
      const scans = Array.isArray(lot.scans) ? lot.scans.length : 0;
      const scannedCount = lot.scannedCount ?? scans;
      const available = capacity - scannedCount;

      return {
        lotID: lot.lotID,
        title: lot.title,
        capacity,
        scannedCount,
        available,
        congestion:
          scannedCount / capacity >= 0.8
            ? "High"
            : scannedCount / capacity >= 0.5
            ? "Medium"
            : "Low",
        coords: lot.coords ?? [0, 0],
      };
    });

    return NextResponse.json(withAvailability);
  } catch (error) {
    console.error("Error fetching lots:", error);
    return NextResponse.json(
      { error: "Failed to fetch parking lot data" },
      { status: 500 }
    );
  }
}
