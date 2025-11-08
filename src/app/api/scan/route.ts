import { scanPlateIn, scanPlateOut } from "@/app/lib/mongodb";

type RequestData = {
  plateNumber: string;
  lotID: string;
  scanType: "entry" | "exit";
};

export async function POST(req: Request) {
  const data: RequestData = await req.json();
  if (data.plateNumber && data.lotID && data.scanType) {
    // request has valid data
    // use the data
    if (data.scanType === "entry") {
      // handle adding scan to list
      await scanPlateIn(data.plateNumber, data.lotID);

      return new Response("Successfully scanned plate");
    } else if (data.scanType === "exit") {
      // handle removing scan from list
      await scanPlateOut(data.plateNumber, data.lotID);
      return new Response("Successfully scanned plate");
    }
  } else {
    return new Response("improper request", { status: 400 });
  }
}
