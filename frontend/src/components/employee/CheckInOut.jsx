// frontend/src/components/employee/CheckInOut.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { Button } from '../shared';

const CheckInOut = () => {
  const { user, logout } = useAuth();

  const handleCheckOut = async () => {
    try {
      await api.post('/employees/check-out');
      logout();
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  return (
    <div className="check-in-out-header">
      <div className="employee-info">
        <h3>Welcome, {user.name}</h3>
        <p>Checked in at {new Date(user.lastCheckIn).toLocaleTimeString()}</p>
      </div>
      
      <Button 
        variant="danger" 
        onClick={handleCheckOut}
      >
        Check Out
      </Button>
    </div>
  );
};

export default CheckInOut;
