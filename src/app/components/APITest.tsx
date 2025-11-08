"use client";

import { useEffect, useState } from "react";

interface LotData {
  _id: string;
  lotID: string;
  title?: string;
  location?: string;
  capacity: number;
  scans: any[];
  scanCount: number;
  allows: object;
}

const APITest = () => {
  const [lots, setLots] = useState<LotData[]>([]);
  const [loadingState, setLoadingState] = useState<
    "loading" | "done" | "error" | ""
  >("");

  useEffect(() => {
    const fetchLots = async () => {
      try {
        setLoadingState("loading");
        const response = await fetch("/api/lots/");
        if (!response.ok) {
          setLoadingState("error");
        }
        const data = await response.json();
        setLots(data);
        setLoadingState("done");
      } catch (err) {
        setLoadingState("error");
      }
    };

    fetchLots();
  }, []);

  if (loadingState === "loading") return <div>Loading...</div>;
  if (loadingState === "error") return <div>Error Loading Lots!</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Parking Lots Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lots.map((lot) => (
          <div
            key={lot._id}
            className="col-span-1 border p-4 rounded-lg overflow-hidden"
          >
            <h3 className="text-xl font-semibold"> {lot.title}</h3>
            <pre>{JSON.stringify(lot, null, 3)}</pre>
            <p>This lot is {(1 - lot.scanCount / lot.capacity) * 100}% free</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APITest;
