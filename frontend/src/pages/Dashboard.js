import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, TextField,
  MenuItem, Toolbar, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import Topbar from '../components/Topbar';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [user, setUser] = useState({});
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [invRes, venRes] = await Promise.all([
          API.get('invoices/'),
          API.get('vendors/')
        ]);
        setInvoices(invRes.data);
        setVendors(venRes.data);
      } catch {
        enqueueSnackbar('Session expired', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, [enqueueSnackbar]);

  const isAdmin = user?.role === 'admin';

  const filtered = invoices.filter(inv => {
    const vendor = vendors.find(v => v.id === inv.vendor);
    const matchesStatus = !filterStatus || inv.status === filterStatus;
    const matchesVendor = !filterVendor || vendor?.name === filterVendor;
    const issueDate = new Date(inv.issue_date);
    const matchesStart = !startDate || issueDate >= new Date(startDate);
    const matchesEnd = !endDate || issueDate <= new Date(endDate);
    return matchesStatus && matchesVendor && matchesStart && matchesEnd;
  });

  const total = filtered.length;
  const outstanding = filtered.reduce((sum, inv) =>
    inv.status !== 'Paid' ? sum + parseFloat(inv.amount) : sum, 0);

  const handleStatusChange = async (id) => {
    try {
      await API.patch(`invoices/${id}/`, { status: 'Paid' });
      enqueueSnackbar('Marked as Paid', { variant: 'success' });
      refreshData();
    } catch {
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await API.delete(`invoices/${id}/`);
        enqueueSnackbar('Invoice deleted', { variant: 'success' });
        refreshData();
      } catch {
        enqueueSnackbar('Failed to delete invoice', { variant: 'error' });
      }
    }
  };

  const handleClearFilters = () => {
    setFilterStatus('');
    setFilterVendor('');
    setStartDate('');
    setEndDate('');
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice({ ...invoice });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const amountValue = parseFloat(selectedInvoice.amount);
    if (isNaN(amountValue)) {
      enqueueSnackbar('Amount must be a valid number', { variant: 'warning' });
      return;
    }

    try {
      await API.patch(`invoices/${selectedInvoice.id}/`, {
        ...selectedInvoice,
        amount: amountValue
      });
      enqueueSnackbar('Invoice updated successfully', { variant: 'success' });
      setEditDialogOpen(false);
      refreshData();
    } catch {
      enqueueSnackbar('Failed to update invoice', { variant: 'error' });
    }
  };

  const refreshData = async () => {
    try {
      const [invRes, venRes] = await Promise.all([
        API.get('invoices/'),
        API.get('vendors/')
      ]);
      setInvoices(invRes.data);
      setVendors(venRes.data);
    } catch {}
  };

  return (
    <Box>
      <Topbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Typography variant="h4" mb={2}>Dashboard</Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <StatCard label="Total Invoices" value={total} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard label="Outstanding Balance" value={`$${outstanding.toFixed(2)}`} />
              </Grid>
            </Grid>

            <Box mb={3} display="flex" flexWrap="wrap" gap={2} alignItems="center">
              <TextField select label="Filter by Status" value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: 180 }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </TextField>

              <TextField select label="Filter by Vendor" value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)} sx={{ minWidth: 200 }}>
                <MenuItem value="">All</MenuItem>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.name}>{v.name}</MenuItem>
                ))}
              </TextField>

              <TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }}
                value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <TextField label="End Date" type="date" InputLabelProps={{ shrink: true }}
                value={endDate} onChange={(e) => setEndDate(e.target.value)} />

              <Button variant="outlined" onClick={handleClearFilters}>Clear Filters</Button>
            </Box>

            {isAdmin && (
              <Box mb={3}>
                <Button variant="contained" onClick={() => navigate('/add-invoice')} sx={{ mr: 2 }}>
                  New Invoice
                </Button>
                <Button variant="outlined" onClick={() => navigate('/add-vendor')}>
                  Add New Vendor
                </Button>
              </Box>
            )}

            <Typography variant="h6" gutterBottom>Recent Invoices</Typography>
            <Paper sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f4f4f4' }}>
                  <tr>
                    <th style={thStyle}>Invoice #</th>
                    <th style={thStyle}>Vendor</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Issue Date</th>
                    <th style={thStyle}>Due Date</th>
                    <th style={thStyle}>File</th>
                    {isAdmin && <th style={thStyle}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inv => {
                    const vendor = vendors.find(v => v.id === inv.vendor);
                    return (
                      <tr key={inv.id}>
                        <td style={tdStyle}>{inv.invoice_number}</td>
                        <td style={tdStyle}>{vendor?.name || 'N/A'}</td>
                        <td style={tdStyle}>${inv.amount}</td>
                        <td style={tdStyle}>
                          <Typography>{inv.status}</Typography>
                          {isAdmin && inv.status !== 'Paid' && (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ mt: 1 }}
                              onClick={() => handleStatusChange(inv.id)}
                            >
                              Mark as Paid
                            </Button>
                          )}
                        </td>
                        <td style={tdStyle}>{inv.issue_date}</td>
                        <td style={tdStyle}>{inv.due_date}</td>
                        <td style={tdStyle}>
                          <IconButton onClick={() => window.open(inv.file_url, '_blank')}>
                            <DescriptionIcon />
                          </IconButton>
                        </td>
                        {isAdmin && (
                          <td style={tdStyle}>
                            <IconButton onClick={() => handleEdit(inv)}><EditIcon /></IconButton>
                            <IconButton onClick={() => handleDelete(inv.id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} style={tdStyle} align="center">No invoices found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Paper>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
              <DialogTitle>Edit Invoice</DialogTitle>
              <DialogContent>
                <TextField fullWidth label="Invoice #" name="invoice_number" margin="dense"
                  value={selectedInvoice?.invoice_number || ''} disabled />
                <TextField fullWidth label="Amount" name="amount" type="number" margin="dense"
                  inputProps={{ step: '0.01', min: '0' }}
                  value={selectedInvoice?.amount || ''} onChange={handleEditChange} />
                <TextField fullWidth label="Due Date" name="due_date" type="date" margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={selectedInvoice?.due_date || ''} onChange={handleEditChange} />
                <TextField select fullWidth label="Status" name="status" margin="dense"
                  value={selectedInvoice?.status || ''} onChange={handleEditChange}>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleEditSubmit}>Update</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </Box>
  );
}

const StatCard = ({ label, value }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="subtitle1">{label}</Typography>
    <Typography variant="h6">{value}</Typography>
  </Paper>
);

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '1px solid #ccc'
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee'
};
