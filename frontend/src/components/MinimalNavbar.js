import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

export default function MinimalNavbar() {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          InvoiceFlow
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
