import Dexie, { type Table } from 'dexie';
import type { DBInstance, MetricSnapshot } from '../types';

// Export explicit data types for your Hooks and Component render layers
export type { DBInstance, MetricSnapshot };

/**
 * Client-Side Embedded Browser Storage Architecture.
 * Establishes structured, indexed tables for time-series log analysis.
 */
class CloudDBDatabase extends Dexie {
  instances!: Table<DBInstance>;
  metrics!: Table<MetricSnapshot>;

  constructor() {
    super('CloudDB_Metrics_Dashboard');
    // Index specific fields to run fast filtering queries in the browser
    this.version(1).stores({
      instances: 'id, provider, status',
      metrics: '++id, instanceId, timestamp'
    });
  }
}

export const db = new CloudDBDatabase();

/**
 * Database Seeding Engine.
 * Automatically populates the browser database on the application's first launch.
 */
export async function seedDatabaseIfEmpty() {
  const instanceCount = await db.instances.count();
  if (instanceCount > 0) return; 

  const mockInstances: DBInstance[] = [
    { id: 'db-prod-pg', name: 'Production-Postgres', provider: 'AWS', status: 'healthy', region: 'us-east-1' },
    { id: 'db-analytics-ch', name: 'Analytics-ClickHouse', provider: 'GCP', status: 'warning', region: 'europe-west1' },
    { id: 'db-cache-redis', name: 'Cache-RedisCluster', provider: 'Azure', status: 'healthy', region: 'eastus' }
  ];

  await db.instances.bulkAdd(mockInstances);

  const metricsBatch: MetricSnapshot[] = [];
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  mockInstances.forEach((instance) => {
    for (let i = 24; i >= 0; i--) {
      const timestamp = now - i * oneHour;
      const baseCpu = instance.status === 'warning' ? 75 : 30;

      metricsBatch.push({
        instanceId: instance.id,
        timestamp,
        cpuUsage: Math.min(100, Math.floor(Math.random() * 20) + baseCpu),
        memoryUsage: Math.floor(Math.random() * 15) + 60,
        latencyMs: Math.floor(Math.random() * 12) + (instance.status === 'warning' ? 45 : 8)
      });
    }
  });

  await db.metrics.bulkAdd(metricsBatch);
  console.log('IndexedDB: Local browser environment database successfully seeded!');
}

/**
 * Asynchronous Data Garbage Collector (Storage Pruning Utility).
 * Keeps only the most recent snapshots to protect browser memory performance.
 */
export async function runStorageGarbageCollection(maxRecordsAllowed: number = 200) {
  try {
    const totalRecords = await db.metrics.count();
    if (totalRecords <= maxRecordsAllowed) return;

    const recordsToDeleteCount = totalRecords - maxRecordsAllowed;
    const legacyKeysCollection = await db.metrics
      .orderBy('timestamp')
      .limit(recordsToDeleteCount)
      .primaryKeys();

    if (legacyKeysCollection.length > 0) {
      await db.metrics.bulkDelete(legacyKeysCollection);
      console.log(`[Storage GC]: Safely purged ${legacyKeysCollection.length} stale telemetric log snapshots.`);
    }
  } catch (error) {
    console.error("Storage Garbage Collection loop encountered an exception:", error);
  }
}

// Global runtime variables moved to the root level to prevent syntax conflicts
export let IS_CHAOS_MODE_ACTIVE = false;

export function setChaosMode(isActive: boolean) {
  IS_CHAOS_MODE_ACTIVE = isActive;
  console.log(`[Chaos Engine]: Simulation state shifted. Active = ${isActive}`);
}

/**
 * Utility to extract metrics from IndexedDB and convert them to a CSV string.
 * Demonstrates client-side data parsing and processing pipelines.
 */
export async function exportMetricsToCSV(instanceId: string): Promise<string> {
  const records = await db.metrics
    .where('instanceId')
    .equals(instanceId)
    .sortBy('timestamp');

  if (records.length === 0) return '';

  // Define headers for our database report file
  const headers = ['Timestamp', 'Instance ID', 'CPU Usage (%)', 'Memory Usage (%)', 'Latency (ms)'];
  
  // Map rows into clean comma-separated strings
  const csvRows = records.map(record => [
    new Date(record.timestamp).toISOString(),
    record.instanceId,
    record.cpuUsage,
    record.memoryUsage,
    record.latencyMs
  ].join(','));

  // Combine headers and rows with a newline character break
  return [headers.join(','), ...csvRows].join('\n');
}
