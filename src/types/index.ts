export interface DBInstance {
    id: string;
    name: string;
    provider: 'AWS' | 'GCP' | 'Azure';
    status: 'healthy' | 'warning' | 'critical';
    region: string;
}

export interface MetricSnapshot {
    id?: string;
    instanceId: string;
    timestamp: number;
    cpuUsage: number; // percentage
    memoryUsage: number; // percentage
    latencyMs: number; // milliseconds
}