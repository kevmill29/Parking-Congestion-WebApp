import { NextResponse } from "next/server";
import { findUnauthorizedPlatesOverTime } from "@/lib/mongodb";

export async function GET() {
  try {
    const alerts = await findUnauthorizedPlatesOverTime();
    return NextResponse.json(alerts, { status: 200 });
  } catch (err) {
    console.error("Error fetching enforcement alerts:", err);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
