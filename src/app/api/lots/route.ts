import { NextResponse } from "next/server";
import { getLotData } from "@/lib/mongodb";

export async function GET() {
  try {
    const data = await getLotData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in /api/lots:", error);
    return NextResponse.json({ error: "Failed to load lots" }, { status: 500 });
  }
}


