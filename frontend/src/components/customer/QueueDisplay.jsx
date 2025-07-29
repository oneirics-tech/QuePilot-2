// frontend/src/components/customer/QueueDisplay.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { Card } from '../shared';

const QueueDisplay = ({ businessId, businessInfo }) => {
  const [queueStatus, setQueueStatus] = useState(null);
  const [currentlyServing, setCurrentlyServing] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    fetchQueueStatus();

    if (socket) {
      socket.on('queue:updated', fetchQueueStatus);
      
      return () => {
        socket.off('queue:updated');
      };
    }
  }, [socket]);

  const fetchQueueStatus = async () => {
    try {
      const { data } = await api.get(`/queue/status?businessId=${businessId}`);
      setQueueStatus(data);
      
      // Get currently serving customers
      const serving = data.inProgress?.slice(0, 5) || [];
      setCurrentlyServing(serving);
    } catch (error) {
      console.error('Error fetching queue status:', error);
    }
  };

  return (
    <div 
      className="queue-display"
      style={{
        '--primary-color': businessInfo?.primaryColor || '#4F46E5',
        '--secondary-color': businessInfo?.secondaryColor || '#10B981',
        fontFamily: businessInfo?.fontFamily || 'Inter'
      }}
    >
      <div className="display-header">
        <h1>{businessInfo?.name || 'Queue Display'}</h1>
        <div className="queue-stats">
          <div className="stat">
            <span className="stat-label">Waiting</span>
            <span className="stat-value">{queueStatus?.waiting?.length || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">In Service</span>
            <span className="stat-value">{queueStatus?.inProgress?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="display-content">
        <Card className="now-serving">
          <h2>Now Serving</h2>
          <div className="serving-list">
            {currentlyServing.length > 0 ? (
              currentlyServing.map(customer => (
                <div key={customer.id} className="serving-item">
                  <span className="queue-number">#{customer.queueNumber}</span>
                  <span className="customer-name">{customer.name}</span>
                  {customer.assignedEmployee && (
                    <span className="employee-name">
                      with {customer.assignedEmployee.name}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="no-serving">No customers currently being served</p>
            )}
          </div>
        </Card>

        <Card className="waiting-list">
          <h2>Waiting</h2>
          <div className="waiting-numbers">
            {queueStatus?.waiting?.slice(0, 10).map(customer => (
              <div key={customer.id} className="waiting-number">
                #{customer.queueNumber}
              </div>
            ))}
          </div>
          {queueStatus?.waiting?.length > 10 && (
            <p className="more-waiting">
              +{queueStatus.waiting.length - 10} more waiting
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QueueDisplay;
