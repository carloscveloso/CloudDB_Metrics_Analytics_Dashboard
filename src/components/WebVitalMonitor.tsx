import React from 'react';
import { Gauge, Zap } from 'lucide-react';
import { useWebVitals } from '../hooks/useWebVitals';

interface WebVitalsMonitorProps {
  streamTick: number;
}

export const WebVitalsMonitor: React.FC<WebVitalsMonitorProps> = ({ streamTick }) => {
  const { renderTimeMs, memoryProgress, jsHeapSizeMB } = useWebVitals(streamTick);

  // Determine UX performance grading based on render paint budget limits (16.6ms window)
  const getRenderStatusColor = (ms: number) => {
    if (ms <= 8) return '#198754'; // Excellent performance
    if (ms <= 16) return '#ffc107'; // Safe rendering boundaries
    return '#dc3545'; // Thread blocking / UI thrashing
  };

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
      {/* Header section with telemetry context labels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#495057', fontWeight: 'bold' }}>
        <Gauge size={14} style={{ color: '#0dcaf0' }} />
        <span>APPLICATION WEB VITALS</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e9ecef' }}>
        <div>
          <span style={{ color: '#6c757d', display: 'block', fontSize: '0.65rem' }}>RENDER PAINT TIME</span>
          <span style={{ fontWeight: 'bold', color: getRenderStatusColor(renderTimeMs) }}>{renderTimeMs} ms</span>
        </div>
        <div>
          <span style={{ color: '#6c757d', display: 'block', fontSize: '0.65rem' }}>JS HEAP ALLOCATION</span>
          <span style={{ color: '#212529', fontWeight: 'bold' }}>{jsHeapSizeMB > 0 ? `${jsHeapSizeMB} MB` : 'N/A'}</span>
        </div>
      </div>

      {jsHeapSizeMB > 0 && (
        <div style={{ width: '100%', backgroundColor: '#e9ecef', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#0dcaf0', height: '100%', width: `${Math.max(memoryProgress, 1)}%`, transition: 'all 0.5s' }} />
        </div>
      )}

      <div style={{ paddingTop: '0.5rem', borderTop: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: '#6c757d' }}>
        <Zap size={11} style={{ color: '#ffc107' }} />
        <span>Ensures Recharts engine stays within the 16.6ms frame budget window.</span>
      </div>
    </div>
  );
};
