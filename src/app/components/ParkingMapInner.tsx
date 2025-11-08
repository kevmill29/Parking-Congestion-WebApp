'use client';

import { useEffect, useState } from 'react';
import { MapContainer, ImageOverlay, Circle, Tooltip } from 'react-leaflet';
import L, { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Lot {
  lotID: string;
  title: string;
  capacity: number;
  scannedCount: number;
  congestion: 'Low' | 'Medium' | 'High';
  coords: [number, number];
}

export default function ParkingMapInner() {
  const [lots, setLots] = useState<Lot[]>([]);

  useEffect(() => {
    fetch('/api/lots/occupancy/')
      .then((res) => res.json())
      .then(setLots)
      .catch(console.error);
  }, []);

  const bounds: LatLngBoundsExpression = [
    [0, 0],
    [1000, 1000],
  ];

  const getColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        center={[500, 500]}
        zoom={-1}
        minZoom={-2}
        maxZoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <ImageOverlay url="/map.png" bounds={bounds} />

        {lots.map((lot) => (
          <Circle
            key={lot.lotID}
            center={lot.coords}
            radius={40}
            color={getColor(lot.congestion)}
            fillOpacity={0.6}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div>
                <strong>{lot.title}</strong>
                <br />
                {lot.scannedCount}/{lot.capacity} occupied
                <br />
                Congestion: {lot.congestion}
              </div>
            </Tooltip>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
