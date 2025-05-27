// pages/Auth.jsx
import React, { useState } from 'react';
import {
  Grid, Box, Typography, Tabs, Tab,
  TextField, Button, Paper, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function Auth() {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Signup
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setForm({ username: '', email: '', password: '' });
    setError('');
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (tab === 0) {
      // LOGIN
      try {
        await login(form.username, form.password); // username + password only
        navigate('/dashboard');
      } catch {
        setError('Invalid credentials');
      }
    } else {
      // SIGNUP
      try {
        const res = await fetch('http://localhost:8000/api/auth/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        alert('Registration successful! Please log in.');
        setTab(0);
      } catch {
        setError('Registration failed');
      }
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* LEFT SIDE – IMAGE */}
      <Grid item xs={false} md={6}>
        <Box
          sx={{
            height: '100%',
            backgroundImage: `url('https://images.unsplash.com/photo-1733506260573-2ddbf1db9b1a?auto=format&fit=crop&w=1050&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Grid>

      {/* RIGHT SIDE – FORM */}
      <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent="center">
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, m: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            {tab === 0 ? 'Login to your account' : 'Create your account'}
          </Typography>

          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            onChange={handleChange}
          />

          {tab === 1 && (
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              onChange={handleChange}
            />
          )}

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            onChange={handleChange}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            {tab === 0 ? 'Sign In' : 'Sign Up'}
          </Button>

          <Box mt={2} textAlign="center">
            {tab === 0 ? (
              <Typography variant="body2">
                Don’t have an account?{' '}
                <Link component="button" onClick={() => setTab(1)}>Sign up</Link>
              </Typography>
            ) : (
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component="button" onClick={() => setTab(0)}>Sign in</Link>
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
