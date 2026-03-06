import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

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
  back: "M19 12H5M12 19l-7-7 7-7",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  db: "M12 2C6.48 2 3 3.34 3 5v14c0 1.66 3.48 3 9 3s9-1.34 9-3V5c0-1.66-3.48-3-9-3zM3 12c0 1.66 3.48 3 9 3s9-1.34 9-3",
  table: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0H5a2 2 0 01-2-2v-4m6 6h10a2 2 0 002-2v-4M3 9h18M3 15h18",
  columns: "M12 3v18M3 3h18v18H3zM3 9h18M3 15h18",
  sync: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
  materialize: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  refresh: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  copy: "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  info: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 16v-4M12 8h.01",
  play: "M5 3l14 9-14 9V3z",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] transition-all duration-150";

/* ── Badge colors ── */
const STATUS_COLORS = {
  active:   { bg: "rgba(74,222,128,.12)", color: "#4ade80", border: "rgba(74,222,128,.25)" },
  draft:    { bg: "rgba(250,204,21,.12)", color: "#facc15", border: "rgba(250,204,21,.25)" },
  archived: { bg: "rgba(148,163,184,.12)", color: "#94a3b8", border: "rgba(148,163,184,.25)" },
};
const TYPE_COLORS = {
  join:  { bg: "rgba(99,102,241,.10)", color: "#818cf8", border: "rgba(99,102,241,.25)" },
  union: { bg: "rgba(245,158,11,.10)", color: "#fbbf24", border: "rgba(245,158,11,.25)" },
  sql:   { bg: "rgba(6,182,212,.10)",  color: "#22d3ee", border: "rgba(6,182,212,.25)" },
};
const SYNC_COLORS = {
  success: { bg: "rgba(74,222,128,.12)", color: "#4ade80", border: "rgba(74,222,128,.25)" },
  running: { bg: "rgba(96,165,250,.12)", color: "#60a5fa", border: "rgba(96,165,250,.25)" },
  failed:  { bg: "rgba(248,113,113,.12)", color: "#f87171", border: "rgba(248,113,113,.25)" },
  pending: { bg: "rgba(250,204,21,.12)", color: "#facc15", border: "rgba(250,204,21,.25)" },
};
const MAT_COLORS = {
  success:    { bg: "rgba(74,222,128,.12)", color: "#4ade80", border: "rgba(74,222,128,.25)" },
  failed:     { bg: "rgba(248,113,113,.12)", color: "#f87171", border: "rgba(248,113,113,.25)" },
  running:    { bg: "rgba(96,165,250,.12)", color: "#60a5fa", border: "rgba(96,165,250,.25)" },
  pending:    { bg: "rgba(250,204,21,.12)", color: "#facc15", border: "rgba(250,204,21,.25)" },
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
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " at " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

const TYPE_COLOR_MAP = {
  INT: "#60a5fa", INTEGER: "#60a5fa", BIGINT: "#60a5fa", SMALLINT: "#60a5fa", TINYINT: "#60a5fa",
  TEXT: "#4ade80", VARCHAR: "#4ade80", CHAR: "#4ade80", STRING: "#4ade80", NVARCHAR: "#4ade80", NCHAR: "#4ade80",
  DATE: "#fbbf24", DATETIME: "#fbbf24", TIMESTAMP: "#fbbf24", DATETIME2: "#fbbf24",
  DECIMAL: "#f472b6", FLOAT: "#f472b6", DOUBLE: "#f472b6", NUMERIC: "#f472b6", MONEY: "#f472b6", REAL: "#f472b6",
  BOOLEAN: "#fb923c", BOOL: "#fb923c", BIT: "#fb923c",
};

/* ═══════════════════════════════════════════════════════════
   DataSetDetail — Main Component
   ═══════════════════════════════════════════════════════════ */
export default function DataSetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const { push, Toast } = useToast();

  const [ds, setDs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [materializing, setMaterializing] = useState(false);
  const [tab, setTab] = useState("overview");

  const fetchDataset = useCallback(() => {
    if (!api || !id) return;
    setLoading(true);
    api(`/api/v1/datasets/${id}`)
      .then(setDs)
      .catch(() => { push("Failed to load dataset", "error"); })
      .finally(() => setLoading(false));
  }, [api, id, push]);

  useEffect(() => { fetchDataset(); }, [fetchDataset]);

  /* ── Actions ── */
  const handleSync = async () => {
    setSyncing(true);
    try {
      await api(`/api/v1/datasets/${id}/sync`, { method: "POST" });
      push("Sync started");
      fetchDataset();
    } catch { push("Sync failed", "error"); }
    setSyncing(false);
  };

  const handleMaterialize = async () => {
    setMaterializing(true);
    try {
      await api(`/api/v1/datasets/${id}/materialize`, { method: "POST", body: JSON.stringify({}) });
      push("Materialization started");
      fetchDataset();
    } catch { push("Materialization failed", "error"); }
    setMaterializing(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} />
        <div className="flex-1 flex items-center justify-center gap-3">
          <Spin /> <span className="text-sm text-[var(--text-muted)]">Loading dataset…</span>
        </div>
      </div>
    );
  }

  if (!ds) {
    return (
      <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-[var(--text-muted)]">Dataset not found.</p>
          <button className={btnS} onClick={() => navigate("/datasets")}>
            <I d={ico.back} size={14} /> Back to Datasets
          </button>
        </div>
      </div>
    );
  }

  const sc = STATUS_COLORS[ds.status] || STATUS_COLORS.draft;
  const tc = TYPE_COLORS[ds.definition_type] || TYPE_COLORS.join;
  const sources = ds.definition?.sources || [];
  const columns = ds.definition?.columns || [];
  const tables = ds.definition?.tables || [];
  const joins = ds.definition?.joins || [];
  const outputCols = ds.output_definition?.columns || [];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "columns", label: `Columns (${(outputCols.length || columns.length)})` },
    { id: "sources", label: `Sources (${sources.length})` },
    { id: "definition", label: "View Definition" },
    { id: "sync", label: "Sync & Materialization" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              onClick={() => navigate("/datasets")}>
              <I d={ico.back} size={16} />
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: tc.bg, border: `1px solid ${tc.border}` }}>
              <I d={ico.layers} size={16} color={tc.color} />
            </div>
            <div>
              <h1 className="text-sm font-bold">{ds.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge label={ds.definition_type || "—"} bg={tc.bg} color={tc.color} border={tc.border} />
                <Badge label={ds.status || "—"} bg={sc.bg} color={sc.color} border={sc.border} />
                {ds.sync_enabled && <span className="text-[0.6rem] text-[var(--text-muted)]">Sync enabled</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={btnS} onClick={handleSync} disabled={syncing}>
              {syncing ? <Spin /> : <I d={ico.sync} size={14} />} Sync
            </button>
            <button className={btnS} onClick={handleMaterialize} disabled={materializing}>
              {materializing ? <Spin /> : <I d={ico.materialize} size={14} />} Materialize
            </button>
            <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
              onClick={() => navigate(`/datasets/${id}/edit`)}>
              <I d={ico.edit} size={14} color="#fff" /> Edit
            </button>
          </div>
        </header>

        {/* ── Tab Bar ── */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-[var(--border)] bg-[var(--bg-card)]">
          {tabs.map((t) => (
            <button key={t.id}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150"
              style={{
                background: tab === t.id ? "var(--nav-active)" : "transparent",
                color: tab === t.id ? "#fff" : "var(--text-muted)",
                border: "none",
              }}
              onClick={() => t.id === "definition" ? navigate(`/datasets/${id}/definition`) : setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <main className="flex-1 overflow-auto px-6 py-5">
          {tab === "overview" && <OverviewTab ds={ds} sources={sources} columns={columns} outputCols={outputCols} tables={tables} joins={joins} />}
          {tab === "columns" && <ColumnsTab columns={outputCols.length ? outputCols : columns} />}
          {tab === "sources" && <SourcesTab sources={sources} />}
          {tab === "sync" && <SyncTab ds={ds} syncing={syncing} materializing={materializing} onSync={handleSync} onMaterialize={handleMaterialize} />}
        </main>

        <footer className="px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between text-[0.65rem] text-[var(--text-muted)]">
          <span>© 2026 PCSoft Analytics</span>
          <span>v1.0.0</span>
        </footer>
      </div>
      <Toast />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB: Overview
   ═══════════════════════════════════════════════════════════ */
function OverviewTab({ ds, sources, columns, outputCols, tables, joins }) {
  const infoCards = [
    { label: "Sources", value: sources.length, icon: ico.db, color: "#60a5fa" },
    { label: "Tables", value: tables.length, icon: ico.table, color: "#fbbf24" },
    { label: "Columns", value: outputCols.length || columns.length, icon: ico.columns, color: "#4ade80" },
    { label: "Joins", value: joins.length, icon: ico.layers, color: "#a78bfa" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Description ── */}
      <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
        <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3">Description</h3>
        <p className="text-sm text-[var(--text-sub)]">
          {ds.description || <span className="italic text-[var(--text-muted)]">No description provided</span>}
        </p>
      </section>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {infoCards.map((c) => (
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

      {/* ── Details ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3">Configuration</h3>
          <div className="space-y-2.5">
            <DetailRow label="Definition Type" value={ds.definition_type} />
            <DetailRow label="Sync Method" value={ds.sync_method || "—"} />
            <DetailRow label="Sync Frequency" value={ds.sync_frequency || "—"} />
            <DetailRow label="Sync Enabled" value={ds.sync_enabled ? "Yes" : "No"} />
            <DetailRow label="Aggregation" value={ds.aggregation_enabled ? "Enabled" : "Disabled"} />
          </div>
        </section>

        <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3">Timeline</h3>
          <div className="space-y-2.5">
            <DetailRow label="Created" value={formatDateTime(ds.created_at)} />
            <DetailRow label="Updated" value={formatDateTime(ds.updated_at)} />
            <DetailRow label="Last Synced" value={formatDateTime(ds.last_synced_at)} />
            <DetailRow label="Last Materialized" value={formatDateTime(ds.last_materialized_at)} />
            <DetailRow label="Sync Status" value={ds.last_sync_status || "—"} />
            <DetailRow label="Materialization Status" value={ds.last_materialization_status || "—"} />
          </div>
        </section>
      </div>

      {/* ── Materialization Banner ── */}
      {!ds.last_materialized_at && (
        <div className="p-5 rounded-xl border border-dashed flex items-center gap-4"
          style={{ borderColor: "rgba(250,204,21,.4)", background: "rgba(250,204,21,.04)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(250,204,21,.12)", border: "1px solid rgba(250,204,21,.25)" }}>
            <I d={ico.materialize} size={22} color="#facc15" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Dataset Not Yet Materialized</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Materialize this dataset to enable fast queries and data access.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <span className="text-xs font-medium text-[var(--text)] capitalize">{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB: Columns
   ═══════════════════════════════════════════════════════════ */
function ColumnsTab({ columns }) {
  if (!columns.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-[var(--text-muted)]">No columns defined</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <table className="w-full table-fixed">
        <colgroup>
          <col style={{ width: "6%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "16%" }} />
        </colgroup>
        <thead>
          <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]">
            <th className="text-left px-3 py-2.5">#</th>
            <th className="text-left px-3 py-2.5">Name</th>
            <th className="text-left px-3 py-2.5">Display Name</th>
            <th className="text-left px-3 py-2.5">Data Type</th>
            <th className="text-left px-3 py-2.5">Source Table</th>
            <th className="text-left px-3 py-2.5">Visible</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col, i) => {
            const dt = (col.dataType || "").toUpperCase();
            const dtColor = TYPE_COLOR_MAP[dt] || "#94a3b8";
            return (
              <tr key={col.id || i} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors">
                <td className="px-3 py-2.5 text-xs text-[var(--text-muted)]">{(col.order ?? col.columnOrder ?? i) + 1}</td>
                <td className="px-3 py-2.5">
                  <span className="text-sm font-medium">{col.name}</span>
                </td>
                <td className="px-3 py-2.5 text-xs text-[var(--text-sub)]">{col.displayName || "—"}</td>
                <td className="px-3 py-2.5">
                  <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full uppercase"
                    style={{ background: `${dtColor}15`, color: dtColor, border: `1px solid ${dtColor}30` }}>
                    {col.dataType || "—"}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-xs text-[var(--text-muted)] truncate">
                  {col.lineage?.sourceTableName || col.sourceTableName || col.tableId || "—"}
                </td>
                <td className="px-3 py-2.5">
                  {col.visible !== undefined ? (
                    col.visible ? (
                      <I d={ico.check} size={14} color="#4ade80" sw={2.5} />
                    ) : (
                      <I d={ico.x} size={14} color="#94a3b8" sw={2.5} />
                    )
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB: Sources
   ═══════════════════════════════════════════════════════════ */
function SourcesTab({ sources }) {
  if (!sources.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-[var(--text-muted)]">No sources configured</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="grid gap-3">
        {sources.map((s, i) => (
          <div key={s.id || i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(96,165,250,.1)", border: "1px solid rgba(96,165,250,.2)" }}>
              <I d={ico.table} size={18} color="#60a5fa" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{s.name}</p>
              <p className="text-[0.6rem] text-[var(--text-muted)]">
                {s.schema && `${s.schema}.`}{s.name} · {s.sourceType} · Order: {s.tableOrder}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-[var(--text-sub)]">{s.dataSource || "Unknown Source"}</p>
              <p className="text-[0.6rem] text-[var(--text-muted)]">ID: {s.sourceId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB: Sync & Materialization
   ═══════════════════════════════════════════════════════════ */
function SyncTab({ ds, syncing, materializing, onSync, onMaterialize }) {
  const syncStatus = ds.last_sync_status;
  const syncColors = syncStatus ? (SYNC_COLORS[syncStatus] || SYNC_COLORS.pending) : null;
  const matStatus = ds.last_materialization_status;
  const matColors = matStatus ? (MAT_COLORS[matStatus] || MAT_COLORS.pending) : null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* ── Sync Section ── */}
      <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)]">Sync Configuration</h3>
          <button className={btnP} style={{ background: "var(--nav-active-bg)" }} onClick={onSync} disabled={syncing}>
            {syncing ? <Spin /> : <I d={ico.sync} size={14} color="#fff" />} Run Sync
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <DetailRow label="Method" value={ds.sync_method || "—"} />
          <DetailRow label="Frequency" value={ds.sync_frequency || "—"} />
          <DetailRow label="Enabled" value={ds.sync_enabled ? "Yes" : "No"} />
          <DetailRow label="Schedule Time" value={ds.sync_schedule_time || "—"} />
          <DetailRow label="Last Synced" value={formatDateTime(ds.last_synced_at)} />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">Last Status</span>
            {syncColors ? (
              <Badge label={syncStatus} bg={syncColors.bg} color={syncColors.color} border={syncColors.border} />
            ) : (
              <span className="text-xs font-medium text-[var(--text)]">—</span>
            )}
          </div>
        </div>
      </section>

      {/* ── Materialization Section ── */}
      <section className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--text-muted)]">Materialization</h3>
          <button className={btnP} style={{ background: "#f59e0b" }} onClick={onMaterialize} disabled={materializing}>
            {materializing ? <Spin /> : <I d={ico.materialize} size={14} color="#fff" />} Materialize
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <DetailRow label="Materialized Path" value={ds.materialized_path || "Not materialized"} />
          <DetailRow label="Last Materialized" value={formatDateTime(ds.last_materialized_at)} />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">Status</span>
            {matColors ? (
              <Badge label={matStatus} bg={matColors.bg} color={matColors.color} border={matColors.border} />
            ) : (
              <span className="text-xs font-medium text-[var(--text)]">—</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
