import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button, Paper
} from '@mui/material';
import API from '../services/api';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';

export default function AddVendor() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: ''
  });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const { name, email, phone, address } = form;
    if (!name || !email || !phone || !address) {
      enqueueSnackbar('Please fill in all required fields.', { variant: 'warning' });
      return false;
    }
    if (!isValidEmail(email)) {
      enqueueSnackbar('Please enter a valid email address.', { variant: 'warning' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await API.post('vendors/', form);
      enqueueSnackbar('Vendor added successfully', { variant: 'success' });
      navigate('/dashboard');
    } catch {
      enqueueSnackbar('Failed to add vendor', { variant: 'error' });
    }
  };

  return (
    <>
      <Topbar />
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Add New Vendor</Typography>
            <Button onClick={() => navigate('/dashboard')} variant="outlined">
              Back to Dashboard
            </Button>
          </Box>

          <TextField
            fullWidth required label="Name" name="name"
            margin="normal" value={form.name} onChange={handleChange}
          />
          <TextField
            fullWidth required label="Email" name="email"
            margin="normal" value={form.email} onChange={handleChange}
          />
          <TextField
            fullWidth required label="Phone" name="phone"
            margin="normal" value={form.phone} onChange={handleChange}
          />
          <TextField
            fullWidth required label="Address" name="address"
            margin="normal" value={form.address} onChange={handleChange}
          />

          <Box mt={2}>
            <Button variant="contained" onClick={handleSubmit}>
              Add Vendor
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
