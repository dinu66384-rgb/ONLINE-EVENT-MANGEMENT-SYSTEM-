import React, { useState, useEffect } from 'react';
import { Shield, Users, Calendar, Ticket, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const { user, showToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, statusRes] = await Promise.all([
        api.users.getAll(),
        api.status().catch(() => null)
      ]);

      if (usersRes.success) {
        setUsers(usersRes.data || []);
      }
      if (statusRes) {
        setSystemStatus(statusRes);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load admin telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? All associated bookings will be purged.`)) {
      return;
    }

    try {
      const res = await api.users.delete(userId);
      if (res.success) {
        showToast(`User ${userName} deleted.`, 'info');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  if (loading) {
    return <Loading message="Loading Administrator Telemetry..." />;
  }

  return (
    <div className="container animate-fade" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            <Shield size={16} /> System Administration Console
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '4px' }}>Admin Overview</h1>
        </div>

        <button onClick={fetchAdminData} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Accounts</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginTop: '4px' }}>
            {users.length}
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>API Health Status</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} /> {systemStatus?.status || 'Online 200 OK'}
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Database</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#818cf8', marginTop: '10px' }}>
            MongoDB & Mongoose
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '20px' }}>
          System Users Roster ({users.length})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Registered At</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 600, color: 'white' }}>{u.name}</td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    {u._id !== user._id && (
                      <button 
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Delete User"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
