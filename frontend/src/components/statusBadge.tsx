import React from 'react';

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = (status || 'unknown').toLowerCase();
  const variant =
    s === 'active' ? 'bg-success-subtle text-success' :
    s === 'frozen' ? 'bg-warning-subtle text-warning' :
    'bg-secondary-subtle text-secondary';

  return (
    <span className={`badge rounded-pill px-3 py-2 fw-semibold text-capitalize ${variant}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;