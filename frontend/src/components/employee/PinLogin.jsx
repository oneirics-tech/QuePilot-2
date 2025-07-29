// frontend/src/components/employee/PinLogin.jsx
import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button } from '../shared';

const PinLogin = ({ businessId }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const inputRefs = useRef([]);

  const handlePinChange = (index, value) => {
    if (value.length > 1) return;
    
    const newPin = pin.split('');
    newPin[index] = value;
    setPin(newPin.join(''));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/employees/check-in', {
        pin,
        businessId
      });

      login(data.token, data.employee, 'employee');
    } catch (error) {
      setError('Invalid PIN');
      setPin('');
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-login-container">
      <Card className="pin-login-card">
        <h2>Employee Check-In</h2>
        <p>Enter your PIN to check in</p>

        <form onSubmit={handleSubmit}>
          <div className="pin-inputs">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={pin[index] || ''}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="pin-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <Button 
            type="submit" 
            fullWidth 
            disabled={loading || pin.length < 4}
          >
            {loading ? 'Checking in...' : 'Check In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PinLogin;
