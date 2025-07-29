// frontend/src/components/shared/Toggle.jsx
import React from 'react';

const Toggle = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className="toggle-container">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="toggle-input"
      />
      <span className="toggle-slider"></span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
};

export default Toggle;
