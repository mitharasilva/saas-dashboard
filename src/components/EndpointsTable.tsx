import type { EndpointStat } from "../types";

export default function EndpointsTable({ data }: { data: EndpointStat[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-gray-500 text-xs border-b border-gray-800">
          <th className="text-left pb-2 font-medium">Endpoint</th>
          <th className="text-right pb-2 font-medium">Calls</th>
          <th className="text-right pb-2 font-medium">Errors</th>
          <th className="text-right pb-2 font-medium">Avg Latency</th>
          <th className="text-right pb-2 font-medium">Traffic</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {data.map(row => (
          <tr key={row.endpoint} className="text-gray-300">
            <td className="py-2.5 font-mono text-xs text-gray-400">{row.endpoint}</td>
            <td className="py-2.5 text-right">{row.calls.toLocaleString()}</td>
            <td className="py-2.5 text-right">
              <span className={row.errorPct > 5 ? "text-red-400" : row.errorPct > 1 ? "text-amber-400" : ""}>
                {row.errorPct}%
              </span>
            </td>
            <td className="py-2.5 text-right">{Math.round(row.avgLatencyMs)}ms</td>
            <td className="py-2.5 text-right text-gray-500">{row.trafficSharePct}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}