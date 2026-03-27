import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getUsage, getPerformance, getEndpoints, getInsights } from "../api/metrics";
import KpiCard from "../components/KpiCard";
import UsageChart from "../components/UsageChart";
import PerformanceChart from "../components/PerformanceChart";
import EndpointsTable from "../components/EndpointsTable";
import InsightCard from "../components/InsightCard";

export default function Dashboard() {
  const { clientName, planTier, signOut } = useAuth();

  const { data: usage, isLoading: loadingUsage } = useQuery({
    queryKey: ["usage"],
    queryFn: getUsage,
    staleTime: 1000 * 60 * 5,
  });

  const { data: performance, isLoading: loadingPerf } = useQuery({
    queryKey: ["performance"],
    queryFn: getPerformance,
    staleTime: 1000 * 60 * 5,
  });

  const { data: endpoints } = useQuery({
    queryKey: ["endpoints"],
    queryFn: getEndpoints,
    staleTime: 1000 * 60 * 5,
  });

  const { data: insights } = useQuery({
    queryKey: ["insights"],
    queryFn: getInsights,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-800 flex flex-col p-4 shrink-0">
        <div className="mb-8">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2" />
          <span className="text-sm font-medium">SaasDashboard</span>
        </div>
        <nav className="flex-1 space-y-1 text-sm text-gray-400">
          <div className="px-3 py-2 rounded-lg bg-gray-800 text-white">Overview</div>
          <div className="px-3 py-2 rounded-lg hover:bg-gray-900 cursor-pointer">Usage</div>
          <div className="px-3 py-2 rounded-lg hover:bg-gray-900 cursor-pointer">Performance</div>
          <div className="px-3 py-2 rounded-lg hover:bg-gray-900 cursor-pointer">Insights</div>
        </nav>
        <div className="border-t border-gray-800 pt-4 text-xs text-gray-500">
          <div className="text-gray-300 font-medium text-sm">{clientName}</div>
          <div className="capitalize mt-0.5">{planTier} plan</div>
          <button
            onClick={signOut}
            className="mt-3 text-red-400 hover:text-red-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-xl font-medium">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Last 24 hours</p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <KpiCard
            label="Total API Calls"
            value={loadingUsage ? "—" : usage?.totalCalls.toLocaleString() ?? "0"}
            accent="emerald"
          />
          <KpiCard
            label="Error Rate"
            value={loadingUsage ? "—" : `${usage?.errorRatePct ?? 0}%`}
            accent={usage && usage.errorRatePct > 5 ? "red" : "emerald"}
          />
          <KpiCard
            label="Avg Response"
            value={loadingPerf ? "—" : `${Math.round(performance?.avgResponseMs ?? 0)}ms`}
            accent={performance && performance.avgResponseMs > 500 ? "amber" : "emerald"}
          />
          <KpiCard
            label="P95 Latency"
            value={loadingPerf ? "—" : `${Math.round(performance?.p95ResponseMs ?? 0)}ms`}
            accent={performance && performance.p95ResponseMs > 1000 ? "red" : "emerald"}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-medium mb-4">API Calls (hourly)</h2>
            {usage ? <UsageChart data={usage.hourly} /> : <ChartSkeleton />}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-medium mb-4">Response Time (daily)</h2>
            {performance ? <PerformanceChart data={performance.daily} /> : <ChartSkeleton />}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-medium mb-4">Endpoint Breakdown</h2>
            {endpoints ? <EndpointsTable data={endpoints} /> : <p className="text-gray-600 text-sm">No data</p>}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-medium mb-4">Insights</h2>
            <div className="space-y-3">
              {insights?.length
                ? insights.slice(0, 4).map(i => <InsightCard key={i.id} insight={i} />)
                : <p className="text-gray-600 text-sm">No insights yet</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-48 bg-gray-800 rounded-lg animate-pulse" />;
}