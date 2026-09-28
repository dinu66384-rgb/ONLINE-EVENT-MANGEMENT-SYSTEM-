import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Calendar, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser, logout, showToast } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    setSaving(true);
    try {
      const res = await api.users.updateProfile(user._id, { name, phone });
      if (res.success && res.data) {
        updateUser(res.data);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container animate-fade" style={{ padding: '50px 24px 80px 24px', maxWidth: '680px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Account Profile</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your personal details and view your role permissions
        </p>
      </div>

      <div className="card" style={{ padding: '36px', marginBottom: '30px' }}>
        
        {/* User Avatar & Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'white',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <span className={`badge badge-${user.role}`}>
                <Shield size={12} /> {user.role.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                ID: #{user._id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email"
                disabled
                className="form-input"
                value={user.email}
                style={{ paddingLeft: '40px', opacity: 0.7, cursor: 'not-allowed' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Contact Phone</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="tel"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>

            <button 
              type="button" 
              onClick={logout}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};

export default Profile;
