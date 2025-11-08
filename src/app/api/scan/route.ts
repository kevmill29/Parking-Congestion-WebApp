import { NextResponse } from "next/server";
import { scanPlateIn, scanPlateOut } from "@/lib/mongodb";

type RequestData = {
  plateNumber: string;
  lotID: string;
  scanType: "entry" | "exit";
};

export async function POST(req: Request) {
  try {
    const data: RequestData = await req.json();

    if (!data.plateNumber || !data.lotID || !data.scanType) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    if (data.scanType === "entry") {
      await scanPlateIn(data.plateNumber, data.lotID);
      return NextResponse.json({ message: "Plate scanned in successfully" });
    } else if (data.scanType === "exit") {
      await scanPlateOut(data.plateNumber, data.lotID);
      return NextResponse.json({ message: "Plate scanned out successfully" });
    }

    return NextResponse.json({ error: "Invalid scan type" }, { status: 400 });
  } catch (error) {
    console.error("Scan API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
