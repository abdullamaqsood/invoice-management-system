// components/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open }) => {
  const navigate = useNavigate();

  const menu = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Invoices', icon: <ReceiptIcon />, path: '/dashboard' },
    { text: 'Vendors', icon: <PeopleIcon />, path: '/dashboard' },
  ];

  return (
    <Drawer variant="persistent" anchor="left" open={open}>
      <List sx={{ width: 240 }}>
        {menu.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
