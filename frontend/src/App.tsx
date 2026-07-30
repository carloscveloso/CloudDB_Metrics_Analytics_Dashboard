// src/App.tsx - VERSÃO COM SYSTEM CONTEXT
import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { AppLayout } from './components/layout/AppLayout';
import { seedDatabaseIfEmpty, exportMetricsToCSV } from './data/db';
import { useMetrics } from './hooks/useMetrics';
import { useSystem } from './contexts/SystemContext'; // ← IMPORT DO CONTEXT

function App() {
  const [isDbReady, setIsDbReady] = useState<boolean>(false);
  const [streamTick, setStreamTick] = useState<number>(0);

  // ✅ USAR CONTEXT
  const {
    selectedInstance,
    timeWindow,
    viewMode,
    setSelectedInstance,
    setTimeWindow,
    setViewMode,
  } = useSystem(); // ← Hook do Context

  // Inicialização da base de dados (mantém igual)
  useEffect(() => {
    seedDatabaseIfEmpty()
      .then(() => setIsDbReady(true))
      .catch((err: any) => console.error("Database initialization failed:", err));
  }, []);

  // Streaming tick para atualizar monitores (mantém igual)
  useEffect(() => {
    const interval = setInterval(() => setStreamTick(t => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  // Busca métricas (mantém igual - usa selectedInstance e timeWindow do Context)
  const { instances, metrics, loading, error } = useMetrics(selectedInstance, timeWindow);

  // Exportação CSV (mantém igual)
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

  // Loading state (mantém igual)
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
        <p style={{ color: '#666666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Bootstrapping asynchronous browser storage engine...
        </p>
      </div>
    );
  }

  // Error state (mantém igual)
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

  // Render principal
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* ✅ Header agora usa viewMode e setViewMode do Context */}
      <Header 
        viewMode={viewMode} 
        onToggleView={() => setViewMode(
          viewMode === 'dashboard' ? 'diagnostics' : 'dashboard'
        )} 
      />

      <AppLayout
        instances={instances}
        metrics={metrics}
        loading={loading}
        selectedInstance={selectedInstance}
        timeWindow={timeWindow}
        viewMode={viewMode}
        streamTick={streamTick}
        onSelectInstance={setSelectedInstance}      // ← Função do Context
        onTimeWindowChange={setTimeWindow}          // ← Função do Context
        onExportCSV={handleCSVExport}
      />
    </div>
  );
}

export default App;