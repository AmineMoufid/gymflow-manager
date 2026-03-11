import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';

function MemberList({ members, deleteMember, editMember }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

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

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  return (
    <div className="member-list">
      <div className="list-header">
        <h2>Members Directory</h2>
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Members
        </button>
        <button 
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`filter-tab ${filter === 'inactive' ? 'active' : ''}`}
          onClick={() => setFilter('inactive')}
        >
          Inactive
        </button>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="empty-state">
          <FiUsers />
          <h3>No members found</h3>
          <p>Add your first member to get started</p>
        </div>
      ) : (
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
              {filteredMembers.map((member) => (
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
                    <span className="membership-badge">
                      {getMembershipPrice(member.membership)}
                    </span>
                  </td>
                  <td>{new Date(member.startDate).toLocaleDateString()}</td>
                  <td>{calculateEndDate(member.startDate, member.membership)}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MemberList;