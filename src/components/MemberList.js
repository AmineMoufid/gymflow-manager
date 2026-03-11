import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';

function MemberList({ members, deleteMember, editMember }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMembershipPrice = (type) => {
    const prices = {
      monthly: '$49.99/mo',
      quarterly: '$129.99/3mo',
      yearly: '$399.99/yr'
    };
    return prices[type] || type;
  };

  const getMembershipColor = (type) => {
    const colors = {
      monthly: '#2563eb',
      quarterly: '#7c3aed',
      yearly: '#10b981'
    };
    return colors[type] || '#2563eb';
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.phone && member.phone.includes(searchTerm));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && member.active;
    if (filter === 'inactive') return matchesSearch && !member.active;
    return matchesSearch;
  });

  const calculateEndDate = (startDate, membership) => {
    const start = new Date(startDate);
    const end = new Date(start);
    
    switch(membership) {
      case 'monthly': end.setMonth(end.getMonth() + 1); break;
      case 'quarterly': end.setMonth(end.getMonth() + 3); break;
      case 'yearly': end.setFullYear(end.getFullYear() + 1); break;
      default: end.setMonth(end.getMonth() + 1);
    }
    
    return end.toLocaleDateString();
  };

  const getDaysRemaining = (startDate, membership) => {
    const end = new Date(calculateEndDate(startDate, membership));
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="member-list">
      <div className="list-header">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`filter-tab ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
          <button 
            className={`filter-tab ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Cards
          </button>
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({members.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({members.filter(m => m.active).length})
        </button>
        <button 
          className={`filter-tab ${filter === 'inactive' ? 'active' : ''}`}
          onClick={() => setFilter('inactive')}
        >
          Inactive ({members.filter(m => !m.active).length})
        </button>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="empty-state">
          <FiUsers size={48} />
          <h3>No members found</h3>
          <p>Try adjusting your search or add a new member</p>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            // Table View
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Contact</th>
                    <th>Membership</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => {
                    const daysRemaining = getDaysRemaining(member.startDate, member.membership);
                    return (
                      <tr key={member.id}>
                        <td>
                          <div className="member-info">
                            <div className="member-avatar">
                              {getInitials(member.name)}
                            </div>
                            {member.name}
                          </div>
                        </td>
                        <td>
                          <div>{member.email}</div>
                          <small>{member.phone}</small>
                        </td>
                        <td>
                          <span className="membership-badge" style={{
                            background: `${getMembershipColor(member.membership)}20`,
                            color: getMembershipColor(member.membership)
                          }}>
                            {getMembershipPrice(member.membership)}
                          </span>
                        </td>
                        <td>{new Date(member.startDate).toLocaleDateString()}</td>
                        <td>
                          <div>{calculateEndDate(member.startDate, member.membership)}</div>
                          <small style={{ color: daysRemaining < 7 ? '#ef4444' : '#10b981' }}>
                            {daysRemaining} days left
                          </small>
                        </td>
                        <td>
                          <span className={`status-badge ${member.active ? 'status-active' : 'status-inactive'}`}>
                            {member.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => editMember(member)}
                              title="Edit member"
                            >
                              <FiEdit2 />
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteMember(member.id)}
                              title="Delete member"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Grid/Card View
            <div className="members-grid">
              {filteredMembers.map((member) => {
                const daysRemaining = getDaysRemaining(member.startDate, member.membership);
                return (
                  <div key={member.id} className="member-card">
                    <div className="member-card-header">
                      <div className="member-card-avatar">
                        {getInitials(member.name)}
                      </div>
                      <span className={`member-card-status ${member.active ? 'status-active' : 'status-inactive'}`}>
                        {member.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="member-card-info">
                      <h3>{member.name}</h3>
                      <p>{member.email}</p>
                      <p>{member.phone}</p>
                    </div>

                    <div className="member-card-details">
                      <div className="detail-item">
                        <div className="label">Membership</div>
                        <div className="value" style={{ color: getMembershipColor(member.membership) }}>
                          {getMembershipPrice(member.membership)}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Days Left</div>
                        <div className="value" style={{ color: daysRemaining < 7 ? '#ef4444' : '#10b981' }}>
                          {daysRemaining}
                        </div>
                      </div>
                    </div>

                    <div className="member-card-actions">
                      <button 
                        className="edit-card-btn"
                        onClick={() => editMember(member)}
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button 
                        className="delete-card-btn"
                        onClick={() => deleteMember(member.id)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MemberList;