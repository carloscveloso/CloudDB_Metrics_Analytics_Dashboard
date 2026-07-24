import Dexie, { type Table } from 'dexie';
import type { DBInstance, MetricSnapshot } from '../types';
export { type DBInstance, type MetricSnapshot } from '../types';

// 1. Definição da base de dados embutida no browser
class CloudDBDatabase extends Dexie {
  instances!: Table<DBInstance>;
  metrics!: Table<MetricSnapshot>;

  constructor() {
    super('CloudDB_Metrics_Dashboard');
    // Indexamos os campos que vamos usar para filtros (queries rápidas)
    this.version(1).stores({
      instances: 'id, provider, status',
      metrics: '++id, instanceId, timestamp'
    });
  }
}

export const db = new CloudDBDatabase();

// 2. Função para popular (semear) o browser caso esteja vazio
export async function seedDatabaseIfEmpty() {
  const instanceCount = await db.instances.count();
  if (instanceCount > 0) return; // Se já existir dados, não faz nada

  // Dados simulados de infraestrutura para o contexto da vaga
  const mockInstances: DBInstance[] = [
    { id: 'db-prod-pg', name: 'Production-Postgres', provider: 'AWS', status: 'healthy', region: 'us-east-1' },
    { id: 'db-analytics-ch', name: 'Analytics-ClickHouse', provider: 'GCP', status: 'warning', region: 'europe-west1' },
    { id: 'db-cache-redis', name: 'Cache-RedisCluster', provider: 'Azure', status: 'healthy', region: 'eastus' }
  ];

  await db.instances.bulkAdd(mockInstances);

  const metricsBatch: MetricSnapshot[] = [];
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // Cria 24 pontos de dados históricos para cada base de dados simulada
  mockInstances.forEach((instance) => {
    for (let i = 24; i >= 0; i--) {
      const timestamp = now - i * oneHour;
      
      // Se a base de dados tiver o estado 'warning', simulamos carga alta no CPU
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
  console.log('IndexedDB: Base de dados embutida semeada com sucesso!');
}

