// pages/Login.jsx
import React, { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Box, Paper,
} from '@mui/material';
import MinimalNavbar from '../components/MinimalNavbar';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <>
      <MinimalNavbar />
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Sign in to your account
          </Typography>
          <TextField fullWidth label="Username" name="username" margin="normal" onChange={handleChange} />
          <TextField fullWidth label="Password" type="password" name="password" margin="normal" onChange={handleChange} />
          {error && <Typography color="error">{error}</Typography>}
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            Sign In
          </Button>
          <Box mt={2} textAlign="center">
            <Link to="/register">Don’t have an account? Sign up</Link>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
