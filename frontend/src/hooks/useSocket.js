// frontend/src/hooks/useSocket.js
import { useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export const useSocket = () => {
  return useContext(SocketContext);
};
