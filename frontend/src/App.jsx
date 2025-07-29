// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { BusinessProvider } from './contexts/BusinessContext';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import EmployeePortal from './pages/EmployeePortal';
import CustomerKiosk from './pages/CustomerKiosk';
import QueueDisplay from './pages/QueueDisplay';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './styles/tokens.css';
import './styles/components.css';
import './styles/app.css';

function App() {
  return (
    <BusinessProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/kiosk" />} />
              <Route path="/kiosk" element={<CustomerKiosk />} />
              <Route path="/display" element={<QueueDisplay />} />
              <Route path="/employee" element={<EmployeePortal />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </BusinessProvider>
  );
}

export default App;
