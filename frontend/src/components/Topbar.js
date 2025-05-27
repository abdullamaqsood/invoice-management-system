import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem,
  Avatar, Box
} from '@mui/material';
import { logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', fontWeight: 600 }}
          onClick={() => navigate('/dashboard')}
        >
          InvoiceFlow
        </Typography>

        <Box display="flex" alignItems="center">
          <Typography mr={2}>{user.username} ({user.role})</Typography>
          <IconButton onClick={handleMenu}>
            <Avatar />
          </IconButton>
          <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
