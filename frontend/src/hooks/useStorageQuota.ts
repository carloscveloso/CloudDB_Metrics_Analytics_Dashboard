import { useState, useEffect } from 'react';

interface StorageQuota {
  usedMB: number;
  totalMB: number;
  percentage: number;
  supported: boolean;
}

export function useStorageQuota(triggerRefresh: any) {
  const [quota, setQuota] = useState<StorageQuota>({
    usedMB: 0,
    totalMB: 0,
    percentage: 0,
    supported: true,
  });

  useEffect(() => {
    if (!navigator.storage || !navigator.storage.estimate) {
      setQuota((prev) => ({ ...prev, supported: false }));
      return;
    }

    async function checkQuota() {
      try {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quotaValue = estimate.quota || 1;

        // Convert bytes to Megabytes (MB)
        const usedMB = Number((usage / (1024 * 1024)).toFixed(2));
        const totalMB = Number((quotaValue / (1024 * 1024)).toFixed(2));
        const percentage = Number(((usage / quotaValue) * 100).toFixed(4));

        setQuota({ usedMB, totalMB, percentage, supported: true });
      } catch (error) {
        console.error("Failed to calculate browser storage quota:", error);
      }
    }

    checkQuota();
  }, [triggerRefresh]); // Fires every time the background stream writes telemetry data

  return quota;
}
