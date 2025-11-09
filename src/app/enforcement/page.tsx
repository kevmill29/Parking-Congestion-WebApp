'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Button, Paper, Table, TableHead, TableBody, TableRow, TableCell, Stack } from '@mui/material';
import AlertsTable from './components/AlertsTable';
import BackButton from '@/components/BackButton';
import SortIcon from '@mui/icons-material/Sort';

interface Alert {
  plateNumber: string;
  lotID: string;
  minutesParked: number;
}

interface Lot {
  lotID: string;
  title: string;
  capacity: number;
  scanCount: number;
  available?: number;
}

export default function EnforcementDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(false);

  // Fetch both alerts and lots
  const fetchData = async () => {
    try {
      const [alertsRes, lotsRes] = await Promise.all([
        fetch('/api/enforcement/alerts'),
        fetch('/api/lots'),
      ]);

      const alertsData = await alertsRes.json();
      const lotsData = await lotsRes.json();

      const processedLots = lotsData.map((lot: Lot) => ({
        ...lot,
        available: lot.capacity - lot.scanCount,
      }));

      // initial sort (most full → least full)
      const sortedLots = processedLots.sort(
        (a: Lot, b: Lot) => (b.scanCount / b.capacity) - (a.scanCount / a.capacity)
      );

      setAlerts(alertsData);
      setLots(sortedLots);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sorting toggle
  const handleSort = () => {
    setSortAsc((prev) => !prev);
    setLots((prev) =>
      [...prev].sort((a, b) =>
        sortAsc
          ? (b.scanCount / b.capacity) - (a.scanCount / a.capacity)
          : (a.scanCount / a.capacity) - (b.scanCount / b.capacity)
      )
    );
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <BackButton />

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          🚓 Parking Enforcement Dashboard
        </Typography>
        <Button variant="outlined" onClick={fetchData}>Refresh Now</Button>
      </Box>

      {/* Loading State */}
      {loading ? (
        <>
          <Typography variant="body1" textAlign="center" sx={{ mb: 2 }}>
            Checking for unauthorized vehicles...
          </Typography>
          <LinearProgress />
        </>
      ) : (
        <>
          {/* Alerts Section */}
          {alerts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mb: 4 }}>
              <Typography variant="h6" color="text.secondary">
                ✅ No unauthorized vehicles detected.
              </Typography>
            </Paper>
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                ⚠️ Active Parking Alerts
              </Typography>
              <AlertsTable alerts={alerts} />
            </>
          )}

          {/* Parking Lot Status Section */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 5, mb: 2 }}>
            <Typography variant="h5">🅿️ Parking Lot Occupancy</Typography>
            <Button
              startIcon={<SortIcon />}
              variant="outlined"
              onClick={handleSort}
            >
              Sort by {sortAsc ? 'Most Full (↓)' : 'Least Full (↑)'}
            </Button>
          </Stack>

          {/* Parking Lots Table */}
          <Paper sx={{ borderRadius: 2, p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Lot Name</strong></TableCell>
                  <TableCell><strong>Lot ID</strong></TableCell>
                  <TableCell><strong>Capacity</strong></TableCell>
                  <TableCell><strong>Occupied</strong></TableCell>
                  <TableCell><strong>Available</strong></TableCell>
                  <TableCell><strong>Percent Full</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lots.map((lot) => {
                  const percentFull = (lot.scanCount / lot.capacity) * 100;
                  return (
                    <TableRow
                      key={lot.lotID}
                      sx={{
                        backgroundColor:
                          percentFull >= 90
                            ? 'rgba(255, 0, 0, 0.1)'
                            : percentFull >= 70
                            ? 'rgba(255, 165, 0, 0.1)'
                            : 'rgba(0, 255, 0, 0.05)',
                      }}
                    >
                      <TableCell>{lot.title}</TableCell>
                      <TableCell>{lot.lotID}</TableCell>
                      <TableCell>{lot.capacity}</TableCell>
                      <TableCell>{lot.scanCount}</TableCell>
                      <TableCell>{lot.available}</TableCell>
                      <TableCell>{percentFull.toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </main>
  );
}
