'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
  label?: string;
  href?: string;
}

export default function BackButton({
  label = 'Back to Home',
  href = '/',
}: BackButtonProps) {
  return (
    <Button
      component={Link}
      href={href}
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      sx={{ mb: 3 }}
    >
      {label}
    </Button>
  );
}
