// types/index.ts - VERSÃO MELHORADA
// ============================================
// 1. TIPOS BASE (já existentes, com melhorias)
// ============================================

export interface DBInstance {
    id: string;
    name: string;
    provider: 'AWS' | 'GCP' | 'Azure';
    status: 'healthy' | 'warning' | 'critical';
    region: string;
    // NOVOS campos para SaaS:
    userId?: string;       // Dono da instância
    tenantId?: string;     // Multi-tenant isolation
    createdAt?: string;    // ISO date
    updatedAt?: string;    // ISO date
}

export interface MetricSnapshot {
    id?: string;
    instanceId: string;
    timestamp: number;     // Unix timestamp (ms)
    cpuUsage: number;      // percentage (0-100)
    memoryUsage: number;   // percentage (0-100)
    latencyMs: number;     // milliseconds
    // NOVOS campos para SaaS:
    userId?: string;       // Quem criou a métrica
    tenantId?: string;     // Multi-tenant isolation
    createdAt?: string;    // ISO date
}

// ============================================
// 2. NOVOS TIPOS PARA AUTENTICAÇÃO
// ============================================

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN' | 'OWNER';
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;     // segundos
}

// ============================================
// 3. NOVOS TIPOS PARA RESPOSTAS DA API
// ============================================

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ErrorResponse {
    error: string;
    message: string;
    status: number;
    details?: Record<string, string[]>;
}

// ============================================
// 4. NOVOS TIPOS PARA STATS E AGREGADOS
// ============================================

export interface InstanceStats {
    instanceId: string;
    instanceName: string;
    totalMetrics: number;
    avgCpu: number;
    avgMemory: number;
    avgLatency: number;
    maxCpu: number;
    maxMemory: number;
    maxLatency: number;
    uptime: number;          // horas
    lastMetricAt: string;    // ISO date
    status: 'healthy' | 'warning' | 'critical';
}

export interface MetricSummary {
    instanceId: string;
    instanceName: string;
    latest: MetricSnapshot;
    stats: {
        avgCpu: number;
        avgMemory: number;
        avgLatency: number;
        maxCpu: number;
        maxMemory: number;
        maxLatency: number;
    };
}

// ============================================
// 5. TIPOS PARA REQUESTS (DTOs)
// ============================================

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

export interface CreateMetricDTO {
    instanceId: string;
    cpuUsage: number;
    memoryUsage: number;
    latencyMs: number;
}

export interface MetricsQueryParams {
    instanceId?: string;
    hours?: number;
    startDate?: string;     // ISO date
    endDate?: string;       // ISO date
    limit?: number;
    offset?: number;
}

// ============================================
// 6. TIPOS PARA O SISTEMA (UI State)
// ============================================

export interface SystemState {
    selectedInstance: string | null;
    timeWindow: number;      // horas
    viewMode: 'dashboard' | 'diagnostics';
    chaosMode: boolean;
}

export interface WebVitals {
    renderTimeMs: number;
    memoryProgress: number;
    jsHeapSizeMB: number;
    jsHeapLimitMB: number;
}

export interface StorageQuota {
    usedMB: number;
    totalMB: number;
    percentage: number;
    supported: boolean;
}