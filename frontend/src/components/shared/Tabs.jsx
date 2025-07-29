// frontend/src/components/shared/Tabs.jsx
import React from 'react';
import Badge from './Badge';

const Tabs = ({ tabs, activeTab, onChange, children }) => {
  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {tab.badge && <Badge variant="info">{tab.badge}</Badge>}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {children}
      </div>
    </div>
  );
};

export default Tabs;
