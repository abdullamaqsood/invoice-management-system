// components/InvoiceList.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Box, Button } from '@mui/material';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);

  const loadInvoices = () => {
    API.get('invoices/').then(res => setInvoices(res.data));
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const markPaid = async (id) => {
    await API.post(`invoices/${id}/mark_paid/`);
    loadInvoices();
  };

  const deleteInvoice = async (id) => {
    await API.delete(`invoices/${id}/`);
    loadInvoices();
  };

  return (
    <Box mt={4}>
      <h2>Invoices</h2>
      {invoices.map(inv => (
        <Box key={inv.id} mb={2} borderBottom="1px solid #ccc" p={1}>
          <div><strong>{inv.invoice_number}</strong> - ${inv.amount} ({inv.status})</div>
          <a href={inv.file_url} target="_blank" rel="noopener noreferrer">View File</a><br />
          <Button onClick={() => markPaid(inv.id)}>Mark Paid</Button>
          <Button onClick={() => deleteInvoice(inv.id)}>Delete</Button>
        </Box>
      ))}
    </Box>
  );
}
