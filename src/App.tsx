import { useEffect, useState } from 'react';
import { Server, Globe, Activity, Cloud, Download, AlertTriangle } from 'lucide-react';
import { seedDatabaseIfEmpty, exportMetricsToCSV } from './data/db';
import { useMetrics } from './hooks/useMetrics';
import { MetricChart } from './components/MetricChart';
import { KpiCards } from './components/KpiCards';
import { StreamSimulator } from './components/StreamSimulator';
import { SkeletonLoader } from './components/SkeletonLoader';

/**
 * Advanced Responsive SaaS Control Plane Dashboard Shell for CloudDB.
 * Integrates real-time Chaos Alert Overlays and Client-Side CSV Data Export streams.
 */
function App() {
  const [isDbReady, setIsDbReady] = useState<boolean>(false);
  const [selectedInstance, setSelectedInstance] = useState<string | null>('db-prod-pg');
  const [timeWindow, setTimeWindow] = useState<number>(24);
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null);

  // Initialize and seed internal database tables on first boot
  useEffect(() => {
    seedDatabaseIfEmpty()
      .then(() => setIsDbReady(true))
      .catch((err) => console.error("Database initialization failed:", err));
  }, []);

  // Continuous telemetry capture link based on selection models
  const { instances, metrics, loading } = useMetrics(selectedInstance, timeWindow);

  // Client-Side Export Pipeline: Asynchronously triggers local desktop downloads
  const handleCSVExport = async () => {
    if (!selectedInstance) return;
    try {
      const csvContent = await exportMetricsToCSV(selectedInstance);
      if (!csvContent) {
        alert("No metric indices found in cache to generate reports.");
        return;
      }

      // Convert raw string into a secure browser document blob type file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const blobUrl = URL.createObjectURL(blob);

      // Inject temporary layout node anchor links to execute silent file download pipelines
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

  // Check if active metric points violate system limits (> 90% CPU)
  const latestMetric = metrics[metrics.length - 1];
  const isSystemInCrisis = latestMetric && latestMetric.cpuUsage > 90;

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

  return (
    <div style={{
      padding: '2rem max(1.5rem, calc((100vw - 1300px) / 2))',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      color: '#0a0a0a',
      WebkitFontSmoothing: 'antialiased'
    }}>

      {/* SaaS Dashboard Top Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #eaeaea',
        paddingBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
            <Cloud size={20} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0a0a0a' }}>
              CloudDB Control Plane
            </h1>
            <p style={{ margin: '0.15rem 0 0 0', color: '#666666', fontSize: '0.8rem', fontWeight: 500 }}>
              Telemetry Operations Workspace • Persistent Browser Streams
            </p>
          </div>
        </div>
        <StreamSimulator />
      </header>

      {/* Live Cluster Health Degradation Simulator - High Impact Alert Box Overlay */}
      {isSystemInCrisis && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'flash 2s infinite ease-in-out'
        }}>
          <AlertTriangle size={18} style={{ color: '#ef4444' }} />
          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#991b1b' }}>
            <strong style={{ fontWeight: 700 }}>CRITICAL OVERHEAD ALERT:</strong> Active computing nodes on cluster
            <span style={{ fontFamily: 'monospace', backgroundColor: '#fee2e2', padding: '0.1rem 0.3rem', borderRadius: '4px', margin: '0 0.3rem' }}>{selectedInstance}</span>
            are experiencing rapid multi-region cascading latency breaches. Review P99 replica lines immediately.
          </div>
          <style>{`
            @keyframes flash {
              0% { opacity: 0.95; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(0.998); }
              100% { opacity: 0.95; transform: scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* Main Responsive Grid Layout Shell */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>

        {/* Navigation Sidebar Panel (Vercel Style Design Layout) */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', gridColumn: 'span 1' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Clusters
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {instances.map((inst) => {
              const isActive = selectedInstance === inst.id;
              const isHovered = hoveredButtonId === inst.id;

              const getProviderBrand = (provider: 'AWS' | 'GCP' | 'Azure') => {
                switch (provider) {
                  case 'AWS': return { text: '#ff9900', bg: '#fff7ed', label: 'AWS' };
                  case 'GCP': return { text: '#ea4335', bg: '#fef2f2', label: 'GCP' };
                  case 'Azure': return { text: '#0078d4', bg: '#f0f9ff', label: 'Azure' };
                }
              };

              const brand = getProviderBrand(inst.provider);

              return (
                <button
                  key={inst.id}
                  onClick={() => setSelectedInstance(inst.id)}
                  onMouseEnter={() => setHoveredButtonId(inst.id)}
                  onMouseLeave={() => setHoveredButtonId(null)}
                  style={{
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: isActive ? '1px solid #0a0a0a' : isHovered ? '1px solid #ccc' : '1px solid #eaeaea',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.04)' : '0 1px 2px rgba(0,0,0,0.01)',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: isActive || isHovered ? 'translateY(-1px)' : 'none'
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
          </div>
        </aside>

        {/* Dynamic Analytics Data Board Container */}
        <section style={{ gridColumn: 'span 2', minWidth: 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={14} style={{ color: '#666666' }} />
              <h2 style={{ fontSize: '0.75rem', fontWeight: 700, margin: 0, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Metrics Logs
              </h2>
            </div>

            {/* Action Bar containing Export and Time Filters side-by-side */}
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
                {[1, 6, 24].map((hours) => (
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

          {/* Operational Viewport Loader Conditional Matrix */}
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
        </section>

      </div>
    </div>
  );
}

export default App;
