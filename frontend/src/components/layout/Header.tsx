// src/components/layout/Header.tsx
import React from 'react';
import { Settings, Database } from 'lucide-react';
import { StreamSimulator } from '../StreamSimulator';

interface HeaderProps {
  viewMode: 'dashboard' | 'diagnostics';
  onToggleView: () => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, onToggleView }) => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      borderBottom: '1px solid #eaeaea',
      paddingBottom: '1.5rem'
    }}>
      <div>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: 0, color: '#0a0a0a' }}>
          CloudDB Control Plane
        </h1>
        <p style={{ color: '#666666', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
          Telemetry Operations Workspace • Persistent Browser Streams
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleView}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            borderRadius: '6px',
            border: '1px solid #eaeaea',
            backgroundColor: viewMode === 'diagnostics' ? '#0a0a0a' : '#ffffff',
            color: viewMode === 'diagnostics' ? '#ffffff' : '#0a0a0a',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease'
          }}
        >
          {viewMode === 'dashboard' ? <Settings size={14} /> : <Database size={14} />}
          <span>{viewMode === 'dashboard' ? 'Open Engine Settings' : 'Back to Dashboard'}</span>
        </button>
        <StreamSimulator />
      </div>
    </header>
  );
};