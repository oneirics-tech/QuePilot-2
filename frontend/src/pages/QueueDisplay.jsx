// frontend/src/pages/QueueDisplay.jsx
import React from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import QueueDisplayComponent from '../components/customer/QueueDisplay';

const QueueDisplayPage = () => {
  const { businessId, businessInfo } = useBusiness();

  return (
    <QueueDisplayComponent 
      businessId={businessId} 
      businessInfo={businessInfo} 
    />
  );
};

export default QueueDisplayPage;
