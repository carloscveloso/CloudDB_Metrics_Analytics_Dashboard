import React from 'react';
import { HardDrive, AlertTriangle } from 'lucide-react';
import { useStorageQuota } from '../hooks/useStorageQuota';

interface StorageMonitorProps {
  // Pass the state or timestamp that updates when the StreamSimulator writes to Dexie
  streamTick: number; 
}

export const StorageMonitor: React.FC<StorageMonitorProps> = ({ streamTick }) => {
  const { usedMB, totalMB, percentage, supported } = useStorageQuota(streamTick);

  if (!supported) {
    return (
      <div style={{ padding: '0.75rem', backgroundColor: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '0.75rem', color: '#6c757d' }}>
        Storage Manager API is not supported by this browser.
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      fontFamily: 'monospace',
      fontSize: '0.8rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      {/* Header section with engine label and percentage */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#495057', fontWeight: 'bold' }}>
          <HardDrive size={14} style={{ color: '#198754' }} />
          <span>INDEXEDDB ENGINE STORAGE</span>
        </div>
        <span style={{ color: '#6c757d' }}>{percentage.toFixed(3)}%</span>
      </div>

      {/* Custom Progress Bar */}
      <div style={{ width: '100%', backgroundColor: '#e9ecef', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ 
          backgroundColor: '#198754', 
          height: '100%', 
          width: `${Math.max(percentage * 100, 2)}%`, 
          transition: 'all 0.5s ease-in-out' 
        }} />
      </div>

      {/* Detailed Metrics Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div>
          <span style={{ color: '#6c757d', display: 'block', fontSize: '0.65rem' }}>USED SPACE</span>
          <span style={{ fontWeight: 'bold', color: '#212529' }}>{usedMB} MB</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: '#6c757d', display: 'block', fontSize: '0.65rem' }}>BROWSER QUOTA</span>
          <span style={{ color: '#6c757d' }}>{Math.round(totalMB / 1024)} GB</span>
        </div>
      </div>

      {/* Technical Audit Alert Footer */}
      <div style={{ 
        paddingTop: '0.5rem', 
        borderTop: '1px dashed #dee2e6', 
        display: 'flex', 
        alignItems: 'start', 
        gap: '0.4rem', 
        fontSize: '0.7rem', 
        color: '#6c757d', 
        lineHeight: '1.4' 
      }}>
        <AlertTriangle size={12} style={{ color: '#ffc107', marginTop: '2px', flexShrink: 0 }} />
        <span>
          Automated <code style={{ backgroundColor: '#f8fafc', padding: '1px 4px', borderRadius: '3px', border: '1px solid #e9ecef', color: '#212529' }}>runStorageGarbageCollection</code> utility is active to mitigate storage bloat.
        </span>
      </div>
    </div>
  );
};
