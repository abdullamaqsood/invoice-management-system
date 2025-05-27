// components/VendorForm.jsx
import React, { useState } from 'react';
import API from '../services/api';
import { TextField, Button, Box } from '@mui/material';

export default function VendorForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await API.post('vendors/', form);
    alert('Vendor added');
  };

  return (
    <Box mt={4}>
      <h2>Add Vendor</h2>
      <TextField label="Name" name="name" onChange={handleChange} />
      <TextField label="Email" name="email" onChange={handleChange} />
      <TextField label="Phone" name="phone" onChange={handleChange} />
      <TextField label="Address" name="address" onChange={handleChange} />
      <Button onClick={handleSubmit}>Add Vendor</Button>
    </Box>
  );
}
