// frontend/src/services/instancesService.ts
import api from './api';
import type { DBInstance } from '../types';

export interface CreateInstanceDTO {
  name: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  region: string;
  status?: 'healthy' | 'warning' | 'critical';
}

export interface UpdateInstanceDTO {
  name?: string;
  provider?: 'AWS' | 'GCP' | 'Azure';
  region?: string;
  status?: 'healthy' | 'warning' | 'critical';
}

export const instancesService = {
  /**
   * Buscar todas as instâncias do tenant
   */
  getAll: async (): Promise<DBInstance[]> => {
    const response = await api.get<DBInstance[]>('/instances');
    return response.data;
  },

  /**
   * Buscar uma instância por ID
   */
  getById: async (id: string): Promise<DBInstance> => {
    const response = await api.get<DBInstance>(`/instances/${id}`);
    return response.data;
  },

  /**
   * Criar uma nova instância
   */
  create: async (data: CreateInstanceDTO): Promise<DBInstance> => {
    const response = await api.post<DBInstance>('/instances', data);
    return response.data;
  },

  /**
   * Atualizar uma instância
   */
  update: async (id: string, data: UpdateInstanceDTO): Promise<DBInstance> => {
    const response = await api.put<DBInstance>(`/instances/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar uma instância
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/instances/${id}`);
  },

  /**
   * Obter estatísticas de uma instância
   */
  getStats: async (id: string): Promise<{
    totalMetrics: number;
    avgCpu: number;
    avgMemory: number;
    avgLatency: number;
    uptime: number;
    lastMetricAt: string;
  }> => {
    const response = await api.get(`/instances/${id}/stats`);
    return response.data;
  },

  /**
   * Atualizar status de uma instância (para Chaos Mode)
   */
  updateStatus: async (id: string, status: 'healthy' | 'warning' | 'critical'): Promise<DBInstance> => {
    const response = await api.patch<DBInstance>(`/instances/${id}/status`, { status });
    return response.data;
  },

  /**
   * Obter todas as instâncias com métricas mais recentes
   */
  getInstancesWithLatestMetrics: async (): Promise<Array<DBInstance & { latestMetric?: any }>> => {
    const response = await api.get('/instances/with-metrics');
    return response.data;
  },
};