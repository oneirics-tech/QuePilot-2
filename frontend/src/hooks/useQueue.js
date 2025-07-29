// frontend/src/hooks/useQueue.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSocket } from './useSocket';

export const useQueue = (businessId) => {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    fetchQueueStatus();

    if (socket) {
      socket.on('queue:updated', fetchQueueStatus);
      socket.on('customer:statusChanged', fetchQueueStatus);

      return () => {
        socket.off('queue:updated');
        socket.off('customer:statusChanged');
      };
    }
  }, [socket, businessId]);

  const fetchQueueStatus = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/queue/status?businessId=${businessId}`);
      setQueueStatus(data);
    } catch (error) {
      console.error('Error fetching queue status:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    queueStatus,
    loading,
    refetch: fetchQueueStatus
  };
};
