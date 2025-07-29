// frontend/src/components/shared/Input.jsx
import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  as = 'input',
  className = '',
  ...props
}) => {
  const Component = as;
  
  return (
    <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <Component className="input-field" {...props} />
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
};

export default Input;
