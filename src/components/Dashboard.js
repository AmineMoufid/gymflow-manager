import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiUserX, FiDollarSign, FiPlus } from 'react-icons/fi';
import MemberModal from './MemberModal';
import MemberList from './MemberList';
import StatsCard from './StatsCard';

function Dashboard() {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Load members from localStorage
  useEffect(() => {
    const savedMembers = localStorage.getItem('gymMembers');
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    } else {
      // Add some sample data
      const sampleMembers = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          membership: 'yearly',
          startDate: '2024-01-15',
          active: true,
          joinDate: '2024-01-15T00:00:00.000Z'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '(555) 234-5678',
          membership: 'monthly',
          startDate: '2024-03-01',
          active: true,
          joinDate: '2024-03-01T00:00:00.000Z'
        },
        {
          id: '3',
          name: 'Mike Wilson',
          email: 'mike@example.com',
          phone: '(555) 345-6789',
          membership: 'quarterly',
          startDate: '2024-02-10',
          active: false,
          joinDate: '2024-02-10T00:00:00.000Z'
        }
      ];
      setMembers(sampleMembers);
      localStorage.setItem('gymMembers', JSON.stringify(sampleMembers));
    }
  }, []);

  // Save to localStorage whenever members change
  useEffect(() => {
    localStorage.setItem('gymMembers', JSON.stringify(members));
    
    // Update header stats
    const activeCount = members.filter(m => m.active).length;
    const totalRevenue = members.reduce((sum, member) => {
      if (!member.active) return sum;
      const prices = { monthly: 49.99, quarterly: 129.99, yearly: 399.99 };
      return sum + (prices[member.membership] || 0);
    }, 0);
    
    const activeElement = document.getElementById('active-count');
    const revenueElement = document.getElementById('revenue');
    if (activeElement) activeElement.textContent = activeCount;
    if (revenueElement) revenueElement.textContent = `$${totalRevenue.toFixed(2)}`;
  }, [members]);

  const addMember = (member) => {
    setMembers([...members, member]);
    setIsModalOpen(false);
  };

  const updateMember = (updatedMember) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const deleteMember = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const stats = {
    total: members.length,
    active: members.filter(m => m.active).length,
    inactive: members.filter(m => !m.active).length,
    revenue: members.reduce((sum, member) => {
      if (!member.active) return sum;
      const prices = { monthly: 49.99, quarterly: 129.99, yearly: 399.99 };
      return sum + (prices[member.membership] || 0);
    }, 0)
  };

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatsCard 
          icon={<FiUsers />}
          title="Total Members"
          value={stats.total}
          color="linear-gradient(135deg, #2563eb, #7c3aed)"
        />
        <StatsCard 
          icon={<FiUserCheck />}
          title="Active Members"
          value={stats.active}
          color="linear-gradient(135deg, #10b981, #059669)"
        />
        <StatsCard 
          icon={<FiUserX />}
          title="Inactive Members"
          value={stats.inactive}
          color="linear-gradient(135deg, #f59e0b, #d97706)"
        />
        <StatsCard 
          icon={<FiDollarSign />}
          title="Monthly Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          color="linear-gradient(135deg, #ef4444, #dc2626)"
        />
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <span className="label">Today's Check-ins:</span>
          <span className="value">12</span>
        </div>
        <div className="quick-stat">
          <span className="label">Expiring this week:</span>
          <span className="value">5</span>
        </div>
        <div className="quick-stat">
          <span className="label">New this month:</span>
          <span className="value">8</span>
        </div>
      </div>

      <div className="main-grid">
        <div className="list-header">
          <div className="list-header-left">
            <h2>Members Directory</h2>
            <span className="total-badge">{stats.total} total</span>
          </div>
          <button className="add-member-btn" onClick={openAddModal}>
            <FiPlus /> Add New Member
          </button>
        </div>
        
        <MemberList 
          members={members}
          deleteMember={deleteMember}
          editMember={openEditModal}
        />
      </div>

      {isModalOpen && (
        <MemberModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          addMember={addMember}
          updateMember={updateMember}
          editingMember={editingMember}
        />
      )}
    </div>
  );
}

export default Dashboard;