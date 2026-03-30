import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";
import { PageSkeleton, Sk, TableSkeleton } from "./Skeleton.jsx";

/* ═══════════════════════════════════════════════════════════
   SVG helpers
   ═══════════════════════════════════════════════════════════ */
function I({ d, size = 16, color = "currentColor", sw = 2, className = "" }) {
  return (
    <svg className={`shrink-0 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ico = {
  back:        "M19 12H5M12 19l-7-7 7-7",
  report:      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2L14 8 20 8 M16 13L8 13 M16 17L8 17 M10 9L9 9 8 9",
  refresh:     "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  edit:        "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  copy:        "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  trash:       "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  check:       "M20 6L9 17l-5-5",
  x:           "M18 6L6 18M6 6l12 12",
  filter:      "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  plus:        "M12 5v14M5 12h14",
  share:       "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
  link:        "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  duplicate:   "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  sort:        "M3 6h18M7 12h10M11 18h2",
  download:    "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  search:      "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  chevLeft:    "M15 18l-6-6 6-6",
  chevRight:   "M9 18l6-6-6-6",
  chevDown:    "M6 9l6 6 6-6",
  chevUp:      "M18 15l-6-6-6 6",
  materialize: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  layers:      "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  sigma:       "M18 7V5H6l7 7-7 7h12v-2",
  hash:        "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] flex items-center gap-1.5 transition-all duration-150 hover:border-[var(--text-muted)]";

const STATUS_COLORS = {
  active:   { bg: "rgba(74,222,128,.12)",  color: "#4ade80", border: "rgba(74,222,128,.25)" },
  draft:    { bg: "rgba(250,204,21,.12)",  color: "#facc15", border: "rgba(250,204,21,.25)" },
  archived: { bg: "rgba(148,163,184,.12)", color: "#94a3b8", border: "rgba(148,163,184,.25)" },
};

function Badge({ label, bg, color, border }) {
  return (
    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap capitalize"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
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

/* ── Time helpers ── */
function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function isNumeric(val) {
  if (val === null || val === undefined || val === "") return false;
  return !isNaN(parseFloat(val)) && isFinite(val);
}

const NUM_FORMATS = [
  { id: "full",  label: "Full Number", preview: "10,000,000" },
  { id: "k",     label: "Thousands (K)", preview: "10,000K" },
  { id: "l",     label: "Lakhs (L)",    preview: "100L" },
  { id: "cr",    label: "Crores (Cr)",  preview: "1Cr" },
  { id: "m",     label: "Millions (M)", preview: "10M" },
  { id: "b",     label: "Billions (B)", preview: "0.01B" },
];

const OPERATORS = [
  { id: "equals",                label: "equals" },
  { id: "not_equals",            label: "not equals" },
  { id: "contains",              label: "contains" },
  { id: "not_contains",          label: "not contains" },
  { id: "greater_than",          label: ">" },
  { id: "less_than",             label: "<" },
  { id: "greater_than_or_equal", label: ">=" },
  { id: "less_than_or_equal",    label: "<=" },
  { id: "starts_with",           label: "starts with" },
  { id: "ends_with",             label: "ends with" },
  { id: "is_null",               label: "is empty" },
  { id: "is_not_null",           label: "is not empty" },
];

const NO_VALUE_OPS = ["is_null", "is_not_null"];

function formatNum(val, fmt = "full") {
  if (val === null || val === undefined) return "—";
  if (!isNumeric(val)) return String(val);
  const n = parseFloat(val);
  switch (fmt) {
    case "k":  return (n / 1_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "K";
    case "l":  return (n / 100_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "L";
    case "cr": return (n / 10_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "Cr";
    case "m":  return (n / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "M";
    case "b":  return (n / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 4 }) + "B";
    default:   return Number.isInteger(n) ? n.toLocaleString() : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

/* ── Share Modal ── */
function ShareModal({ reportName, onClose }) {
  const url = window.location.href;
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-md mx-4 overflow-hidden" style={{ animation: "fadeUp .2s ease both" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.25)" }}>
              <I d={ico.share} size={16} color="#818cf8" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Share Report</h3>
              <p className="text-[0.65rem] text-[var(--text-muted)] mt-0.5 truncate max-w-[220px]">{reportName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer">
            <I d={ico.x} size={14} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-[0.65rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Report Link</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-muted)] truncate font-mono">{url}</div>
              <button onClick={copy} className={btnP} style={{ background: copied ? "#22c55e" : "var(--nav-active-bg)", minWidth: 80 }}>
                {copied ? <I d={ico.check} size={13} color="#fff" /> : <I d={ico.duplicate} size={13} color="#fff" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.12)" }}>
            <p className="text-[var(--text-muted)]">Anyone with access to this application and the required permissions can view this report using the link above.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Duplicate Modal ── */
function DuplicateModal({ report, api, push, onClose, onSuccess }) {
  const [name, setName] = useState(`${report.name} (Copy)`);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await api(`/api/v1/reports/${report.id}/duplicate`, { method: "POST", body: JSON.stringify({ name: name.trim() }) });
      push(`"${name.trim()}" created`);
      onSuccess();
      onClose();
    } catch { push("Duplicate failed", "error"); }
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-sm mx-4" style={{ animation: "fadeUp .2s ease both" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-[var(--border)]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.25)" }}>
            <I d={ico.duplicate} size={16} color="#818cf8" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Duplicate Report</h3>
            <p className="text-[0.65rem] text-[var(--text-muted)] mt-0.5">Create a copy of this report</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[0.65rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">New Report Name</label>
            <input
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] transition-colors"
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              autoFocus
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
          <button className={btnS} onClick={onClose}>Cancel</button>
          <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: loading ? 0.7 : 1 }} disabled={loading || !name.trim()} onClick={submit}>
            {loading ? <Spin /> : <I d={ico.duplicate} size={13} color="#fff" />} Duplicate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ReportDetail — Main Component
   ═══════════════════════════════════════════════════════════ */
export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const { push, Toast } = useToast();

  const [report, setReport]             = useState(null);
  const [loading, setLoading]           = useState(true);
  const [dataLoading, setDataLoading]   = useState(false);
  const [rows, setRows]                 = useState([]);
  const [columns, setColumns]           = useState([]);
  const [grandTotals, setGrandTotals]   = useState(null);
  const [totalRows, setTotalRows]       = useState(0);
  const [page, setPage]                 = useState(1);
  const [pageSize]                      = useState(50);
  const [sortField, setSortField]       = useState(null);
  const [sortDir, setSortDir]           = useState("asc");
  const [tab, setTab]                   = useState("data");
  const [searchCol, setSearchCol]       = useState("");
  const [materializing, setMaterializing] = useState(false);
  const [numFmt, setNumFmt]             = useState("full");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showShare, setShowShare]       = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);

  /* ── fetch report meta ── */
  const fetchReport = useCallback(() => {
    if (!api || !id) return;
    setLoading(true);
    api(`/api/v1/reports/${id}`)
      .then((data) => { setReport(data); })
      .catch(() => push("Failed to load report", "error"))
      .finally(() => setLoading(false));
  }, [api, id, push]);

  /* ── fetch report data ── */
  const fetchData = useCallback(async (pg = 1, sf = sortField, sd = sortDir, filters = activeFilters) => {
    if (!api || !id) return;
    setDataLoading(true);
    try {
      const sorting = sf ? [{ field: sf, direction: sd }] : [];
      const apiFilters = filters.map(f => ({ field: f.field, operator: f.operator, value: f.value }));
      const body = { page: pg, page_size: pageSize, filters: apiFilters, sorting, hidden_dimensions: [] };
      const res = await api(`/api/v1/reports/${id}/query`, { method: "POST", body: JSON.stringify(body) });
      const rawRows = res?.data || res?.rows || [];
      const rawCols = res?.columns || (rawRows.length > 0 ? Object.keys(rawRows[0]).map(k => ({ name: k, display_name: k })) : []);
      setRows(rawRows);
      setColumns(rawCols);
      setTotalRows(res?.total_rows ?? res?.total ?? rawRows.length);
    } catch {
      push("Failed to load report data", "error");
      setRows([]);
      setColumns([]);
    }
    setDataLoading(false);
  }, [api, id, pageSize, sortField, sortDir, activeFilters, push]);

  /* ── fetch grand totals ── */
  const fetchGrandTotals = useCallback(async () => {
    if (!api || !id) return;
    try {
      const res = await api(`/api/v1/reports/${id}/grand-totals`);
      setGrandTotals(res?.totals || res || null);
    } catch {
      setGrandTotals(null);
    }
  }, [api, id]);

  useEffect(() => { fetchReport(); }, [fetchReport]);
  useEffect(() => {
    if (report) {
      fetchData(page, sortField, sortDir, activeFilters);
      fetchGrandTotals();
    }
  }, [report, page, sortField, sortDir, activeFilters]);

  const addFilter = (f) => { setActiveFilters(p => [...p, { ...f, id: Date.now() }]); setPage(1); };
  const removeFilter = (fid) => { setActiveFilters(p => p.filter(f => f.id !== fid)); setPage(1); };
  const clearFilters = () => { setActiveFilters([]); setPage(1); };

  const handleSort = (colName) => {
    if (sortField === colName) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(colName);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleMaterialize = async () => {
    setMaterializing(true);
    try {
      await api(`/api/v1/reports/${id}/materialize`, { method: "POST" });
      push("Materialization started");
      fetchReport();
    } catch { push("Materialization failed", "error"); }
    setMaterializing(false);
  };

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  /* ── computed: visibleColumns ── */
  const visibleCols = columns.filter((c) => {
    const name = c.display_name || c.name || "";
    return !searchCol || name.toLowerCase().includes(searchCol.toLowerCase());
  });

  /* ── grand total row values ── */
  const grandTotalRow = grandTotals && columns.length > 0
    ? columns.map((c) => grandTotals[c.name] ?? grandTotals[c.display_name] ?? null)
    : null;

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  if (loading) return <PageSkeleton />;

  if (!report) {
    return (
      <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-[var(--text-muted)]">Report not found.</p>
          <button className={btnS} onClick={() => navigate("/reports")}>
            <I d={ico.back} size={14} /> Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const sc = STATUS_COLORS[(report.status || "draft").toLowerCase()] || STATUS_COLORS.draft;
  const reportCols = report.definition?.columns || [];
  const reportType = report.report_type || report.definition?.report_type || "flat";

  /* ─────────── Main UI ─────────── */
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ════════════════ HEADER ════════════════ */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
          {/* Left: back + icon + name */}
          <div className="flex items-center gap-3 min-w-0">
            <button title="Back to Reports"
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shrink-0"
              onClick={() => navigate("/reports")}>
              <I d={ico.back} size={15} />
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.3)" }}>
              <I d={ico.report} size={15} color="#818cf8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold truncate leading-tight">{report.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge label={report.status || "draft"} bg={sc.bg} color={sc.color} border={sc.border} />
                {reportType && reportType !== "—" && (
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full capitalize"
                    style={{ background: "rgba(6,182,212,.1)", color: "#22d3ee", border: "1px solid rgba(6,182,212,.2)" }}>
                    {reportType}
                  </span>
                )}
                {activeFilters.length > 0 && (
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(251,191,36,.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,.25)" }}>
                    {activeFilters.length} filter{activeFilters.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Refresh */}
            <button title="Refresh data" className={btnS}
              onClick={() => { fetchData(page, sortField, sortDir, activeFilters); fetchGrandTotals(); }}
              disabled={dataLoading}>
              {dataLoading ? <Spin /> : <I d={ico.refresh} size={13} />}
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Re-materialize */}
            <button title="Re-materialize report" className={btnS}
              onClick={handleMaterialize} disabled={materializing}>
              {materializing ? <Spin /> : <I d={ico.materialize} size={13} />}
              <span className="hidden sm:inline">Re-materialize</span>
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-[var(--border)] mx-1" />

            {/* Share */}
            <button title="Share" className={btnS} onClick={() => setShowShare(true)}>
              <I d={ico.share} size={13} />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Duplicate */}
            <button title="Duplicate" className={btnS} onClick={() => setShowDuplicate(true)}>
              <I d={ico.duplicate} size={13} />
              <span className="hidden sm:inline">Duplicate</span>
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-[var(--border)] mx-1" />

            {/* Edit (primary) */}
            <button title="Edit report" className={btnP}
              style={{ background: "var(--nav-active-bg)" }}
              onClick={() => navigate(`/reports/${id}/edit`)}>
              <I d={ico.edit} size={13} color="#fff" />
              Edit
            </button>
          </div>
        </header>

        {/* ════════════════ TAB BAR ════════════════ */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
          {[
            { id: "data",     label: `Data${totalRows ? ` (${totalRows.toLocaleString()})` : ""}` },
            { id: "overview", label: "Overview" },
            { id: "columns",  label: `Columns (${reportCols.length})` },
          ].map((t) => (
            <button key={t.id}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150"
              style={{
                background: tab === t.id ? "var(--nav-active)" : "transparent",
                color: tab === t.id ? "#fff" : "var(--text-muted)",
                border: "none",
              }}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════ CONTENT ════════════════ */}
        <main className="flex-1 overflow-auto flex flex-col min-h-0">
          {tab === "data" && <DataTab
            rows={rows} columns={visibleCols} allColumns={columns}
            grandTotals={grandTotals}
            dataLoading={dataLoading}
            sortField={sortField} sortDir={sortDir} onSort={handleSort}
            page={page} totalPages={totalPages} totalRows={totalRows} pageSize={pageSize}
            onPageChange={setPage}
            searchCol={searchCol} setSearchCol={setSearchCol}
            numFmt={numFmt} setNumFmt={setNumFmt}
            activeFilters={activeFilters} onAddFilter={addFilter}
            onRemoveFilter={removeFilter} onClearFilters={clearFilters}
            reportColumns={columns}
          />}
          {tab === "overview" && <OverviewTab report={report} reportCols={reportCols} onMaterialize={handleMaterialize} materializing={materializing} />}
          {tab === "columns"  && <ColumnsTab columns={reportCols} />}
        </main>

        <footer className="px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between text-[0.65rem] text-[var(--text-muted)] shrink-0">
          <span>© 2026 PCSoft Analytics</span>
          <span>v1.0.0</span>
        </footer>
      </div>

      <Toast />
      {showShare    && <ShareModal reportName={report.name} onClose={() => setShowShare(false)} />}
      {showDuplicate && <DuplicateModal report={report} api={api} push={push} onClose={() => setShowDuplicate(false)} onSuccess={fetchReport} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB: Data  — main data table with grand totals row
   ═══════════════════════════════════════════════════════════ */
/* ── Numbers Format Dropdown ── */
function NumFmtDropdown({ numFmt, setNumFmt }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const cur = NUM_FORMATS.find(f => f.id === numFmt) || NUM_FORMATS[0];
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)} className={btnS} style={{ borderColor: open ? "var(--nav-active)" : undefined }}>
        <I d={ico.hash} size={13} /> {cur.label} <I d={open ? ico.chevUp : ico.chevDown} size={11} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-40 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl overflow-hidden" style={{ minWidth: 220, animation: "fadeUp .15s ease both" }}>
          <div className="px-3 pt-3 pb-1">
            <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Quick apply to all measures</p>
          </div>
          {NUM_FORMATS.map(f => {
            const active = f.id === numFmt;
            return (
              <button key={f.id} onClick={() => { setNumFmt(f.id); setOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs cursor-pointer border-none transition-colors"
                style={{ background: active ? "var(--nav-active)" : "transparent", color: active ? "#fff" : "var(--text)" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-input)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <span className="font-semibold">{f.label}</span>
                <span className="text-[0.65rem] opacity-70 font-mono">{f.preview}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Filter Builder ── */
function FilterBuilder({ reportColumns, onAdd }) {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("equals");
  const [value, setValue] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const noVal = NO_VALUE_OPS.includes(operator);
  const apply = () => {
    if (!field || (!noVal && !value.trim())) return;
    onAdd({ field, operator, value: noVal ? null : value.trim(), label: `${field} ${OPERATORS.find(o=>o.id===operator)?.label||operator} ${noVal ? "" : value.trim()}` });
    setValue(""); setOpen(false);
  };
  const cols = reportColumns.map(c => c.name || c.display_name).filter(Boolean);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)} className={btnS} style={{ borderColor: open ? "var(--nav-active)" : undefined }}>
        <I d={ico.plus} size={13} /> Add Filter {open && <I d={ico.chevUp} size={11} />}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-40 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl p-4 space-y-3" style={{ minWidth: 340, animation: "fadeUp .15s ease both" }}>
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Add Runtime Filter</p>
          {/* Column */}
          <div>
            <label className="text-[0.6rem] text-[var(--text-muted)] block mb-1">Column</label>
            <select value={field} onChange={e => setField(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text)] outline-none cursor-pointer">
              <option value="">Select column…</option>
              {cols.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Operator */}
          <div>
            <label className="text-[0.6rem] text-[var(--text-muted)] block mb-1">Operator</label>
            <select value={operator} onChange={e => setOperator(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text)] outline-none cursor-pointer">
              {OPERATORS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
          {/* Value */}
          {!noVal && (
            <div>
              <label className="text-[0.6rem] text-[var(--text-muted)] block mb-1">Value</label>
              <input value={value} onChange={e => setValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && apply()}
                className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--nav-active)] transition-colors"
                placeholder="Enter value…" />
            </div>
          )}
          <button onClick={apply} disabled={!field || (!noVal && !value.trim())} className={btnP}
            style={{ background: "var(--nav-active-bg)", width: "100%", justifyContent: "center", opacity: (!field || (!noVal && !value.trim())) ? 0.5 : 1 }}>
            <I d={ico.filter} size={13} color="#fff" /> Apply Filter
          </button>
        </div>
      )}
    </div>
  );
}

function DataTab({ rows, columns, allColumns, grandTotals, dataLoading, sortField, sortDir, onSort, page, totalPages, totalRows, pageSize, onPageChange, searchCol, setSearchCol, numFmt, setNumFmt, activeFilters, onAddFilter, onRemoveFilter, onClearFilters, reportColumns }) {
  const pageStart = (page - 1) * pageSize;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ── Filter Bar ── */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
        <FilterBuilder reportColumns={reportColumns.length ? reportColumns : allColumns} onAdd={onAddFilter} />
        {activeFilters.map(f => (
          <span key={f.id} className="flex items-center gap-1.5 text-[0.65rem] font-semibold px-2.5 py-1 rounded-full cursor-default"
            style={{ background: "rgba(251,191,36,.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,.25)" }}>
            <I d={ico.filter} size={11} color="#fbbf24" />
            {f.label}
            <button onClick={() => onRemoveFilter(f.id)} className="ml-0.5 hover:opacity-70 cursor-pointer bg-transparent border-none p-0">
              <I d={ico.x} size={11} color="#fbbf24" sw={2.5} />
            </button>
          </span>
        ))}
        {activeFilters.length > 1 && (
          <button onClick={onClearFilters} className="text-[0.65rem] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer bg-transparent border-none underline">
            Clear all
          </button>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 px-5 py-2 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
        <NumFmtDropdown numFmt={numFmt} setNumFmt={setNumFmt} />
        <div className="flex-1" />
        <div className="relative">
          <I d={ico.search} size={12} color="var(--text-muted)" className="absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            className="bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-7 pr-3 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--nav-active)] transition-[border-color] duration-150"
            placeholder="Find column…"
            value={searchCol}
            onChange={e => setSearchCol(e.target.value)}
            style={{ width: 160 }}
          />
        </div>
        {totalRows > 0 && (
          <span className="text-[0.65rem] text-[var(--text-muted)] whitespace-nowrap">
            {totalRows.toLocaleString()} rows · {allColumns.length} cols
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto relative">
        {dataLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <Spin /> <span className="text-xs text-[var(--text-muted)]">Loading…</span>
            </div>
          </div>
        )}

        {columns.length === 0 && !dataLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.12)" }}>
              <I d={ico.report} size={24} color="#818cf8" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-sub)] mb-1">No data available</p>
            <p className="text-xs text-[var(--text-muted)]">This report may not be materialized yet</p>
          </div>
        ) : (
          <table className="w-full text-xs border-collapse" style={{ tableLayout: "auto" }}>
            <thead className="sticky top-0 z-[5]">
              <tr style={{ background: "var(--bg-card)", borderBottom: "2px solid var(--border)" }}>
                {/* Row number */}
                <th className="px-3 py-2.5 text-left font-bold text-[0.6rem] uppercase tracking-wider whitespace-nowrap"
                  style={{ color: "var(--text-muted)", width: 48 }}>#</th>
                {columns.map((col) => {
                  const name = col.name || col.display_name || "";
                  const isSorted = sortField === name;
                  return (
                    <th key={name}
                      className="px-3 py-2.5 text-left font-bold text-[0.6rem] uppercase tracking-wider whitespace-nowrap cursor-pointer select-none group"
                      style={{ color: isSorted ? "var(--nav-active)" : "var(--text-muted)" }}
                      onClick={() => onSort(name)}>
                      <div className="flex items-center gap-1">
                        <span>{col.display_name || col.name}</span>
                        <span className="opacity-0 group-hover:opacity-60 transition-opacity">
                          {isSorted
                            ? <I d={sortDir === "asc" ? ico.chevUp : ico.chevDown} size={10} color="var(--nav-active)" />
                            : <I d={ico.chevDown} size={10} />}
                        </span>
                        {isSorted && (
                          <I d={sortDir === "asc" ? ico.chevUp : ico.chevDown} size={10} color="var(--nav-active)" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const globalIdx = pageStart + i + 1;
                return (
                  <tr key={i}
                    className="border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors duration-75">
                    <td className="px-3 py-2 text-[var(--text-muted)] font-mono" style={{ fontSize: "0.6rem" }}>
                      {globalIdx}
                    </td>
                    {columns.map((col) => {
                      const name = col.name || col.display_name || "";
                      const val  = row[name] ?? row[col.display_name] ?? null;
                      const numeric = isNumeric(val);
                      return (
                        <td key={name} className="px-3 py-2 whitespace-nowrap"
                          style={{ color: "var(--text)", textAlign: numeric ? "right" : "left" }}>
                          {numeric
                            ? <span className="font-mono tabular-nums">{formatNum(val, numFmt)}</span>
                            : <span>{val === null || val === undefined ? <span style={{ color: "var(--text-muted)" }}>—</span> : String(val)}</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>

            {/* ── Grand Total Row ── */}
            {grandTotals && columns.length > 0 && (
              <tfoot>
                <tr style={{ borderTop: "2px solid var(--nav-active)", background: "rgba(99,102,241,.08)" }}>
                  <td className="px-3 py-2.5 text-center">
                    <span className="text-[0.6rem] font-bold" style={{ color: "#818cf8" }}>Σ</span>
                  </td>
                  {columns.map((col) => {
                    const name = col.name || col.display_name || "";
                    const val  = grandTotals[name] ?? grandTotals[col.display_name] ?? null;
                    const numeric = isNumeric(val);
                    return (
                      <td key={name} className="px-3 py-2.5 font-bold whitespace-nowrap"
                        style={{ color: "#818cf8", textAlign: numeric ? "right" : "left", fontSize: "0.7rem" }}>
                        {val === null || val === undefined
                          ? <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>—</span>
                          : numeric
                            ? <span className="font-mono tabular-nums">{formatNum(val, numFmt)}</span>
                            : String(val) === "" ? <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>Grand Total</span> : <span className="font-semibold">{String(val)}</span>
                        }
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalRows > 0 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-card)] shrink-0">
          <span className="text-[0.65rem] text-[var(--text-muted)]">
            Showing {pageStart + 1}–{Math.min(pageStart + pageSize, totalRows)} of {totalRows.toLocaleString()} rows
          </span>
          <div className="flex items-center gap-2">
            <button className={btnS} disabled={page <= 1} onClick={() => onPageChange(page - 1)}
              style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? "not-allowed" : "pointer" }}>
              <I d={ico.chevLeft} size={13} /> Prev
            </button>
            <span className="text-[0.65rem] text-[var(--text-muted)] min-w-[80px] text-center">
              Page {page} / {totalPages}
            </span>
            <button className={btnS} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
              style={{ opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer" }}>
              Next <I d={ico.chevRight} size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB: Overview
   ═══════════════════════════════════════════════════════════ */
function OverviewTab({ report, reportCols, onMaterialize, materializing }) {
  const sc = STATUS_COLORS[(report.status || "draft").toLowerCase()] || STATUS_COLORS.draft;
  const reportType = report.report_type || report.definition?.report_type || "—";
  const datasetId  = report.definition?.dataset_id || report.dataset_id || "—";
  const groupBy    = report.definition?.group_by || report.definition?.groupBy || [];
  const measures   = report.definition?.measures || [];
  const filters    = report.definition?.base_filters || report.definition?.filters || [];

  const statCards = [
    { label: "Columns",   value: reportCols.length,  color: "#818cf8", icon: ico.layers },
    { label: "Measures",  value: measures.length,    color: "#22d3ee", icon: ico.sigma },
    { label: "Group By",  value: groupBy.length,     color: "#4ade80", icon: ico.sort },
    { label: "Filters",   value: filters.length,     color: "#fbbf24", icon: ico.filter },
  ];

  return (
    <div className="px-6 py-5 space-y-5">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((c) => (
          <div key={c.label} className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
              <I d={c.icon} size={18} color={c.color} />
            </div>
            <div>
              <p className="text-xl font-bold">{c.value}</p>
              <p className="text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Details Grid ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Config */}
        <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)] mb-4">Report Configuration</h3>
          <div className="space-y-3">
            <DetailRow label="Report Type"  value={reportType} />
            <DetailRow label="Dataset ID"   value={datasetId} />
            <DetailRow label="Status"       value={
              <Badge label={report.status || "draft"} bg={sc.bg} color={sc.color} border={sc.border} />
            } />
            <DetailRow label="Category"     value={report.category?.name || report.category_id || "—"} />
            <DetailRow label="Description"  value={report.description || "—"} />
          </div>
        </section>

        {/* Right: Timeline */}
        <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)] mb-4">Timeline & Materialization</h3>
          <div className="space-y-3">
            <DetailRow label="Created"             value={formatDateTime(report.created_at)} />
            <DetailRow label="Updated"             value={formatDateTime(report.updated_at)} />
            <DetailRow label="Last Materialized"   value={formatDateTime(report.last_materialized_at)} />
            <DetailRow label="Materialized Path"   value={report.materialized_path || "Not materialized"} />
          </div>
          {!report.last_materialized_at && (
            <div className="mt-4 p-3 rounded-xl border border-dashed flex items-center justify-between gap-3"
              style={{ borderColor: "rgba(250,204,21,.4)", background: "rgba(250,204,21,.04)" }}>
              <div>
                <p className="text-xs font-semibold text-yellow-400">Not yet materialized</p>
                <p className="text-[0.6rem] text-[var(--text-muted)] mt-0.5">Run materialization to enable data queries</p>
              </div>
              <button className={btnP} style={{ background: "#f59e0b" }} onClick={onMaterialize} disabled={materializing}>
                {materializing ? <Spin /> : <I d={ico.materialize} size={13} color="#fff" />} Materialize
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ── Group By & Measures ── */}
      {(groupBy.length > 0 || measures.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {groupBy.length > 0 && (
            <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3">Group By Columns</h3>
              <div className="flex flex-wrap gap-2">
                {groupBy.map((g, i) => (
                  <span key={i} className="text-[0.7rem] font-semibold px-2 py-1 rounded-lg"
                    style={{ background: "rgba(74,222,128,.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,.2)" }}>
                    {typeof g === "string" ? g : g.column || g.name || JSON.stringify(g)}
                  </span>
                ))}
              </div>
            </section>
          )}
          {measures.length > 0 && (
            <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3">Measures</h3>
              <div className="flex flex-wrap gap-2">
                {measures.map((m, i) => (
                  <span key={i} className="text-[0.7rem] font-semibold px-2 py-1 rounded-lg"
                    style={{ background: "rgba(6,182,212,.1)", color: "#22d3ee", border: "1px solid rgba(6,182,212,.2)" }}>
                    {typeof m === "string" ? m : `${m.aggregation || m.function || ""}(${m.column || m.name || ""})`.replace(/^\(/, "")}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── Base Filters ── */}
      {filters.length > 0 && (
        <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3">Base Filters</h3>
          <div className="space-y-2">
            {filters.map((f, i) => (
              <div key={i} className="p-2.5 rounded-lg text-xs flex items-center gap-2"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}>
                <I d={ico.filter} size={12} color="#fbbf24" />
                <span className="font-semibold" style={{ color: "var(--text)" }}>
                  {f.field || f.column}
                </span>
                <span className="text-[var(--text-muted)]">{f.operator}</span>
                <span style={{ color: "#fbbf24" }}>{Array.isArray(f.value) ? f.value.join(", ") : String(f.value ?? "")}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[var(--text-muted)] shrink-0">{label}</span>
      <span className="text-xs font-medium text-[var(--text)] text-right">{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB: Columns — shows report column definitions
   ═══════════════════════════════════════════════════════════ */
const TYPE_COLOR_MAP = {
  INTEGER: "#60a5fa", INT: "#60a5fa", BIGINT: "#60a5fa",
  TEXT: "#4ade80", VARCHAR: "#4ade80", STRING: "#4ade80",
  DATE: "#fbbf24", DATETIME: "#fbbf24", TIMESTAMP: "#fbbf24",
  DECIMAL: "#f472b6", FLOAT: "#f472b6", DOUBLE: "#f472b6", NUMERIC: "#f472b6",
  BOOLEAN: "#fb923c", BOOL: "#fb923c",
};

function ColumnsTab({ columns }) {
  if (!columns.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <p className="text-sm text-[var(--text-muted)]">No column definitions available</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <table className="w-full table-fixed">
        <colgroup>
          <col style={{ width: "4%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "14%" }} />
        </colgroup>
        <thead>
          <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)] border-b border-[var(--border)]">
            <th className="text-left px-3 py-2.5">#</th>
            <th className="text-left px-3 py-2.5">Name</th>
            <th className="text-left px-3 py-2.5">Display Name</th>
            <th className="text-left px-3 py-2.5">Data Type</th>
            <th className="text-left px-3 py-2.5">Column Type</th>
            <th className="text-left px-3 py-2.5">Aggregation</th>
            <th className="text-left px-3 py-2.5">Visible</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col, i) => {
            const dt      = (col.data_type || col.dataType || "").toUpperCase();
            const dtColor = TYPE_COLOR_MAP[dt] || "#94a3b8";
            const colType = col.column_type || col.columnType || col.type || "";
            const agg     = col.aggregation || col.aggregate || "—";
            const vis     = col.visible !== undefined ? col.visible : col.is_visible !== undefined ? col.is_visible : null;

            return (
              <tr key={col.id || i} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors">
                <td className="px-3 py-2.5 text-xs text-[var(--text-muted)]">{i + 1}</td>
                <td className="px-3 py-2.5 text-sm font-medium truncate">{col.name}</td>
                <td className="px-3 py-2.5 text-xs text-[var(--text-sub)] truncate">{col.display_name || col.displayName || "—"}</td>
                <td className="px-3 py-2.5">
                  {dt ? (
                    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full uppercase"
                      style={{ background: `${dtColor}15`, color: dtColor, border: `1px solid ${dtColor}30` }}>
                      {dt}
                    </span>
                  ) : <span className="text-xs text-[var(--text-muted)]">—</span>}
                </td>
                <td className="px-3 py-2.5">
                  {colType ? (
                    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: "rgba(99,102,241,.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,.2)" }}>
                      {colType}
                    </span>
                  ) : <span className="text-xs text-[var(--text-muted)]">—</span>}
                </td>
                <td className="px-3 py-2.5 text-xs text-[var(--text-muted)]">{agg}</td>
                <td className="px-3 py-2.5">
                  {vis !== null
                    ? vis
                      ? <I d={ico.check} size={14} color="#4ade80" sw={2.5} />
                      : <I d={ico.x}     size={14} color="#94a3b8" sw={2.5} />
                    : <span className="text-xs text-[var(--text-muted)]">—</span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
