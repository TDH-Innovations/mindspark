import React from 'react';
import './ProgressIndicator.css';

interface ProgressIndicatorProps {
  completed: number;
  total: number;
  label?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  completed,
  total,
  label = 'Progress',
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="progress-indicator">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-text">
          {completed} / {total}
        </span>
      </div>
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        >
          {percentage === 100 && <span className="complete-icon">✓</span>}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
