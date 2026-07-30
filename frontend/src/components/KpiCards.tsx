import type { MetricSnapshot } from '../data/db';

interface KpiCardsProps {
  metrics: MetricSnapshot[];
}

/**
 * Modern High-Density KPI Cards for Telemetry Monitoring.
 * Evaluates the latest streaming database snapshot in real-time.
 */
export function KpiCards({ metrics }: KpiCardsProps) {
  // Extract the most recent snapshot entry from the array stream
  const latest = metrics[metrics.length - 1];

  // Format data values or provide fallback placeholders during initialization
  const cpu = latest ? `${latest.cpuUsage}%` : '--';
  const memory = latest ? `${latest.memoryUsage}%` : '--';
  const latency = latest ? `${latest.latencyMs} ms` : '--';

  // Dynamic status evaluation for computer load metrics
  const getCpuColor = () => {
    if (!latest) return '#64748b';
    if (latest.cpuUsage > 80) return '#ef4444'; // Critical Breach (Red)
    if (latest.cpuUsage > 60) return '#f59e0b'; // Warning Threshold (Amber)
    return '#2563eb'; // Standard Operational State (Blue)
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '1.25rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.02)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0.25rem 0 0 0'
  };

    return (
    <div style={{
      display: 'grid',
      /* Forces exactly 3 columns side-by-side and prevents wrapping */
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.25rem',
      marginBottom: '1.5rem',
      width: '100%'
    }}>
      {/* Compute Overhead KPI */}
      <div style={cardStyle}>
        <span style={labelStyle}>Current Compute</span>
        <h3 style={{ ...valueStyle, color: getCpuColor() }}>{cpu}</h3>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Core processing load</span>
      </div>

      {/* Memory Footprint KPI */}
      <div style={cardStyle}>
        <span style={labelStyle}>Memory Allocation</span>
        <h3 style={valueStyle}>{memory}</h3>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>RAM utilization capacity</span>
      </div>

      {/* Replication Latency KPI */}
      <div style={cardStyle}>
        <span style={labelStyle}>Network Latency</span>
        <h3 style={{ ...valueStyle, color: latest && latest.latencyMs > 40 ? '#ef4444' : '#10b981' }}>
          {latency}
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>P99 replication transfer</span>
      </div>
    </div>
  );
};
