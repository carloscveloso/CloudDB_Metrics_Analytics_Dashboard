// src/components/layout/DashboardView.tsx
import React from 'react';
import { Activity, Download } from 'lucide-react';
import { KpiCards } from '../KpiCards';
import { MetricChart } from '../MetricChart';
import { SkeletonLoader } from '../SkeletonLoader';
import type { MetricSnapshot } from '../../types';

interface DashboardViewProps {
  metrics: MetricSnapshot[];
  loading: boolean;
  selectedInstance: string | null;
  timeWindow: number;
  onTimeWindowChange: (hours: number) => void;
  onExportCSV: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  loading,
  timeWindow,
  onTimeWindowChange,
  onExportCSV,
}) => {
  const latestMetric = metrics[metrics.length - 1];
  const isSystemInCrisis = latestMetric && latestMetric.cpuUsage > 90;

  return (
    <>
      {isSystemInCrisis && (
        <div style={{
          backgroundColor: '#fff5f5',
          border: '1px solid #feb2b2',
          color: '#c53030',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          ⚠️ WARNING: System Load Shedding Active. CPU Overhead on active partition exceeds critical thresholds.
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Activity size={14} style={{ color: '#666666' }} />
          <h2 style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            margin: 0,
            color: '#666666',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            System Metrics Logs
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onExportCSV}
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#444444',
              backgroundColor: '#ffffff',
              border: '1px solid #eaeaea',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.01)',
              transition: 'all 0.1s ease'
            }}
            title="Export current instance history to local CSV spreadsheet report"
          >
            <Download size={12} />
            Export CSV
          </button>

          <div style={{
            display: 'flex',
            gap: '0.25rem',
            backgroundColor: '#eaeaea',
            padding: '0.2rem',
            borderRadius: '6px'
          }}>
            {[1, 6, 24].map((hours) => (
              <button
                key={hours}
                onClick={() => onTimeWindowChange(hours)}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: timeWindow === hours ? '#ffffff' : 'transparent',
                  color: timeWindow === hours ? '#0a0a0a' : '#666666',
                  cursor: 'pointer',
                  boxShadow: timeWindow === hours ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.1s ease'
                }}
              >
                {hours}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : metrics.length > 0 ? (
        <div>
          <KpiCards metrics={metrics} />
          <MetricChart data={metrics} metricKey="cpuUsage" title="CPU Compute Overhead" color="#0a0a0a" unit="%" />
          <MetricChart data={metrics} metricKey="memoryUsage" title="RAM Capacity Footprint" color="#0070f3" unit="%" />
          <MetricChart data={metrics} metricKey="latencyMs" title="P99 Replication Latency" color="#ea4335" unit=" ms" />
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '2.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #eaeaea'
        }}>
          <p style={{ color: '#666666', margin: 0, fontSize: '0.85rem' }}>
            No telemetry data segments indexed for this specific timeframe.
          </p>
        </div>
      )}
    </>
  );
};