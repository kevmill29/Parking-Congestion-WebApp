'use client';

import dynamic from 'next/dynamic';

const ParkingMapInner = dynamic(() => import('./ParkingMapInner'), {
  ssr: false,
});

export default function ParkingMap() {
  return <ParkingMapInner />;
}

