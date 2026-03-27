import type { EndpointStat } from "../../types";
import styles from "./EndpointsTable.module.css";

const EndpointsTable = ({ data }: { data: EndpointStat[] }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.theadRow}>
          <th className={styles.thLeft}>Endpoint</th>
          <th className={styles.thRight}>Calls</th>
          <th className={styles.thRight}>Errors</th>
          <th className={styles.thRight}>Avg Latency</th>
          <th className={styles.thRight}>Traffic</th>
        </tr>
      </thead>
      <tbody className={styles.tbody}>
        {data.map(row => (
          <tr key={row.endpoint} className={styles.row}>
            <td className={styles.cellEndpoint}>{row.endpoint}</td>
            <td className={styles.cell}>{row.calls.toLocaleString()}</td>
            <td className={styles.cell}>
              <span className={row.errorPct > 5 ? styles.errorHigh : row.errorPct > 1 ? styles.errorMed : ""}>
                {row.errorPct}%
              </span>
            </td>
            <td className={styles.cell}>{Math.round(row.avgLatencyMs)}ms</td>
            <td className={styles.cellTraffic}>{row.trafficSharePct}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default EndpointsTable; 

