import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

/* ═══════════════════════════════════════════════════════════
   SVG Helpers
   ═══════════════════════════════════════════════════════════ */
function I({ d, size = 16, color = "currentColor", sw = 2, className = "" }) {
  return (
    <svg className={`shrink-0 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ico = {
  search:   "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  plus:     "M12 5v14M5 12h14",
  question: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
  circle:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
  edit:     "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  copy:     "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  check:    "M20 6L9 17l-5-5",
  x:        "M18 6L6 18M6 6l12 12",
  chevDown: "M6 9l6 6 6-6",
  refresh:  "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  view:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
  bar:      "M18 20V10M12 20V4M6 20v-6",
  line:     "M23 6l-9.5 9.5-5-5L1 18",
  pie:      "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z",
  table:    "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  tag:      "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] transition-all duration-150";

/* ── Chart type → icon map ── */
const CHART_ICONS = {
  bar:         ico.bar,
  line:        ico.line,
  pie:         ico.pie,
  area:        ico.line,
  scatter:     ico.circle,
  table:       ico.table,
  number:      "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
  default:     ico.question,
};

function chartIcon(chartType) {
  if (!chartType) return CHART_ICONS.default;
  const k = chartType.toLowerCase();
  return Object.keys(CHART_ICONS).find((key) => k.includes(key))
    ? CHART_ICONS[Object.keys(CHART_ICONS).find((key) => k.includes(key))]
    : CHART_ICONS.default;
}

const CHART_COLORS = [
  "#818cf8", "#34d399", "#f472b6", "#fb923c", "#a78bfa", "#38bdf8", "#4ade80",
];
function getColorForType(type) {
  if (!type) return CHART_COLORS[0];
  let hash = 0;
  for (const c of type) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffff;
  return CHART_COLORS[Math.abs(hash) % CHART_COLORS.length];
}

/* ── Badge ── */
function Badge({ label, color }) {
  return (
    <span
      className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap capitalize"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {label}
    </span>
  );
}

/* ── Empty State ── */
function EmptyState({ icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.12)" }}>
        {icon}
      </div>
      <p className="text-sm font-semibold text-[var(--text-sub)] mb-1">{title}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mb-4">{sub}</p>}
      {action}
    </div>
  );
}

/* ── Toast ── */
function useToast() {
  const [items, setItems] = useState([]);
  const id = useRef(0);
  const push = useCallback((msg, type = "success") => {
    const tid = ++id.current;
    setItems((p) => [...p, { id: tid, msg, type }]);
    setTimeout(() => setItems((p) => p.filter((x) => x.id !== tid)), 3200);
  }, []);
  const Toast = () =>
    items.length > 0 ? (
      <div className="fixed top-5 right-5 z-[99] flex flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} className="px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border"
            style={{
              background: t.type === "error" ? "rgba(239,68,68,.12)" : "rgba(16,185,129,.12)",
              borderColor: t.type === "error" ? "rgba(239,68,68,.25)" : "rgba(16,185,129,.25)",
              color: t.type === "error" ? "#f87171" : "#34d399",
              animation: "fadeUp .25s ease both",
            }}>
            <I d={t.type === "error" ? ico.x : ico.check} size={13} color={t.type === "error" ? "#f87171" : "#34d399"} sw={2.5} />
            {t.msg}
          </div>
        ))}
      </div>
    ) : null;
  return { push, Toast };
}

/* ── Confirm Dialog ── */
function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} onClick={onCancel}>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-sm mx-4" style={{ animation: "fadeUp .2s ease both" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)" }}>
              <I d={ico.trash} size={18} color="#f87171" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text)]">{title}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
          <button className={btnS} onClick={onCancel}>Cancel</button>
          <button className={btnP} style={{ background: danger ? "#ef4444" : "var(--nav-active-bg)", opacity: loading ? 0.7 : 1 }} disabled={loading} onClick={onConfirm}>
            {loading ? <Spin /> : null} {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Custom Select ── */
function Select({ value, onChange, options, placeholder, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => String(o.value) === String(value));
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen((p) => !p)}
        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-left outline-none cursor-pointer flex items-center justify-between gap-2 transition-[border-color] duration-150 hover:border-[var(--text-muted)]"
        style={{ color: selected ? "var(--text)" : "var(--text-muted)", borderColor: open ? "var(--nav-active)" : undefined }}>
        <span className="truncate">{selected ? selected.label : placeholder || "Select..."}</span>
        <I d={ico.chevDown} size={12} className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-[60] mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl max-h-56 overflow-y-auto"
          style={{ animation: "fadeUp .15s ease both" }}>
          {options.map((o) => {
            const act = String(o.value) === String(value);
            return (
              <button key={o.value} type="button"
                className="w-full text-left px-3 py-2 text-sm cursor-pointer flex items-center justify-between gap-2 transition-colors duration-100"
                style={{ background: act ? "var(--nav-active)" : "transparent", color: act ? "#fff" : "var(--text)", border: "none" }}
                onMouseEnter={(e) => { if (!act) e.currentTarget.style.background = "var(--bg-input)"; }}
                onMouseLeave={(e) => { if (!act) e.currentTarget.style.background = "transparent"; }}
                onClick={() => { onChange(o.value); setOpen(false); }}>
                <span className="truncate">{o.label}</span>
                {act && <I d={ico.check} size={12} color="#fff" sw={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Time helpers ── */
function relativeTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const ms = now - d;
  const min = Math.floor(ms / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return d.toLocaleDateString();
}

/* ═══════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════ */
export default function Questions() {
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const navigate = useNavigate();
  const { push, Toast } = useToast();
  const PAGE_SIZE = 12;

  /* ── State ── */
  const [questions, setQuestions]         = useState([]);
  const [categories, setCategories]       = useState([]);
  const [chartTypes, setChartTypes]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [chartTypeFilter, setChartTypeFilter] = useState("all");
  const [currentPage, setCurrentPage]     = useState(1);
  const [openMenu, setOpenMenu]           = useState(null);
  const [deleting, setDeleting]           = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewMode, setViewMode]           = useState("grid"); // "grid" | "table"

  /* ── Fetch all data ── */
  const fetchAll = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    try {
      const [qData, catData, ctData] = await Promise.allSettled([
        api("/api/v1/questions-v2/"),
        api("/api/v1/questions-v2/categories"),
        api("/api/v1/questions-v2/chart-types"),
      ]);

      if (qData.status === "fulfilled") {
        const list = Array.isArray(qData.value?.data)
          ? qData.value.data
          : Array.isArray(qData.value)
          ? qData.value
          : [];
        setQuestions(list);
      } else {
        setQuestions([]);
        push("Failed to load questions", "error");
      }

      if (catData.status === "fulfilled") {
        const cats = Array.isArray(catData.value?.data)
          ? catData.value.data
          : Array.isArray(catData.value)
          ? catData.value
          : [];
        setCategories(cats);
      }

      if (ctData.status === "fulfilled") {
        const cts = Array.isArray(ctData.value?.data)
          ? ctData.value.data
          : Array.isArray(ctData.value)
          ? ctData.value
          : [];
        setChartTypes(cts);
      }
    } finally {
      setLoading(false);
    }
  }, [api, push]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Filtered & paginated list ── */
  const filtered = questions.filter((q) => {
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      q.name?.toLowerCase().includes(term) ||
      q.description?.toLowerCase().includes(term);
    const matchCat =
      categoryFilter === "all" ||
      String(q.category_id) === String(categoryFilter) ||
      q.category?.id === categoryFilter;
    const matchType =
      chartTypeFilter === "all" ||
      q.chart_type?.toLowerCase() === chartTypeFilter.toLowerCase();
    return matchSearch && matchCat && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [search, categoryFilter, chartTypeFilter]);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  /* ── Close menus on outside click ── */
  useEffect(() => {
    const close = () => setOpenMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  /* ── Actions ── */
  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api(`/api/v1/questions-v2/${deleting.id}`, { method: "DELETE" });
      push(`"${deleting.name}" deleted`);
      setQuestions((prev) => prev.filter((q) => q.id !== deleting.id));
    } catch {
      push("Delete failed", "error");
    }
    setDeleteLoading(false);
    setDeleting(null);
  };

  const handleDuplicate = async (q) => {
    try {
      await api(`/api/v1/questions-v2/${q.id}/duplicate`, { method: "POST" });
      push(`"${q.name}" duplicated`);
      fetchAll();
    } catch {
      push("Duplicate failed", "error");
    }
  };

  /* ── Stats ── */
  const stats = {
    total: questions.length,
    categories: categories.length,
    chartTypes: [...new Set(questions.map((q) => q.chart_type).filter(Boolean))].length,
  };

  /* ── Category & chart-type select options ── */
  const catOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];
  const ctOptions = [
    { value: "all", label: "All Chart Types" },
    ...[...new Set(questions.map((q) => q.chart_type).filter(Boolean))]
      .map((t) => ({ value: t, label: t })),
  ];

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  );

  /* ── Question Card (grid view) ── */
  function QuestionCard({ q }) {
    const color = getColorForType(q.chart_type);
    const icon  = chartIcon(q.chart_type);
    return (
      <div
        className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 cursor-pointer hover:border-[var(--nav-active)] transition-all duration-200 group flex flex-col gap-3 relative"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}
        onClick={() => navigate(`/questions/${q.id}`)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <I d={icon} size={16} color={color} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-[var(--nav-active)] transition-colors">
                {q.name || "Untitled Question"}
              </p>
              {q.category?.name && (
                <p className="text-[0.6rem] text-[var(--text-muted)] truncate">{q.category.name}</p>
              )}
            </div>
          </div>
          {/* Kebab menu */}
          <div onClick={(e) => e.stopPropagation()} className="relative shrink-0">
            <button
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--nav-active)] bg-[var(--bg-input)] border border-[var(--border)]"
              onClick={() => setOpenMenu(openMenu === q.id ? null : q.id)}
            >⋮</button>
            {openMenu === q.id && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg z-50 overflow-hidden" style={{ animation: "fadeUp .15s ease both" }}>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-[var(--bg-hover)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                  onClick={() => navigate(`/questions/${q.id}`)}>
                  <I d={ico.view} size={13} /> View
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-[var(--bg-hover)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                  onClick={() => navigate(`/questions/${q.id}/edit`)}>
                  <I d={ico.edit} size={13} /> Edit
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-[var(--bg-hover)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                  onClick={() => handleDuplicate(q)}>
                  <I d={ico.copy} size={13} /> Duplicate
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-[var(--bg-hover)] bg-transparent border-none cursor-pointer"
                  onClick={() => setDeleting(q)}>
                  <I d={ico.trash} size={13} color="#f87171" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {q.description && (
          <p className="text-[0.72rem] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {q.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1 border-t border-[var(--border)]">
          {q.chart_type ? (
            <Badge label={q.chart_type} color={color} />
          ) : (
            <span className="text-[0.62rem] text-[var(--text-muted)] italic">No chart type</span>
          )}
          <span className="text-[0.6rem] text-[var(--text-muted)]" title={q.updated_at}>
            {relativeTime(q.updated_at || q.created_at)}
          </span>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════
     Render
     ════════════════════════════════════ */
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)" }}>
              <I d={ico.question} size={16} color="#818cf8" />
            </div>
            <div>
              <h1 className="text-sm font-bold">Questions</h1>
              <p className="text-[0.65rem] text-[var(--text-muted)]">
                {stats.total} total · {stats.categories} categories · {stats.chartTypes} chart type{stats.chartTypes !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Grid / Table toggle */}
            <div className="flex items-center rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--bg-input)]">
              <button
                className="px-3 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  background: viewMode === "grid" ? "var(--nav-active-bg)" : "transparent",
                  color: viewMode === "grid" ? "#fff" : "var(--text-muted)",
                  border: "none", cursor: "pointer",
                }}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                ⊞
              </button>
              <button
                className="px-3 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  background: viewMode === "table" ? "var(--nav-active-bg)" : "transparent",
                  color: viewMode === "table" ? "#fff" : "var(--text-muted)",
                  border: "none", cursor: "pointer",
                }}
                onClick={() => setViewMode("table")}
                title="Table view"
              >
                ☰
              </button>
            </div>
            <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
              onClick={() => navigate("/questions/new")}>
              <I d={ico.plus} size={14} color="#fff" sw={2.5} /> New Question
            </button>
          </div>
        </header>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex-1 relative">
            <I d={ico.search} size={14} color="var(--text-muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="questions-search"
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onChange={setCategoryFilter} className="w-44" options={catOptions} />
          <Select value={chartTypeFilter} onChange={setChartTypeFilter} className="w-40" options={ctOptions} />
          <button className={btnS} onClick={fetchAll} title="Refresh">
            <I d={ico.refresh} size={14} />
          </button>
        </div>

        {/* ── Content ── */}
        <main className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20">
              <Spin /><span className="text-sm text-[var(--text-muted)]">Loading questions...</span>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<I d={ico.question} size={24} color="#818cf8" />}
              title={search || categoryFilter !== "all" || chartTypeFilter !== "all" ? "No matching questions" : "No questions yet"}
              sub={search || categoryFilter !== "all" || chartTypeFilter !== "all" ? "Try adjusting your filters" : "Create your first question to visualise data"}
              action={
                !search && categoryFilter === "all" && chartTypeFilter === "all" ? (
                  <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
                    onClick={() => navigate("/questions/new")}>
                    <I d={ico.plus} size={14} color="#fff" sw={2.5} /> New Question
                  </button>
                ) : null
              }
            />
          ) : viewMode === "grid" ? (
            /* ── Grid view ── */
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((q) => <QuestionCard key={q.id} q={q} />)}
              </div>
              {/* Pagination */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-[0.65rem] text-[var(--text-muted)]">
                  Showing {filtered.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <button className={btnS} disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Prev</button>
                  <span className="text-[0.65rem] text-[var(--text-muted)] min-w-20 text-center">Page {currentPage} / {totalPages}</span>
                  <button className={btnS} disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Table view ── */
            <div className="px-6 py-4">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "14%" }} />
                </colgroup>
                <thead>
                  <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]">
                    <th className="text-left px-3 py-2.5">Name</th>
                    <th className="text-left px-3 py-2.5">Description</th>
                    <th className="text-left px-3 py-2.5">Category</th>
                    <th className="text-left px-3 py-2.5">Chart Type</th>
                    <th className="text-left px-3 py-2.5">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((q) => {
                    const color = getColorForType(q.chart_type);
                    const icon  = chartIcon(q.chart_type);
                    return (
                      <tr key={q.id}
                        className="border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors cursor-pointer group"
                        onClick={() => navigate(`/questions/${q.id}`)}>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                              <I d={icon} size={14} color={color} />
                            </div>
                            <p className="text-sm font-semibold truncate group-hover:text-[var(--nav-active)] transition-colors">
                              {q.name || "Untitled"}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-xs text-[var(--text-sub)] truncate">
                            {q.description || <span className="text-[var(--text-muted)] italic">—</span>}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-[var(--text-muted)]">
                            {q.category?.name || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {q.chart_type ? (
                            <Badge label={q.chart_type} color={color} />
                          ) : (
                            <span className="text-xs text-[var(--text-muted)]">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-[var(--text-sub)]" title={q.updated_at}>
                            {relativeTime(q.updated_at || q.created_at)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="mt-3 px-1 flex items-center justify-between gap-3">
                <span className="text-[0.65rem] text-[var(--text-muted)]">
                  Showing {filtered.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <button className={btnS} disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Prev</button>
                  <span className="text-[0.65rem] text-[var(--text-muted)] min-w-20 text-center">Page {currentPage} / {totalPages}</span>
                  <button className={btnS} disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer className="px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between text-[0.65rem] text-[var(--text-muted)]">
          <span>© 2026 PCSoft Analytics</span>
          <span>v1.0.0</span>
        </footer>
      </div>

      {/* ── Delete Confirm ── */}
      {deleting && (
        <ConfirmDialog
          title="Delete Question"
          message={`Are you sure you want to delete "${deleting.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          danger
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
      <Toast />
    </div>
  );
}
