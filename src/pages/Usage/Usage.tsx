import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { getUsage } from "../../api/metrics";
import Sidebar from "../../components/Sidebar/Sidebar";
import KpiCard from "../../components/KpiCard/KpiCard";
import type { HourlyDataPoint } from "../../types";
import styles from "./Usage.module.css";

type Range = "24h" | "7d" | "30d";
const RANGE_HOURS: Record<Range, number> = { "24h": 24, "7d": 168, "30d": 720 };
const RANGE_LABELS: Record<Range, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};
const RANGES: Range[] = ["24h", "7d", "30d"];

export default function Usage() {
  const [range, setRange] = useState<Range>("24h");
  const hours = RANGE_HOURS[range];

  const { data: usage, isLoading } = useQuery({
    queryKey: ["usage", hours],
    queryFn: () => getUsage(hours),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.main}>

        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Usage</h1>
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
            label="Total Calls"
            value={isLoading ? "—" : usage?.totalCalls.toLocaleString() ?? "0"}
            accent="emerald"
          />
          <KpiCard
            label="Total Errors"
            value={isLoading ? "—" : usage?.totalErrors.toLocaleString() ?? "0"}
            accent={usage && usage.totalErrors > 0 ? "red" : "emerald"}
          />
          <KpiCard
            label="Error Rate"
            value={isLoading ? "—" : `${usage?.errorRatePct ?? 0}%`}
            accent={usage && usage.errorRatePct > 5 ? "red" : "emerald"}
          />
        </div>

        {/* Charts */}
        <div className={styles.chartsGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Call Volume</h2>
            {usage ? <CallVolumeChart data={usage.hourly} /> : <Skeleton />}
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Errors</h2>
            {usage ? <ErrorChart data={usage.hourly} /> : <Skeleton />}
          </div>
        </div>

        {/* Breakdown table */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Hourly Breakdown</h2>
          {usage ? <HourlyTable key={range} data={usage.hourly} /> : <Skeleton />}
        </div>

      </main>
    </div>
  );
}

function CallVolumeChart({ data }: { data: HourlyDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8 }}
          labelStyle={{ color: "#9ca3af" }}
          itemStyle={{ color: "#10b981" }}
        />
        <Area type="monotone" dataKey="calls" stroke="#10b981" fill="url(#callsGrad)" strokeWidth={2} name="Calls" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ErrorChart({ data }: { data: HourlyDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="errorsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8 }}
          labelStyle={{ color: "#9ca3af" }}
          itemStyle={{ color: "#ef4444" }}
        />
        <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="url(#errorsGrad)" strokeWidth={2} name="Errors" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const PAGE_SIZE = 10;

function HourlyTable({ data }: { data: HourlyDataPoint[] }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = data.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.theadRow}>
            <th className={styles.thLeft}>Time</th>
            <th className={styles.thRight}>Calls</th>
            <th className={styles.thRight}>Errors</th>
            <th className={styles.thRight}>Error %</th>
            <th className={styles.thRight}>Avg Latency</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {pageRows.map(row => {
            const errorPct = row.calls > 0 ? ((row.errors / row.calls) * 100).toFixed(1) : "0.0";
            return (
              <tr key={row.hour} className={styles.tableRow}>
                <td className={styles.cellMono}>{row.hour}</td>
                <td className={styles.cell}>{row.calls.toLocaleString()}</td>
                <td className={styles.cell}>{row.errors.toLocaleString()}</td>
                <td className={styles.cell}>
                  <span className={
                    Number(errorPct) > 5 ? styles.errorHigh
                    : Number(errorPct) > 1 ? styles.errorMed
                    : ""
                  }>
                    {errorPct}%
                  </span>
                </td>
                <td className={styles.cell}>{Math.round(row.avgLatencyMs)}ms</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            {start + 1}–{Math.min(start + PAGE_SIZE, data.length)} of {data.length}
          </span>
          <div className={styles.pageButtons}>
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className={styles.pageBtn}
            >
              ‹ Prev
            </button>
            <span className={styles.pageCount}>{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className={styles.pageBtn}
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return <div className={styles.skeleton} />;
}
