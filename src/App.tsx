import { useState, useEffect } from 'react';
import { Activity, Download, Globe, Server, Settings, Database } from 'lucide-react';
import { StreamSimulator } from './components/StreamSimulator';
import { NetworkPerformanceConsole } from './components/NetworkPerformanceConsole';
import { StorageMonitor } from './components/StorageMonitor';
import { seedDatabaseIfEmpty, exportMetricsToCSV } from './data/db';
import { useMetrics } from './hooks/useMetrics';
import { KpiCards } from './components/KpiCards';
import { MetricChart } from './components/MetricChart';
import { SkeletonLoader } from './components/SkeletonLoader';
import { WebVitalsMonitor } from './components/WebVitalMonitor';

function App() {
  const [isDbReady, setIsDbReady] = useState<boolean>(false);
  const [selectedInstance, setSelectedInstance] = useState<string | null>('db-prod-pg');
  const [timeWindow, setTimeWindow] = useState<number>(24);
  const [viewMode, setViewMode] = useState<'dashboard' | 'diagnostics'>('dashboard');

  // CORRIGIDO: Adicionado o tipo (err: any) para resolver o erro de parâmetro implícito
  useEffect(() => {
    seedDatabaseIfEmpty()
      .then(() => setIsDbReady(true))
      .catch((err: any) => console.error("Database initialization failed:", err));
  }, []);

  const { instances, metrics, loading, error } = useMetrics(selectedInstance, timeWindow);

  const [streamTick, setStreamTick] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => setStreamTick(t => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);


  // Pipeline assíncrona de exportação de relatórios para CSV
  const handleCSVExport = async () => {
    if (!selectedInstance) return;
    try {
      const csvContent = await exportMetricsToCSV(selectedInstance);
      if (!csvContent) {
        alert("No metric indices found in cache to generate reports.");
        return;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const blobUrl = URL.createObjectURL(blob);

      const temporaryAnchor = document.createElement('a');
      temporaryAnchor.href = blobUrl;
      temporaryAnchor.setAttribute('download', `clouddb_telemetry_${selectedInstance}.csv`);
      document.body.appendChild(temporaryAnchor);
      temporaryAnchor.click();
      document.body.removeChild(temporaryAnchor);
    } catch (error) {
      console.error("CSV engine export routine threw an exception:", error);
    }
  };

  // Local utility function to determine cloud provider styles
  const getClusterBrand = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case 'gcp':
        return { label: 'GCP', text: '#1e3a8a', bg: '#dbeafe' };
      case 'aws':
        return { label: 'AWS', text: '#7c2d12', bg: '#ffedd5' };
      case 'azure':
        return { label: 'AZURE', text: '#1e3a8a', bg: '#e0f2fe' };
      default:
        return { label: provider?.toUpperCase() || 'CLOUD', text: '#334155', bg: '#f1f5f9' };
    }
  };


  // Detetar se o sistema entrou em sobrecarga crítica (> 90% CPU)
  const latestMetric = metrics[metrics.length - 1];
  const isSystemInCrisis = latestMetric && latestMetric.cpuUsage > 90;

  // Renderização condicional do ecrã de Bootstrapping
  if (!isDbReady) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#fafafa',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2 style={{ color: '#0a0a0a', fontWeight: 700, margin: 0 }}>⚡ CloudDB Systems</h2>
        <p style={{ color: '#666666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Bootstrapping asynchronous browser storage engine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#fafafa',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ color: '#dc2626', fontSize: '3rem' }}>⚠️</div>
        <h2 style={{ color: '#0a0a0a', fontWeight: 700, margin: 0 }}>Error Loading Metrics</h2>
        <p style={{ color: '#666666', fontSize: '0.9rem', maxWidth: '400px' }}>
          {error.message || 'An unexpected error occurred while loading telemetry data.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '6px',
            border: '1px solid #dc2626',
            backgroundColor: '#ffffff',
            color: '#dc2626',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#dc2626';
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* BARRA DE COMANDO SUPERIOR DO PLANO DE CONTROLO */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid #eaeaea',
        paddingBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: 0, color: '#0a0a0a' }}>CloudDB Control Plane</h1>
          <p style={{ color: '#666666', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Telemetry Operations Workspace • Persistent Browser Streams</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Botão de Alternância de Interface (UX Pro Requisito da Vaga) */}
          <button
            onClick={() => setViewMode(viewMode === 'dashboard' ? 'diagnostics' : 'dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid #eaeaea',
              backgroundColor: viewMode === 'diagnostics' ? '#0a0a0a' : '#ffffff',
              color: viewMode === 'diagnostics' ? '#ffffff' : '#0a0a0a',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            {viewMode === 'dashboard' ? <Settings size={14} /> : <Database size={14} />}
            <span>{viewMode === 'dashboard' ? 'Open Engine Settings' : 'Back to Dashboard'}</span>
          </button>

          <StreamSimulator />
        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE GRID LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2.5rem' }}>

        {/* LEFT PANEL: ALWAYS VISIBLE SIDEBAR */}
        <aside style={{ gridColumn: 'span 1' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Clusters
          </h2>

          {instances.map((inst: any) => {
            const brand = getClusterBrand(inst.provider);
            const isActive = selectedInstance === inst.id;

            return (
              <button
                key={inst.id}
                onClick={() => setSelectedInstance(inst.id)}
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  textAlign: 'left',
                  backgroundColor: '#ffffff',
                  border: isActive ? '1px solid #000000' : '1px solid #eaeaea',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.03)' : '0 1px 2px rgba(0,0,0,0.01)',
                  transition: 'all 0.15s ease',
                  marginBottom: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: brand.text, backgroundColor: brand.bg, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                    {brand.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#666666' }}>
                    <Globe size={11} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>{inst.region}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem', width: '100%' }}>
                  <div style={{ display: 'flex', flexShrink: 0, color: isActive ? '#0a0a0a' : '#999999' }}>
                    <Server size={14} />
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#0a0a0a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {inst.name}
                  </div>
                </div>

                <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: inst.status === 'healthy' ? '#0070f3' : '#f5a623' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: inst.status === 'healthy' ? '#0070f3' : '#f5a623' }}>
                    {inst.status}
                  </span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* RIGHT PANEL: CONDITIONALLY SWITCHES CONTENT */}
        <section style={{ gridColumn: 'span 1', minWidth: 0 }}>
          {viewMode === 'diagnostics' ? (

            /* VIEW A: CONSOLIDATED ENGINE DIAGNOSTICS & RESILIENCY DEVTOOLS */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  System Chaos & Network Injection Console
                </h2>
                <p style={{ color: '#888', fontSize: '0.75rem', marginTop: 0, marginBottom: '1rem' }}>Inject synthetic latency and mock packet drops to audit browser application resiliency bounds.</p>
                <NetworkPerformanceConsole />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h2 style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Local-First Persistent Storage Matrix
                </h2>
                <p style={{ color: '#888', fontSize: '0.75rem', marginTop: 0, marginBottom: '1rem' }}>Monitors the local browser IndexedDB / Dexie engine block allocation footprint in real-time.</p>
                <StorageMonitor streamTick={streamTick} />
              </div>

              {/* INJECTED LIVE: NEW APPLICATION RENDERING PERFORMANCE TELEMETRY */}
              <div style={{ marginTop: '1rem' }}>
                <h2 style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Core Interface Health Metrics
                </h2>
                <p style={{ color: '#888', fontSize: '0.75rem', marginTop: 0, marginBottom: '1rem' }}>Audit browser memory heap pressure and render cycles driven by active state transitions.</p>
                <WebVitalsMonitor streamTick={streamTick} />
              </div>
            </div>

          ) : (

            /* VIEW B: ORIGINAL ANALYTICS METRICS CHARTS */
            <>
              {isSystemInCrisis && (
                <div style={{ backgroundColor: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
                  ⚠️ WARNING: System Load Shedding Active. CPU Overhead on active partition exceeds critical thresholds.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Activity size={14} style={{ color: '#666666' }} />
                  <h2 style={{ fontSize: '0.75rem', fontWeight: 700, margin: 0, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    System Metrics Logs
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={handleCSVExport}
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

                  <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#eaeaea', padding: '0.2rem', borderRadius: '6px' }}>
                    {[1, 6, 24].map((hours: number) => (
                      <button
                        key={hours}
                        onClick={() => setTimeWindow(hours)}
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
                <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #eaeaea' }}>
                  <p style={{ color: '#666666', margin: 0, fontSize: '0.85rem' }}>No telemetry data segments indexed for this specific timeframe.</p>
                </div>
              )}
            </>
          )}
        </section>

      </div>
    </div>
  );
}

export default App;

