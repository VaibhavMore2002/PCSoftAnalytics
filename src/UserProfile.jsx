import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";
import { useApp } from "./AppContext.jsx";
import { Sk } from "./Skeleton.jsx";

// ── Icons ──────────────────────────────────────────────────
function Icon({ name, size = 18, color = "currentColor" }) {
  const s = { width: size, height: size };
  const icons = {
    home: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>),
    db: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>),
    layers: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>),
    report: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>),
    dash: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>),
    ai: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2v1a1 1 0 0 1-2 0v-1H7v1a1 1 0 0 1-2 0v-1a2 2 0 0 1-2-2v-1H2a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z" /><circle cx="9" cy="14" r="1" fill={color} stroke="none" /><circle cx="15" cy="14" r="1" fill={color} stroke="none" /></svg>),
    question: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>),
    user: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>),
    mail: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,4 12,13 2,4" /></svg>),
    shield: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
    clock: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>),
    trend: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>),
    settings: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>),
    check: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>),
    arrow: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>),
    logout: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>),
  };
  return icons[name] || null;
}

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

const ACTIVITY = [
  { icon: "dash",   title: "Viewed dashboard",     sub: "Am_All_Chart",          time: "2h ago",  dot: "var(--accent1)" },
  { icon: "report", title: "Generated report",      sub: "Monthly Summary",       time: "5h ago",  dot: "var(--accent1)" },
  { icon: "db",     title: "Connected data source", sub: "PostgreSQL prod",        time: "1d ago",  dot: "var(--accent1)" },
  { icon: "layers", title: "Updated dataset",       sub: "Q4 Sales Dataset",      time: "2d ago",  dot: "var(--accent1)" },
  { icon: "settings","title": "Changed settings",   sub: "Switched to dark theme", time: "3d ago",  dot: "var(--accent1)" },
];

// fix: title is a duplicate key in the object literal above, use proper var
const ACTIVITY_NAV = { dash: "/dashboards", report: "/", db: "/datasources", layers: "/", settings: "/settings" };

const ACTIVITY_FIXED = [
  { icon: "dash",     title: "Viewed dashboard",      sub: "Am_All_Chart",           time: "2h ago" },
  { icon: "report",   title: "Generated report",       sub: "Monthly Summary",        time: "5h ago" },
  { icon: "db",       title: "Connected data source",  sub: "PostgreSQL prod",         time: "1d ago" },
  { icon: "layers",   title: "Updated dataset",        sub: "Q4 Sales Dataset",       time: "2d ago" },
  { icon: "settings", title: "Changed settings",       sub: "Switched to dark theme",  time: "3d ago" },
];

const ROLE_CONFIG = {
  admin:   { label: "Admin",   bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.25)",   color: "#ef4444" },
  analyst: { label: "Analyst", bg: "rgba(96,165,250,0.10)",  border: "rgba(96,165,250,0.25)",  color: "#60a5fa" },
  viewer:  { label: "Viewer",  bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.25)", color: "#94a3b8" },
};

export default function UserProfile() {
  const { isDark } = useTheme();
  const { navItems, activeNav, handleNavClick, user, logout, api } = useApp();
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState({ dashboards: "—", reports: "—", sources: "—" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api("/api/v1/dashboards/", {}, { limit: 1 }).catch(() => null),
      api("/api/v1/reports/",    {}, { limit: 1 }).catch(() => null),
      api("/api/v1/data-sources/", {}, { limit: 1 }).catch(() => null),
    ]).then(([db, rp, ds]) => {
      if (cancelled) return;
      setStatsData({
        dashboards: db?.total ?? db?.data?.length ?? "—",
        reports:    rp?.total ?? rp?.data?.length ?? "—",
        sources:    ds?.total ?? ds?.data?.length ?? "—",
      });
      setLoading(false);
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [api]);

  const roleKey = (user?.role || "viewer").toLowerCase();
  const roleCfg = ROLE_CONFIG[roleKey] || ROLE_CONFIG.viewer;
  const accent = "var(--accent1)";

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-[var(--bg)] text-[var(--text)] font-sans">
      {/* Sidebar */}
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <div className="flex items-center justify-between px-7 pt-7 pb-3 shrink-0 border-b border-b-[var(--border)] bg-[var(--topbar-bg)] gap-6">
          <div className="flex items-center gap-3">
            <Icon name="user" size={18} color="var(--nav-active)" />
            <span className="text-[0.92rem] font-bold tracking-[-0.01em] text-[var(--text)]">
              User Profile
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative cursor-pointer" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div className="absolute -top-[2px] -right-[2px] w-2 h-2 rounded-full bg-[#ff5555] border-2 border-[var(--topbar-bg)]" />
            </div>
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[0.68rem] font-bold text-white cursor-pointer tracking-[0.02em] [box-shadow:0_2px_8px_rgba(124,58,237,0.30)]"
              style={{ background: "var(--nav-active-bg)" }}
              onClick={() => navigate("/profile")}
              title="My Profile"
            >
              {user?.initials || "U"}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-7 flex flex-col gap-7">

          {loading ? (
            /* ─── SKELETON ─── */
            <>
              {/* Hero card skeleton */}
              <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6 flex items-center gap-5"
                style={{ borderTop: "2px solid var(--border)" }}>
                <Sk w={64} h={64} r={14} />
                <div className="flex-1 flex flex-col gap-2.5">
                  <Sk w="40%" h={18} />
                  <Sk w="60%" h={11} />
                  <Sk w="25%" h={10} />
                </div>
                <div className="flex gap-2">
                  <Sk w={90} h={34} r={9} />
                  <Sk w={80} h={34} r={9} />
                </div>
              </div>

              {/* Stats row skeleton */}
              <div className="grid grid-cols-3 gap-3.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl p-[18px_20px] bg-[var(--bg-card)] border border-[var(--border)] flex flex-col gap-3"
                    style={{ borderLeft: "3px solid var(--border)" }}>
                    <Sk w={32} h={32} r={8} />
                    <Sk w={52} h={22} r={5} />
                    <Sk w="65%" h={10} />
                  </div>
                ))}
              </div>

              {/* Preferences + Activity skeleton */}
              <div className="grid grid-cols-2 gap-3.5">
                {[0, 1].map((col) => (
                  <div key={col} className="rounded-xl p-[18px_20px] bg-[var(--bg-card)] border border-[var(--border)] flex flex-col gap-3">
                    <Sk w="35%" h={10} />
                    {[0, 1, 2].map((row) => (
                      <div key={row} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
                        <Sk w={28} h={28} r={7} />
                        <div className="flex-1 flex flex-col gap-1.5">
                          <Sk w="30%" h={8} />
                          <Sk w="55%" h={11} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ─── REAL CONTENT ─── */
            <>
          {/* ── Profile Hero Card ─────────────────── */}
          <div
            className="fade-up rounded-xl bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)] shrink-0"
            style={{ borderTop: "2px solid var(--accent1)", animationDelay: "0.05s" }}
          >
            {/* Top row: avatar + info + actions */}
            <div className="flex items-start gap-5 p-6">
              {/* Avatar */}
              <div
                className="w-[64px] h-[64px] rounded-2xl flex items-center justify-center text-[1.4rem] font-bold text-white shrink-0 [box-shadow:0_4px_20px_rgba(124,58,237,0.35)]"
                style={{ background: "var(--nav-active-bg)" }}
              >
                {user?.initials || "U"}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 pt-[2px]">
                <div className="flex items-center gap-2 mb-[6px]">
                  <h1 className="text-[1.1rem] font-bold tracking-[-0.01em] text-[var(--text)] truncate">
                    {user?.name || "User"}
                  </h1>
                  <span
                    className="text-[0.62rem] font-bold px-[10px] py-[3px] rounded-full tracking-[0.07em] uppercase shrink-0 whitespace-nowrap"
                    style={{ background: roleCfg.bg, border: `1px solid ${roleCfg.border}`, color: roleCfg.color }}
                  >
                    {roleCfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-[5px]">
                  <Icon name="mail" size={12} color="var(--text-muted)" />
                  <span className="text-[0.74rem] text-[var(--text-muted)] truncate">{user?.email || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="check" size={12} color="#4ade80" />
                  <span className="text-[0.72rem] font-medium" style={{ color: "#4ade80" }}>Active account</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-[2px]">
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-1.5 text-[0.73rem] font-semibold px-3 py-[7px] rounded-[8px] cursor-pointer transition-all duration-150 border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text)] hover:border-[var(--nav-active)]"
                >
                  <Icon name="settings" size={13} color="var(--text-muted)" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-[0.73rem] font-semibold px-3 py-[7px] rounded-[8px] cursor-pointer transition-all duration-150 border"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#ef4444" }}
                >
                  <Icon name="logout" size={13} color="#ef4444" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* ── Stats row ─────────────────────────── */}
          <div className="grid grid-cols-3 gap-3.5 fade-up" style={{ animationDelay: "0.12s" }}>
            {[
              { icon: "dash",   label: "Total Dashboards",  value: statsData.dashboards, color: "var(--accent1)" },
              { icon: "report", label: "Total Reports",      value: statsData.reports,    color: "var(--accent2)" },
              { icon: "db",     label: "Total Data Sources", value: statsData.sources,    color: "var(--accent3)" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-[18px_20px] bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)]"
                style={{ borderLeft: `3px solid ${s.color}` }}
              >
                <div
                  className="flex items-center justify-center mb-3 rounded-lg w-[32px] h-[32px]"
                  style={{ background: `${s.color}1a`, border: `1px solid ${s.color}30` }}
                >
                  <Icon name={s.icon} size={14} color={s.color} />
                </div>
                <div className="text-[1.6rem] font-bold leading-none tracking-[-0.02em] mb-1 text-[var(--text)]">{s.value}</div>
                <div className="text-[0.68rem] font-medium text-[var(--text-muted)]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Two col: Preferences + Activity ───── */}
          <div className="grid grid-cols-2 gap-3.5 fade-up" style={{ animationDelay: "0.20s" }}>

            {/* ── Preferences ──── */}
            <div className="rounded-xl p-[18px_20px] bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)]">
              <SectionLabel>Preferences</SectionLabel>
              <div className="space-y-2">
                {[
                  { icon: isDark ? "moon" : "sun", label: "Theme", value: isDark ? "Dark Mode" : "Light Mode", action: () => navigate("/settings"), actionLabel: "Change" },
                  { icon: "shield", label: "Role",   value: roleCfg.label, action: null },
                  { icon: "mail",   label: "Email",  value: user?.email || "—", action: null },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-[12px] py-[10px] rounded-[9px]"
                    style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}
                  >
                    <div
                      className="flex items-center justify-center w-[28px] h-[28px] rounded-[7px] shrink-0"
                      style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
                    >
                      <Icon name={row.icon} size={13} color="var(--nav-active)" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[0.65rem] font-medium text-[var(--text-muted)]">{row.label}</div>
                      <div className="text-[0.78rem] font-semibold text-[var(--text)] truncate">{row.value}</div>
                    </div>
                    {row.action && (
                      <button
                        onClick={row.action}
                        className="text-[0.68rem] font-semibold shrink-0 cursor-pointer"
                        style={{ color: "var(--nav-active)" }}
                      >
                        {row.actionLabel} →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Recent Activity ── */}
            <div className="rounded-xl p-[18px_20px] bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)]">
              <SectionLabel right={
                <span className="text-[0.7rem] font-semibold cursor-pointer" style={{ color: "var(--nav-active)" }}>
                  View all →
                </span>
              }>
                Activity Summary
              </SectionLabel>
              <div className="space-y-[6px]">
                {ACTIVITY_FIXED.map((a, i) => {
                  const dest = ACTIVITY_NAV[a.icon] || "/";
                  return (
                    <div
                      key={i}
                      onClick={() => navigate(dest)}
                      className="flex items-center gap-[10px] px-[10px] py-[8px] rounded-[8px] cursor-pointer transition-colors duration-150 hover:bg-[var(--bg-active)]"
                      style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}
                    >
                      <div
                        className="w-[28px] h-[28px] rounded-[7px] shrink-0 flex items-center justify-center"
                        style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
                      >
                        <Icon name={a.icon} size={12} color="var(--nav-active)" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.75rem] font-medium text-[var(--text)] truncate">{a.title}</div>
                        <div className="text-[0.64rem] text-[var(--text-muted)] truncate">{a.sub}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[0.60rem] text-[var(--text-muted)]">{a.time}</span>
                        <Icon name="arrow" size={10} color="var(--text-muted)" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
            </>
          )}

        </div>{/* end scrollable */}
      </div>{/* end main */}
    </div>
  );
}
