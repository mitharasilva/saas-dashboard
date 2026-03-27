import { useQuery } from "@tanstack/react-query";
import { getUsage, getPerformance, getEndpoints, getInsights } from "../../api/metrics";
import Sidebar from "../../components/Sidebar/Sidebar";
import KpiCard from "../../components/KpiCard/KpiCard";
import UsageChart from "../../components/UsageChart";
import PerformanceChart from "../../components/PerformanceChart";
import EndpointsTable from "../../components/EndpointsTable/EndpointsTable";
import InsightCard from "../../components/InsightCard/InsightCard";
import styles from "./Dashboard.module.css";
import type{ UsageSummary, PerformanceSummary } from "../../types";

const ChartSkeleton =() => {
  return <div className={styles.skeleton} />;
}
const Header = () =>{
  return (<div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Overview</h1>
          <p className={styles.pageSubtitle}>Last 24 hours</p>
        </div>)
}

const KpiStrip = ({loadingUsage, usage,loadingPerf, performance} : {loadingUsage:boolean, usage:UsageSummary | undefined, loadingPerf: boolean, performance:PerformanceSummary | undefined}) =>{
  return (
    <div className={styles.kpiGrid}>
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
  )
}

const ChartsRow = ({usage, performance}: {usage:UsageSummary | undefined, performance:PerformanceSummary | undefined}) => {
  return (
          <div className={styles.chartsGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>API Calls (hourly)</h2>
            {usage ? <UsageChart data={usage.hourly} /> : <ChartSkeleton />}
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Response Time (daily)</h2>
            {performance ? <PerformanceChart data={performance.daily} /> : <ChartSkeleton />}
          </div>
        </div>
  );
}

const BottomRow = () =>{
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
    <div className={styles.bottomGrid}>
          <div className={styles.cardWide}>
            <h2 className={styles.cardTitle}>Endpoint Breakdown</h2>
            {endpoints ? <EndpointsTable data={endpoints} /> : <p className={styles.noData}>No data</p>}
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Insights</h2>
            <div className={styles.insightsList}>
              {insights?.length
                ? insights.slice(0, 4).map(i => <InsightCard key={i.id} insight={i} />)
                : <p className={styles.noData}>No insights yet</p>}
            </div>
          </div>
        </div>
  )
}

const Dashboard = () => {

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

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.main}>
        <Header/>
        <KpiStrip loadingUsage={loadingUsage} usage={usage} loadingPerf={loadingPerf} performance={performance}/>
        <ChartsRow usage={usage} performance={performance}/>
        <BottomRow/>
      </main>
    </div>
  );
}

export default Dashboard; 