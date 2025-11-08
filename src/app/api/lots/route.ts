import { getLotData } from "@/app/lib/mongodb";

export async function GET() {
  const lotData = await getLotData();
  // return this as a response
  return Response.json(lotData, { status: 200 });
}
