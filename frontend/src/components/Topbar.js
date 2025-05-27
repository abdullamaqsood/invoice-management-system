import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem,
  Avatar, Box, Button, Drawer, List, ListItem, ListItemText, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Topbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Vendors', path: '/vendors' }
  ];

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              sx={{ cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate('/dashboard')}
            >
              InvoiceFlow
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box sx={{ width: 250 }} role="presentation">
                  <List>
                    {navItems.map((item) => (
                      <ListItem button key={item.label} onClick={() => handleNav(item.path)}>
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <Box p={2}>
                    <Typography variant="body1" mb={1}>
                      {user.username} ({user.role})
                    </Typography>
                    <Button variant="outlined" fullWidth onClick={handleLogout}>
                      Logout
                    </Button>
                  </Box>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              {navItems.map((item) => (
                <Button key={item.label} color="inherit" onClick={() => navigate(item.path)}>
                  {item.label}
                </Button>
              ))}
              <Typography mr={2}>{user.username} ({user.role})</Typography>
              <IconButton onClick={handleMenu}>
                <Avatar />
              </IconButton>
              <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Topbar;
