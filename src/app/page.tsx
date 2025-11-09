'use client';

import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          🚗 Parking Management Dashboard
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome to the Parking Management System.  
          Choose a dashboard below to monitor, report, or enforce parking activity.
        </Typography>

        <Stack
          direction="column"
          spacing={3}
          alignItems="center"
          justifyContent="center"
        >
          <Link href="/lots" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ width: '250px' }}
            >
              🅿️ Parking Lots Overview
            </Button>
          </Link>

          <Link href="/enforcement" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ width: '250px' }}
            >
              🚓 Enforcement Dashboard
            </Button>
          </Link>

          <Link href="/accidents" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="warning"
              size="large"
              sx={{ width: '250px' }}
            >
              🚧 Report an Accident
            </Button>
          </Link>
          
          <Button
            href="/register"
            component={Link}
            variant="outlined"
            color="primary"
            size="large"
          >
            Register Vehicle
          </Button>

          
        </Stack>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Parking Management System
        </Typography>
      </Box>
    </main>
  );
}
