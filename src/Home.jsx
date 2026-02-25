import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";

// ── Stripe accent colors per theme ─────────────────────────
const STRIPES = {
  dark: {
    stripeA: "var(--accent1)",
    stripeB: "var(--accent2)",
    stripeC: "var(--accent3)",
    stripeD: "var(--accent4)"
  },
  light: {
    stripeA: "var(--accent1)",
    stripeB: "var(--accent2)",
    stripeC: "var(--accent3)",
    stripeD: "var(--accent4)"
  },
};

// ── Static data ────────────────────────────────────────────
const stats = [
  { label: "Total Data Sources", value: 24, change: "+12%", icon: "db", stripe: "stripeA" },
  { label: "Active Data Sets", value: 156, change: "+8%", icon: "layers", stripe: "stripeA" },
  { label: "Reports Generated", value: 1234, change: "+23%", icon: "trend", stripe: "stripeA" },
  { label: "Active Users", value: 89, change: "+5%", icon: "users", stripe: "stripeA" },
];

const quickActions = [
  { label: "Data Sources", desc: "Connect and manage your data sources", icon: "db", stripe: "stripeA" },
  { label: "Data Sets", desc: "Create and manage your data sets", icon: "layers", stripe: "stripeA" },
  { label: "Get Started", desc: "Learn how to use PCSoft Analytics", icon: "star", stripe: "stripeA" },
];

const activity = [
  { icon: "report", title: "New report generated", sub: "by Sarah Johnson", time: "5 min ago", dot: "var(--accent1)" },
  { icon: "db", title: "Data source connected", sub: "PostgreSQL DB added", time: "23 min ago", dot: "var(--accent1)" },
  { icon: "layers", title: "Data set updated", sub: "Q4 Sales Dataset", time: "1 hr ago", dot: "var(--accent1)" },
  { icon: "alert", title: "Scheduled report failed", sub: "Monthly Summary", time: "2 hr ago", dot: "var(--accent1)" },
  { icon: "user", title: "New user joined", sub: "mike@company.com", time: "3 hr ago", dot: "var(--accent1)" },
];

const navItems = [
  { label: "Home", icon: "home" },
  { label: "Data Sources", icon: "db" },
  { label: "Data Sets", icon: "layers" },
  { label: "Reports", icon: "report" },
  { label: "Dashboards", icon: "dash" },
  { label: "Analytics Expert", icon: "ai", aiBadge: true },
  { label: "Questions", icon: "question" },
];

// ── Icons ──────────────────────────────────────────────────
function Icon({ name, size = 18, color = "currentColor" }) {
  const s = { width: size, height: size };
  const icons = {
    home: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    db: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    layers: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    report: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    question: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    dash: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    trend: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    users: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    star: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    alert: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    user: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    arrow: (
      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
  };
  return icons[name] || null;
}

// ── Animated number counter ────────────────────────────────
function AnimatedNumber({ target, duration = 1400 }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      v += step;
      if (v >= target) { setCur(target); clearInterval(id); }
      else setCur(Math.floor(v));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return <span>{cur.toLocaleString()}</span>;
}

// ── Section label ──────────────────────────────────────────
function SectionLabel({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <span className="text-[0.62rem] font-bold tracking-[0.11em] uppercase text-[var(--text-muted)]">
        {children}
      </span>
      {right}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────
export default function PCSoftAnalytics() {
  const { isDark } = useTheme();
  const [activeNav, setActiveNav] = useState("Home");
  const [dsSearch, setDsSearch] = useState("");
  const [priorityDashboards, setPriorityDashboards] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pcsoft-priority-dashboards")) || []; }
    catch { return []; }
  });
  const [dashboardFilter, setDashboardFilter] = useState("All Dashboards");

  const navigate = useNavigate();

  // Listen for priority dashboard changes from the Dashboards page
  useEffect(() => {
    const handler = () => {
      try {
        const val = JSON.parse(localStorage.getItem("pcsoft-priority-dashboards")) || [];
        setPriorityDashboards(val);
      } catch { setPriorityDashboards([]); }
    };
    window.addEventListener("priority-dashboards-changed", handler);
    window.addEventListener("storage", handler);
    window.addEventListener("focus", handler);
    return () => {
      window.removeEventListener("priority-dashboards-changed", handler);
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", handler);
    };
  }, []);

  const S = isDark ? STRIPES.dark : STRIPES.light;

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  const handleNavClick = (label) => {
    if (label === "Dashboards") navigate("/dashboards");
    else setActiveNav(label);
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-[var(--bg)] text-[var(--text)] font-sans">
      {/* ── Sidebar ──────────────────────────────────── */}
      <Sidebar
        navItems={navItems}
        onNavClick={handleNavClick}
        activeNav={activeNav}
        logo={logo}
      />

      {/* ── Main content ─────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Top bar ───────────────────────────────── */}
        <div className="flex items-center justify-between px-7 pt-7 pb-3 shrink-0 transition-colors duration-300 gap-6 border-b border-b-[var(--border)] bg-[var(--topbar-bg)]">
          {/* ── Left: Data Sources section ─────────── */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Data Sources label */}
            <div className="flex items-center gap-2 shrink-0">
              <Icon name="db" size={18} color="var(--nav-active)" />
              <span className="text-[0.92rem] font-bold tracking-[-0.01em] whitespace-nowrap text-[var(--text)]">
                Data Sources
              </span>
            </div>

            {/* Search */}
            <div className="ds-search flex items-center gap-2 rounded-[9px] px-3 py-[6px] min-w-[180px] max-w-[260px] flex-1 bg-[var(--bg-input)] border border-[var(--border)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search data sources..."
                value={dsSearch}
                onChange={(e) => setDsSearch(e.target.value)}
                className="text-[0.78rem] w-full bg-transparent outline-none text-[var(--text)] caret-[var(--nav-active)]"
              />
            </div>

            {/* Dashboard Filter (only if priority dashboards exist) */}
            {priorityDashboards.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--nav-active)" strokeWidth="2" className="shrink-0">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                <select
                  value={dashboardFilter}
                  onChange={(e) => setDashboardFilter(e.target.value)}
                  className="ds-select text-[0.74rem] font-medium rounded-[8px] px-[10px] py-[6px] cursor-pointer outline-none bg-[var(--bg-input)] text-[var(--text)] border border-[var(--border)]"
                >
                  <option value="All Dashboards">All Dashboards</option>
                  {priorityDashboards.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ── Right: Notifications + Avatar ───────────── */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Notifications bell */}
            <div className="relative cursor-pointer" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div className="absolute -top-[2px] -right-[2px] w-2 h-2 rounded-full bg-[#ff5555] border-2 border-[var(--topbar-bg)]" />
            </div>
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[0.68rem] font-bold text-white cursor-pointer tracking-[0.02em] [box-shadow:0_2px_8px_rgba(124,58,237,0.30)]"
              style={{ background: "var(--nav-active-bg)" }}
            >
              JD
            </div>
          </div>
        </div>

        {/* ── Scrollable content ──────────────────────── */}
        <div className="flex-1 overflow-auto p-7 flex flex-col gap-7">

          {/* ── Stat Cards ──────────────────────────── */}
          <div>
            <SectionLabel>Overview</SectionLabel>
            <div className="grid grid-cols-4 gap-3.5">
              {stats.map((s, i) => {
                const color = S[s.stripe];
                return (
                  <div
                    key={s.label}
                    className="stat-card fade-up rounded-xl relative p-[18px_20px] bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)]"
                    style={{ borderLeft: `3px solid ${color}`, animationDelay: `${0.05 + i * 0.07}s` }}
                  >
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center mb-3.5 rounded-lg w-[34px] h-[34px]"
                      style={{ background: `${color}1a`, border: `1px solid ${color}30` }}
                    >
                      <Icon name={s.icon} size={15} color={color} />
                    </div>
                    {/* Label */}
                    <div className="text-[0.68rem] font-medium tracking-[0.03em] mb-[5px] text-[var(--text-muted)]">
                      {s.label}
                    </div>
                    {/* Value */}
                    <div className="text-[1.85rem] font-bold leading-none tracking-[-0.02em] mb-[10px] font-mono text-[var(--text)]">
                      <AnimatedNumber target={s.value} />
                    </div>
                    {/* Change */}
                    <div className="flex items-center gap-[5px]">
                      <span className="text-[0.68rem] font-semibold font-mono text-[var(--positive)]">
                        ↑ {s.change}
                      </span>
                      <span className="text-[0.65rem] text-[var(--text-muted)]">vs last month</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Quick Actions ──────────────────────── */}
          <div className="fade-up" style={{ animationDelay: "0.28s" }}>
            <SectionLabel>Quick Actions</SectionLabel>
            <div className="grid grid-cols-3 gap-3.5">
              {quickActions.map((qa) => {
                const color = S[qa.stripe];
                return (
                  <div
                    key={qa.label}
                    className="qa-card rounded-xl cursor-pointer p-[20px_22px] bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)]"
                    style={{ borderTop: `2px solid ${color}` }}
                  >
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center mb-3.5 rounded-lg w-[38px] h-[38px]"
                      style={{ background: `${color}1a`, border: `1px solid ${color}28` }}
                    >
                      <Icon name={qa.icon} size={17} color={color} />
                    </div>
                    <div className="text-[0.9rem] font-semibold mb-[6px] text-[var(--text)]">
                      {qa.label}
                    </div>
                    <div className="text-[0.76rem] leading-[1.55] mb-4 text-[var(--text-sub)]">
                      {qa.desc}
                    </div>
                    <div
                      className="explore-link inline-flex items-center gap-[3px] text-[0.73rem] font-semibold cursor-pointer tracking-[0.01em]"
                      style={{ color }}
                    >
                      Explore
                      <Icon name="arrow" size={12} color={color} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Recent Activity ─────────────────────── */}
          <div className="fade-up" style={{ animationDelay: "0.42s" }}>
            <SectionLabel right={
              <span className="text-[0.7rem] font-semibold cursor-pointer tracking-[0.01em] text-[var(--nav-active)]">
                View all →
              </span>
            }>
              Recent Activity
            </SectionLabel>

            <div className="rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)]">
              {activity.map((a, i) => (
                <div
                  key={i}
                  className="activity-row flex items-center gap-[14px] px-[18px] py-[13px]"
                  style={{ borderBottom: i < activity.length - 1 ? "1px solid var(--divider)" : "none" }}
                >
                  {/* Icon badge */}
                  <div
                    className="w-[34px] h-[34px] rounded-[9px] shrink-0 flex items-center justify-center"
                    style={{ background: `${a.dot}18`, border: `1px solid ${a.dot}28` }}
                  >
                    <Icon name={a.icon} size={14} color={a.dot} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.8rem] font-medium whitespace-nowrap overflow-hidden text-ellipsis text-[var(--text)]">
                      {a.title}
                    </div>
                    <div className="text-[0.68rem] mt-[2px] text-[var(--text-muted)]">
                      {a.sub}
                    </div>
                  </div>
                  <div className="text-[0.63rem] shrink-0 tracking-[0.02em] font-mono text-[var(--text-muted)]">
                    {a.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>{/* end scrollable */}
      </div>{/* end main */}
    </div>
  );
}
