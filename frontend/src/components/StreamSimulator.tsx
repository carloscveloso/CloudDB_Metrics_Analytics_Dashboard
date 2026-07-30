// frontend/src/components/StreamSimulator.tsx
import { useEffect, useState } from 'react';
import { metricsService } from '../services/metricsService';
import { instancesService } from '../services/instancesService';
import { db, runStorageGarbageCollection } from '../data/db';
import { simulateNetwork } from '../utils/networkSimulator';

export function StreamSimulator() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [useApi, setUseApi] = useState(true);

  useEffect(() => {
    if (!isStreaming) return;

    const streamTicker = setInterval(async () => {
      try {
        // 1. Simular latência/packet loss
        await simulateNetwork();

        // 2. Buscar instâncias (tenta API primeiro)
        let allInstances;
        try {
          allInstances = await instancesService.getAll();
          setUseApi(true);
        } catch (apiError) {
          console.warn('API failed, using IndexedDB for instances:', apiError);
          setUseApi(false);
          allInstances = await db.instances.toArray();
        }

        const now = Date.now();

        // 3. Criar métricas
        const newSnapshots = allInstances.map((instance: any) => {
          const isCrisisActive = instance.status === 'warning' || instance.status === 'critical';
          const currentBaseCpu = isCrisisActive ? 80 : 25;
          const currentBaseRam = isCrisisActive ? 85 : 45;
          const currentBaseLatency = isCrisisActive ? 90 : 8;

          return {
            instanceId: instance.id,
            cpuUsage: Math.min(100, Math.floor(Math.random() * 15) + currentBaseCpu),
            memoryUsage: Math.min(100, Math.floor(Math.random() * 10) + currentBaseRam),
            latencyMs: Math.floor(Math.random() * 8) + currentBaseLatency,
          };
        });

        // 4. Enviar para API (se disponível) ou IndexedDB
        if (useApi) {
          try {
            await metricsService.createMetricsBatch(newSnapshots);
          } catch (apiError) {
            console.warn('API failed, using IndexedDB fallback:', apiError);
            setUseApi(false);
            await db.metrics.bulkAdd(
              newSnapshots.map((s: any) => ({ ...s, timestamp: now }))
            );
          }
        } else {
          // Usar IndexedDB diretamente
          await db.metrics.bulkAdd(
            newSnapshots.map((s: any) => ({ ...s, timestamp: now }))
          );
        }

        // 5. Garbage collection (só para IndexedDB)
        if (!useApi) {
          await runStorageGarbageCollection(50);
        }

      } catch (error: any) {
        console.warn("Telemetry Stream Pipeline Interrupted:", error.message);
      }
    }, 2000);

    return () => clearInterval(streamTicker);
  }, [isStreaming, useApi]);

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
        {!useApi && <span style={{ color: '#f59e0b', marginLeft: '0.5rem' }}>(Offline Mode)</span>}
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