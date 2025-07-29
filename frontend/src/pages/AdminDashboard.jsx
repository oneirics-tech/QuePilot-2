// frontend/src/pages/AdminDashboard.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../components/admin/Dashboard';
import { Header } from '../components/shared';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      <Header>
        <div className="header-content">
          <h1>Queue Management System</h1>
          <div className="header-actions">
            <span>Welcome, {user?.name}</span>
            <Button variant="secondary" size="small" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </Header>
      
      <main className="admin-main">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
