import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { getPerformance } from "../../api/metrics";
import Sidebar from "../../components/Sidebar/Sidebar";
import KpiCard from "../../components/KpiCard/KpiCard";
import type { DailySnapshot } from "../../types";
import styles from "./Performance.module.css";

type Range = "24h" | "7d" | "30d";
const RANGE_HOURS: Record<Range, number> = { "24h": 24, "7d": 168, "30d": 720 };
const RANGE_LABELS: Record<Range, string> = {
  "24h": "Last 24 hours",
  "7d":  "Last 7 days",
  "30d": "Last 30 days",
};
const RANGES: Range[] = ["24h", "7d", "30d"];

export default function Performance() {
  const [range, setRange] = useState<Range>("24h");
  const hours = RANGE_HOURS[range];

  const { data: perf, isLoading } = useQuery({
    queryKey: ["performance", hours],
    queryFn: () => getPerformance(hours),
    staleTime: 1000 * 60 * 5,
  });

  const avgErrorRate = perf
    ? (perf.daily.reduce((sum, d) => sum + d.errorRate, 0) / (perf.daily.length || 1)).toFixed(1)
    : "0";

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.main}>

        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Performance</h1>
            <p className={styles.pageSubtitle}>{RANGE_LABELS[range]}</p>
          </div>
          <div className={styles.rangePicker}>
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={r === range ? styles.rangeActive : styles.rangeBtn}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* KPI strip */}
        <div className={styles.kpiGrid}>
          <KpiCard
            label="Avg Response"
            value={isLoading ? "—" : `${Math.round(perf?.avgResponseMs ?? 0)}ms`}
            accent={perf && perf.avgResponseMs > 500 ? "amber" : "emerald"}
          />
          <KpiCard
            label="P95 Latency"
            value={isLoading ? "—" : `${Math.round(perf?.p95ResponseMs ?? 0)}ms`}
            accent={perf && perf.p95ResponseMs > 1000 ? "red" : "emerald"}
          />
          <KpiCard
            label="Avg Error Rate"
            value={isLoading ? "—" : `${avgErrorRate}%`}
            accent={Number(avgErrorRate) > 5 ? "red" : "emerald"}
          />
        </div>

        {/* Latency chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Latency Over Time</h2>
          {perf ? <LatencyChart data={perf.daily} /> : <Skeleton />}
        </div>

        {/* Daily table */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Daily Breakdown</h2>
          {perf ? <DailyTable data={perf.daily} /> : <Skeleton />}
        </div>

      </main>
    </div>
  );
}

function LatencyChart({ data }: { data: DailySnapshot[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} unit="ms" />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8 }}
          labelStyle={{ color: "#9ca3af" }}
          formatter={(val) => `${val}ms`}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="avgResponseMs" stroke="#3b82f6" strokeWidth={2} dot={false} name="Avg (ms)" />
        <Line type="monotone" dataKey="p95ResponseMs" stroke="#a855f7" strokeWidth={2} dot={false} name="P95 (ms)" />
      </LineChart>
    </ResponsiveContainer>
  );
}

function DailyTable({ data }: { data: DailySnapshot[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.theadRow}>
          <th className={styles.thLeft}>Date</th>
          <th className={styles.thRight}>Requests</th>
          <th className={styles.thRight}>Avg (ms)</th>
          <th className={styles.thRight}>P95 (ms)</th>
          <th className={styles.thRight}>Error Rate</th>
        </tr>
      </thead>
      <tbody className={styles.tbody}>
        {data.map(row => (
          <tr key={row.date} className={styles.tableRow}>
            <td className={styles.cellMono}>{row.date}</td>
            <td className={styles.cell}>{row.requestCount.toLocaleString()}</td>
            <td className={styles.cell}>
              <span className={row.avgResponseMs > 500 ? styles.latencyHigh : ""}>
                {Math.round(row.avgResponseMs)}
              </span>
            </td>
            <td className={styles.cell}>
              <span className={row.p95ResponseMs > 1000 ? styles.latencyHigh : ""}>
                {Math.round(row.p95ResponseMs)}
              </span>
            </td>
            <td className={styles.cell}>
              <span className={row.errorRate > 5 ? styles.errorHigh : row.errorRate > 1 ? styles.errorMed : ""}>
                {row.errorRate.toFixed(1)}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Skeleton() {
  return <div className={styles.skeleton} />;
}
