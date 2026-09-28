import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  PlusCircle, 
  Ticket, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Calendar size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              color: '#ffffff',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              EventFlow <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '4px', color: '#818cf8' }}>MERN</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-links">
          <Link 
            to="/" 
            style={{ 
              fontWeight: 500, 
              fontSize: '0.92rem',
              color: isActive('/') ? '#818cf8' : '#cbd5e1' 
            }}
          >
            Home
          </Link>
          <Link 
            to="/events" 
            style={{ 
              fontWeight: 500, 
              fontSize: '0.92rem',
              color: isActive('/events') ? '#818cf8' : '#cbd5e1' 
            }}
          >
            Browse Events
          </Link>

          {isAuthenticated && (
            <Link 
              to="/my-registrations" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontWeight: 500, 
                fontSize: '0.92rem',
                color: isActive('/my-registrations') ? '#818cf8' : '#cbd5e1' 
              }}
            >
              <Ticket size={16} /> My Bookings
            </Link>
          )}

          {(user?.role === 'organizer' || user?.role === 'admin') && (
            <Link 
              to="/events/create" 
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PlusCircle size={15} /> Host Event
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontWeight: 600, 
                color: '#f87171',
                fontSize: '0.92rem'
              }}
            >
              <ShieldAlert size={16} /> Admin Console
            </Link>
          )}
        </div>

        {/* User Status / Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link 
                to="/profile" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  textDecoration: 'none'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'white'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', lineHeight: 1 }}>{user.name}</span>
                  <span className={`badge badge-${user.role}`} style={{ fontSize: '0.68rem', padding: '1px 6px', marginTop: '2px' }}>
                    {user.role}
                  </span>
                </div>
              </Link>

              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} /> Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} /> Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              display: 'none', 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer' 
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          padding: '16px 24px',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)}>Browse Events</Link>
          {isAuthenticated && (
            <Link to="/my-registrations" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
          )}
          {(user?.role === 'organizer' || user?.role === 'admin') && (
            <Link to="/events/create" onClick={() => setMobileMenuOpen(false)}>Host Event</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Console</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
