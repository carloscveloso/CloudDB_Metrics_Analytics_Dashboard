// frontend/src/types/index.ts

export interface DBInstance {
  id: string;
  name: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  status: 'healthy' | 'warning' | 'critical';
  region: string;
  userId?: string;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetricSnapshot {
  id?: string;
  instanceId: string;
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
  latencyMs: number;
  userId?: string;
  tenantId?: string;
  createdAt?: string;
}

// Autenticação
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'OWNER';
  tenantId: string;
  createdAt: string;
  updatedAt?: string;
}

// Respostas da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}