import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";
import { useApp } from "./AppContext.jsx";

const STATUS_TABS = ["All", "Active", "Draft", "Archived"];

function relativeTime(isoString) {
  if (!isoString) return "Never";
  const diff = Date.now() - new Date(isoString).getTime();
  if (isNaN(diff)) return "Never";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeDashboard(d) {
  const status = d.status
    ? d.status.charAt(0).toUpperCase() + d.status.slice(1).toLowerCase()
    : "Draft";
  const tags = Array.isArray(d.tags) && d.tags.length > 0 ? d.tags.join(", ") : null;
  const wArr = Array.isArray(d.widgets) ? d.widgets : [];
  return {
    id: d.id,
    name: d.name || "Untitled",
    description: d.description || null,
    groups: tags,
    widgets: d.widget_count ?? wArr.length,
    widgetNames: wArr.map((w) => w.name || w.title || "Widget").slice(0, 5),
    chartTypes: [...new Set(wArr.map((w) => {
      const n = (w.name || w.title || "").toLowerCase();
      if (n.includes("pie")) return "pie";
      if (n.includes("line")) return "line";
      if (n.includes("area")) return "area";
      if (n.includes("gauge")) return "gauge";
      if (n.includes("funnel")) return "funnel";
      if (n.includes("scatter")) return "scatter";
      if (n.includes("bar")) return "bar";
      return w.widget_type || "chart";
    }))],
    filterCount: d._filterCount ?? 0,
    status,
    updated: relativeTime(d.updated_at),
    createdAt: d.created_at ? relativeTime(d.created_at) : null,
  };
}

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

// ── Chart helpers ──────────────────────────────────────────
function DLDonut({ segments, size = 88, thickness = 16, label, sublabel }) {
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const arcs = segments.map((seg) => {
    const pct = total > 0 ? seg.value / total : 0;
    const dash = pct * circ;
    const arc = { ...seg, dash, gap: circ - dash, offset: acc * circ };
    acc += pct;
    return arc;
  });
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {total === 0
          ? <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={thickness} />
          : arcs.map((arc, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={arc.color}
              strokeWidth={thickness} strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={-arc.offset} strokeLinecap="round" />
          ))
        }
      </svg>
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
        <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{label}</span>
        {sublabel && <span style={{ fontSize: "0.52rem", color: "var(--text-muted)", marginTop: 2 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

function DLBar({ items }) {
  const max = Math.max(...items.map((x) => x.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: "0.62rem", color: "var(--text)", minWidth: 78, maxWidth: 78, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
          <div style={{ flex: 1, height: 6, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, width: `${Math.round((item.value / max) * 100)}%`, background: item.color || "var(--nav-active)", transition: "width 0.7s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--text-muted)", minWidth: 22, textAlign: "right" }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────
export default function DashboardsPage() {
  const { isDark } = useTheme();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createCategoryId, setCreateCategoryId] = useState("");
  const [createTags, setCreateTags] = useState("");
  const [createTemplate, setCreateTemplate] = useState("blank");
  const [categories, setCategories] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [priorityDashboards, setPriorityDashboards] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("pcsoft-priority-dashboards")) || [];
      return raw.map((p) => (typeof p === "object" && p !== null ? p : { id: null, name: String(p) }));
    } catch { return []; }
  });

  // Fetch dashboards from API, then enrich with detail data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setApiError(null);
    api("/api/v1/dashboards/", {}, { limit: 100, include_ungrouped: true })
      .then(async (data) => {
        if (cancelled) return;
        const raw = data?.data || data?.dashboards || data?.items || (Array.isArray(data) ? data : []);
        // Show list immediately with whatever we have
        setDashboards(raw.map(normalizeDashboard));
        setLoading(false);

        // Enrich each dashboard with real widget count from detail endpoint
        const enriched = await Promise.all(
          raw.map(async (d) => {
            try {
              const [detail, filters] = await Promise.all([
                api(`/api/v1/dashboards/${d.id}`).catch(() => null),
                api(`/api/v1/dashboards/${d.id}/filters`).catch(() => null),
              ]);
              const dd = detail?.data && !Array.isArray(detail.data) && typeof detail.data === "object" ? detail.data : detail;
              const merged = { ...d };
              if (dd) {
                if (Array.isArray(dd.widgets)) merged.widgets = dd.widgets;
                if (dd.widget_count != null) merged.widget_count = dd.widget_count;
                if (dd.description) merged.description = dd.description;
              }
              merged._filterCount = Array.isArray(filters) ? filters.length : 0;
              return merged;
            } catch {
              return d;
            }
          })
        );
        if (!cancelled) setDashboards(enriched.map(normalizeDashboard));
      })
      .catch((err) => {
        if (!cancelled) { setApiError(err.message || "Failed to load dashboards"); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [api, refreshKey]);

  useEffect(() => {
    localStorage.setItem("pcsoft-priority-dashboards", JSON.stringify(priorityDashboards));
    window.dispatchEvent(new Event("priority-dashboards-changed"));
  }, [priorityDashboards]);

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  const navigate = useNavigate();

  const togglePriority = ({ id, name }) => {
    setPriorityDashboards((prev) => {
      const match = (p) => typeof p === "object"
        ? (p.id && p.id === id) || p.name === name
        : p === name;
      const exists = prev.some(match);
      if (exists) return prev.filter((p) => !match(p));
      return [...prev, { id, name }];
    });
  };

  // Fetch categories for the create modal
  useEffect(() => {
    api("/api/v1/dashboards/categories").then((data) => {
      const list = Array.isArray(data) ? data : data?.data || data?.categories || [];
      setCategories(list);
    }).catch(() => {});
  }, [api]);

  const handleCreateDashboard = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      const body = {
        name: createName.trim(),
        description: createDesc.trim() || null,
        status: "draft",
      };
      if (createCategoryId) body.category_id = Number(createCategoryId);
      if (createTags.trim()) body.tags = createTags.split(",").map((t) => t.trim()).filter(Boolean);
      // Template-based settings
      if (createTemplate !== "blank") {
        body.settings = { template: createTemplate };
        body.tags = [...(body.tags || []), createTemplate];
      }
      await api("/api/v1/dashboards/", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setShowCreate(false);
      setCreateName("");
      setCreateDesc("");
      setCreateCategoryId("");
      setCreateTags("");
      setCreateTemplate("blank");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setCreateError(err.message || "Failed to create dashboard");
    } finally {
      setCreating(false);
    }
  };

  const filtered = dashboards.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch = d.name.toLowerCase().includes(q) || (d.description || "").toLowerCase().includes(q);
    const matchesTab = activeTab === "All" || d.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((d) => priorityDashboards.includes(d.name));
  const someFilteredSelected =
    filtered.some((d) => priorityDashboards.includes(d.name)) && !allFilteredSelected;

  const selectAll = () => {
    setPriorityDashboards((prev) => {
      const toAdd = filtered.map((d) => d.name).filter((n) => !prev.includes(n));
      return [...prev, ...toAdd];
    });
  };

  const deselectAll = () => {
    const filteredNames = new Set(filtered.map((d) => d.name));
    setPriorityDashboards((prev) => prev.filter((n) => !filteredNames.has(n)));
  };

  const counts = { All: dashboards.length, Active: 0, Draft: 0, Archived: 0 };
  dashboards.forEach((d) => { if (counts[d.status] !== undefined) counts[d.status]++; });

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
            <div
              className="action-btn cursor-pointer rounded-md flex items-center justify-center w-[30px] h-[30px] bg-[var(--bg-input)] border border-[var(--border)]"
              title="Refresh"
              onClick={() => setRefreshKey((k) => k + 1)}
            >
              <Icon name="refresh" size={13} color="var(--text-muted)" />
            </div>
            <button
              onClick={() => setShowCreate(true)}
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
          {apiError && (
            <div className="mb-4 text-[0.75rem] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {apiError}
            </div>
          )}
          <div
            className="rounded-xl overflow-hidden fade-up bg-[var(--bg-card)] border border-[var(--border)] [box-shadow:var(--shadow)]"
            style={{ animationDelay: "0.05s" }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3">
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--nav-active)" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span className="text-[0.80rem] text-[var(--text-muted)]">Loading dashboards…</span>
              </div>
            ) : (
            <table className="w-full border-collapse min-w-[880px]">
              <thead>
                <tr style={{ borderBottom: "1.5px solid var(--border)" }}>
                  {[
                    { label: "★", width: "42px", align: "center" },
                    { label: "Name", width: null },
                    { label: "Description", width: null },
                    { label: "Groups", width: "110px" },
                    { label: "Widgets", width: "80px", align: "center" },
                    { label: "Filters", width: "70px", align: "center" },
                    { label: "Types", width: "140px" },
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
                        <label
                          className="flex items-center justify-center cursor-pointer"
                          title={allFilteredSelected ? "Deselect all" : "Select all"}
                        >
                          <input
                            type="checkbox"
                            checked={allFilteredSelected}
                            onChange={() => (allFilteredSelected ? deselectAll() : selectAll())}
                            className="sr-only"
                          />
                          <div
                            className="flex items-center justify-center transition-all duration-200 rounded-sm w-[17px] h-[17px]"
                            style={{
                              background: allFilteredSelected
                                ? "var(--nav-active-bg)"
                                : someFilteredSelected
                                ? "rgba(189,147,249,0.18)"
                                : "transparent",
                              border: allFilteredSelected
                                ? "none"
                                : "1.5px solid var(--border)",
                              boxShadow: allFilteredSelected
                                ? "0 2px 6px rgba(124,58,237,0.30)"
                                : "none",
                            }}
                          >
                            {allFilteredSelected && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                            {someFilteredSelected && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--nav-active)" strokeWidth="3.5">
                                <line x1="4" y1="12" x2="20" y2="12" />
                              </svg>
                            )}
                          </div>
                        </label>
                      ) : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-16">
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
                  const isPriority = priorityDashboards.some((p) => typeof p === "object" ? p.id === d.id || p.name === d.name : p === d.name);
                  return (
                    <tr
                      key={d.id}
                      onClick={() => navigate(`/dashboards/${d.id}`)}
                      className={`cursor-pointer ${isPriority ? "dash-row-priority" : "dash-row"}`}
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--divider)" : "none" }}
                    >
                      {/* Checkbox */}
                      <td className="px-3.5 py-3 text-center">
                        <label className="flex items-center justify-center cursor-pointer">
                          <input type="checkbox" checked={isPriority} onChange={(e) => { e.stopPropagation(); togglePriority({ id: d.id, name: d.name }); }} className="sr-only" />
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
                            color: !d.description ? "var(--text-muted)" : "var(--text)",
                            opacity: !d.description ? 0.5 : 0.85,
                          }}
                        >
                          {d.description || "—"}
                        </span>
                      </td>
                      {/* Groups */}
                      <td className="px-3.5 py-3">
                        {d.groups ? (
                          <span className="text-[0.65rem] font-medium px-2 py-[2px] rounded-full bg-[rgba(189,147,249,0.10)] border border-[rgba(189,147,249,0.20)] text-[var(--nav-active)]">
                            {d.groups}
                          </span>
                        ) : (
                          <span className="text-[0.74rem] text-[var(--text-muted)] opacity-50">—</span>
                        )}
                      </td>
                      {/* Widgets */}
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className={`text-[0.82rem] font-bold ${d.widgets > 0 ? "text-[var(--nav-active)]" : "text-[var(--text-muted)] opacity-50"}`}
                            style={d.widgets > 0 ? { textShadow: "0 0 8px rgba(99,102,241,.25)" } : {}}
                          >
                            {d.widgets}
                          </span>
                          {d.widgets > 0 && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--nav-active)" strokeWidth="2" style={{ opacity: 0.5 }}>
                              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                          )}
                        </div>
                      </td>
                      {/* Filters */}
                      <td className="px-3.5 py-3 text-center">
                        <span
                          className={`text-[0.76rem] font-semibold ${d.filterCount > 0 ? "text-[#f59e0b]" : "text-[var(--text-muted)] opacity-50"}`}
                        >
                          {d.filterCount}
                        </span>
                      </td>
                      {/* Chart Types */}
                      <td className="px-3.5 py-3">
                        {d.chartTypes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {d.chartTypes.map((t, ti) => (
                              <span key={ti} className="text-[0.55rem] font-semibold px-[7px] py-[2px] rounded-full uppercase tracking-wider"
                                style={{
                                  background: t === "bar" ? "rgba(99,102,241,.1)" : t === "pie" ? "rgba(244,63,94,.1)" : t === "line" ? "rgba(52,211,153,.1)" : t === "area" ? "rgba(14,165,233,.1)" : t === "gauge" ? "rgba(245,158,11,.1)" : "rgba(148,163,184,.08)",
                                  color: t === "bar" ? "#818cf8" : t === "pie" ? "#f43f5e" : t === "line" ? "#34d399" : t === "area" ? "#0ea5e9" : t === "gauge" ? "#f59e0b" : "var(--text-muted)",
                                  border: `1px solid ${t === "bar" ? "rgba(99,102,241,.2)" : t === "pie" ? "rgba(244,63,94,.2)" : t === "line" ? "rgba(52,211,153,.2)" : t === "area" ? "rgba(14,165,233,.2)" : t === "gauge" ? "rgba(245,158,11,.2)" : "var(--border)"}`,
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[0.74rem] text-[var(--text-muted)] opacity-50">—</span>
                        )}
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
            )}
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-7 py-[10px] shrink-0 border-t border-t-[var(--border)] bg-[var(--topbar-bg)]">
          <div className="flex items-center gap-3">
            <span className="text-[0.68rem] font-medium text-[var(--text-muted)]">
              Showing <span className="text-[var(--nav-active)]">{filtered.length}</span> of <span className="text-[var(--nav-active)]">{dashboards.length}</span> dashboards
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

      {/* ── Create Dashboard Modal ─────────────────── */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowCreate(false)}
        >
          <div
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-[600px] mx-4 max-h-[90vh] flex flex-col"
            style={{ animation: "fadeUp .3s cubic-bezier(.22,1,.36,1) both" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold">Create New Dashboard</h2>
                  <p className="text-[0.62rem] text-[var(--text-muted)] mt-0.5">Set up your dashboard with a name, description, and template</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                style={{ transition: "all .15s" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal body - scrollable */}
            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5" style={{ flex: 1 }}>
              {createError && (
                <div className="text-[0.75rem] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {createError}
                </div>
              )}

              {/* ── Section: Basic Information ──────── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--nav-active)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  <span className="text-xs font-bold text-[var(--text)]">Basic Information</span>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Name */}
                  <div>
                    <label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Dashboard Name</label>
                    <input
                      type="text"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="Enter dashboard name"
                      autoFocus
                      className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)]"
                      style={{ transition: "border-color .15s" }}
                      onKeyDown={(e) => e.key === "Enter" && handleCreateDashboard()}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Description</label>
                    <textarea
                      value={createDesc}
                      onChange={(e) => setCreateDesc(e.target.value)}
                      placeholder="Enter dashboard description (optional)"
                      rows={2}
                      className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] resize-none"
                      style={{ transition: "border-color .15s" }}
                    />
                  </div>

                  {/* Category + Tags row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Category</label>
                      <select
                        value={createCategoryId}
                        onChange={(e) => setCreateCategoryId(e.target.value)}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] cursor-pointer"
                        style={{ transition: "border-color .15s" }}
                      >
                        <option value="">Select category (optional)</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Tags</label>
                      <input
                        type="text"
                        value={createTags}
                        onChange={(e) => setCreateTags(e.target.value)}
                        placeholder="Enter tags separated by commas"
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)]"
                        style={{ transition: "border-color .15s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section: Choose Template ────────── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--nav-active)" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                  <span className="text-xs font-bold text-[var(--text)]">Choose Template</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "blank", name: "Blank Dashboard", cat: "General", desc: "Start with an empty dashboard and add widgets as needed", icon: "blank", tags: ["blank", "custom"], color: "#818cf8" },
                    { id: "executive", name: "Executive Summary", cat: "Business", desc: "High-level KPIs and business metrics for executives", icon: "exec", tags: ["executive", "kpi", "business"], color: "#34d399" },
                    { id: "sales", name: "Sales Dashboard", cat: "Sales", desc: "Sales performance metrics and team analytics", icon: "sales", tags: ["sales", "revenue", "pipeline"], color: "#f59e0b" },
                    { id: "operations", name: "Operations Monitor", cat: "Operations", desc: "Operational KPIs and system monitoring", icon: "ops", tags: ["operations", "monitoring", "system"], color: "#0ea5e9" },
                  ].map((tpl) => {
                    const sel = createTemplate === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setCreateTemplate(tpl.id)}
                        className="cursor-pointer rounded-xl border p-3.5 transition-all duration-200"
                        style={{
                          background: sel ? `${tpl.color}08` : "var(--bg-input)",
                          borderColor: sel ? `${tpl.color}50` : "var(--border)",
                          boxShadow: sel ? `0 0 0 1px ${tpl.color}30, 0 4px 12px ${tpl.color}10` : "none",
                        }}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: `${tpl.color}15`, border: `1px solid ${tpl.color}25` }}
                          >
                            {tpl.icon === "blank" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tpl.color} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
                            {tpl.icon === "exec" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tpl.color} strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
                            {tpl.icon === "sales" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tpl.color} strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                            {tpl.icon === "ops" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tpl.color} strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[0.75rem] font-bold" style={{ color: sel ? tpl.color : "var(--text)" }}>{tpl.name}</span>
                              {sel && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tpl.color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                              )}
                            </div>
                            <span className="text-[0.58rem] font-semibold px-1.5 py-[1px] rounded-full mt-1 inline-block"
                              style={{ background: `${tpl.color}12`, color: tpl.color, border: `1px solid ${tpl.color}25` }}
                            >{tpl.cat}</span>
                            <p className="text-[0.62rem] text-[var(--text-muted)] mt-1.5 leading-relaxed">{tpl.desc}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {tpl.tags.map((t) => (
                                <span key={t} className="text-[0.52rem] px-1.5 py-[1px] rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]">{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] shrink-0">
              <span className="text-[0.62rem] text-[var(--text-muted)]">
                Template: <span className="font-semibold text-[var(--text-sub)]">{createTemplate === "blank" ? "Blank" : createTemplate === "executive" ? "Executive Summary" : createTemplate === "sales" ? "Sales" : "Operations"}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDashboard}
                  disabled={!createName.trim() || creating}
                  className="px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5"
                  style={{
                    background: !createName.trim() ? "var(--border)" : "var(--nav-active-bg)",
                    boxShadow: createName.trim() ? "0 2px 10px rgba(124,58,237,0.35)" : "none",
                    opacity: creating ? 0.7 : 1,
                  }}
                >
                  {creating ? (
                    <><svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Creating...</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> Create Dashboard</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
