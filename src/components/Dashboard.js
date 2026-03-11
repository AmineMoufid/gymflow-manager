import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiUserX, FiDollarSign } from 'react-icons/fi';
import MemberForm from './MemberForm';
import MemberList from './MemberList';
import StatsCard from './StatsCard';

function Dashboard() {
  const [members, setMembers] = useState([]);
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
    
    document.getElementById('active-count').textContent = activeCount;
    document.getElementById('revenue').textContent = `$${totalRevenue.toFixed(2)}`;
  }, [members]);

  const addMember = (member) => {
    setMembers([...members, member]);
  };

  const updateMember = (updatedMember) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const deleteMember = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
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

      <div className="main-grid">
        <MemberForm 
          addMember={addMember}
          updateMember={updateMember}
          editingMember={editingMember}
          setEditingMember={setEditingMember}
        />
        <MemberList 
          members={members}
          deleteMember={deleteMember}
          editMember={setEditingMember}
        />
      </div>
    </div>
  );
}

export default Dashboard;