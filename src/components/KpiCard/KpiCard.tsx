import styles from "./KpiCard.module.css";

type Accent = "emerald" | "amber" | "red";

interface Props {
  label: string;
  value: string;
  accent: Accent;
}

const accentBar: Record<Accent, string> = {
  emerald: styles.barEmerald,
  amber:   styles.barAmber,
  red:     styles.barRed,
};

const KpiCard = ({ label, value, accent }: Props) => {
  return (
    <div className={styles.card}>
      <div className={`${styles.bar} ${accentBar[accent]}`} />
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}
export default KpiCard; 