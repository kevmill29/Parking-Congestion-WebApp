'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface Alert {
  plateNumber: string;
  lotID: string;
  minutesParked: number;
}

export default function AlertsTable({ alerts }: { alerts: Alert[] }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>License Plate</strong></TableCell>
            <TableCell><strong>Lot ID</strong></TableCell>
            <TableCell><strong>Minutes Parked</strong></TableCell>
            <TableCell align="center"><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow
              key={`${alert.lotID}-${alert.plateNumber}`}
              sx={{
                backgroundColor:
                  alert.minutesParked >= 30
                    ? 'rgba(255, 0, 0, 0.1)'
                    : 'rgba(255, 165, 0, 0.1)',
              }}
            >
              <TableCell>{alert.plateNumber}</TableCell>
              <TableCell>{alert.lotID}</TableCell>
              <TableCell>{alert.minutesParked}</TableCell>
              <TableCell align="center">
                <WarningAmberIcon
                  color={alert.minutesParked >= 30 ? 'error' : 'warning'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
