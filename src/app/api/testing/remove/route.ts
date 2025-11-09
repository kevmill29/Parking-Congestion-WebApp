import { NextResponse } from "next/server";
import { testRemoveCars } from "@/lib/mongodb";

type RequestData = {
  lotID: string;
};

export async function POST(req: Request) {
  try {
    const data: RequestData = await req.json();

    if (!data.lotID) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    await testRemoveCars(data.lotID);
    return NextResponse.json({ message: "removed lots of plates" });
  } catch (error) {
    console.error("Scan API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
