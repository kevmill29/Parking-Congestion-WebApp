'use client';

import { useEffect, useState } from 'react';

interface Lot {
  lotID: string;
  title: string;
  capacity: number;
  scannedCount: number;
  available: number;
}

export default function LotsListPage() {
  const [lots, setLots] = useState<Lot[]>([]);

  useEffect(() => {
    fetch('/api/lots/list')
      .then((res) => res.json())
      .then(setLots)
      .catch(console.error);
  }, []);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Parking Lots Overview</h1>

      <div className="border rounded-lg shadow-sm divide-y divide-gray-200">
        {lots.map((lot) => (
          <div key={lot.lotID} className="p-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{lot.title}</h2>
              <p className="text-sm text-gray-600">
                Capacity: {lot.capacity} | Occupied: {lot.scannedCount}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                lot.available > 10
                  ? 'bg-green-100 text-green-700'
                  : lot.available > 0
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {lot.available} spaces left
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
