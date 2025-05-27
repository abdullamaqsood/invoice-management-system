// pages/Settings.jsx
import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import API from '../services/api';

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [email, setEmail] = useState(user.email);
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
    try {
      await API.patch(`users/${user.id}/`, { email });
      enqueueSnackbar('Profile updated!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to update profile.', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" mb={2}>Update Profile</Typography>
        <TextField fullWidth label="Username" value={user.username} disabled />
        <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </Paper>
    </Container>
  );
}
