// frontend/src/components/KpiCards.tsx - ADICIONAR ANIMAÇÃO
import type { MetricSnapshot } from '../types';

interface KpiCardsProps {
  metrics: MetricSnapshot[];
}

export function KpiCards({ metrics }: KpiCardsProps) {
  const latest = metrics[metrics.length - 1];

  const cpu = latest ? `${latest.cpuUsage}%` : '--';
  const memory = latest ? `${latest.memoryUsage}%` : '--';
  const latency = latest ? `${latest.latencyMs} ms` : '--';

  const getCpuColor = () => {
    if (!latest) return '#64748b';
    if (latest.cpuUsage > 80) return '#ef4444';
    if (latest.cpuUsage > 60) return '#f59e0b';
    return '#2563eb';
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '1.25rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.02)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    transition: 'all 0.3s ease', // ← NOVO: transição suave
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0.25rem 0 0 0',
    transition: 'color 0.3s ease, transform 0.2s ease', // ← NOVO: transição suave
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.25rem',
      marginBottom: '1.5rem',
      width: '100%'
    }}>
      <div style={cardStyle}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Current Compute
        </span>
        <h3 style={{ ...valueStyle, color: getCpuColor() }}>{cpu}</h3>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Core processing load</span>
      </div>

      <div style={cardStyle}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Memory Allocation
        </span>
        <h3 style={valueStyle}>{memory}</h3>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>RAM utilization capacity</span>
      </div>

      <div style={cardStyle}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Network Latency
        </span>
        <h3 style={{ ...valueStyle, color: latest && latest.latencyMs > 40 ? '#ef4444' : '#10b981' }}>
          {latency}
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>P99 replication transfer</span>
      </div>
    </div>
  );
}