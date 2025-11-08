'use client';

import ParkingMap from './components/ParkingMap';

export default function ParkingPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Campus Parking Congestion</h1>
      <ParkingMap />
    </main>
  );
}
