export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  clientName: string;
  planTier: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface HourlyDataPoint {
  hour: string;
  calls: number;
  errors: number;
  avgLatencyMs: number;
}

export interface UsageSummary {
  totalCalls: number;
  totalErrors: number;
  errorRatePct: number;
  hourly: HourlyDataPoint[];
}

export interface DailySnapshot {
  date: string;
  avgResponseMs: number;
  p95ResponseMs: number;
  errorRate: number;
  requestCount: number;
}

export interface PerformanceSummary {
  avgResponseMs: number;
  p95ResponseMs: number;
  daily: DailySnapshot[];
}

export interface EndpointStat {
  endpoint: string;
  calls: number;
  errors: number;
  errorPct: number;
  avgLatencyMs: number;
  trafficSharePct: number;
}

export interface Insight {
  id: number;
  category: string;
  title: string;
  body: string;
  isRead: boolean;
  generatedAt: string;
}
