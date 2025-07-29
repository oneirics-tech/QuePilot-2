// frontend/src/components/shared/Badge.jsx
import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;