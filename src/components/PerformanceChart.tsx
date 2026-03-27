import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { DailySnapshot } from "../types";

export default function PerformanceChart({ data }: { data: DailySnapshot[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8 }}
          labelStyle={{ color: "#9ca3af" }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="avgResponseMs" stroke="#3b82f6" strokeWidth={2} dot={false} name="Avg (ms)" />
        <Line type="monotone" dataKey="p95ResponseMs" stroke="#a855f7" strokeWidth={2} dot={false} name="P95 (ms)" />
      </LineChart>
    </ResponsiveContainer>
  );
}