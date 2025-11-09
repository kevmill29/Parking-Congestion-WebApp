// src/theme.ts
'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    warning: { main: '#ffa726' },
    background: { default: '#f5f6fa' },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', sans-serif`,
    h4: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
});

export default theme;
