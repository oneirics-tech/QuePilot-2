// frontend/src/components/customer/ConfirmationScreen.jsx
import React from 'react';
import { Card, Button } from '../shared';

const ConfirmationScreen = ({ confirmation, businessInfo, onNewCheckIn }) => {
  return (
    <div 
      className="confirmation-container"
      style={{
        '--primary-color': businessInfo?.primaryColor || '#4F46E5',
        '--secondary-color': businessInfo?.secondaryColor || '#10B981',
        fontFamily: businessInfo?.fontFamily || 'Inter'
      }}
    >
      <Card className="confirmation-card">
        <div className="success-icon">✓</div>
        
        <h1>Check-In Successful!</h1>
        
        <div className="queue-number">
          <span>Your Queue Number</span>
          <div className="number">#{confirmation.queueNumber}</div>
        </div>

        <div className="confirmation-details">
          <p>Thank you, {confirmation.customerName}!</p>
          {confirmation.hasEmail && (
            <p className="email-notice">
              We'll send you an email when your service provider is ready for you.
            </p>
          )}
        </div>

        <Button 
          onClick={onNewCheckIn}
          variant="secondary"
          fullWidth
        >
          New Check-In
        </Button>
      </Card>
    </div>
  );
};

export default ConfirmationScreen;
