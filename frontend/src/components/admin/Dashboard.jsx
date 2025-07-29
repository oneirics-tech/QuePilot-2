// frontend/src/components/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { api } from '../../services/api';
import QueueView from './QueueView';
import EmployeeManagement from './EmployeeManagement';
import Analytics from './Analytics';
import WorkflowEditor from './WorkflowEditor';
import { Card, Tabs, Button, Badge, Modal } from '../shared';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [queueStatus, setQueueStatus] = useState(null);
  const [showCloseDay, setShowCloseDay] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    fetchQueueStatus();
    
    if (socket) {
      socket.on('queue:updated', fetchQueueStatus);
      socket.on('employee:statusChanged', fetchQueueStatus);
      
      return () => {
        socket.off('queue:updated');
        socket.off('employee:statusChanged');
      };
    }
  }, [socket]);

  const fetchQueueStatus = async () => {
    try {
      const { data } = await api.get('/queue/status');
      setQueueStatus(data);
    } catch (error) {
      console.error('Error fetching queue status:', error);
    }
  };

  const handleCloseDay = async () => {
    try {
      const { data } = await api.post('/admin/close-day');
      alert(`Day closed. ${data.closedCustomers} customers auto-completed.`);
      setShowCloseDay(false);
      fetchQueueStatus();
    } catch (error) {
      console.error('Error closing day:', error);
    }
  };

  const tabs = [
    { id: 'queue', label: 'Queue', badge: queueStatus?.totalInQueue },
    { id: 'employees', label: 'Employees' },
    { id: 'workflows', label: 'Workflows' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Queue Management Dashboard</h1>
        <Button 
          variant="danger" 
          onClick={() => setShowCloseDay(true)}
        >
          Close Out Day
        </Button>
      </div>

      <div className="dashboard-stats">
        <Card>
          <h3>Waiting</h3>
          <div className="stat-value">{queueStatus?.waiting?.length || 0}</div>
        </Card>
        <Card>
          <h3>Assigned</h3>
          <div className="stat-value">{queueStatus?.assigned?.length || 0}</div>
        </Card>
        <Card>
          <h3>In Progress</h3>
          <div className="stat-value">{queueStatus?.inProgress?.length || 0}</div>
        </Card>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
        {activeTab === 'queue' && <QueueView queueStatus={queueStatus} />}
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'workflows' && <WorkflowEditor />}
        {activeTab === 'analytics' && <Analytics />}
      </Tabs>

      <Modal
        isOpen={showCloseDay}
        onClose={() => setShowCloseDay(false)}
        title="Close Out Day"
      >
        <p>Are you sure you want to close out the day?</p>
        <p>This will mark all remaining customers as auto-completed.</p>
        <div className="modal-actions">
          <Button onClick={() => setShowCloseDay(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleCloseDay}>
            Close Day
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
