// components/InvoiceForm.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Input,
} from '@mui/material';

export default function InvoiceForm() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    vendor: '',
    invoice_number: '',
    amount: '',
    issue_date: '',
    due_date: '',
    status: 'Pending',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    API.get('vendors/').then(res => setVendors(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);
    if (file) data.append('file', file);
    await API.post('invoices/', data);
    alert('Invoice uploaded');
  };

  return (
    <Box mt={4}>
      <h2>Upload Invoice</h2>
      <TextField select label="Vendor" name="vendor" onChange={handleChange}>
        {vendors.map((v) => (
          <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
        ))}
      </TextField>
      <TextField label="Invoice #" name="invoice_number" onChange={handleChange} />
      <TextField label="Amount" name="amount" type="number" onChange={handleChange} />
      <TextField label="Issue Date" name="issue_date" type="date" onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField label="Due Date" name="due_date" type="date" onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField select label="Status" name="status" onChange={handleChange} value={form.status}>
        {['Pending', 'Paid', 'Overdue'].map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>
      <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Button onClick={handleSubmit}>Upload Invoice</Button>
    </Box>
  );
}
