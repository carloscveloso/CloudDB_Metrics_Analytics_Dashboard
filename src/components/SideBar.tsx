import React, { useState, useEffect } from 'react';
import { NetworkPerformanceConsole } from './NetworkPerformanceConsole';
import { StorageMonitor } from './StorageMonitor';

export const AppLayout: React.FC = () => {
  // Simple state to notify the StorageMonitor that a new database write occurred
  const [streamTick, setStreamTick] = useState<number>(0);

  useEffect(() => {
    // Listen to your existing streaming interval to update the tick counter
    const interval = setInterval(() => {
      setStreamTick(prev => prev + 1);
    }, 2000); // Align this with your streaming database frequency

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Main Dashboard Canvas Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Your existing Charts, KPI Cards, and Chaos Banners go here */}
      </main>

      {/* High-Density Developer Operations Sidebar */}
      <aside className="w-80 border-l border-zinc-800 bg-zinc-950 p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="text-zinc-400 font-bold tracking-wider text-[11px] mb-2 uppercase">
          System Control Plane
        </div>

        {/* Console 1: FPS and Network Latency / Packet Loss Injected Sliders */}
        <NetworkPerformanceConsole />

        {/* Console 2: Real-time IndexedDB Storage Footprint Monitor */}
        <StorageMonitor streamTick={streamTick} />
      </aside>
    </div>
  );
};
