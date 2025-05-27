import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, IconButton,
  Button, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Topbar from '../components/Topbar';
import API from '../services/api';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [editingVendor, setEditingVendor] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [open, setOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await API.get('vendors/');
        setVendors(res.data);
      } catch {
        enqueueSnackbar('Session expired', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, [enqueueSnackbar]);

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setForm(vendor);
    setEmailError('');
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await API.delete(`vendors/${id}/`);
        const updated = await API.get('vendors/');
        setVendors(updated.data);
        enqueueSnackbar('Vendor deleted successfully', { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to delete vendor', { variant: 'error' });
      }
    }
  };

  const handleUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    try {
      await API.put(`vendors/${editingVendor.id}/`, form);
      enqueueSnackbar('Vendor updated', { variant: 'success' });
      const refreshed = await API.get('vendors/');
      setVendors(refreshed.data);
      setOpen(false);
    } catch {
      enqueueSnackbar('Update failed', { variant: 'error' });
    }
  };

  const isAdmin = user?.role === 'admin';

  const thStyle = {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #ccc'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #eee'
  };

  return (
    <>
      <Topbar />
      <Container sx={{ mt: 10 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Vendors</Typography>
          {isAdmin && (
            <Button variant="contained" onClick={() => navigate('/add-vendor')}>
              Add New Vendor
            </Button>
          )}
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Address</th>
                  {isAdmin && <th style={thStyle} align="right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id}>
                    <td style={tdStyle}>{v.name}</td>
                    <td style={tdStyle}>{v.email}</td>
                    <td style={tdStyle}>{v.phone}</td>
                    <td style={tdStyle}>{v.address}</td>
                    {isAdmin && (
                      <td style={tdStyle} align="right">
                        <IconButton onClick={() => handleEdit(v)}><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(v.id)}><DeleteIcon /></IconButton>
                      </td>
                    )}
                  </tr>
                ))}
                {vendors.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} style={tdStyle} align="center">
                      No vendors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Paper>
        )}

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Edit Vendor</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth label="Name" name="name" margin="dense"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              fullWidth label="Email" name="email" margin="dense"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              fullWidth label="Phone" name="phone" margin="dense"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <TextField
              fullWidth label="Address" name="address" margin="dense"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>Update</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
