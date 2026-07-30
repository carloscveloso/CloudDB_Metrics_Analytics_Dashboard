// src/components/layout/AppLayout.tsx
import React from 'react';
import { InstanceSidebar } from './InstanceSideBar';
import { DashboardView } from './DashBoardView'
import { DiagnosticsView } from './DiagnosticsView';
import type { DBInstance, MetricSnapshot } from '../../types';

interface AppLayoutProps {
  instances: DBInstance[];
  metrics: MetricSnapshot[];
  loading: boolean;
  selectedInstance: string | null;
  timeWindow: number;
  viewMode: 'dashboard' | 'diagnostics';
  streamTick: number;
  onSelectInstance: (id: string) => void;
  onTimeWindowChange: (hours: number) => void;
  onExportCSV: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  instances,
  metrics,
  loading,
  selectedInstance,
  timeWindow,
  viewMode,
  streamTick,
  onSelectInstance,
  onTimeWindowChange,
  onExportCSV,
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '2.5rem'
    }}>
      <InstanceSidebar
        instances={instances}
        selectedInstance={selectedInstance}
        onSelectInstance={onSelectInstance}
      />

      <section style={{ gridColumn: 'span 1', minWidth: 0 }}>
        {viewMode === 'diagnostics' ? (
          <DiagnosticsView streamTick={streamTick} />
        ) : (
          <DashboardView
            metrics={metrics}
            loading={loading}
            selectedInstance={selectedInstance}
            timeWindow={timeWindow}
            onTimeWindowChange={onTimeWindowChange}
            onExportCSV={onExportCSV}
          />
        )}
      </section>
    </div>
  );
};