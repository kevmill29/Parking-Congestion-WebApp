import { NextResponse } from "next/server";
import { getLotData } from "@/lib/mongodb";

export async function GET() {
  const lotData = await getLotData();
  return NextResponse.json(lotData, { status: 200 });
}
