import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit } from 'react-icons/fi';

function MemberForm({ addMember, updateMember, editingMember, setEditingMember }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membership: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    active: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || '',
        email: editingMember.email || '',
        phone: editingMember.phone || '',
        membership: editingMember.membership || 'monthly',
        startDate: editingMember.startDate || new Date().toISOString().split('T')[0],
        active: editingMember.active !== undefined ? editingMember.active : true
      });
    }
  }, [editingMember]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const memberData = {
      ...formData,
      id: editingMember ? editingMember.id : Date.now().toString(),
      joinDate: editingMember ? editingMember.joinDate : new Date().toISOString()
    };

    if (editingMember) {
      updateMember(memberData);
    } else {
      addMember(memberData);
    }

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      membership: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      active: true
    });
    setEditingMember(null);
  };

  const handleCancel = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      membership: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      active: true
    });
    setErrors({});
  };

  return (
    <div className="member-form">
      <div className="form-header">
        {editingMember ? <FiEdit /> : <FiUserPlus />}
        <h2>{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Membership Type</label>
          <select name="membership" value={formData.membership} onChange={handleChange}>
            <option value="monthly">Monthly - $49.99</option>
            <option value="quarterly">Quarterly - $129.99</option>
            <option value="yearly">Yearly - $399.99</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          <label>Active Member</label>
        </div>

        <button type="submit" className="submit-btn">
          {editingMember ? 'Update Member' : 'Add Member'}
        </button>

        {editingMember && (
          <button 
            type="button" 
            className="submit-btn" 
            style={{ background: '#64748b', marginTop: '0.5rem' }}
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default MemberForm;