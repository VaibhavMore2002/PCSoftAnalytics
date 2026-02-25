import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";

// ── Sample dashboard data ───────────────────────────────────
const DASHBOARDS = [
  { id: 1, name: "all-type-charts-dashboard", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "1d ago" },
  { id: 2, name: "DASHBABOARD-2", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "1d ago" },
  { id: 3, name: "m-dashboard", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "Jan 6, 2026" },
  { id: 4, name: "dbsh-2", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "Jan 3, 2026" },
  { id: 5, name: "dbsh", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "Jan 3, 2026" },
  { id: 6, name: "DASHBABOARD-1", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "Dec 24, 2025" },
  { id: 7, name: "TEST", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "Never" },
  { id: 8, name: "m-dashboard (Copy)", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "Never" },
  { id: 9, name: "Sample Dashboard", description: "Main analytics overview", groups: "Analytics", widgets: 5, status: "Active", updated: "2d ago" },
  { id: 10, name: "Test", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "Never" },
  { id: 11, name: "abc", description: "—", groups: "—", widgets: 0, status: "Draft", updated: "Never" },
  { id: 12, name: "Sales Dashboard", description: "Revenue tracking", groups: "Sales", widgets: 8, status: "Active", updated: "3h ago" },
  { id: 13, name: "Marketing Metrics", description: "Campaign performance", groups: "Marketing", widgets: 3, status: "Archived", updated: "Feb 10, 2026" },
];

const STATUS_TABS = ["All", "Active", "Draft", "Archived"];

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
    home: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>),
    db: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>),
    layers: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>),
    report: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>),
    question: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>),
    dash: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>),
    trend: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>),
    users: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
    search: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>),
    refresh: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>),
    plus: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>),
    dots: (<svg {...s} viewBox="0 0 24 24" fill={color} stroke="none"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>),
    filter: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>),
    arrow: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>),
    star: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>),
    settings: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>),
  };
  return icons[name] || null;
}

// ── Status badge ───────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    Draft: { bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.22)", color: "#fbbf24" },
    Active: { bg: "rgba(74,222,128,0.10)", border: "rgba(74,222,128,0.22)", color: "#4ade80" },
    Archived: { bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.22)", color: "#94a3b8" },
  };
  const s = cfg[status] || cfg.Draft;
  return (
    <span
      className="text-[0.65rem] font-bold px-[9px] py-[3px] rounded-full tracking-[0.06em] uppercase"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      {status}
    </span>
  );
}

// ── Main ────────────────────────────────────────────────────
export default function DashboardsPage() {
  const { isDark } = useTheme();
  const [activeNav, setActiveNav] = useState("Dashboards");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [priorityDashboards, setPriorityDashboards] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pcsoft-priority-dashboards")) || []; }
    catch { return []; }
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("pcsoft-priority-dashboards", JSON.stringify(priorityDashboards));
    window.dispatchEvent(new Event("priority-dashboards-changed"));
  }, [priorityDashboards]);

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  const handleNavClick = (label) => {
    if (label === "Home") navigate("/");
    else setActiveNav(label);
  };

  const togglePriority = (name) => {
    setPriorityDashboards((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const filtered = DASHBOARDS.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || d.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const counts = { All: DASHBOARDS.length, Active: 0, Draft: 0, Archived: 0 };
  DASHBOARDS.forEach((d) => { if (counts[d.status] !== undefined) counts[d.status]++; });

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
        <div className="flex items-center justify-between px-7 pt-3 pb-3 shrink-0 transition-colors duration-300 gap-4 border-b border-b-[var(--border)] bg-[var(--topbar-bg)]">
          {/* Left: Title + Search */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <Icon name="dash" size={18} color="var(--nav-active)" />
              <span className="text-[0.92rem] font-bold tracking-[-0.01em] whitespace-nowrap text-[var(--text)]">
                Dashboards
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-[9px] px-3 py-[6px] min-w-[180px] max-w-[280px] flex-1 bg-[var(--bg-input)] border border-[var(--border)]">
              <Icon name="search" size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search dashboards..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-[0.78rem] w-full bg-transparent outline-none text-[var(--text)] caret-[var(--nav-active)]"
              />
            </div>
          </div>

          {/* Center: Status tabs */}
          <div className="flex items-center gap-1 shrink-0 rounded-lg p-1 bg-[var(--bg-input)] border border-[var(--border)]">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="text-[0.70rem] px-[12px] py-[4px] rounded-[7px] cursor-pointer transition-all duration-200 border-none"
                style={{
                  background: activeTab === tab ? "var(--nav-active)" : "transparent",
                  color: activeTab === tab ? "#fff" : "var(--text-muted)",
                  fontWeight: activeTab === tab ? 700 : 500,
                  boxShadow: activeTab === tab ? "0 1px 4px rgba(124,58,237,0.25)" : "none",
                }}
              >
                {tab}
                <span
                  className="ml-[5px] text-[0.58rem]"
                  style={{ opacity: activeTab === tab ? 0.85 : 0.5 }}
                >
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {[
              { icon: "filter", title: "Filter by groups" },
              { icon: "settings", title: "Settings" },
              { icon: "refresh", title: "Refresh" },
            ].map(({ icon, title }) => (
              <div
                key={icon}
                className="action-btn cursor-pointer rounded-md flex items-center justify-center w-[30px] h-[30px] bg-[var(--bg-input)] border border-[var(--border)]"
                title={title}
              >
                <Icon name={icon} size={13} color="var(--text-muted)" />
              </div>
            ))}
            <button
              className="create-btn flex items-center gap-1 text-[0.72rem] font-semibold rounded-md cursor-pointer ml-1 px-[14px] py-[6px] text-white border-none [box-shadow:0_2px_10px_rgba(124,58,237,0.35)]"
              style={{ background: "var(--nav-active-bg)" }}
            >
              <Icon name="plus" size={12} color="#fff" />
              Create
            </button>
          </div>
        </div>

        {/* ── Table area ─────────────────────────────── */}
        <div className="flex-1 overflow-auto p-5">
          <div
            className="rounded-xl overflow-hidden fade-up bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)]"
            style={{ animationDelay: "0.05s" }}
          >
            <table className="w-full border-collapse min-w-[880px]">
              <thead>
                <tr style={{ borderBottom: "1.5px solid var(--border)" }}>
                  {[
                    { label: "★", width: "42px", align: "center" },
                    { label: "Name", width: null },
                    { label: "Description", width: null },
                    { label: "Groups", width: "110px" },
                    { label: "Widgets", width: "80px", align: "center" },
                    { label: "Status", width: "90px", align: "center" },
                    { label: "Updated", width: "120px" },
                    { label: "", width: "50px", align: "center" },
                  ].map((col, i) => (
                    <th
                      key={i}
                      className="text-[0.60rem] font-bold tracking-[0.12em] uppercase py-3 px-3.5 text-[var(--text)] opacity-70 bg-[var(--topbar-bg)] sticky top-0 z-[1]"
                      style={{ textAlign: col.align || "left", width: col.width || "auto" }}
                    >
                      {col.label === "★" ? (
                        <span className="text-[var(--nav-active)] text-[0.72rem]" title="Priority">★</span>
                      ) : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Icon name="search" size={32} color="var(--text-muted)" />
                        <div className="text-[0.85rem] font-medium text-[var(--text-muted)]">
                          No dashboards found
                        </div>
                        <div className="text-[0.72rem] text-[var(--text-muted)] opacity-60">
                          Try adjusting your search or filter
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {filtered.map((d, i) => {
                  const isPriority = priorityDashboards.includes(d.name);
                  return (
                    <tr
                      key={d.id}
                      className={`${isPriority ? "dash-row-priority" : "dash-row"}`}
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--divider)" : "none" }}
                    >
                      {/* Checkbox */}
                      <td className="px-3.5 py-3 text-center">
                        <label className="flex items-center justify-center cursor-pointer">
                          <input type="checkbox" checked={isPriority} onChange={() => togglePriority(d.name)} className="sr-only" />
                          <div
                            className="flex items-center justify-center transition-all duration-200 rounded-sm w-[17px] h-[17px]"
                            style={{
                              background: isPriority ? "var(--nav-active-bg)" : "transparent",
                              border: isPriority ? "none" : "1.5px solid var(--border)",
                              boxShadow: isPriority ? "0 2px 6px rgba(124,58,237,0.30)" : "none",
                            }}
                          >
                            {isPriority && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </label>
                      </td>
                      {/* Name */}
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2">
                          {isPriority && (
                            <span className="text-[0.55rem] text-[var(--nav-active)]">★</span>
                          )}
                          <span
                            className="text-[0.78rem] font-normal"
                            style={{ color: isPriority ? "var(--nav-active)" : "var(--text)" }}
                          >
                            {d.name}
                          </span>
                        </div>
                      </td>
                      {/* Description */}
                      <td className="px-3.5 py-3">
                        <span
                          className="text-[0.74rem]"
                          style={{
                            color: d.description === "—" ? "var(--text-muted)" : "var(--text)",
                            opacity: d.description === "—" ? 0.5 : 0.85,
                          }}
                        >
                          {d.description}
                        </span>
                      </td>
                      {/* Groups */}
                      <td className="px-3.5 py-3">
                        {d.groups !== "—" ? (
                          <span className="text-[0.65rem] font-medium px-2 py-[2px] rounded-full bg-[rgba(189,147,249,0.10)] border border-[rgba(189,147,249,0.20)] text-[var(--nav-active)]">
                            {d.groups}
                          </span>
                        ) : (
                          <span className="text-[0.74rem] text-[var(--text-muted)] opacity-50">—</span>
                        )}
                      </td>
                      {/* Widgets */}
                      <td className="px-3.5 py-3 text-center">
                        <span
                          className={`text-[0.76rem] font-semibold ${d.widgets > 0 ? "text-[var(--nav-active)] opacity-100" : "text-[var(--text-muted)] opacity-50"}`}
                        >
                          {d.widgets}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-3.5 py-3 text-center">
                        <StatusBadge status={d.status} />
                      </td>
                      {/* Updated */}
                      <td className="px-3.5 py-3">
                        <span className="text-[0.70rem] text-[var(--text-muted)]">
                          {d.updated}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-3.5 py-3 text-center">
                        <div className="dots-btn cursor-pointer inline-flex items-center justify-center w-[26px] h-[26px] rounded-[7px] border border-transparent">
                          <Icon name="dots" size={14} color="var(--text-muted)" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-7 py-[10px] shrink-0 border-t border-t-[var(--border)] bg-[var(--topbar-bg)]">
          <div className="flex items-center gap-3">
            <span className="text-[0.68rem] font-medium text-[var(--text-muted)]">
              Showing <span className="text-[var(--nav-active)]">{filtered.length}</span> of <span className="text-[var(--nav-active)]">{DASHBOARDS.length}</span> dashboards
            </span>
            {activeTab !== "All" && (
              <span
                className="text-[0.62rem] font-medium px-2 py-[2px] rounded-full cursor-pointer bg-[rgba(189,147,249,0.10)] border border-[rgba(189,147,249,0.20)] text-[var(--nav-active)]"
                onClick={() => setActiveTab("All")}
              >
                {activeTab} ✕
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-[6px] h-[6px] rounded-full"
              style={{
                background: priorityDashboards.length > 0 ? "var(--nav-active)" : "var(--text-muted)",
                boxShadow: priorityDashboards.length > 0 ? "0 0 6px rgba(189,147,249,0.5)" : "none",
              }}
            />
            <span className="text-[0.68rem] font-medium text-[var(--text-muted)]">
              <span className="text-[var(--nav-active)]">{priorityDashboards.length}</span> priority selected
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
