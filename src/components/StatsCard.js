import React from 'react';

function StatsCard({ icon, title, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color || 'var(--gradient)' }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}

export default StatsCard;