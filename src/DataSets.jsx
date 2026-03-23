import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

/* ═══════════════════════════════════════════════════════════
   SVG helpers & shared UI
   ═══════════════════════════════════════════════════════════ */
function I({ d, size = 16, color = "currentColor", sw = 2, className = "" }) {
  return (
    <svg className={`shrink-0 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ico = {
  search: "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  copy: "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  chevDown: "M6 9l6 6 6-6",
  refresh: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  sync: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] transition-all duration-150";

/* ── Status / Type / Sync badge colors ── */
const STATUS_COLORS = {
  active: { bg: "rgba(74,222,128,.12)", color: "#4ade80", border: "rgba(74,222,128,.25)" },
  draft: { bg: "rgba(250,204,21,.12)", color: "#facc15", border: "rgba(250,204,21,.25)" },
  archived: { bg: "rgba(148,163,184,.12)", color: "#94a3b8", border: "rgba(148,163,184,.25)" },
};
const SYNC_COLORS = {
  success: { bg: "rgba(74,222,128,.12)", color: "#4ade80", border: "rgba(74,222,128,.25)" },
  running: { bg: "rgba(96,165,250,.12)", color: "#60a5fa", border: "rgba(96,165,250,.25)" },
  failed: { bg: "rgba(248,113,113,.12)", color: "#f87171", border: "rgba(248,113,113,.25)" },
  pending: { bg: "rgba(250,204,21,.12)", color: "#facc15", border: "rgba(250,204,21,.25)" },
};
const TYPE_COLORS = {
  join: { bg: "rgba(99,102,241,.10)", color: "#818cf8", border: "rgba(99,102,241,.25)" },
  union: { bg: "rgba(245,158,11,.10)", color: "#fbbf24", border: "rgba(245,158,11,.25)" },
  sql: { bg: "rgba(6,182,212,.10)", color: "#22d3ee", border: "rgba(6,182,212,.25)" },
};

function Badge({ label, bg, color, border }) {
  return (
    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap capitalize"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  );
}

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
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl max-h-56 overflow-y-auto"
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

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ═══════════════════════════════════════════════════════════
   DataSets — Main Component
   ═══════════════════════════════════════════════════════════ */
export default function DataSets() {
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const navigate = useNavigate();
  const { push, Toast } = useToast();
  const PAGE_SIZE = 10;

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [duplicating, setDuplicating] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDatasets = useCallback(() => {
    if (!api) return;
    setLoading(true);
    api("/api/v1/datasets/?skip=0&limit=100")
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.datasets || [];
        setDatasets(list);
      })
      .catch(() => { setDatasets([]); push("Failed to load datasets", "error"); })
      .finally(() => setLoading(false));
  }, [api, push]);

  useEffect(() => { fetchDatasets(); }, [fetchDatasets]);

  /* ── Filtered list ── */
  const filtered = datasets.filter((ds) => {
    const q = search.toLowerCase();
    const matchSearch = !q || ds.name?.toLowerCase().includes(q) || ds.description?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || ds.status === statusFilter;
    const matchType = typeFilter === "all" || ds.definition_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* ── Actions ── */
  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api(`/api/v1/datasets/${deleting.id}`, { method: "DELETE" });
      push(`"${deleting.name}" deleted`);
      setDatasets((prev) => prev.filter((d) => d.id !== deleting.id));
    } catch { push("Delete failed", "error"); }
    setDeleteLoading(false);
    setDeleting(null);
  };

  const handleDuplicate = async (ds) => {
    setDuplicating(ds.id);
    try {
      await api(`/api/v1/datasets/${ds.id}/duplicate`, { method: "POST" });
      push(`"${ds.name}" duplicated`);
      fetchDatasets();
    } catch { push("Duplicate failed", "error"); }
    setDuplicating(null);
  };

  const handleSync = async (ds) => {
    setSyncing(ds.id);
    try {
      await api(`/api/v1/datasets/${ds.id}/sync`, { method: "POST" });
      push(`Sync started for "${ds.name}"`);
      fetchDatasets();
    } catch { push("Sync failed", "error"); }
    setSyncing(null);
  };

  /* ── Stats ── */
  const stats = {
    total: datasets.length,
    active: datasets.filter((d) => d.status === "active").length,
    draft: datasets.filter((d) => d.status === "draft").length,
    archived: datasets.filter((d) => d.status === "archived").length,
  };

  useEffect(() => {
    const close = () => setOpenMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)" }}>
              <I d={ico.layers} size={16} color="#818cf8" />
            </div>
            <div>
              <h1 className="text-sm font-bold">Data Sets</h1>
              <p className="text-[0.65rem] text-[var(--text-muted)]">
                {stats.total} total · {stats.active} active · {stats.draft} draft
              </p>
            </div>
          </div>
          <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
            onClick={() => navigate("/datasets/new")}>
            <I d={ico.plus} size={14} color="#fff" sw={2.5} /> New Dataset
          </button>
        </header>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex-1 relative">
            <I d={ico.search} size={14} color="var(--text-muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150"
              placeholder="Search datasets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onChange={setStatusFilter} className="w-36"
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "draft", label: "Draft" },
              { value: "archived", label: "Archived" },
            ]} />
          <Select value={typeFilter} onChange={setTypeFilter} className="w-36"
            options={[
              { value: "all", label: "All Types" },
              { value: "join", label: "Join" },
              { value: "union", label: "Union" },
              { value: "sql", label: "SQL" },
            ]} />
          <button className={btnS} onClick={fetchDatasets} title="Refresh">
            <I d={ico.refresh} size={14} />
          </button>
        </div>

        {/* ── Content ── */}
        <main className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20">
              <Spin /> <span className="text-sm text-[var(--text-muted)]">Loading datasets…</span>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<I d={ico.layers} size={24} color="#818cf8" />}
              title={search || statusFilter !== "all" || typeFilter !== "all" ? "No matching datasets" : "No datasets yet"}
              sub={search || statusFilter !== "all" || typeFilter !== "all" ? "Try adjusting your filters" : "Create your first dataset to get started"}
              action={
                !search && statusFilter === "all" && typeFilter === "all" ? (
                  <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
                    onClick={() => navigate("/datasets/new")}>
                    <I d={ico.plus} size={14} color="#fff" sw={2.5} /> Create Dataset
                  </button>
                ) : null
              }
            />
          ) : (
            <div className="px-6 py-4">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]">
                    <th className="text-left px-3 py-2.5">Name</th>
                    <th className="text-left px-3 py-2.5">Description</th>
                    <th className="text-left px-3 py-2.5">Type</th>
                    <th className="text-left px-3 py-2.5">Status</th>
                    <th className="text-left px-3 py-2.5">Sync</th>
                    <th className="text-left px-3 py-2.5">Updated</th>
                    <th className="text-center px-3 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((ds) => {
                    const sc = STATUS_COLORS[ds.status] || STATUS_COLORS.draft;
                    const tc = TYPE_COLORS[ds.definition_type] || TYPE_COLORS.join;
                    const syncSt = ds.last_sync_status || (ds.sync_enabled ? "pending" : null);
                    const syncc = syncSt ? (SYNC_COLORS[syncSt] || SYNC_COLORS.pending) : null;
                    const srcCount = ds.definition?.sources?.length || 0;
                    const colCount = ds.definition?.columns?.length || 0;

                    return (
                      <tr key={ds.id}
                        className="border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors cursor-pointer group"
                        onClick={() => navigate(`/datasets/${ds.id}`)}>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: tc.bg, border: `1px solid ${tc.border}` }}>
                              <I d={ico.layers} size={14} color={tc.color} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate group-hover:text-[var(--nav-active)] transition-colors">
                                {ds.name}
                              </p>
                              <p className="text-[0.6rem] text-[var(--text-muted)] truncate">
                                {srcCount} source{srcCount !== 1 ? "s" : ""} · {colCount} col{colCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-xs font-semibold text-[var(--text-sub)] truncate">
                            {ds.description || <span className="text-[var(--text-muted)] italic">No description</span>}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <Badge label={ds.definition_type || "—"} bg={tc.bg} color={tc.color} border={tc.border} />
                        </td>
                        <td className="px-3 py-3">
                          <Badge label={ds.status || "—"} bg={sc.bg} color={sc.color} border={sc.border} />
                        </td>
                        <td className="px-3 py-3">
                          {syncc ? (
                            <Badge label={syncSt} bg={syncc.bg} color={syncc.color} border={syncc.border} />
                          ) : (
                            <span className="text-xs text-[var(--text-muted)]">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-[var(--text-sub)]" title={formatDate(ds.updated_at)}>
                            {relativeTime(ds.updated_at)}
                          </span>
                        </td>
                        <td className="px-3 py-3 relative" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-center">

                            <button
                              onClick={() => setOpenMenu(openMenu === ds.id ? null : ds.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer
      bg-[var(--bg-input)] border border-[var(--border)]
      text-[var(--text-muted)] hover:text-[var(--nav-active)] text-center"
                            >
                              ⋮
                              {/* <I d={ico.dots} size={14} /> */}
                            </button>

                          </div>

                          {openMenu === ds.id && (
                            <div className="absolute right-6 mt-2 w-40 rounded-xl border border-[var(--border)]
      bg-[var(--bg-card)] shadow-lg z-50 overflow-hidden">

                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"
                                onClick={() => navigate(`/datasets/${ds.id}/edit`)}
                              >
                                <I d={ico.edit} size={14} /> Edit
                              </button>

                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"
                                onClick={() => handleDuplicate(ds)}
                              >
                                <I d={ico.copy} size={14} /> Duplicate
                              </button>

                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"
                                onClick={() => handleSync(ds)}
                              >
                                <I d={ico.sync} size={14} /> Sync
                              </button>

                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[var(--bg-hover)]"
                                onClick={() => setDeleting(ds)}
                              >
                                <I d={ico.trash} size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-3 px-1 flex items-center justify-between gap-3">
                <div className="text-[0.65rem] text-[var(--text-muted)]">
                  Showing {filtered.length === 0 ? 0 : pageStart + 1}-{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={btnS}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                  >
                    Prev
                  </button>
                  <span className="text-[0.65rem] text-[var(--text-muted)] min-w-20 text-center">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    className={btnS}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                  >
                    Next
                  </button>
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
          title="Delete Dataset"
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
