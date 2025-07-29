// frontend/src/components/admin/QueueView.jsx
import React, { useState } from 'react';
import { api } from '../../services/api';
import { Card, Button, Badge, Select } from '../shared';
import { formatTime } from '../../utils/helpers';

const QueueView = ({ queueStatus }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [availableEmployees, setAvailableEmployees] = useState([]);

  const handleAssign = async (customerId, employeeId) => {
    try {
      await api.post('/queue/assign', { customerId, employeeId });
    } catch (error) {
      console.error('Error assigning customer:', error);
    }
  };

  const handleReassign = async (customerId, fromEmployeeId) => {
    try {
      await api.post(`/customers/${customerId}/reassign`, { fromEmployeeId });
    } catch (error) {
      console.error('Error reassigning customer:', error);
    }
  };

  const CustomerCard = ({ customer, status }) => (
    <Card className="customer-card">
      <div className="customer-header">
        <h4>#{customer.queueNumber} - {customer.name}</h4>
        <Badge variant={status}>{status}</Badge>
      </div>
      <div className="customer-details">
        {customer.reason && <p>Reason: {customer.reason}</p>}
        <p>Check-in: {formatTime(customer.checkInTime)}</p>
        {customer.assignedEmployee && (
          <p>Assigned to: {customer.assignedEmployee.name}</p>
        )}
        <p>Current Step: {customer.currentWorkflowStep}</p>
      </div>
      <div className="customer-actions">
        {status === 'waiting' && (
          <Button 
            size="small"
            onClick={() => setSelectedCustomer(customer)}
          >
            Assign
          </Button>
        )}
        {(status === 'assigned' || status === 'in_progress') && (
          <Button 
            size="small"
            variant="secondary"
            onClick={() => handleReassign(customer.id, customer.assignedEmployeeId)}
          >
            Reassign
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="queue-view">
      <div className="queue-columns">
        <div className="queue-column">
          <h3>Waiting ({queueStatus?.waiting?.length || 0})</h3>
          {queueStatus?.waiting?.map(customer => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              status="waiting"
            />
          ))}
        </div>

        <div className="queue-column">
          <h3>Assigned ({queueStatus?.assigned?.length || 0})</h3>
          {queueStatus?.assigned?.map(customer => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              status="assigned"
            />
          ))}
        </div>

        <div className="queue-column">
          <h3>In Progress ({queueStatus?.inProgress?.length || 0})</h3>
          {queueStatus?.inProgress?.map(customer => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              status="in_progress"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueueView;
