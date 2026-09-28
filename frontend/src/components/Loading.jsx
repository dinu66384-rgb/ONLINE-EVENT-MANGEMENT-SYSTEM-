import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading details...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      gap: '16px',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        animation: 'spin 1s linear infinite',
        color: 'var(--accent-primary)'
      }}>
        <Loader2 size={36} />
      </div>
      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
