import React from 'react';
import { FaDumbbell } from 'react-icons/fa';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <FaDumbbell className="gym-icon" color="#2563eb" />
          <h1>GymFlow Manager</h1>
        </div>
        <div className="header-stats">
          <div className="header-stat">
            <div className="label">Active Members</div>
            <div className="value" id="active-count">0</div>
          </div>
          <div className="header-stat">
            <div className="label">Monthly Revenue</div>
            <div className="value" id="revenue">$0</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;