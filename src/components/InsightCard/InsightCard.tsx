import type { Insight } from "../../types";
import styles from "./InsightCard.module.css";

const categoryClass: Record<string, string> = {
  trend:          styles.trend,
  anomaly:        styles.anomaly,
  forecast:       styles.forecast,
  recommendation: styles.recommendation,
};

const InsightCard = ({ insight }: { insight: Insight }) =>{

  const colourClass = categoryClass[insight.category] ?? styles.default;

  return (
    <div className={`${styles.card} ${colourClass} ${insight.isRead ? styles.read : ""}`}>
      <p className={styles.category}>{insight.category}</p>
      <p className={styles.title}>{insight.title}</p>
      {insight.body && <p className={styles.body}>{insight.body}</p>}
    </div>
  );
}
export default InsightCard; 