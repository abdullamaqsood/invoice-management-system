import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, TextField,
  MenuItem, Button, Paper
} from '@mui/material';
import API from '../services/api';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';

export default function AddInvoice() {
  const [form, setForm] = useState({
    vendor: '',
    invoice_number: '',
    amount: '',
    issue_date: '',
    due_date: '',
    status: 'Pending',
  });
  const [vendors, setVendors] = useState([]);
  const [file, setFile] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('vendors/').then((res) => setVendors(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const { vendor, invoice_number, amount, issue_date, due_date } = form;
    if (!vendor || !invoice_number || !amount || !issue_date || !due_date) {
      enqueueSnackbar('Please fill in all required fields.', { variant: 'warning' });
      return false;
    }
    if (!file) {
      enqueueSnackbar('Please upload an invoice file.', { variant: 'warning' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = new FormData();
    const vendorObj = vendors.find(v => v.id === parseInt(form.vendor));
    const fileExt = file?.name.split('.').pop();
    const cleanVendor = vendorObj?.name?.replace(/\s+/g, '_') || 'vendor';
    const cleanInvoice = form.invoice_number?.replace(/\s+/g, '_') || 'invoice';

    if (file) {
      const newFileName = `${cleanVendor}_${cleanInvoice}.${fileExt}`;
      const renamedFile = new File([file], newFileName, { type: file.type });
      data.append('file', renamedFile);
    }

    Object.keys(form).forEach((key) => data.append(key, form[key]));

    try {
      await API.post('invoices/', data);
      enqueueSnackbar('Invoice uploaded successfully', { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar('Upload failed', { variant: 'error' });
    }
  };

  return (
    <>
      <Topbar />
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Add New Invoice</Typography>
            <Button onClick={() => navigate('/dashboard')} variant="outlined">
              Back to Dashboard
            </Button>
          </Box>

          <TextField
            select fullWidth required name="vendor" label="Vendor"
            margin="normal" value={form.vendor} onChange={handleChange}
          >
            {vendors.map((v) => (
              <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth required name="invoice_number" label="Invoice #"
            margin="normal" value={form.invoice_number} onChange={handleChange}
          />

          <TextField
            fullWidth required name="amount" label="Amount" type="number"
            margin="normal" value={form.amount} onChange={handleChange}
          />

          <TextField
            fullWidth required name="issue_date" type="date"
            label="Issue Date" InputLabelProps={{ shrink: true }}
            margin="normal" value={form.issue_date} onChange={handleChange}
          />

          <TextField
            fullWidth required name="due_date" type="date"
            label="Due Date" InputLabelProps={{ shrink: true }}
            margin="normal" value={form.due_date} onChange={handleChange}
          />

          <TextField
            select fullWidth name="status" label="Status"
            value={form.status} margin="normal" onChange={handleChange}
          >
            {['Pending', 'Paid', 'Overdue'].map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>

          <Box mt={2}>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Box>

          <Box mt={3}>
            <Button variant="contained" onClick={handleSubmit}>
              Upload Invoice
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
