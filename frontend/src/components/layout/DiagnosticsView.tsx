// src/components/layout/DiagnosticsView.tsx
import React from 'react';
import { NetworkPerformanceConsole } from '../NetworkPerformanceConsole';
import { StorageMonitor } from '../StorageMonitor';
import { WebVitalsMonitor } from '../WebVitalMonitor';

interface DiagnosticsViewProps {
  streamTick: number;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({ streamTick }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: '#666666',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          System Chaos & Network Injection Console
        </h2>
        <p style={{ color: '#888', fontSize: '0.75rem', marginTop: 0, marginBottom: '1rem' }}>
          Inject synthetic latency and mock packet drops to audit browser application resiliency bounds.
        </p>
        <NetworkPerformanceConsole />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h2 style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: '#666666',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Local-First Persistent Storage Matrix
        </h2>
        <p style={{ color: '#888', fontSize: '0.75rem', marginTop: 0, marginBottom: '1rem' }}>
          Monitors the local browser IndexedDB / Dexie engine block allocation footprint in real-time.
        </p>
        <StorageMonitor streamTick={streamTick} />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h2 style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: '#666666',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Core Interface Health Metrics
        </h2>
        <p style={{ color: '#888', fontSize: '0.75rem', marginTop: 0, marginBottom: '1rem' }}>
          Audit browser memory heap pressure and render cycles driven by active state transitions.
        </p>
        <WebVitalsMonitor streamTick={streamTick} />
      </div>
    </div>
  );
};