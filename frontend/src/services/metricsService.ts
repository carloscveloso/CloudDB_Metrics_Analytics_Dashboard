// frontend/src/services/metricsService.ts
import api from './api';
import type { MetricSnapshot } from '../types';

export interface CreateMetricDTO {
  instanceId: string;
  cpuUsage: number;
  memoryUsage: number;
  latencyMs: number;
}

export interface MetricWithInstance extends MetricSnapshot {
  instanceName: string;
}

export interface MetricsQueryParams {
  instanceId?: string;
  hours?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export const metricsService = {
  /**
   * Buscar métricas de uma instância específica
   */
  getMetrics: async (params: MetricsQueryParams): Promise<MetricSnapshot[]> => {
    const response = await api.get<MetricSnapshot[]>('/metrics', {
      params: {
        instanceId: params.instanceId,
        hours: params.hours || 24,
        startDate: params.startDate,
        endDate: params.endDate,
        limit: params.limit,
      },
    });
    return response.data;
  },

  /**
   * Buscar métricas mais recentes de todas as instâncias
   */
  getLatestMetrics: async (): Promise<MetricWithInstance[]> => {
    const response = await api.get<MetricWithInstance[]>('/metrics/latest');
    return response.data;
  },

  /**
   * Buscar métricas de uma instância por período
   */
  getMetricsByTimeRange: async (
    instanceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MetricSnapshot[]> => {
    const response = await api.get<MetricSnapshot[]>('/metrics/range', {
      params: {
        instanceId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data;
  },

  /**
   * Criar nova métrica (para o StreamSimulator)
   */
  createMetric: async (data: CreateMetricDTO): Promise<MetricSnapshot> => {
    const response = await api.post<MetricSnapshot>('/metrics', data);
    return response.data;
  },

  /**
   * Criar múltiplas métricas em batch
   */
  createMetricsBatch: async (metrics: CreateMetricDTO[]): Promise<MetricSnapshot[]> => {
    const response = await api.post<MetricSnapshot[]>('/metrics/batch', { metrics });
    return response.data;
  },

  /**
   * Eliminar métricas antigas
   */
  deleteOldMetrics: async (days: number = 30): Promise<{ deleted: number }> => {
    const response = await api.delete<{ deleted: number }>('/metrics/old', {
      params: { days },
    });
    return response.data;
  },

  /**
   * Obter estatísticas agregadas
   */
  getMetricsStats: async (instanceId: string, hours: number = 24): Promise<{
    avgCpu: number;
    maxCpu: number;
    avgMemory: number;
    maxMemory: number;
    avgLatency: number;
    maxLatency: number;
    count: number;
  }> => {
    const response = await api.get('/metrics/stats', {
      params: { instanceId, hours },
    });
    return response.data;
  },

  /**
   * Exportar métricas para CSV (via backend)
   */
  exportMetricsToCSV: async (instanceId: string, hours: number = 24): Promise<Blob> => {
    const response = await api.get('/metrics/export', {
      params: { instanceId, hours },
      responseType: 'blob',
    });
    return response.data;
  },
};