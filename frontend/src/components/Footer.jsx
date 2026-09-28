import React from 'react';
import { Calendar, GitBranch, ShieldCheck, Database, Server, Layers } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(10, 13, 20, 0.95)',
      padding: '48px 0 24px 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          marginBottom: '36px'
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                background: 'var(--accent-gradient)',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex'
              }}>
                <Calendar size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800 }}>
                Online Event Management System
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              A full-stack MERN platform built for scalable event publishing, dynamic attendee registrations, seat capacity management, and role-based access control.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'white' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a href="/" style={{ color: 'var(--text-secondary)' }}>Home Overview</a></li>
              <li><a href="/events" style={{ color: 'var(--text-secondary)' }}>Event Catalog</a></li>
              <li><a href="/login" style={{ color: 'var(--text-secondary)' }}>Organizer & User Login</a></li>
              <li><a href="/register" style={{ color: 'var(--text-secondary)' }}>Create Account</a></li>
            </ul>
          </div>

          {/* Technical Specs (Weeks 1 to 7) */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'white' }}>Architecture Milestones</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span className="badge badge-tech"><Server size={12} /> Node.js & Express</span>
              <span className="badge badge-tech"><Database size={12} /> MongoDB & Mongoose</span>
              <span className="badge badge-tech"><Layers size={12} /> React 19 & Vite</span>
              <span className="badge badge-workshop"><ShieldCheck size={12} /> Bcrypt & JWT (W7)</span>
              <span className="badge badge-conference">CRUD & Queries (W6)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
              Weeks 1–7 Milestones 100% Implemented & Verified
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} Online Event Management System. Built with MERN Stack.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Project Repository: dinu66384-rgb/ONLINE-EVENT-MANGEMENT-SYSTEM-</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
