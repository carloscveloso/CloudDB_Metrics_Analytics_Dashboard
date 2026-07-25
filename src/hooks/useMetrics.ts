import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, DBInstance, MetricSnapshot } from '../data/db';

/**
 * Reactive Custom Hook for Orchestrating Telemetry Data Pipelines.
 * Bridges browser-native storage (IndexedDB) with layout presentation components.
 * Establishes real-time streaming subscriptions with optimal performance metrics.
 * 
 * @param selectedInstanceId The unique string identifier of the active database cluster node
 * @param timeWindowHours The historical time scope boundary (e.g., 1, 6, or 24 hours)
 */
export function useMetrics(selectedInstanceId: string | null, timeWindowHours: number) {
  const [instances, setInstances] = useState<DBInstance[]>([]);
  const [metrics, setMetrics] = useState<MetricSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial bootstrap sequence: Fetch active cluster node topology mappings exactly once
  useEffect(() => {
    async function loadInstances() {
      try {
        const allInstances = await db.instances.toArray();
        setInstances(allInstances);
      } catch (error) {
        console.error("Failed to load cluster topology states:", error);
      }
    }
    loadInstances();
  }, []);

  // Telemetry Ingestion Loop: Query metrics reactively from IndexedDB cache
  useEffect(() => {
    // Prevent database query crashes by short-circuiting if no node is chosen
    if (!selectedInstanceId) return;

    // Operational flag to prevent state mutation updates on unmounted component viewports
    let isMounted = true;

    /**
     * Executes localized time-series database lookups.
     * Applies precise indexing rules and historical range restrictions.
     */
    async function queryMetricsPipeline() {
      try {
        // Calculate the oldest timestamp log entry allowed within the selected window scope
        const cutoffTime = Date.now() - timeWindowHours * 60 * 60 * 1000;

        // Query the indexed table using sub-millisecond primary key lookup constraints.
        // The exclamation point (!) acts as a strict non-null assertion contract since
        // the early return above already guarantees a valid string payload presence.
        const records = await db.metrics
          .where('instanceId')
          .equals(selectedInstanceId!)
          .and(item => item.timestamp >= cutoffTime)
          .sortBy('timestamp');

        // Safely update layout states only if the mounting lifespan is active
        if (isMounted) {
          setMetrics(records);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error querying time-series telemetric records:", error);
      }
    }

    // Immediate initial execution cycle to populate charts instantly on mount
    queryMetricsPipeline();

    // Poll the local database every 2000ms to seamlessly capture streaming broker data injections
    const dynamicStreamInterval = setInterval(queryMetricsPipeline, 2000);

    // Tear down intervals and disable asynchronous state updates on unmount boundaries
    return () => {
      isMounted = false;
      clearInterval(dynamicStreamInterval);
    };
  }, [selectedInstanceId, timeWindowHours]); // Instantly recreates the query profile on dashboard filter events

  return { instances, metrics, loading };
}
