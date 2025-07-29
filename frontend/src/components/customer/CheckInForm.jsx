// frontend/src/components/customer/CheckInForm.jsx
import React, { useState } from 'react';
import { api } from '../../services/api';
import { Card, Button, Input } from '../shared';
import ConfirmationScreen from './ConfirmationScreen';

const CheckInForm = ({ businessId, businessInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: ''
  });
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await api.post('/customers/check-in', {
        ...formData,
        businessId
      });
      
      setConfirmation({
        queueNumber: data.queueNumber,
        customerName: formData.name,
        hasEmail: !!formData.email
      });
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Error checking in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCheckIn = () => {
    setFormData({ name: '', email: '', reason: '' });
    setConfirmation(null);
    setErrors({});
  };

  if (confirmation) {
    return (
      <ConfirmationScreen 
        confirmation={confirmation}
        businessInfo={businessInfo}
        onNewCheckIn={handleNewCheckIn}
      />
    );
  }

  return (
    <div 
      className="check-in-container"
      style={{
        '--primary-color': businessInfo?.primaryColor || '#4F46E5',
        '--secondary-color': businessInfo?.secondaryColor || '#10B981',
        fontFamily: businessInfo?.fontFamily || 'Inter'
      }}
    >
      <Card className="check-in-card">
        <div className="business-header">
          {businessInfo?.logo && (
            <img src={businessInfo.logo} alt={businessInfo.name} className="business-logo" />
          )}
          <h1>{businessInfo?.name || 'Welcome'}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <h2>Customer Check-In</h2>
          
          <Input
            label="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Email (optional)"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="your@email.com"
            helperText="We'll notify you when it's your turn"
          />

          <Input
            label="Reason for Visit (optional)"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="e.g., Haircut, Consultation"
            as="textarea"
            rows={3}
          />

          <Button 
            type="submit" 
            fullWidth 
            size="large"
            disabled={loading}
          >
            {loading ? 'Checking in...' : 'Check In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CheckInForm;
