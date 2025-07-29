// frontend/src/components/admin/EmployeeManagement.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, Button, Input, Modal, Toggle, Badge } from '../shared';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', initials: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      await api.post('/employees', newEmployee);
      setShowAddModal(false);
      setNewEmployee({ name: '', initials: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleRegeneratePin = async (employeeId) => {
    try {
      const { data } = await api.post(`/employees/${employeeId}/regenerate-pin`);
      alert(`New PIN: ${data.pin}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error regenerating PIN:', error);
    }
  };

  const handleToggleAvailability = async (employeeId, isAvailable) => {
    try {
      await api.patch(`/employees/${employeeId}/availability`, { isAvailable });
      fetchEmployees();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  return (
    <div className="employee-management">
      <div className="section-header">
        <h2>Employee Management</h2>
        <Button onClick={() => setShowAddModal(true)}>
          Add Employee
        </Button>
      </div>

      <div className="employee-grid">
        {employees.map(employee => (
          <Card key={employee.id} className="employee-card">
            <div className="employee-header">
              <div className="employee-info">
                <h3>{employee.name}</h3>
                <Badge>{employee.initials}</Badge>
              </div>
              <Toggle
                checked={employee.isAvailable}
                onChange={(checked) => handleToggleAvailability(employee.id, checked)}
                label="Available"
              />
            </div>
            
            <div className="employee-details">
              <p>PIN: ****{employee.pin.slice(-2)}</p>
              <p>Active Customers: {employee.activeCustomerCount}</p>
              {employee.lastCheckIn && (
                <p>Last Check-in: {formatTime(employee.lastCheckIn)}</p>
              )}
            </div>

            <div className="employee-actions">
              <Button 
                size="small" 
                variant="secondary"
                onClick={() => handleRegeneratePin(employee.id)}
              >
                New PIN
              </Button>
              <Button 
                size="small"
                onClick={() => setSelectedEmployee(employee)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Employee"
      >
        <Input
          label="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          placeholder="Enter employee name"
        />
        <Input
          label="Initials (optional)"
          value={newEmployee.initials}
          onChange={(e) => setNewEmployee({ ...newEmployee, initials: e.target.value })}
          placeholder="e.g., JD"
          maxLength={3}
        />
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddEmployee}>
            Add Employee
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
