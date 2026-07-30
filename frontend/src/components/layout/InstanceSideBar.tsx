// src/components/layout/InstanceSidebar.tsx
import React from 'react';
import { Globe, Server } from 'lucide-react';
import type { DBInstance } from '../../types';

interface InstanceSidebarProps {
  instances: DBInstance[];
  selectedInstance: string | null;
  onSelectInstance: (id: string) => void;
}

const getClusterBrand = (provider: string) => {
  switch (provider?.toLowerCase()) {
    case 'gcp':
      return { label: 'GCP', text: '#1e3a8a', bg: '#dbeafe' };
    case 'aws':
      return { label: 'AWS', text: '#7c2d12', bg: '#ffedd5' };
    case 'azure':
      return { label: 'AZURE', text: '#1e3a8a', bg: '#e0f2fe' };
    default:
      return { label: provider?.toUpperCase() || 'CLOUD', text: '#334155', bg: '#f1f5f9' };
  }
};

export const InstanceSidebar: React.FC<InstanceSidebarProps> = ({
  instances,
  selectedInstance,
  onSelectInstance,
}) => {
  return (
    <aside style={{ gridColumn: 'span 1' }}>
      <h2 style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        marginBottom: '1.25rem',
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Active Clusters
      </h2>

      {instances.map((inst) => {
        const brand = getClusterBrand(inst.provider);
        const isActive = selectedInstance === inst.id;

        return (
          <button
            key={inst.id}
            onClick={() => onSelectInstance(inst.id)}
            style={{
              width: '100%',
              padding: '1.2rem',
              textAlign: 'left',
              backgroundColor: '#ffffff',
              border: isActive ? '1px solid #000000' : '1px solid #eaeaea',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.03)' : '0 1px 2px rgba(0,0,0,0.01)',
              transition: 'all 0.15s ease',
              marginBottom: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: brand.text,
                backgroundColor: brand.bg,
                padding: '0.15rem 0.4rem',
                borderRadius: '4px'
              }}>
                {brand.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#666666' }}>
                <Globe size={11} />
                <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>{inst.region}</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.6rem',
              width: '100%'
            }}>
              <div style={{ display: 'flex', flexShrink: 0, color: isActive ? '#0a0a0a' : '#999999' }}>
                <Server size={14} />
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#0a0a0a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {inst.name}
              </div>
            </div>

            <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: inst.status === 'healthy' ? '#0070f3' : '#f5a623'
              }} />
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: inst.status === 'healthy' ? '#0070f3' : '#f5a623'
              }}>
                {inst.status}
              </span>
            </div>
          </button>
        );
      })}
    </aside>
  );
};