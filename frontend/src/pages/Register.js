// pages/Register.jsx
import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Paper,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import MinimalNavbar from '../components/MinimalNavbar';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      enqueueSnackbar('Registration successful. Please login.', { variant: 'success' });
      navigate('/');
    } catch {
      enqueueSnackbar('Registration failed. Please try again.', { variant: 'error' });
    }
  };

  return (
    <>
      <MinimalNavbar />
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create your account
          </Typography>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            margin="normal"
            onChange={handleChange}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Box mt={2} textAlign="center">
            <Link to="/">Already have an account? Sign in</Link>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
