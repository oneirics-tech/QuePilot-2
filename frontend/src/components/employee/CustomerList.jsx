// frontend/src/components/employee/CustomerList.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { Card, Button, Badge } from '../shared';
import WorkflowProgress from './WorkflowProgress';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    fetchMyCustomers();

    if (socket) {
      socket.on('customer:assigned', fetchMyCustomers);
      socket.on('customer:reassigned', fetchMyCustomers);
      socket.on('customer:updated', fetchMyCustomers);

      return () => {
        socket.off('customer:assigned');
        socket.off('customer:reassigned');
        socket.off('customer:updated');
      };
    }
  }, [socket]);

  const fetchMyCustomers = async () => {
    try {
      const { data } = await api.get('/customers/my-customers');
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleReadyToBegin = async (customerId) => {
    try {
      await api.post(`/customers/${customerId}/ready`);
      fetchMyCustomers();
    } catch (error) {
      console.error('Error marking customer ready:', error);
    }
  };

  const handleReassign = async (customerId) => {
    if (!confirm('Reassign this customer back to the queue?')) return;

    try {
      await api.post(`/customers/${customerId}/reassign`);
      fetchMyCustomers();
    } catch (error) {
      console.error('Error reassigning customer:', error);
    }
  };

  if (customers.length === 0) {
    return (
      <div className="no-customers">
        <Card>
          <h3>No Customers Assigned</h3>
          <p>You'll see customers here once they're assigned to you.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="customer-list">
      <h2>My Customers ({customers.length})</h2>
      
      <div className="customer-grid">
        {customers.map(customer => (
          <Card key={customer.id} className="customer-card">
            <div className="customer-header">
              <h3>#{customer.queueNumber} - {customer.name}</h3>
              <Badge variant={customer.status}>
                {customer.status.replace('_', ' ')}
              </Badge>
            </div>

            {customer.reason && (
              <p className="customer-reason">Reason: {customer.reason}</p>
            )}

            <div className="customer-timing">
              <p>Wait time: {calculateWaitTime(customer.checkInTime, customer.readyTime)}</p>
            </div>

            <WorkflowProgress
              customer={customer}
              onStepChange={(step) => handleWorkflowStepChange(customer.id, step)}
            />

            <div className="customer-actions">
              {customer.status === 'assigned' && !customer.readyTime && (
                <Button 
                  onClick={() => handleReadyToBegin(customer.id)}
                  variant="primary"
                >
                  Ready to Begin
                </Button>
              )}
              
              <Button
                onClick={() => handleReassign(customer.id)}
                variant="secondary"
                size="small"
              >
                Reassign
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const calculateWaitTime = (checkInTime, readyTime) => {
  const start = new Date(checkInTime);
  const end = readyTime ? new Date(readyTime) : new Date();
  const minutes = Math.floor((end - start) / 60000);
  
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
};

export default CustomerList;
