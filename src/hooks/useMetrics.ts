import { useState, useEffect } from 'react';
import { db, DBInstance, MetricSnapshot } from '../data/db';

export function useMetrics(selectedInstanceId: string | null, timeWindowHours: number) {
  const [instances, setInstances] = useState<DBInstance[]>([]);
  const [metrics, setMetrics] = useState<MetricSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch static instances list once on load
  useEffect(() => {
    async function loadInstances() {
      try {
        const allInstances = await db.instances.toArray();
        setInstances(allInstances);
      } catch (error) {
        console.error("Failed to load DB instances:", error);
      }
    }
    loadInstances();
  }, []);

  // 2. Set up a polling loop to read the latest metrics from IndexedDB reactively
  useEffect(() => {
    // Se selectedInstanceId for nulo, interrompe imediatamente antes de chamar o Dexie
    if (!selectedInstanceId) return;

    let isMounted = true;

    async function queryMetricsPipeline() {
      try {
        const cutoffTime = Date.now() - timeWindowHours * 60 * 60 * 1000;

        // Ao colocar a exclamação (!) dizemos ao TypeScript que temos a certeza absoluta que não é nulo aqui
        const records = await db.metrics
          .where('instanceId')
          .equals(selectedInstanceId!)
          .and(item => item.timestamp >= cutoffTime)
          .sortBy('timestamp');

        if (isMounted) {
          setMetrics(records);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error querying telemetric records:", error);
      }
    }

    // Immediate initial query execution
    queryMetricsPipeline();

    // Poll the embedded database every 2000ms to catch live incoming streams smoothly
    const dynamicStreamInterval = setInterval(queryMetricsPipeline, 2000);

    return () => {
      isMounted = false;
      clearInterval(dynamicStreamInterval);
    };
  }, [selectedInstanceId, timeWindowHours]); // Triggers query adjustments instantly on UI filter changes
  return { instances, metrics, loading };
}
