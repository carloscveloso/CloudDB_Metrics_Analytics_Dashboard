import React, { useState } from 'react';
import { Server, Cpu } from 'lucide-react';
import { NetworkPerformanceConsole } from './NetworkPerformanceConsole';
import { StorageMonitor } from './StorageMonitor';

interface SidebarTabsProps {
  streamTick: number;
  // This prop will receive your clean clusters list from the main file
  children: React.ReactNode; 
}

export const SidebarTabs: React.FC<SidebarTabsProps> = ({ streamTick, children }) => {
  // Toggle between 'clusters' view and 'engines' view
  const [activeTab, setActiveTab] = useState<'clusters' | 'engines'>('clusters');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      
      {/* Navigation Tab Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        backgroundColor: '#f1f5f9',
        padding: '4px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <button
          onClick={() => setActiveTab('clusters')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.6rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeTab === 'clusters' ? '#fff' : 'transparent',
            boxShadow: activeTab === 'clusters' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            color: activeTab === 'clusters' ? '#1e293b' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          <Server size={14} />
          <span>Active Clusters</span>
        </button>

        <button
          onClick={() => setActiveTab('engines')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.6rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeTab === 'engines' ? '#fff' : 'transparent',
            boxShadow: activeTab === 'engines' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            color: activeTab === 'engines' ? '#1e293b' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          <Cpu size={14} />
          <span>Engine Settings</span>
        </button>
      </div>

      {/* Conditionally render the active viewport panel */}
      <div style={{ minHeight: '200px' }}>
        {activeTab === 'clusters' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Renders your original loop of GCP, Azure, and AWS clusters */}
            {children}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Engineering metrics consolidated away from the cluster list */}
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                DIAGNOSTICS & SYSTEM CHAOS
              </h4>
              <NetworkPerformanceConsole />
            </div>
            
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                LOCAL PERSISTENCE LAYER
              </h4>
              <StorageMonitor streamTick={streamTick} />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
