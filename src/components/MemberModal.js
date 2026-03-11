import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit, FiX } from 'react-icons/fi';

function MemberModal({ isOpen, onClose, addMember, updateMember, editingMember }) {
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
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        membership: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        active: true
      });
    }
    setErrors({});
  }, [editingMember, isOpen]);

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
    if (!formData.phone.match(/^[\d\s\-\(\)]+$/)) {
      newErrors.phone = 'Invalid phone format';
    }
    
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
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  // Calculate end date based on start date and membership
  const calculateEndDate = () => {
    if (!formData.startDate) return '';
    const start = new Date(formData.startDate);
    const end = new Date(start);
    
    switch(formData.membership) {
      case 'monthly': end.setMonth(end.getMonth() + 1); break;
      case 'quarterly': end.setMonth(end.getMonth() + 3); break;
      case 'yearly': end.setFullYear(end.getFullYear() + 1); break;
      default: end.setMonth(end.getMonth() + 1);
    }
    
    return end.toLocaleDateString();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {editingMember ? <FiEdit /> : <FiUserPlus />}
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
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
              <label>Email *</label>
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
              <label>Phone *</label>
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
                <option value="monthly">Monthly - $49.99/month</option>
                <option value="quarterly">Quarterly - $129.99/3 months</option>
                <option value="yearly">Yearly - $399.99/year</option>
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
              <small style={{ color: 'var(--gray)', marginTop: '0.25rem', display: 'block' }}>
                Membership ends: {calculateEndDate()}
              </small>
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

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="submit-btn" style={{ flex: 2 }}>
                {editingMember ? 'Update Member' : 'Add Member'}
              </button>
              <button 
                type="button" 
                className="submit-btn" 
                style={{ flex: 1, background: '#64748b' }}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MemberModal;