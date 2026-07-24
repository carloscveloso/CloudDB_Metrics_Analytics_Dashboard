import { useEffect, useState } from 'react';
import { db } from '../data/db';

export function StreamSimulator() {
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    if (!isStreaming) return;

    const streamTicker = setInterval(async () => {
      const allInstances = await db.instances.toArray();
      const now = Date.now();

      const newSnapshots = allInstances.map(instance => {
        const baseCpu = instance.status === 'warning' ? 75 : 30;
        return {
          instanceId: instance.id,
          timestamp: now,
          cpuUsage: Math.min(100, Math.floor(Math.random() * 20) + baseCpu),
          memoryUsage: Math.floor(Math.random() * 10) + 65,
          latencyMs: Math.floor(Math.random() * 10) + (instance.status === 'warning' ? 45 : 8)
        };
      });

      // Appending streaming telemetry directly into browser storage asynchronously
      await db.metrics.bulkAdd(newSnapshots);
    }, 2000);

    return () => clearInterval(streamTicker);
  }, [isStreaming]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      backgroundColor: '#fff',
      padding: '0.75rem 1.2rem',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: isStreaming ? '#2563eb' : '#9ca3af',
        animation: isStreaming ? 'pulse 1.5s infinite ease-in-out' : 'none'
      }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
        Background Broker Engine: <strong>{isStreaming ? 'STREAMING ACTIVE' : 'PAUSED'}</strong>
      </span>
      <button
        onClick={() => setIsStreaming(!isStreaming)}
        style={{
          marginLeft: 'auto',
          padding: '0.3rem 0.75rem',
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
          backgroundColor: isStreaming ? '#f8fafc' : '#2563eb',
          color: isStreaming ? '#334155' : '#fff',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}
      >
        {isStreaming ? 'Pause Feed' : 'Resume Feed'}
      </button>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
