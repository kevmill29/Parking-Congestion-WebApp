'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import BackButton from '@/components/BackButton';

export default function AccidentReportPage() {
  const [formData, setFormData] = useState({
    name: '',
    lotID: '',
    description: '',
    plateNumber: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    if (!formData.name || !formData.lotID || !formData.description || !formData.plateNumber) {
      setError('Please fill out all required fields.');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('lotID', formData.lotID);
    data.append('description', formData.description);
    data.append('plateNumber', formData.plateNumber);
    if (file) data.append('photo', file);

    try {
      const res = await fetch('/api/accidents/report', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', lotID: '', description: '', plateNumber: '' });
        setFile(null);
      } else {
        setError('Failed to submit report.');
      }
    } catch (err) {
      console.error(err);
      setError('Error submitting report.');
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
        <BackButton />
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Accident Report Form
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Please fill in all required fields (*) and upload a photo if available.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {submitted && <Alert severity="success" sx={{ mb: 2 }}>✅ Report submitted successfully!</Alert>}

        <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
          <Stack spacing={2}>
            <TextField
              label="Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Lot ID *"
              name="lotID"
              value={formData.lotID}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="License Plate *"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Description *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={3}
            />

            {/* File Upload Field */}
            <Button
              variant="outlined"
              component="label"
            >
              {file ? `Selected: ${file.name}` : 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
              Submit Report
            </Button>
          </Stack>
        </Box>
      </Paper>
    </main>
  );
}
