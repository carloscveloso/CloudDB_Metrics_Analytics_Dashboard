// configuration for network simulation state (can be wired to UI toggles later)
export const networkConfig = {
  latencyMs: 0,       // artificial delay in milliseconds (e.g., 300ms for slow 3G)
  packetLossRate: 0,  // probability of failure between 0 and 1 (e.g., 0.2 = 20% loss)
};

/**
 * Simulates network behaviors (latency and drops) before resolving a promise.
 * Implements a standard SaaS resilience pattern for offline/flaky connection testing.
 */
export async function simulateNetwork(): Promise<void> {
  // 1. Simulate Packet Loss (Network Drop)
  if (networkConfig.packetLossRate > 0 && Math.random() < networkConfig.packetLossRate) {
    throw new Error("Network request failed: Packet dropped by simulation engine.");
  }

  // 2. Simulate Network Latency
  if (networkConfig.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, networkConfig.latencyMs));
  }
}
