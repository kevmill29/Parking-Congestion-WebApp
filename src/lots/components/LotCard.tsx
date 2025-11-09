'use client';

import { Paper, Box, Typography, LinearProgress } from '@mui/material';

interface LotCardProps {
  title: string;
  capacity: number;
  available: number;
  scanCount: number;
}

/**
 * LotCard - Displays parking lot information with occupancy progress bar.
 * Used in LotsListPage to visualize congestion and capacity.
 */
export default function LotCard({ title, capacity, available, scanCount }: LotCardProps) {
  const percent = capacity > 0 ? (scanCount / capacity) * 100 : 0;

  const getColor = (percent: number): 'error' | 'warning' | 'success' => {
    if (percent >= 90) return 'error';   // Very congested
    if (percent >= 70) return 'warning'; // Moderate congestion
    return 'success';                    // Plenty of space
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        transition: 'transform 0.1s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: 6,
        },
      }}
    >
      {/* Header Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {available} / {capacity} available
        </Typography>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={percent}
        color={getColor(percent)}
        sx={{ height: 10, borderRadius: 5 }}
      />

      {/* Footer / Summary */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textAlign: 'right', fontStyle: 'italic' }}
      >
        {Math.round(percent)}% occupied
      </Typography>
    </Paper>
  );
}
