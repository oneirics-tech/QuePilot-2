// frontend/src/pages/CustomerKiosk.jsx
import React from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import CheckInForm from '../components/customer/CheckInForm';

const CustomerKiosk = () => {
  const { businessId, businessInfo } = useBusiness();

  return (
    <div className="kiosk-page">
      <CheckInForm businessId={businessId} businessInfo={businessInfo} />
    </div>
  );
};

export default CustomerKiosk;
