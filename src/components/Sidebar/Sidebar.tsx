import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/dashboard",   label: "Overview" },
  { to: "/usage",       label: "Usage" },
  { to: "/performance", label: "Performance" },
  { to: "/insights",    label: "Insights" },
];

const Sidebar = () => {
  const { clientName, planTier, signOut } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/SaasDashboardLogo.png" alt="SaasDashboard logo" className={styles.logoImg} />
        <span className={styles.logoText}>SaasDashboard</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <div className={styles.clientName}>{clientName}</div>
        <div className={styles.planTier}>{planTier} plan</div>
        <button onClick={signOut} className={styles.signOut}>Sign out</button>
      </div>
    </aside>
  );
}

export default Sidebar;
