// frontend/src/utils/helpers.js
export const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };
  
  export const formatWaitTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${mins}m`;
  };
  
  export const generateQueueNumber = (number) => {
    return number.toString().padStart(3, '0');
  };
  
  export const getStatusColor = (status) => {
    const colors = {
      waiting: 'var(--warning)',
      assigned: 'var(--info)',
      in_progress: 'var(--success)',
      completed: 'var(--gray-500)',
      auto_closed: 'var(--gray-400)'
    };
    
    return colors[status] || 'var(--gray-500)';
  };
  
  export const debounce = (func, delay) => {
    let timeoutId;
    
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };
  