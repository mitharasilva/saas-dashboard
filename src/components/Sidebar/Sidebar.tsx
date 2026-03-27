import styles from "./Sidebar.module.css";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () =>{

    const { clientName, planTier, signOut } = useAuth();


    return (
              <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.dot} />
          <span className={styles.logoText}>SaasDashboard</span>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navItemActive}>Overview</div>
          <div className={styles.navItem}>Usage</div>
          <div className={styles.navItem}>Performance</div>
          <div className={styles.navItem}>Insights</div>
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.clientName}>{clientName}</div>
          <div className={styles.planTier}>{planTier} plan</div>
          <button onClick={signOut} className={styles.signOut}>Sign out</button>
        </div>
      </aside>
    )
}
export default Sidebar;