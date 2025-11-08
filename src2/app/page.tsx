'use client';

import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

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
    fetch('/api/lots/occupancy')
      .then((res) => res.json())
      .then(setLots)
      .catch(console.error);
  }, []);

  const getColor = (percent: number) => {
    if (percent >= 90) return 'error'; // red
    if (percent >= 70) return 'warning'; // yellow
    return 'success'; // green
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Typography variant="h4" gutterBottom textAlign="center">
        Parking Lots Overview
      </Typography>

      {lots.map((lot) => {
        const percent = (lot.scannedCount / lot.capacity) * 100;

        return (
          <Paper
            key={lot.lotID}
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{lot.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {lot.available} / {lot.capacity} available
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={percent}
              color={getColor(percent)}
              sx={{ height: 10, borderRadius: 5 }}
            />

            <Typography variant="caption" color="text.secondary">
              {Math.round(percent)}% occupied
            </Typography>
          </Paper>
        );
      })}
    </main>
  );
}
