// frontend/src/hooks/useMetrics.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { metricsService } from '../services/metricsService';
import { instancesService } from '../services/instancesService';
import { db, DBInstance, MetricSnapshot } from '../data/db';

export function useMetrics(selectedInstanceId: string | null, timeWindowHours: number) {
  const [instances, setInstances] = useState<DBInstance[]>([]);
  const [metrics, setMetrics] = useState<MetricSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [useApi, setUseApi] = useState(true);
  
  // ← NOVO: Referência para controlar se é a primeira carga
  const isFirstLoad = useRef(true);

  // 🔄 Buscar instâncias
  useEffect(() => {
    async function loadInstances() {
      try {
        const allInstances = await instancesService.getAll();
        setInstances(allInstances);
        setUseApi(true);
      } catch (apiError) {
        console.warn('API failed, using IndexedDB fallback for instances:', apiError);
        try {
          const allInstances = await db.instances.toArray();
          setInstances(allInstances);
          setUseApi(false);
        } catch (dbError) {
          console.error("Failed to load instances:", dbError);
          setError(dbError as Error);
        }
      }
    }
    loadInstances();
  }, []);

  // 📈 Buscar métricas (com controle de loading)
  const fetchMetrics = useCallback(async (showLoading: boolean = false) => {
    if (!selectedInstanceId) {
      setLoading(false);
      return;
    }

    try {
      // ← NOVO: Só mostra loading se for pedido explicitamente
      if (showLoading) {
        setError(null);
        setLoading(true);
      }

      let data: MetricSnapshot[] = [];

      if (useApi) {
        try {
          data = await metricsService.getMetrics({
            instanceId: selectedInstanceId,
            hours: timeWindowHours,
          });
        } catch (apiError) {
          console.warn('API failed, using IndexedDB fallback:', apiError);
          setUseApi(false);
          const cutoffTime = Date.now() - timeWindowHours * 60 * 60 * 1000;
          data = await db.metrics
            .where('instanceId')
            .equals(selectedInstanceId)
            .and(item => item.timestamp >= cutoffTime)
            .sortBy('timestamp');
        }
      } else {
        const cutoffTime = Date.now() - timeWindowHours * 60 * 60 * 1000;
        data = await db.metrics
          .where('instanceId')
          .equals(selectedInstanceId)
          .and(item => item.timestamp >= cutoffTime)
          .sortBy('timestamp');
      }

      // ← NOVO: Update suave (sem flash)
      setMetrics(data);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError(err as Error);
      setMetrics([]);
    } finally {
      // ← NOVO: Só desativa loading se estiver ativo
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [selectedInstanceId, timeWindowHours, useApi]);

  // Efeito principal
  useEffect(() => {
    let isMounted = true;

    const fetchAndUpdate = async () => {
      if (!isMounted) return;
      
      // ← NOVO: Primeira carga mostra loading, as seguintes NÃO
      const shouldShowLoading = isFirstLoad.current;
      await fetchMetrics(shouldShowLoading);
      
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      }
    };

    fetchAndUpdate();

    // Polling a cada 2 segundos (SEM loading)
    const interval = setInterval(fetchAndUpdate, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchMetrics]);

  return { instances, metrics, loading, error };
}