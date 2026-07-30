import React, { useState } from 'react';
import { Activity, Wifi, WifiOff, Sliders } from 'lucide-react';
import { useFpsTracker } from '../hooks/useFpsTracker';
import { networkConfig } from '../utils/networkSimulator';

export const NetworkPerformanceConsole: React.FC = () => {
  const fps = useFpsTracker();
  const [latency, setLatency] = useState<number>(0);
  const [loss, setLoss] = useState<number>(0);

  const handleLatencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLatency(value);
    networkConfig.latencyMs = value;
  };

  const handleLossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLoss(value);
    networkConfig.packetLossRate = value / 100;
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
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#495057', fontWeight: 'bold' }}>
        <Activity size={14} style={{ color: '#0dcaf0' }} />
        <span>BROWSER RENDERING METRICS</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e9ecef' }}>
        <div>
          <span style={{ color: '#6c757d', display: 'block', fontSize: '0.7rem' }}>FRAME RATE</span>
          <span style={{ fontWeight: 'bold', color: fps >= 55 ? '#198754' : '#ffc107' }}>{fps} FPS</span>
        </div>
        <div>
          <span style={{ color: '#6c757d', display: 'block', fontSize: '0.7rem' }}>UI LAG STATUS</span>
          <span style={{ color: '#212529' }}>{fps >= 55 ? 'Nominal' : 'Degraded'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed #dee2e6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#495057', fontWeight: 'bold' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {latency > 0 || loss > 0 ? <WifiOff size={14} style={{ color: '#dc3545' }} /> : <Wifi size={14} style={{ color: '#198754' }} />}
            <span>NETWORK CHAOS ENGINE</span>
          </div>
          <Sliders size={12} style={{ color: '#6c757d', marginLeft: 'auto' }} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'between', color: '#6c757d', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
            <span>ARTIFICIAL LATENCY</span>
            <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>{latency} ms</span>
          </div>
          <input type="range" min="0" max="2000" step="100" value={latency} onChange={handleLatencyChange} style={{ width: '100%', cursor: 'pointer' }} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'between', color: '#6c757d', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
            <span>PACKET LOSS</span>
            <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>{loss}%</span>
          </div>
          <input type="range" min="0" max="90" step="5" value={loss} onChange={handleLossChange} style={{ width: '100%', cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
};
