import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody, Button, Box, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
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
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchVendors();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchVendors = async () => {
    const res = await API.get('vendors/');
    setVendors(res.data);
  };

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
        fetchVendors();
        enqueueSnackbar('Vendor deleted successfully', { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to delete vendor', { variant: 'error' });
      }
    }
  };

  const handleUpdate = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    try {
      await API.put(`vendors/${editingVendor.id}/`, form);
      enqueueSnackbar('Vendor updated', { variant: 'success' });
      setOpen(false);
      fetchVendors();
    } catch {
      enqueueSnackbar('Update failed', { variant: 'error' });
    }
  };

  const isAdmin = user?.role === 'admin';

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

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                {isAdmin && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell>{v.phone}</TableCell>
                  <TableCell>{v.address}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(v)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(v.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {vendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} align="center">
                    No vendors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Edit Vendor</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth label="Name" name="name" margin="dense"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              fullWidth label="Email" name="email" margin="dense"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              fullWidth label="Phone" name="phone" margin="dense"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <TextField
              fullWidth label="Address" name="address" margin="dense"
              value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
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
