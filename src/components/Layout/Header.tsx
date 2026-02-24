import React from 'react';
import './Header.css';

interface HeaderProps {
  onStatsClick: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStatsClick, onHomeClick }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo" onClick={onHomeClick}>
          <span className="logo-icon">🧠</span>
          <h1 className="logo-text">Brain Boost</h1>
        </div>
        <button className="stats-icon-button" onClick={onStatsClick} title="View Statistics">
          📊
        </button>
      </div>
    </header>
  );
};

export default Header;
