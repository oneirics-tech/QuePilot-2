// frontend/src/pages/EmployeePortal.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import PinLogin from '../components/employee/PinLogin';
import CustomerList from '../components/employee/CustomerList';
import CheckInOut from '../components/employee/CheckInOut';

const EmployeePortal = () => {
  const { isAuthenticated, role } = useAuth();
  const { businessId } = useBusiness();

  if (!isAuthenticated || role !== 'employee') {
    return <PinLogin businessId={businessId} />;
  }

  return (
    <div className="employee-portal">
      <CheckInOut />
      <CustomerList />
    </div>
  );
};

export default EmployeePortal;
