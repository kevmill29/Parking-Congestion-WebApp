// import { NextResponse } from 'next/server';

// export async function GET() {
//   const lots = [
//     {
//       lotID: '0',
//       title: 'Lot A',
//       capacity: 50,
//       scannedCount: 25,
//       congestion: 'Medium',
//       coords: [300, 400],
//     },
//     {
//       lotID: '1',
//       title: 'Lot B',
//       capacity: 40,
//       scannedCount: 39,
//       congestion: 'High',
//       coords: [600, 200],
//     },
//     {
//       lotID: '2',
//       title: 'Lot C',
//       capacity: 30,
//       scannedCount: 5,
//       congestion: 'Low',
//       coords: [800, 800],
//     },
//   ];

//   return NextResponse.json(lots);
// }


import { NextResponse } from 'next/server';

export async function GET() {
  const lots = [
    {
      lotID: '0',
      title: 'Lot A',
      capacity: 50,
      scannedCount: 25,
      congestion: 'Medium',
      coords: [300, 400],
    },
    {
      lotID: '1',
      title: 'Lot B',
      capacity: 40,
      scannedCount: 39,
      congestion: 'High',
      coords: [600, 200],
    },
    {
      lotID: '2',
      title: 'Lot C',
      capacity: 30,
      scannedCount: 5,
      congestion: 'Low',
      coords: [800, 800],
    },
  ];

  return NextResponse.json(lots);
}
