// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddVendor from './pages/AddVendor';
import AddInvoice from './pages/AddInvoice';
import Settings from './pages/Settings';
import Auth from './pages/Auth';

import { isAuthenticated, getUserRole } from './services/auth';

// Protects all authenticated routes
const PrivateRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/" />;

// Restricts routes to admin only
const AdminRoute = ({ children }) =>
  getUserRole() === 'admin' ? children : <Navigate to="/dashboard" />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/" element={<Auth />} /> */}
        {/* Authenticated Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-vendor"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AddVendor />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-invoice"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AddInvoice />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
