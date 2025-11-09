'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import BackButton from '@/components/BackButton';

export default function RegisterPage() {
  const [plate, setPlate] = useState('');
  const [permitType, setPermitType] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!plate || !permitType) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate, permitType }),
      });

      if (!res.ok) throw new Error('Failed to register plate');
      setSuccess('Vehicle successfully registered!');
      setPlate('');
      setPermitType('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <BackButton />
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          🚗 Register Your Vehicle
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
          Register your license plate and select your permit type.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="License Plate"
              variant="outlined"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              required
            />

            <TextField
              label="Permit Type"
              select
              value={permitType}
              onChange={(e) => setPermitType(e.target.value)}
              required
            >
              <MenuItem value="facstaff">Faculty/Staff</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>

            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </form>
      </Paper>
    </main>
  );
}
