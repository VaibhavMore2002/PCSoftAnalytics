import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";
import { useApp } from "./AppContext.jsx";

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

// ── Stat config (labels/icons only; values come from API) ──
const STAT_CONFIG = [
  { label: "Total Data Sources", icon: "db",     stripe: "stripeA" },
  { label: "Total Dashboards",   icon: "dash",   stripe: "stripeA" },
  { label: "Reports Generated",  icon: "trend",  stripe: "stripeA" },
  { label: "Active Data Sets",   icon: "layers", stripe: "stripeA" },
];

const quickActions = [
  { label: "Data Sources", desc: "Connect and manage your data sources", icon: "db",     stripe: "stripeA", to: "/datasources" },
  { label: "Dashboards",   desc: "View and manage your dashboards",        icon: "dash",   stripe: "stripeA", to: "/dashboards" },
  { label: "Data Sets",    desc: "Create and manage your data sets",       icon: "layers", stripe: "stripeA", to: "/" },
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

// ── SVG Donut chart ────────────────────────────────────────
function DonutChart({ segments, size = 110, thickness = 22, label, sublabel }) {
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = total > 0 ? seg.value / total : 0;
    const dash = pct * circ;
    const gap = circ - dash;
    const arc = { ...seg, dash, gap, offset: offset * circ };
    offset += pct;
    return arc;
  });
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={thickness} />
        ) : (
          arcs.map((arc, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={arc.color} strokeWidth={thickness}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="round"
            />
          ))
        )}
      </svg>
      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[1.3rem] font-bold leading-none text-[var(--text)]">{label}</span>
        {sublabel && <span className="text-[0.58rem] text-[var(--text-muted)] mt-[2px]">{sublabel}</span>}
      </div>
    </div>
  );
}

// ── SVG Horizontal bar chart ───────────────────────────────
function HBar({ items, maxVal }) {
  const max = maxVal || Math.max(...items.map((x) => x.value), 1);
  return (
    <div className="flex flex-col gap-[7px]">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="text-[0.65rem] text-[var(--text)] truncate" style={{ minWidth: 90, maxWidth: 90 }}>{item.label}</div>
          <div className="flex-1 h-[7px] rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.round((item.value / max) * 100)}%`, background: item.color || "var(--nav-active)" }} />
          </div>
          <div className="text-[0.65rem] font-semibold text-[var(--text-muted)]" style={{ minWidth: 28, textAlign: "right" }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// ── Detail Analytics Modal ─────────────────────────────────
function DashboardDetailModal({ dashDetail, analytics, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const d = dashDetail;
  const an = analytics;
  if (!d || !an) return null;

  const widgetCount = Array.isArray(d.widgets) ? d.widgets.length : (d.widget_count ?? 0);
  const ACCESS_COLORS = { owner: "#7c3aed", editor: "#3b82f6", viewer: "#4ade80", admin: "#f59e0b", view: "#4ade80" };
  const STATUS_STYLE = {
    active:   { bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.25)", color: "#4ade80" },
    draft:    { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)", color: "#fbbf24" },
    archived: { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.25)", color: "#94a3b8" },
  };
  const ss = STATUS_STYLE[(d.status || "").toLowerCase()] || STATUS_STYLE.draft;

  // Donut: dimensions vs measures
  const colDonutSegs = [
    { label: "Dimensions", value: an.dimensions, color: "#4ade80" },
    { label: "Measures", value: an.measures, color: "#7c3aed" },
    { label: "Other", value: Math.max(0, an.columnTotal - an.dimensions - an.measures), color: "#3b82f6" },
  ].filter((s) => s.value > 0);

  // Donut: filters active vs inactive
  const filterDonutSegs = [
    { label: "Active", value: an.activeFilters, color: "#4ade80" },
    { label: "Inactive", value: an.filters.length - an.activeFilters, color: "#94a3b8" },
  ].filter((s) => s.value > 0);

  // Donut: access levels
  const accessSegs = Object.entries(an.accessByLevel).map(([lvl, cnt]) => ({
    label: lvl, value: cnt, color: ACCESS_COLORS[lvl.toLowerCase()] || "#94a3b8"
  }));

  // Bar: top columns by widget use
  const topCols = [...an.columns].sort((a, b) => (b.widget_count || 0) - (a.widget_count || 0)).slice(0, 8);
  const colBarItems = topCols.map((c) => ({ label: c.column_name, value: c.widget_count || 0 }));

  // Bar: source type distribution
  const sourceTypes = an.columns.reduce((acc, c) => {
    const t = c.source_type || "unknown";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const PALETTE = ["#7c3aed", "#3b82f6", "#4ade80", "#f59e0b", "#f43f5e"];
  const sourceBarItems = Object.entries(sourceTypes).map(([t, n], i) => ({ label: t, value: n, color: PALETTE[i % PALETTE.length] }));

  const MetaItem = ({ label, val }) => (
    <div className="flex flex-col gap-[2px]">
      <span className="text-[0.58rem] font-semibold tracking-[0.09em] uppercase text-[var(--text-muted)]">{label}</span>
      <span className="text-[0.83rem] font-bold text-[var(--text)]">{val ?? "—"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto py-10 px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div ref={ref}
        className="w-full max-w-[900px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 24px 80px rgba(0,0,0,0.45)" }}>

        {/* Modal header */}
        <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-center w-[44px] h-[44px] rounded-[12px] shrink-0"
            style={{ background: "var(--nav-active-bg)" }}>
            <Icon name="dash" size={20} color="#fff" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[0.60rem] font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)]">Dashboard Analytics</div>
            <div className="text-[1.1rem] font-bold text-[var(--text)] truncate">{d.name}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {d.status && (
              <span className="text-[0.63rem] font-bold px-[10px] py-[4px] rounded-full tracking-[0.06em] uppercase"
                style={{ background: ss.bg, border: `1px solid ${ss.border}`, color: ss.color }}>{d.status}</span>
            )}
            {an.myAccessLevel && (
              <span className="text-[0.63rem] font-bold px-[10px] py-[4px] rounded-full tracking-[0.06em] uppercase"
                style={{ background: "var(--nav-active-bg)", color: "#fff", opacity: 0.85 }}>{an.myAccessLevel}</span>
            )}
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-[8px] cursor-pointer transition-colors hover:bg-[var(--bg-input)]"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Meta strip */}
        <div className="flex items-center gap-6 px-6 py-3 flex-wrap" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-input)" }}>
          {[
            { label: "ID", val: d.id },
            { label: "Widgets", val: widgetCount },
            { label: "Columns", val: an.columnTotal },
            { label: "Filters", val: an.filters.length },
            { label: "Filter Sets", val: an.filterSets.length },
            { label: "Users", val: an.access.length },
            { label: "Created", val: d.created_at ? new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null },
            { label: "Updated", val: d.updated_at ? new Date(d.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never" },
          ].filter((x) => x.val != null).map(({ label, val }) => <MetaItem key={label} label={label} val={val} />)}
          {d.tags?.length > 0 && (
            <div className="flex flex-col gap-[3px]">
              <span className="text-[0.58rem] font-semibold tracking-[0.09em] uppercase text-[var(--text-muted)]">Tags</span>
              <div className="flex flex-wrap gap-[4px]">
                {d.tags.map((t) => <span key={t} className="text-[0.61rem] font-semibold px-[7px] py-[1px] rounded-full"
                  style={{ background: "var(--nav-active-bg)", color: "#fff", opacity: 0.82 }}>{t}</span>)}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-auto">

          {/* Row 1: 3 donuts */}
          <div className="grid grid-cols-3 gap-4">
            {/* Donut 1: Columns */}
            <div className="rounded-xl p-4 flex flex-col" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="text-[0.60rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3">Column Types</div>
              <div className="flex items-center gap-4">
                <DonutChart segments={colDonutSegs} size={100} thickness={18} label={an.columnTotal} sublabel="cols" />
                <div className="flex flex-col gap-[6px]">
                  {colDonutSegs.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-[0.66rem] text-[var(--text)]">{s.label}</span>
                      <span className="text-[0.66rem] font-bold ml-auto pl-2 text-[var(--text)]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Donut 2: Filters */}
            <div className="rounded-xl p-4 flex flex-col" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="text-[0.60rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3">Filter Status</div>
              <div className="flex items-center gap-4">
                <DonutChart segments={filterDonutSegs.length ? filterDonutSegs : [{ value: 1, color: "var(--border)" }]}
                  size={100} thickness={18}
                  label={an.filters.length || "0"}
                  sublabel="filters"
                />
                <div className="flex flex-col gap-[6px]">
                  {filterDonutSegs.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-[0.66rem] text-[var(--text)]">{s.label}</span>
                      <span className="text-[0.66rem] font-bold ml-auto pl-2 text-[var(--text)]">{s.value}</span>
                    </div>
                  ))}
                  <div className="text-[0.63rem] text-[var(--text-muted)] mt-1">Sets: {an.filterSets.length}</div>
                </div>
              </div>
            </div>

            {/* Donut 3: Access */}
            <div className="rounded-xl p-4 flex flex-col" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="text-[0.60rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3">Access Levels</div>
              <div className="flex items-center gap-4">
                <DonutChart segments={accessSegs.length ? accessSegs : [{ value: 1, color: "var(--border)" }]}
                  size={100} thickness={18}
                  label={an.access.length || "0"}
                  sublabel="users"
                />
                <div className="flex flex-col gap-[6px]">
                  {accessSegs.length > 0 ? accessSegs.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-[0.66rem] capitalize text-[var(--text)]">{s.label}</span>
                      <span className="text-[0.66rem] font-bold ml-auto pl-2 text-[var(--text)]">{s.value}</span>
                    </div>
                  )) : <div className="text-[0.66rem] text-[var(--text-muted)]">No access records</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: 2 bar charts */}
          <div className="grid grid-cols-2 gap-4">
            {/* Bar: top columns */}
            <div className="rounded-xl p-4" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="text-[0.60rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3">Top Columns by Widget Usage</div>
              {colBarItems.length > 0
                ? <HBar items={colBarItems} />
                : <div className="text-[0.70rem] text-[var(--text-muted)]">No column data</div>}
            </div>

            {/* Bar: source type distribution */}
            <div className="rounded-xl p-4" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="text-[0.60rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3">Columns by Source Type</div>
              {sourceBarItems.length > 0
                ? <HBar items={sourceBarItems} />
                : <div className="text-[0.70rem] text-[var(--text-muted)]">No source type data</div>}

              {/* Filter sets list */}
              {an.filterSets.length > 0 && (
                <div className="mt-5">
                  <div className="text-[0.60rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-2">Filter Sets</div>
                  <div className="flex flex-col gap-[5px]">
                    {an.filterSets.map((fs) => (
                      <div key={fs.id} className="flex items-center justify-between px-3 py-[6px] rounded-[8px]"
                        style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}>
                        <span className="text-[0.69rem] font-medium text-[var(--text)] truncate max-w-[160px]">{fs.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {fs.is_default && (
                            <span className="text-[0.58rem] font-bold px-[6px] py-[1px] rounded-full"
                              style={{ background: "var(--nav-active-bg)", color: "#fff", opacity: 0.8 }}>default</span>
                          )}
                          <span className="text-[0.63rem] text-[var(--text-muted)]">{fs.filters?.length ?? 0} filters</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// ── Main ───────────────────────────────────────────────────
export default function PCSoftAnalytics() {
  const { isDark } = useTheme();
  const { navItems, activeNav, handleNavClick, user, api } = useApp();
  const navigate = useNavigate();
  const [dsSearch, setDsSearch] = useState("");
  const [liveStats, setLiveStats] = useState(null);
  const [dashboardFilter, setDashboardFilter] = useState("");
  const [selectedDashDetail, setSelectedDashDetail] = useState(null);
  const [dashboardAnalytics, setDashboardAnalytics] = useState(null);
  const [showDashAnalytics, setShowDashAnalytics] = useState(false);
  const [priorityDashboards, setPriorityDashboards] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("pcsoft-priority-dashboards")) || [];
      return raw.map((p) => (typeof p === "object" && p !== null ? p : { id: null, name: String(p) }));
    } catch { return []; }
  });

  // Fetch overview stats from API
  useEffect(() => {
    if (!api) return;
    let cancelled = false;
    Promise.all([
      api("/api/v1/data-sources/", {}, { limit: 1 }).catch(() => null),
      api("/api/v1/dashboards/",   {}, { limit: 1 }).catch(() => null),
      api("/api/v1/reports/",      {}, { limit: 1 }).catch(() => null),
      api("/api/v1/datasets/",     {}, { limit: 1 }).catch(() => null),
    ]).then(([ds, db, rp, sets]) => {
      if (cancelled) return;
      setLiveStats({
        sources:    ds?.total  ?? null,
        dashboards: db?.total  ?? null,
        reports:    rp?.total  ?? null,
        datasets:   sets?.total ?? null,
      });
    });
    return () => { cancelled = true; };
  }, [api]);

  // Hydrate null-ID priority dashboards by fetching the full list once
  useEffect(() => {
    if (!api) return;
    const needsHydration = priorityDashboards.some((p) => !p.id);
    if (!needsHydration) return;
    let cancelled = false;
    api("/api/v1/dashboards/", {}, { limit: 100 }).then((data) => {
      if (cancelled) return;
      const allDashes = data?.data || data?.dashboards || [];
      setPriorityDashboards((prev) =>
        prev.map((p) => {
          if (p.id) return p;
          const hit = allDashes.find((d) => d.name === p.name);
          return hit ? { id: hit.id, name: p.name } : p;
        })
      );
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [api]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch dashboard detail when a dashboard is selected
  useEffect(() => {
    if (!dashboardFilter || !api) {
      setSelectedDashDetail(null);
      setDashboardAnalytics(null);
      setShowDashAnalytics(false);
      return;
    }
    let cancelled = false;

    const fetchDetail = (id) => {
      api(`/api/v1/dashboards/${id}`)
        .then((d) => {
          if (cancelled) return;
          const obj = (d?.data && !Array.isArray(d.data) && typeof d.data === 'object') ? d.data : d;
          setSelectedDashDetail(obj);
        })
        .catch(() => { if (!cancelled) setSelectedDashDetail(null); });

      // Fetch all analytics sub-endpoints in parallel
      setDashboardAnalytics(null);
      Promise.all([
        api(`/api/v1/dashboards/${id}/columns`).catch(() => null),
        api(`/api/v1/dashboards/${id}/filters`).catch(() => null),
        api(`/api/v1/dashboards/${id}/access`).catch(() => null),
        api(`/api/v1/dashboards/${id}/filter-sets`).catch(() => null),
        api(`/api/v1/dashboards/${id}/me/access`).catch(() => null),
      ]).then(([cols, filters, access, filterSets, myAccess]) => {
        if (cancelled) return;
        const colData = cols?.data || (Array.isArray(cols) ? cols : []);
        const filterData = Array.isArray(filters) ? filters : [];
        const accessData = Array.isArray(access) ? access : [];
        const filterSetData = Array.isArray(filterSets) ? filterSets : [];
        setDashboardAnalytics({
          columns: colData,
          columnTotal: cols?.total ?? colData.length,
          dimensions: colData.filter((c) => c.is_dimension).length,
          measures: colData.filter((c) => c.is_measure).length,
          filters: filterData,
          activeFilters: filterData.filter((f) => f.is_active).length,
          access: accessData,
          filterSets: filterSetData,
          myAccessLevel: myAccess?.data?.access_level ?? null,
          // count access levels
          accessByLevel: accessData.reduce((acc, a) => {
            const lvl = a.access_level || 'unknown';
            acc[lvl] = (acc[lvl] || 0) + 1;
            return acc;
          }, {}),
        });
      });
    };

    // API requires an integer dashboard_id — only call directly if filter is a numeric ID
    const numId = parseInt(dashboardFilter, 10);
    if (!isNaN(numId) && String(numId) === String(dashboardFilter)) {
      fetchDetail(numId);
    } else {
      // dashboardFilter is a name string (legacy) — resolve the real integer ID first
      api("/api/v1/dashboards/", {}, { limit: 100 })
        .then((data) => {
          if (cancelled) return;
          const all = data?.data || data?.dashboards || [];
          const hit = all.find((d) => d.name === dashboardFilter || String(d.id) === String(dashboardFilter));
          if (hit) {
            // Upgrade the filter state to use the real numeric ID going forward
            setDashboardFilter(String(hit.id));
            fetchDetail(hit.id);
          }
        })
        .catch(() => {});
    }

    return () => { cancelled = true; };
  }, [dashboardFilter, api]);

  // Listen for priority dashboard changes from the Dashboards page
  useEffect(() => {
    const handler = () => {
      try {
        const raw = JSON.parse(localStorage.getItem("pcsoft-priority-dashboards")) || [];
        // Normalize: may be strings (legacy) or {id, name} objects
        const normalized = raw.map((p) => typeof p === "object" ? p : { id: null, name: p });
        setPriorityDashboards(normalized);
        // Clear filter if selected dashboard was removed
        setDashboardFilter((prev) => {
          if (!prev) return prev;
          const still = normalized.some((p) => String(p.id) === String(prev));
          return still ? prev : "";
        });
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
                  <option value="">All Dashboards</option>
                  {priorityDashboards.map((d) => (
                    <option key={d.id ?? d.name} value={d.id ?? d.name}>{d.name}</option>
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
              className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[0.68rem] font-bold text-white cursor-pointer tracking-[0.02em] [box-shadow:0_2px_8px_rgba(124,58,237,0.30)] hover:opacity-80 transition-opacity"
              style={{ background: "var(--nav-active-bg)" }}
              onClick={() => navigate("/profile")}
              title="My Profile"
            >
              {user?.initials || "U"}
            </div>
          </div>
        </div>

        {/* ── Scrollable content ──────────────────────── */}
        <div className="flex-1 overflow-auto p-7 flex flex-col gap-7">

          {/* ── Selected Dashboard — compact summary card ─── */}
          {dashboardFilter && (() => {
            const d = selectedDashDetail;
            const an = dashboardAnalytics;
            const widgetCount = d ? (Array.isArray(d.widgets) ? d.widgets.length : (d.widget_count ?? 0)) : null;
            const STATUS_STYLE = {
              active:   { bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.25)", color: "#4ade80" },
              draft:    { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)", color: "#fbbf24" },
              archived: { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.25)", color: "#94a3b8" },
            };
            const ss = STATUS_STYLE[(d?.status || "").toLowerCase()] || STATUS_STYLE.draft;
            const pillName = d?.name ?? priorityDashboards.find((p) => String(p.id ?? p.name) === String(dashboardFilter))?.name ?? "Loading…";

            return (
              <div className="fade-up rounded-xl bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)] overflow-hidden"
                style={{ borderLeft: "3px solid var(--nav-active)" }}>
                {/* Header */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] shrink-0" style={{ background: "var(--nav-active-bg)" }}>
                    <Icon name="dash" size={18} color="#fff" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.60rem] font-semibold tracking-[0.09em] uppercase mb-[2px] text-[var(--text-muted)]">Selected Dashboard</div>
                    <div className="text-[0.98rem] font-bold text-[var(--text)] truncate">{pillName}</div>
                    {d?.description && <div className="text-[0.70rem] text-[var(--text-muted)] mt-[1px] truncate">{d.description}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {d?.status && (
                      <span className="text-[0.62rem] font-bold px-[9px] py-[3px] rounded-full tracking-[0.06em] uppercase"
                        style={{ background: ss.bg, border: `1px solid ${ss.border}`, color: ss.color }}>{d.status}</span>
                    )}
                    {/* Detail Analytics button */}
                    <button
                      onClick={() => setShowDashAnalytics(true)}
                      disabled={!an}
                      className="flex items-center gap-1.5 text-[0.71rem] font-semibold px-[10px] py-[5px] rounded-[8px] cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "var(--nav-active-bg)", color: "#fff" }}
                      title={an ? "Open full analytics" : "Loading analytics…"}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                      </svg>
                      {an ? "Detail Analytics" : "Loading…"}
                    </button>
                    <button onClick={() => setDashboardFilter("")}
                      className="text-[0.69rem] font-medium px-[10px] py-[5px] rounded-[8px] border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-muted)] cursor-pointer hover:border-[var(--nav-active)] transition-colors">
                      Clear
                    </button>
                  </div>
                </div>

                {/* Quick stats strip */}
                <div style={{ display: "flex", borderTop: "1px solid var(--border)", background: "var(--bg-input)" }}>
                  {[
                    { label: "Widgets",       val: widgetCount ?? "—" },
                    { label: "Columns",        val: an ? an.columnTotal : "…" },
                    { label: "Active Filters", val: an ? an.activeFilters : "…" },
                    { label: "Users",          val: an ? an.access.length : "…" },
                    { label: "Filter Sets",    val: an ? an.filterSets.length : "…" },
                  ].map(({ label, val }, idx) => (
                    <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 6px", gap: 2, borderLeft: idx > 0 ? "1px solid var(--border)" : "none" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{val}</span>
                      <span style={{ fontSize: "0.57rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Detail Analytics modal */}
          {showDashAnalytics && selectedDashDetail && dashboardAnalytics && (
            <DashboardDetailModal
              dashDetail={selectedDashDetail}
              analytics={dashboardAnalytics}
              onClose={() => setShowDashAnalytics(false)}
            />
          )}

          {/* ── Stat Cards ──────────────────────────── */}
          <div>
            <SectionLabel>Overview</SectionLabel>
            <div className="grid grid-cols-4 gap-3.5">
              {STAT_CONFIG.map((s, i) => {
                const baseVals = liveStats
                  ? [liveStats.sources, liveStats.dashboards, liveStats.reports, liveStats.datasets]
                  : [null, null, null, null];
                // When a specific dashboard is selected, override the dashboards count to 1
                // and show that dashboard's widget count in place of datasets
                const rawVal = dashboardFilter
                  ? i === 1
                    ? 1
                    : i === 3
                      ? (selectedDashDetail?.widgets != null
                          ? (Array.isArray(selectedDashDetail.widgets)
                              ? selectedDashDetail.widgets.length
                              : selectedDashDetail.widgets)
                          : baseVals[i])
                      : baseVals[i]
                  : baseVals[i];
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
                      {i === 3 && dashboardFilter && selectedDashDetail?.widgets != null
                        ? "Widgets"
                        : s.label}
                    </div>
                    {/* Value */}
                    <div className="text-[1.85rem] font-bold leading-none tracking-[-0.02em] mb-[10px] text-[var(--text)]">
                      {rawVal == null
                        ? <span className="text-[1.4rem] text-[var(--text-muted)]">—</span>
                        : <AnimatedNumber target={rawVal} />}
                    </div>
                    {/* Subtitle */}
                    <div className="flex items-center gap-[5px]">
                      <span className="text-[0.65rem] text-[var(--text-muted)]">
                        {rawVal == null
                          ? "Loading…"
                          : i === 1 && dashboardFilter
                            ? "selected"
                            : i === 3 && dashboardFilter && selectedDashDetail?.widgets != null
                              ? "in this dashboard"
                              : "total in system"}
                      </span>
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
                    onClick={() => navigate(qa.to)}
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
                  <div className="text-[0.63rem] shrink-0 tracking-[0.02em] text-[var(--text-muted)]">
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
