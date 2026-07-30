import { useState, useEffect } from 'react';

interface WebVitals {
  renderTimeMs: number;
  memoryProgress: number;
  jsHeapSizeMB: number;
}

export function useWebVitals(triggerRefresh: number) {
  const [vitals, setVitals] = useState<WebVitals>({
    renderTimeMs: 0,
    memoryProgress: 0,
    jsHeapSizeMB: 0,
  });

  useEffect(() => {
    // Measure total duration of the last operational frame render loop
    const start = performance.now();
    
    requestAnimationFrame(() => {
      const end = performance.now();
      const lastRenderTime = Number((end - start).toFixed(2));

      // Extract Chrome-specific memory footprint indices if available
      const memory = (performance as any).memory;
      const heapSize = memory ? Number((memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)) : 0;
      const memPercentage = memory ? (memory.usedJSHeapSize / memory.jsHeapLimit) * 100 : 0;

      setVitals({
        renderTimeMs: lastRenderTime,
        memoryProgress: memPercentage,
        jsHeapSizeMB: heapSize,
      });
    });
  }, [triggerRefresh]); // Triggers calculation whenever the active stream updates metrics

  return vitals;
}
