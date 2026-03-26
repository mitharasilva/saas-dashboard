import api from "./axios";
import type {
  UsageSummary,
  PerformanceSummary,
  EndpointStat,
  Insight,
} from "../types";

const range = () => {
  const to = new Date().toISOString();
  const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  return { from, to };
};

export const getUsage = async (): Promise<UsageSummary> => {
  const { from, to } = range();
  const res = await api.get("/metrics/usage", { params: { from, to } });
  return res.data;
};

export const getPerformance = async (): Promise<PerformanceSummary> => {
  const { from, to } = range();
  const res = await api.get("/metrics/performance", { params: { from, to } });
  return res.data;
};

export const getEndpoints = async (): Promise<EndpointStat[]> => {
  const { from, to } = range();
  const res = await api.get("/metrics/endpoints", { params: { from, to } });
  return res.data;
};

export const getInsights = async (): Promise<Insight[]> => {
  const res = await api.get("/metrics/insights");
  return res.data;
};
