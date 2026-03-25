import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

/* ═══════════════════════════════════════════════════════════
   SVG helpers
   ═══════════════════════════════════════════════════════════ */
function I({ d, size = 16, color = "currentColor", sw = 2, className = "" }) {
  return (
    <svg className={`shrink-0 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ico = {
  back: "M19 12H5M12 19l-7-7 7-7",
  chevDown: "M6 9l6 6 6-6",
  db: "M12 2C6.48 2 3 3.34 3 5v14c0 1.66 3.48 3 9 3s9-1.34 9-3V5c0-1.66-3.48-3-9-3zM3 9c0 1.66 3.48 3 9 3s9-1.34 9-3M3 14c0 1.66 3.48 3 9 3s9-1.34 9-3",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  sync: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  table: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0H5a2 2 0 01-2-2v-4m6 6h10a2 2 0 002-2v-4M3 9h18M3 15h18",
  search: "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  refresh: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
  info: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 16v-4M12 8h.01",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  columns: "M12 3v18M3 3h18v18H3zM3 9h18M3 15h18",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  plus: "M12 5v14M5 12h14",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] transition-all duration-150";

const STATUS_COLORS = {
  connected: { bg: "rgba(74,222,128,.12)", color: "#4ade80", border: "rgba(74,222,128,.25)" },
  disconnected: { bg: "rgba(248,113,113,.12)", color: "#f87171", border: "rgba(248,113,113,.25)" },
  syncing: { bg: "rgba(96,165,250,.12)", color: "#60a5fa", border: "rgba(96,165,250,.25)" },
  error: { bg: "rgba(248,113,113,.12)", color: "#f87171", border: "rgba(248,113,113,.25)" },
};

function Badge({ label, bg, color, border }) {
  return (
    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap capitalize"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  );
}

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
            <I d={t.type === "error" ? ico.x : ico.check} size={13}
              color={t.type === "error" ? "#f87171" : "#34d399"} sw={2.5} />
            {t.msg}
          </div>
        ))}
      </div>
    ) : null;
  return { push, Toast };
}

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-[var(--border)] last:border-0">
      <span className="text-[0.62rem] font-bold tracking-[0.07em] uppercase text-[var(--text-muted)]">{label}</span>
      <span className="text-sm text-[var(--text)]">{value ?? "—"}</span>
    </div>
  );
}

function asArray(payload, keys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of keys) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

function normalizeCount(value) {
  if (value == null || value === "") return null;
  if (Array.isArray(value)) return value.length;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function toOptionalInteger(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) ? numeric : null;
}

function normalizeTableRecord(raw) {
  const tableName = raw?.table_name || raw?.name || raw?.table || raw?.tableName || raw?.source_table_name || "";
  const schemaName = raw?.schema_name || raw?.schema || raw?.table_schema || "dbo";
  const key = `${schemaName}.${tableName}`;
  return {
    ...raw,
    table_name: tableName,
    schema_name: schemaName,
    key,
    column_count: normalizeCount(raw?.column_count ?? raw?.columns_count ?? raw?.total_columns ?? raw?.num_columns ?? raw?.columns ?? null),
    row_count: normalizeCount(raw?.row_count ?? raw?.rows ?? raw?.total_rows ?? raw?.num_rows ?? raw?.record_count ?? raw?.total_records ?? raw?.table_rows ?? null),
    created_at: raw?.created_at ?? raw?.created_date ?? raw?.table_created_at ?? null,
    last_synced_at: raw?.last_synced_at ?? raw?.last_sync_at ?? raw?.last_data_sync_at ?? raw?.last_metadata_sync_at ?? raw?.modified_date ?? null,
  };
}

function extractTableIdFromLog(log) {
  const maybeId = log?.table_id ?? log?.table?.id ?? log?.table_metadata_id ?? log?.tableId;
  const numeric = Number(maybeId);
  return Number.isFinite(numeric) ? numeric : null;
}

function extractLastSyncFromLog(log) {
  return log?.end_time ?? log?.completed_at ?? log?.start_time ?? log?.started_at ?? log?.created_at ?? null;
}

function extractRowCountFromLog(log) {
  const candidates = [
    log?.row_count,
    log?.rows_processed,
    log?.rows_synced,
    log?.rows_extracted,
    log?.rows_inserted,
    log?.log_details?.row_count,
    log?.log_details?.rows_processed,
    log?.log_details?.rows_synced,
  ];

  for (const c of candidates) {
    const n = normalizeCount(c);
    if (n != null && n > 0) return n;
  }

  for (const c of candidates) {
    const n = normalizeCount(c);
    if (n === 0) return 0;
  }

  return null;
}

function mergeTableEntry(prev, next) {
  return {
    ...prev,
    ...next,
    id: next?.id ?? prev?.id ?? null,
    key: next?.key || prev?.key,
    table_name: next?.table_name || prev?.table_name || "",
    schema_name: next?.schema_name || prev?.schema_name || "dbo",
    column_count: next?.column_count ?? prev?.column_count ?? null,
    row_count: next?.row_count ?? prev?.row_count ?? null,
    created_at: next?.created_at ?? prev?.created_at ?? null,
    last_synced_at: next?.last_synced_at ?? prev?.last_synced_at ?? null,
    sync_enabled: next?.sync_enabled ?? prev?.sync_enabled,
    sync_method: next?.sync_method ?? prev?.sync_method,
    sync_frequency: next?.sync_frequency ?? prev?.sync_frequency,
    sync_schedule_time: next?.sync_schedule_time ?? prev?.sync_schedule_time,
    syncInfo: next?.syncInfo ?? prev?.syncInfo ?? null,
  };
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "—";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return "—";
  const diffMin = Math.floor((now - then) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return formatDateTime(dateStr);
}

const TABS = [
  { id: "overview", label: "Overview", icon: "info" },
  { id: "tables", label: "Tables", icon: "table" },
  { id: "parameters", label: "Parameters", icon: "columns" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "activity", label: "Activity", icon: "activity" },
];

/* ═══════════════════════════════════════════════════════════
   DataSourceDetail — Main Component
   ═══════════════════════════════════════════════════════════ */
export default function DataSourceDetail() {
  const { id } = useParams();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const navigate = useNavigate();
  const { push, Toast } = useToast();
  const numericDataSourceId = toOptionalInteger(id);

  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [discovering, setDiscovering] = useState(false);

  /* Tables tab state */
  const [tables, setTables] = useState([]);          // from /tables
  const [metadataTables, setMetadataTables] = useState([]); // from /api/v1/tables
  const [syncTables, setSyncTables] = useState([]);  // from /sync-tables
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tableSearch, setTableSearch] = useState("");
  const [tableStatusFilter, setTableStatusFilter] = useState("all");
  const [expandedTable, setExpandedTable] = useState(null); // table key being expanded
  const [columnsCache, setColumnsCache] = useState({}); // key → col[]
  const [columnsLoadingKey, setColumnsLoadingKey] = useState(null);
  const [fallbackCounts, setFallbackCounts] = useState({}); // key -> { column_count, row_count, last_synced_at, *_unavailable }
  const [selectedTables, setSelectedTables] = useState(new Set()); // set of "schema.table" keys
  const [bulkSyncing, setBulkSyncing] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null); // key of table whose ⋮ menu is open
  const TABLES_PAGE_SIZE = 25;
  const ACTIVITY_PAGE_SIZE = 15;
  const [tablesPage, setTablesPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);

  /* Sync-inheritance-stats state */
  const [syncStats, setSyncStats] = useState(null);
  const [syncStatsLoading, setSyncStatsLoading] = useState(false);
  const [syncSummary, setSyncSummary] = useState(null);
  const [syncLogs, setSyncLogs] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  /* Settings tab state */
  const [settingsForm, setSettingsForm] = useState({ sync_enabled: false, sync_method: "full", sync_frequency: "manual", sync_cron_expression: "" });
  const [settingsSaving, setSettingsSaving] = useState(false);

  /* Parameters tab state */
  const [parameters, setParameters] = useState([]);
  const [paramsLoading, setParamsLoading] = useState(false);
  const [paramSearch, setParamSearch] = useState("");
  const [showParamModal, setShowParamModal] = useState(false);
  const [paramSaving, setParamSaving] = useState(false);
  const EMPTY_PARAM = { name: "", display_name: "", description: "", data_type: "string", default_value: "", category: "", is_required: false, allow_multiple: false, is_active: true };
  const [paramForm, setParamForm] = useState(EMPTY_PARAM);

  const fetchSource = useCallback(() => {
    if (!api || !id) return;
    setLoading(true);
    api(`/api/v1/data-sources/${id}`)
      .then((data) => setSource(data))
      .catch(() => push("Failed to load data source", "error"))
      .finally(() => setLoading(false));
  }, [api, id, push]);

  useEffect(() => { fetchSource(); }, [fetchSource]);

  const fetchAllSyncTables = useCallback(async () => {
    if (!api || !id) return [];
    const limit = 1000;
    let offset = 0;
    let pages = 0;
    const all = [];

    while (pages < 20) {
      const page = await api(`/api/v1/data-sources/${id}/sync-tables`, {}, { limit, offset });
      const list = asArray(page, ["items", "tables", "data", "results"]);
      if (!list.length) break;
      all.push(...list);
      if (list.length < limit) break;
      offset += limit;
      pages += 1;
    }
    return all;
  }, [api, id]);

  const fetchTablesData = useCallback(async () => {
    if (!api || !id) return;
    setTablesLoading(true);
    setFallbackCounts({});

    const tablesPromise = api(`/api/v1/data-sources/${id}/tables`)
      .then((value) => {
        const rawTables = asArray(value, ["tables", "items", "data", "results"]).map(normalizeTableRecord);
        setTables(rawTables.filter((t) => t.table_name));
        return rawTables;
      })
      .catch(() => {
        setTables([]);
        return [];
      });

    const metadataPromise = (numericDataSourceId == null
      ? Promise.resolve([])
      : api("/api/v1/tables/", {}, { data_source_id: numericDataSourceId, skip: 0, limit: 1000 })
        .then((value) => asArray(value, ["tables", "items", "data", "results"]).map(normalizeTableRecord))
    )
      .then((rawMetadataTables) => {
        setMetadataTables(rawMetadataTables.filter((t) => t.table_name));
        return rawMetadataTables;
      })
      .catch(() => {
        setMetadataTables([]);
        return [];
      });

    const syncPromise = fetchAllSyncTables()
      .then((value) => {
        const rawSync = asArray(value).map(normalizeTableRecord);
        setSyncTables(rawSync.filter((t) => t.table_name));
        return rawSync;
      })
      .catch(() => {
        setSyncTables([]);
        return [];
      });

    try {
      await Promise.race([tablesPromise, metadataPromise]);
    } finally {
      setTablesLoading(false);
    }

    // sync table status enriches rows progressively; no need to block the main tables list.
    syncPromise.catch(() => { });
  }, [api, fetchAllSyncTables, id]);

  const fetchSyncStats = useCallback(async () => {
    if (!api || !id) return;
    setSyncStatsLoading(true);
    try {
      const data = await api(`/api/v1/data-sources/${id}/sync-inheritance-stats`);
      setSyncStats(data || {});
    } catch {
      setSyncStats({});
    }
    setSyncStatsLoading(false);
  }, [api, id]);

  const fetchActivity = useCallback(async () => {
    if (!api || !id) return;
    setActivityLoading(true);
    try {
      const sourceId = numericDataSourceId;
      if (sourceId == null) {
        setSyncSummary({});
        setSyncLogs([]);
        setActivityLoading(false);
        return;
      }
      const [summaryRes, logsRes] = await Promise.allSettled([
        api(`/api/v1/sync-logs/stats/summary`, {}, { data_source_id: sourceId }),
        api(`/api/v1/sync-logs/`, {}, { data_source_id: sourceId, skip: 0, limit: 100 }),
      ]);

      const summary = summaryRes.status === "fulfilled" ? (summaryRes.value || {}) : {};
      const logsPayload = logsRes.status === "fulfilled" ? logsRes.value : [];
      const logs = asArray(logsPayload, ["items", "logs", "data", "results"]);

      setSyncSummary(summary);
      setSyncLogs(logs);
    } catch {
      setSyncSummary({});
      setSyncLogs([]);
    }
    setActivityLoading(false);
  }, [api, id]);

  useEffect(() => {
    if (activeTab === "tables" && tables.length === 0 && metadataTables.length === 0 && syncTables.length === 0) {
      fetchTablesData();
    }
  }, [activeTab, fetchTablesData, metadataTables.length, syncTables.length, tables.length]);

  useEffect(() => {
    if ((activeTab === "overview" || activeTab === "activity") && syncStats === null) {
      fetchSyncStats();
    }
  }, [activeTab, fetchSyncStats, syncStats]);

  useEffect(() => {
    if (activeTab === "activity" && syncLogs.length === 0) {
      fetchActivity();
    }
  }, [activeTab, fetchActivity, syncLogs.length]);

  /* Fetch columns for an expanded table row */
  const handleExpandTable = useCallback(async (t) => {
    const schema = t.schema_name || "dbo";
    const tableName = t.table_name;
    const metadataTableId = t.syncInfo?.id ?? t.id;
    const key = `${schema}.${tableName}`;
    if (expandedTable === key) { setExpandedTable(null); return; }
    setExpandedTable(key);
    if (columnsCache[key]) return;
    setColumnsLoadingKey(key);
    try {
      if (metadataTableId != null) {
        const metaColsRes = await api("/api/v1/columns/", {}, { table_id: metadataTableId, skip: 0, limit: 1000 });
        const metaCols = asArray(metaColsRes, ["columns", "items", "data", "results"]);
        if (metaCols.length > 0) {
          setColumnsCache((prev) => ({ ...prev, [key]: metaCols }));
          setColumnsLoadingKey(null);
          return;
        }
      }

      const cols = await api(
        `/api/v1/data-sources/${id}/tables/${encodeURIComponent(schema)}/${encodeURIComponent(tableName)}/columns`
      );
      setColumnsCache((prev) => ({ ...prev, [key]: asArray(cols, ["columns", "items", "data", "results"]) }));
    } catch { setColumnsCache((prev) => ({ ...prev, [key]: [] })); }
    setColumnsLoadingKey(null);
  }, [api, id, columnsCache, expandedTable]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api(`/api/v1/data-sources/${id}/sync`, { method: "POST" });
      push("Sync started");
      fetchSource();
      fetchTablesData();
      fetchSyncStats();
      fetchActivity();
    } catch (e) { push(e.message || "Sync failed", "error"); }
    setSyncing(false);
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      await api(`/api/v1/data-sources/${id}/test-connection`, { method: "POST" });
      push("Connection successful!");
    } catch (e) { push(e.message || "Connection failed", "error"); }
    setTesting(false);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api(`/api/v1/data-sources/${id}`, { method: "DELETE" });
      push(`"${source?.name}" deleted`);
      setTimeout(() => navigate("/datasources"), 500);
    } catch (e) { push(e.message || "Delete failed", "error"); }
    setDeleteLoading(false);
    setDeleting(false);
  };

  const handleDiscover = async () => {
    setDiscovering(true);
    try {
      await api(`/api/v1/discovery/run/${id}/sync`, { method: "POST" });
      push("Metadata discovery started!");
      fetchSource();
      fetchTablesData();
    } catch (e) { push(e.message || "Discovery failed", "error"); }
    setDiscovering(false);
  };

  const handleToggleTableSync = async (t, enable) => {
    const tableId = t.syncInfo?.id ?? t.id;
    if (tableId == null) { push("Table ID not found", "error"); return; }
    try {
      await api(`/api/v1/tables/${tableId}/${enable ? "enable-sync" : "disable-sync"}`, { method: "POST" });
      push(`Sync ${enable ? "enabled" : "disabled"} for ${t.table_name}`);
      // Update local state
      const updateList = (list) => list.map((item) => {
        if (item.key === t.key) return { ...item, sync_enabled: enable, syncInfo: { ...item.syncInfo, sync_enabled: enable } };
        return item;
      });
      setTables(updateList);
      setMetadataTables(updateList);
      setSyncTables(updateList);
    } catch (e) { push(e.message || "Failed to update sync", "error"); }
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      const updated = await api(`/api/v1/data-sources/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          sync_enabled: settingsForm.sync_enabled,
          sync_method: settingsForm.sync_method,
          sync_frequency: settingsForm.sync_frequency,
          sync_cron_expression: settingsForm.sync_cron_expression || undefined,
        }),
      });
      setSource((prev) => ({ ...prev, ...updated }));
      push("Settings saved successfully");
    } catch (e) { push(e?.message || "Failed to save settings", "error"); }
    setSettingsSaving(false);
  };

  /* ── Multi-select helpers ── */
  const toggleTableSelect = (key) => setSelectedTables((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const toggleSelectAll = () => {
    setSelectedTables((prev) =>
      prev.size === filteredTables.length
        ? new Set()
        : new Set(filteredTables.map((t) => `${t.schema_name || "dbo"}.${t.table_name}`))
    );
  };

  const handleBulkSync = async (enable) => {
    if (selectedTables.size === 0) return;
    setBulkSyncing(true);
    const targets = [];
    for (const key of selectedTables) {
      const t = mergedTables.find((x) => `${x.schema_name || "dbo"}.${x.table_name}` === key);
      const tid = t?.syncInfo?.id ?? t?.id;
      if (tid != null) targets.push({ t, tid });
    }
    if (targets.length === 0) { push("No valid table IDs found", "error"); setBulkSyncing(false); return; }
    try {
      // Try bulk endpoint first, fall back to individual calls
      try {
        await api("/api/v1/tables/bulk-sync-update", {
          method: "POST",
          body: JSON.stringify({ table_ids: targets.map((x) => x.tid), sync_enabled: enable }),
        });
      } catch {
        await Promise.all(targets.map(({ t }) => handleToggleTableSync(t, enable)));
      }
      push(`Sync ${enable ? "enabled" : "disabled"} for ${targets.length} table(s)`);
      setSelectedTables(new Set());
      fetchTablesData();
    } catch (e) { push(e?.message || "Bulk update failed", "error"); }
    setBulkSyncing(false);
  };

  const fetchParameters = useCallback(async () => {
    if (!api || !id) return;
    setParamsLoading(true);
    try {
      const data = await api(`/api/v1/parameters/datasource/${id}`);
      const list = Array.isArray(data) ? data : data?.items || data?.parameters || [];
      setParameters(list);
    } catch { setParameters([]); }
    setParamsLoading(false);
  }, [api, id]);

  const handleCreateParameter = async () => {
    if (!paramForm.name.trim()) { push("Parameter name is required", "error"); return; }
    if (!paramForm.display_name.trim()) { push("Display name is required", "error"); return; }
    setParamSaving(true);
    try {
      const payload = {
        name: paramForm.name.trim(),
        display_name: paramForm.display_name.trim(),
        description: paramForm.description.trim() || undefined,
        scope: "datasource",
        datasource_id: numericDataSourceId,
        data_type: paramForm.data_type,
        default_value: paramForm.default_value.trim() || undefined,
        is_required: paramForm.is_required,
        allow_multiple: paramForm.allow_multiple,
        is_active: paramForm.is_active,
        category: paramForm.category.trim() || undefined,
      };
      await api("/api/v1/parameters/", { method: "POST", body: JSON.stringify(payload) });
      push("Parameter created!");
      setShowParamModal(false);
      setParamForm(EMPTY_PARAM);
      fetchParameters();
    } catch (e) { push(e?.message || "Failed to create parameter", "error"); }
    setParamSaving(false);
  };

  const handleDeleteParameter = async (param) => {
    try {
      await api(`/api/v1/parameters/${param.id}`, { method: "DELETE" });
      push(`Parameter "${param.display_name || param.name}" deleted`);
      setParameters((prev) => prev.filter((p) => p.id !== param.id));
    } catch (e) { push(e?.message || "Delete failed", "error"); }
  };

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  const sc = source ? (STATUS_COLORS[source.status] || STATUS_COLORS.disconnected) : null;

  /* Merge /tables + /sync-tables by schema.table */
  const tableMap = new Map();
  syncTables.forEach((s) => {
    tableMap.set(s.key, mergeTableEntry(tableMap.get(s.key) || {}, { ...s, syncInfo: s }));
  });
  metadataTables.forEach((t) => {
    tableMap.set(t.key, mergeTableEntry(tableMap.get(t.key) || {}, t));
  });
  tables.forEach((t) => {
    tableMap.set(t.key, mergeTableEntry(tableMap.get(t.key) || {}, t));
  });
  const mergedTables = Array.from(tableMap.values()).sort((a, b) => a.key.localeCompare(b.key));

  const filteredTables = mergedTables.filter((t) => {
    const name = t.table_name || "";
    const matchesSearch = !tableSearch || `${t.schema_name}.${name}`.toLowerCase().includes(tableSearch.toLowerCase());
    const syncEnabled = t.syncInfo?.sync_enabled ?? t.sync_enabled;
    const matchesStatus = tableStatusFilter === "all"
      || (tableStatusFilter === "enabled" && syncEnabled === true)
      || (tableStatusFilter === "disabled" && syncEnabled === false);
    return matchesSearch && matchesStatus;
  });

  const syncEnabledCount = mergedTables.filter((t) => (t.syncInfo?.sync_enabled ?? t.sync_enabled) === true).length;
  const tablesTotalPages = Math.max(1, Math.ceil(filteredTables.length / TABLES_PAGE_SIZE));
  const tablesPageStart = (tablesPage - 1) * TABLES_PAGE_SIZE;
  const paginatedTables = filteredTables.slice(tablesPageStart, tablesPageStart + TABLES_PAGE_SIZE);

  const activityTotalPages = Math.max(1, Math.ceil(syncLogs.length / ACTIVITY_PAGE_SIZE));
  const activityPageStart = (activityPage - 1) * ACTIVITY_PAGE_SIZE;
  const paginatedActivityLogs = syncLogs.slice(activityPageStart, activityPageStart + ACTIVITY_PAGE_SIZE);

  useEffect(() => {
    if (activeTab === "tables") setTablesPage(1);
  }, [activeTab, tableSearch, tableStatusFilter]);

  useEffect(() => {
    if (activeTab === "parameters" && parameters.length === 0 && !paramsLoading) fetchParameters();
  }, [activeTab]);

  // Initialize settings form when switching to settings tab
  useEffect(() => {
    if (activeTab === "settings" && source) {
      setSettingsForm({
        sync_enabled: source.sync_enabled ?? false,
        sync_method: source.sync_method || "full",
        sync_frequency: source.sync_frequency || "manual",
        sync_cron_expression: source.sync_cron_expression || "",
      });
    }
  }, [activeTab, source]);

  useEffect(() => {
    if (tablesPage > tablesTotalPages) setTablesPage(tablesTotalPages);
  }, [tablesPage, tablesTotalPages]);

  useEffect(() => {
    if (activeTab === "activity") setActivityPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (activityPage > activityTotalPages) setActivityPage(activityTotalPages);
  }, [activityPage, activityTotalPages]);

  // Close the ⋮ action dropdown when clicking outside
  useEffect(() => {
    if (!openActionMenu) return;
    const close = () => setOpenActionMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openActionMenu]);

  useEffect(() => {
    if (activeTab !== "tables" || !api) return;

    const missing = filteredTables
      .filter((t) => {
        const key = t.key;
        const fallback = fallbackCounts[key] || {};
        const hasCols = t.column_count != null || t.syncInfo?.column_count != null || fallback.column_count != null || fallback.column_count_unavailable === true;
        const hasRows = t.row_count != null || t.syncInfo?.row_count != null || fallback.row_count != null || fallback.row_count_unavailable === true;
        const hasLastSynced = !!(t.last_synced_at || fallback.last_synced_at || fallback.last_synced_unavailable);
        return (!hasCols || !hasRows || !hasLastSynced) && (t.syncInfo?.id ?? t.id) != null;
      })
      .slice(0, 60);

    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      let recentLogsByTableId = new Map();
      const needsLogLookup = missing.some((t) => {
        const fallback = fallbackCounts[t.key] || {};
        const hasRows = t.row_count != null || t.syncInfo?.row_count != null || fallback.row_count != null || fallback.row_count_unavailable === true;
        const hasLastSynced = !!(t.last_synced_at || fallback.last_synced_at || fallback.last_synced_unavailable);
        return !hasRows || !hasLastSynced;
      });

      if (needsLogLookup) {
        try {
          const logParams = { skip: 0, limit: 1000 };
          if (numericDataSourceId != null) logParams.data_source_id = numericDataSourceId;
          const logsPayload = await api("/api/v1/sync-logs/", {}, logParams);
          const logs = asArray(logsPayload, ["sync_logs", "items", "logs", "data", "results"]);
          const byTable = new Map();
          logs.forEach((log) => {
            const tableId = extractTableIdFromLog(log);
            if (tableId == null) return;
            const prev = byTable.get(tableId);
            const prevTs = new Date(extractLastSyncFromLog(prev) || 0).getTime();
            const logTs = new Date(extractLastSyncFromLog(log) || 0).getTime();
            if (!prev || logTs > prevTs) {
              byTable.set(tableId, log);
            }
          });
          recentLogsByTableId = byTable;
        } catch {
          recentLogsByTableId = new Map();
        }
      }

      const results = await Promise.all(missing.map(async (t) => {
        const key = t.key;
        const tableId = t.syncInfo?.id ?? t.id;
        const fallback = fallbackCounts[key] || {};
        const recentLog = recentLogsByTableId.get(Number(tableId));

        const needColumn =
          t.column_count == null
          && t.syncInfo?.column_count == null
          && fallback.column_count == null
          && fallback.column_count_unavailable !== true;

        const needRow =
          t.row_count == null
          && t.syncInfo?.row_count == null
          && fallback.row_count == null
          && fallback.row_count_unavailable !== true;

        const needLastSync =
          !t.last_synced_at
          && !fallback.last_synced_at
          && fallback.last_synced_unavailable !== true;

        let rowCount = fallback.row_count ?? null;
        let lastSyncedAt = fallback.last_synced_at ?? null;

        if (rowCount == null && recentLog) {
          rowCount = extractRowCountFromLog(recentLog);
        }
        if (!lastSyncedAt && recentLog) {
          lastSyncedAt = extractLastSyncFromLog(recentLog);
        }

        const [colsRes, latestLogRes, previewRes] = await Promise.allSettled([
          needColumn
            ? api("/api/v1/columns/", {}, { table_id: tableId, skip: 0, limit: 1 })
            : Promise.resolve(null),
          needLastSync && !lastSyncedAt
            ? api(`/api/v1/sync-logs/tables/${tableId}/latest`).catch(() => null)
            : Promise.resolve(null),
          needRow && rowCount == null
            ? api(`/api/v1/tables/${tableId}/data-preview`, {}, { limit: 1, offset: 0 }).catch(() => null)
            : Promise.resolve(null),
        ]);

        let columnCount = null;

        if (colsRes.status === "fulfilled" && colsRes.value) {
          const colList = asArray(colsRes.value, ["columns", "items", "data", "results"]);
          columnCount = colsRes.value?.total ?? colList.length ?? null;
        }

        if (latestLogRes.status === "fulfilled" && latestLogRes.value) {
          lastSyncedAt = latestLogRes.value?.end_time ?? latestLogRes.value?.start_time ?? latestLogRes.value?.created_at ?? null;
        }

        if (previewRes.status === "fulfilled" && previewRes.value) {
          rowCount = normalizeCount(previewRes.value?.total ?? previewRes.value?.row_count ?? previewRes.value?.rows_count ?? null);
        }

        return {
          key,
          column_count: columnCount,
          row_count: rowCount,
          last_synced_at: lastSyncedAt,
          column_count_unavailable: needColumn && columnCount == null,
          row_count_unavailable: needRow && rowCount == null,
          last_synced_unavailable: needLastSync && !lastSyncedAt,
        };
      }));

      if (cancelled) return;

      const updates = results.filter((r) =>
        r.column_count != null
        || r.row_count != null
        || r.last_synced_at != null
        || r.column_count_unavailable
        || r.row_count_unavailable
        || r.last_synced_unavailable
      );
      if (updates.length === 0) return;

      setFallbackCounts((prev) => {
        const next = { ...prev };
        updates.forEach((u) => {
          next[u.key] = {
            ...(prev[u.key] || {}),
            ...(u.column_count != null ? { column_count: u.column_count } : {}),
            ...(u.row_count != null ? { row_count: u.row_count } : {}),
            ...(u.last_synced_at != null ? { last_synced_at: u.last_synced_at } : {}),
            ...(u.column_count_unavailable ? { column_count_unavailable: true } : {}),
            ...(u.row_count_unavailable ? { row_count_unavailable: true } : {}),
            ...(u.last_synced_unavailable ? { last_synced_unavailable: true } : {}),
          };
        });
        return next;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTab, api, fallbackCounts, filteredTables, id, numericDataSourceId]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-3 min-w-0">
            <button className={btnS} onClick={() => navigate("/datasources")}>
              <I d={ico.back} size={14} /> Back
            </button>
            {loading ? (
              <div className="flex items-center gap-2">
                <Spin />
                <span className="text-sm text-[var(--text-muted)]">Loading...</span>
              </div>
            ) : source ? (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)" }}>
                  <I d={ico.db} size={16} color="#818cf8" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold truncate">{source.name}</h1>
                    {sc && <Badge label={source.status} bg={sc.bg} color={sc.color} border={sc.border} />}
                  </div>
                  <p className="text-[0.65rem] text-[var(--text-muted)] truncate">
                    Last updated {formatDateTime(source.updated_at)}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-sm text-[var(--text-muted)]">Data source not found</span>
            )}
          </div>
          {source && (
            <div className="flex items-center gap-2 shrink-0">
              <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
                onClick={handleDiscover} disabled={discovering}>
                {discovering ? <Spin /> : <I d={ico.db} size={14} color="#fff" sw={2.5} />} Discover Metadata
              </button>
              <button className={btnS} onClick={() => navigate(`/datasources/${id}/edit`)}>
                <I d={ico.edit} size={14} /> Edit
              </button>
              <button className={btnS} onClick={() => setDeleting(true)}
                style={{ color: "#f87171", borderColor: "rgba(248,113,113,.3)" }}>
                <I d={ico.trash} size={14} color="#f87171" /> Delete
              </button>
            </div>
          )}
        </header>

        {/* Tabs */}
        {source && (
          <div className="flex items-center gap-0 px-6 border-b border-[var(--border)] bg-[var(--bg-card)]">
            {TABS.map((tab) => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-3 text-xs font-semibold cursor-pointer flex items-center gap-1.5 border-b-2 transition-all duration-150"
                style={{
                  borderBottomColor: activeTab === tab.id ? "var(--nav-active)" : "transparent",
                  color: activeTab === tab.id ? "var(--nav-active)" : "var(--text-muted)",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${activeTab === tab.id ? "var(--nav-active)" : "transparent"}`,
                }}>
                <I d={ico[tab.icon]} size={13} />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20">
              <Spin /> <span className="text-sm text-[var(--text-muted)]">Loading data source...</span>
            </div>
          ) : !source ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <I d={ico.db} size={32} color="var(--text-muted)" />
              <p className="text-sm font-semibold text-[var(--text-sub)] mt-4">Data source not found</p>
              <button className={`${btnS} mt-3`} onClick={() => navigate("/datasources")}>
                <I d={ico.back} size={14} /> Back to list
              </button>
            </div>
          ) : (
            <>
              {/* ── Overview Tab ── */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-2 gap-5 w-full" style={{ gridTemplateRows: "auto" }}>
                  {/* Connection Details */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[var(--border)]"
                      style={{ background: "rgba(99,102,241,.04)" }}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        Data Source Details
                      </h3>
                    </div>
                    <div className="px-5">
                      <DetailRow label="Description" value={source.description || "—"} />
                      <DetailRow label="Data Source Type" value={source.type} />
                      <DetailRow label="Host" value={source.host} />
                      <DetailRow label="Port" value={source.port} />
                      <DetailRow label="Database Name" value={source.database_name} />
                      <DetailRow label="Username" value={source.username} />
                      <DetailRow label="Connection Timeout" value={source.connection_timeout ? `${source.connection_timeout}s` : "—"} />
                      <DetailRow label="Created At" value={formatDateTime(source.created_at)} />
                      <DetailRow label="Last Updated At" value={formatDateTime(source.updated_at)} />
                    </div>
                  </div>

                  {/* Sync Settings */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[var(--border)]"
                      style={{ background: "rgba(99,102,241,.04)" }}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        Synchronization Settings
                      </h3>
                    </div>
                    <div className="px-5">
                      <DetailRow label="Sync Status"
                        value={
                          <Badge
                            label={source.sync_enabled ? "Enabled" : "Disabled"}
                            bg={source.sync_enabled ? "rgba(74,222,128,.12)" : "rgba(148,163,184,.12)"}
                            color={source.sync_enabled ? "#4ade80" : "#94a3b8"}
                            border={source.sync_enabled ? "rgba(74,222,128,.25)" : "rgba(148,163,184,.25)"}
                          />
                        }
                      />
                      <DetailRow label="Sync Method" value={source.sync_method} />
                      <DetailRow label="Sync Frequency" value={source.sync_frequency} />
                      <DetailRow label="Schedule Time" value={source.sync_schedule_time || "—"} />
                      <DetailRow label="Last Sync" value={formatDateTime(source.last_connected_at)} />
                      <DetailRow label="Next Sync" value="—" />
                    </div>
                  </div>

                  {/* Sync Inheritance Stats */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[var(--border)]"
                      style={{ background: "rgba(99,102,241,.04)" }}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Dataset Dependencies</h3>
                    </div>
                    <div className="px-5 py-3">
                      {syncStatsLoading ? (
                        <div className="flex items-center gap-2 py-2">
                          <Spin /><span className="text-xs text-[var(--text-muted)]">Loading stats...</span>
                        </div>
                      ) : syncStats && Object.keys(syncStats).length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {Object.entries(syncStats).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                              <span className="text-xs font-semibold text-[var(--text)] capitalize">{key.replace(/_/g, " ")}</span>
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(99,102,241,.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,.2)" }}>
                                {val}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)] py-2">No datasets are using this data source yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {source.tags && source.tags.length > 0 && (
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                      <div className="px-5 py-3 border-b border-[var(--border)]"
                        style={{ background: "rgba(99,102,241,.04)" }}>
                        <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Tags</h3>
                      </div>
                      <div className="px-5 py-3 flex flex-wrap gap-2">
                        {source.tags.map((tag) => (
                          <span key={tag} className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(99,102,241,.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,.2)" }}>
                            <I d={ico.tag} size={10} color="#818cf8" className="inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tables Tab ── */}
              {activeTab === "tables" && (
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 relative">
                      <I d={ico.search} size={14} color="var(--text-muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150"
                        placeholder="Search tables..."
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                      />
                    </div>
                    <select
                      className="bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text)] cursor-pointer"
                      style={{ colorScheme: "dark light" }}
                      value={tableStatusFilter}
                      onChange={(e) => setTableStatusFilter(e.target.value)}>
                      <option value="all" style={{ background: "var(--bg-card)", color: "var(--text)" }}>All Statuses</option>
                      <option value="enabled" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Sync Enabled</option>
                      <option value="disabled" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Sync Disabled</option>
                    </select>
                    {(tableSearch || tableStatusFilter !== "all") && (
                      <button className={btnS}
                        onClick={() => { setTableSearch(""); setTableStatusFilter("all"); }}
                        title="Clear filters">
                        <I d={ico.x} size={14} /> Clear
                      </button>
                    )}
                    <button className={btnS}
                      onClick={fetchTablesData}
                      title="Refresh tables">
                      <I d={ico.refresh} size={14} />
                    </button>
                  </div>

                  {/* Bulk selection bar — visible only when rows are checked */}
                  {selectedTables.size > 0 && (
                    <div className="flex items-center justify-between mb-3 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                      <span className="text-xs font-semibold text-[var(--nav-active)] flex items-center gap-1.5">
                        <I d={ico.check} size={13} color="var(--nav-active)" />
                        {selectedTables.size} table{selectedTables.size !== 1 ? "s" : ""} selected
                      </span>
                      <span className="flex items-center gap-2">
                        <button className={btnP} style={{ fontSize: "0.7rem" }} disabled={bulkSyncing}
                          onClick={() => handleBulkSync(true)}>
                          {bulkSyncing ? <Spin /> : <I d={ico.sync} size={12} color="#fff" />} Enable Sync
                        </button>
                        <button className={btnP} style={{ fontSize: "0.7rem", background: "var(--text-muted)" }} disabled={bulkSyncing}
                          onClick={() => handleBulkSync(false)}>
                          {bulkSyncing ? <Spin /> : <I d={ico.x} size={12} color="#fff" />} Disable Sync
                        </button>
                        <button className={btnS} style={{ fontSize: "0.7rem" }}
                          onClick={() => setSelectedTables(new Set())}>
                          <I d={ico.x} size={12} /> Clear
                        </button>
                      </span>
                    </div>
                  )}

                  {tablesLoading ? (
                    <div className="flex items-center justify-center gap-3 py-12">
                      <Spin /> <span className="text-sm text-[var(--text-muted)]">Loading tables...</span>
                    </div>
                  ) : filteredTables.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <I d={ico.table} size={28} color="var(--text-muted)" />
                      <p className="text-sm font-semibold text-[var(--text-sub)] mt-3">
                        {tableSearch ? "No matching tables" : "No tables found"}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {tableSearch ? "Try adjusting your search" : "Run a sync to discover tables"}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]"
                            style={{ background: "rgba(99,102,241,.04)", borderBottom: "1px solid var(--border)" }}>
                            <th className="w-10 px-3 py-2.5 text-center">
                              {/* Indeterminate / checked header checkbox */}
                              <input type="checkbox" ref={(el) => {
                                if (el) el.indeterminate = selectedTables.size > 0 && selectedTables.size < filteredTables.length;
                              }}
                                checked={filteredTables.length > 0 && selectedTables.size === filteredTables.length}
                                onChange={toggleSelectAll}
                                className="cursor-pointer w-3.5 h-3.5 accent-[var(--nav-active)]" />
                            </th>
                            <th className="text-left px-4 py-2.5">Table</th>
                            <th className="text-left px-4 py-2.5">Status</th>
                            <th className="text-left px-4 py-2.5">Last Sync</th>
                            <th className="text-left px-4 py-2.5">Created</th>
                            <th className="text-left px-4 py-2.5">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedTables.map((t) => {
                            const schema = t.schema_name || "dbo";
                            const tableName = t.table_name;
                            const key = `${schema}.${tableName}`;
                            const isExpanded = expandedTable === key;
                            const cols = columnsCache[key] || [];
                            const fallback = fallbackCounts[key] || {};
                            const syncEnabled = t.syncInfo?.sync_enabled ?? t.sync_enabled;
                            const syncLabel = syncEnabled ? "SYNC ENABLED" : "SYNC DISABLED";
                            const lastSyncedAt = t.last_synced_at ?? t.syncInfo?.last_synced_at ?? fallback.last_synced_at ?? null;
                            const createdAt = t.created_at ?? t.syncInfo?.created_at ?? null;
                            const isSelected = selectedTables.has(key);
                            const menuOpen = openActionMenu === key;
                            return [
                              <tr key={`${key}-row`}
                                className="border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors">
                                {/* Checkbox */}
                                <td className="w-10 px-3 py-2.5 text-center">
                                  <input type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleTableSelect(key)}
                                    className="cursor-pointer w-3.5 h-3.5 accent-[var(--nav-active)]" />
                                </td>
                                {/* Table name: power icon + schema.table */}
                                <td className="px-4 py-2.5">
                                  <div className="flex items-center gap-2">
                                    <I d={ico.sync} size={13}
                                      color={syncEnabled === true ? "#4ade80" : syncEnabled === false ? "var(--text-muted)" : "var(--text-muted)"} />
                                    <button
                                      className="text-sm font-semibold cursor-pointer hover:underline truncate text-left"
                                      style={{ background: "transparent", border: "none", padding: 0, color: "inherit" }}
                                      onClick={() => navigate(`/datasources/${id}/tables/${encodeURIComponent(schema)}/${encodeURIComponent(tableName)}`)}>
                                      {schema}.{tableName}
                                    </button>
                                  </div>
                                </td>
                                {/* Status badge */}
                                <td className="px-4 py-2.5">
                                  {syncEnabled !== undefined ? (
                                    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border"
                                      style={{
                                        background: syncEnabled ? "rgba(74,222,128,.12)" : "rgba(148,163,184,.10)",
                                        color: syncEnabled ? "#4ade80" : "var(--text-muted)",
                                        borderColor: syncEnabled ? "rgba(74,222,128,.25)" : "var(--border)",
                                      }}>
                                      {syncLabel}
                                    </span>
                                  ) : <span className="text-xs text-[var(--text-muted)]">—</span>}
                                </td>
                                {/* Last Sync */}
                                <td className="px-4 py-2.5">
                                  <span className="text-xs text-[var(--text-sub)]">{formatRelativeTime(lastSyncedAt)}</span>
                                </td>
                                {/* Created */}
                                <td className="px-4 py-2.5">
                                  <span className="text-xs text-[var(--text-sub)]">{formatRelativeTime(createdAt)}</span>
                                </td>
                                {/* Actions ⋮ dropdown */}
                                <td className="px-4 py-2.5">
                                  <div className="relative inline-block">
                                    <button
                                      className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-input)] transition-colors cursor-pointer"
                                      style={{ background: menuOpen ? "var(--bg-input)" : "transparent", border: menuOpen ? "1px solid var(--border)" : "1px solid transparent" }}
                                      onClick={(e) => { e.stopPropagation(); setOpenActionMenu(menuOpen ? null : key); }}>
                                      <span style={{ fontSize: 18, lineHeight: 1, letterSpacing: 0 }}>⋮</span>
                                    </button>
                                    {menuOpen && (
                                      <div className="absolute right-0 top-full mt-1 z-30 min-w-[160px] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg overflow-hidden"
                                        style={{ animation: "fadeUp .12s ease both" }}
                                        onClick={(e) => e.stopPropagation()}>
                                        <button className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-[var(--text-sub)] hover:bg-[var(--bg-input)] cursor-pointer transition-colors"
                                          style={{ background: "none", border: "none" }}
                                          onClick={() => { setOpenActionMenu(null); navigate(`/datasources/${id}/tables/${encodeURIComponent(schema)}/${encodeURIComponent(tableName)}`); }}>
                                          <I d={ico.info} size={13} /> View Details
                                        </button>
                                        <button className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-[var(--text-sub)] hover:bg-[var(--bg-input)] cursor-pointer transition-colors"
                                          style={{ background: "none", border: "none" }}
                                          onClick={async () => { setOpenActionMenu(null); push("Syncing table..."); await api(`/api/v1/tables/${t.syncInfo?.id ?? t.id}/sync`, { method: "POST" }).catch(() => { }); push("Sync triggered"); }}>
                                          <I d={ico.sync} size={13} /> Sync Now
                                        </button>
                                        <div style={{ borderTop: "1px solid var(--border)" }} />
                                        <button className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs hover:bg-[var(--bg-input)] cursor-pointer transition-colors"
                                          style={{ background: "none", border: "none", color: syncEnabled ? "var(--text-muted)" : "#4ade80" }}
                                          onClick={() => { setOpenActionMenu(null); handleToggleTableSync(t, !syncEnabled); }}>
                                          <I d={ico.sync} size={13} color={syncEnabled ? "var(--text-muted)" : "#4ade80"} />
                                          {syncEnabled ? "Disable Sync" : "Enable Sync"}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>,
                              isExpanded ? (
                                <tr key={`${key}-cols`} className="border-b border-[var(--border)]">
                                  <td colSpan={6} className="px-6 py-3"
                                    style={{ background: "rgba(99,102,241,.03)" }}>
                                    {columnsLoadingKey === key && cols.length === 0 ? (
                                      <div className="flex items-center gap-2">
                                        <Spin /><span className="text-xs text-[var(--text-muted)]">Loading columns...</span>
                                      </div>
                                    ) : cols.length === 0 ? (
                                      <span className="text-xs text-[var(--text-muted)]">No column data available</span>
                                    ) : (
                                      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                                        {cols.map((c, colIndex) => (
                                          <div key={c.column_name || c.name || `${key}-col-${colIndex}`} className="flex items-center gap-2 py-0.5">
                                            <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded"
                                              style={{ background: "rgba(96,165,250,.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,.2)", minWidth: 52, textAlign: "center", fontFamily: "monospace" }}>
                                              {(c.data_type || c.dataType || "").toUpperCase().slice(0, 12)}
                                            </span>
                                            <span className="text-xs text-[var(--text)]">{c.column_name || c.name || "Unnamed"}</span>
                                            {c.is_nullable === false && (
                                              <span className="text-[0.55rem] font-bold text-[var(--text-muted)] ml-auto">NOT NULL</span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ) : null,
                            ];
                          })}
                        </tbody>
                      </table>
                      <div className="px-4 py-2.5 border-t border-[var(--border)] text-[0.65rem] text-[var(--text-muted)]">
                        {filteredTables.length} table{filteredTables.length !== 1 ? "s" : ""}
                        {tableSearch ? ` matching "${tableSearch}"` : ""}
                        {` · ${syncEnabledCount} sync-enabled`}
                        {filteredTables.length > 0 ? ` · Showing ${tablesPageStart + 1}-${Math.min(tablesPageStart + TABLES_PAGE_SIZE, filteredTables.length)}` : ""}
                      </div>
                      {filteredTables.length > TABLES_PAGE_SIZE && (
                        <div className="px-4 py-2.5 border-t border-[var(--border)] flex items-center justify-end gap-2 bg-[var(--bg-card)]">
                          <button
                            className={btnS}
                            disabled={tablesPage === 1}
                            onClick={() => setTablesPage((p) => Math.max(1, p - 1))}
                            style={{ opacity: tablesPage === 1 ? 0.5 : 1, cursor: tablesPage === 1 ? "not-allowed" : "pointer" }}>
                            Prev
                          </button>
                          <span className="text-xs text-[var(--text-sub)] px-1">Page {tablesPage} / {tablesTotalPages}</span>
                          <button
                            className={btnS}
                            disabled={tablesPage === tablesTotalPages}
                            onClick={() => setTablesPage((p) => Math.min(tablesTotalPages, p + 1))}
                            style={{ opacity: tablesPage === tablesTotalPages ? 0.5 : 1, cursor: tablesPage === tablesTotalPages ? "not-allowed" : "pointer" }}>
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Parameters Tab ── */}
              {activeTab === "parameters" && (
                <div className="w-full max-w-none space-y-4">
                  {/* Info banner */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-3 flex items-start gap-3">
                    <I d={ico.info} size={16} color="var(--nav-active)" className="mt-0.5 shrink-0" />
                    <p className="text-xs text-[var(--text-sub)] leading-relaxed">
                      Parameters defined here are scoped to this datasource only and can be used in datasets, queries, and filters that reference this datasource.
                    </p>
                  </div>

                  {/* Datasource Parameters section */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between"
                      style={{ background: "rgba(99,102,241,.04)" }}>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--text)]">Datasource Parameters</h3>
                        <p className="text-[0.65rem] text-[var(--text-muted)]">Manage parameters specific to this datasource</p>
                      </div>
                      <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
                        onClick={() => { setParamForm(EMPTY_PARAM); setShowParamModal(true); }}>
                        <I d={ico.plus} size={14} color="#fff" sw={2.5} /> New Parameter
                      </button>
                    </div>
                    <div className="px-5 py-3">
                      <div className="relative mb-3">
                        <I d={ico.search} size={14} color="var(--text-muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150"
                          placeholder="Search parameters..."
                          value={paramSearch}
                          onChange={(e) => setParamSearch(e.target.value)}
                        />
                      </div>
                      {paramsLoading ? (
                        <div className="flex items-center justify-center gap-2 py-8"><Spin /><span className="text-sm text-[var(--text-muted)]">Loading...</span></div>
                      ) : (() => {
                        const filtered = parameters.filter((p) =>
                          !paramSearch || (p.name + p.display_name + (p.description || "")).toLowerCase().includes(paramSearch.toLowerCase())
                        );
                        return filtered.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <I d={ico.columns} size={28} color="var(--text-muted)" />
                            <p className="text-sm font-semibold text-[var(--text-sub)] mt-3">No parameters defined</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">Click "New Parameter" to add one</p>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-[var(--border)] overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]"
                                  style={{ background: "rgba(99,102,241,.04)", borderBottom: "1px solid var(--border)" }}>
                                  <th className="text-left px-3 py-2">Name</th>
                                  <th className="text-left px-3 py-2">Display Name</th>
                                  <th className="text-left px-3 py-2">Type</th>
                                  <th className="text-left px-3 py-2">Default</th>
                                  <th className="text-left px-3 py-2">Status</th>
                                  <th className="text-left px-3 py-2">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filtered.map((p) => (
                                  <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors">
                                    <td className="px-3 py-2 text-xs font-mono font-semibold text-[var(--text)]">{p.name}</td>
                                    <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{p.display_name}</td>
                                    <td className="px-3 py-2">
                                      <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(96,165,250,.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,.2)" }}>
                                        {(p.data_type || "").toUpperCase()}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{p.default_value || "—"}</td>
                                    <td className="px-3 py-2">
                                      <Badge label={p.is_active ? "Active" : "Inactive"}
                                        bg={p.is_active ? "rgba(74,222,128,.12)" : "rgba(148,163,184,.12)"}
                                        color={p.is_active ? "#4ade80" : "#94a3b8"}
                                        border={p.is_active ? "rgba(74,222,128,.25)" : "rgba(148,163,184,.25)"} />
                                    </td>
                                    <td className="px-3 py-2">
                                      <button className="text-[0.65rem] text-[#f87171] hover:underline cursor-pointer" style={{ background: "none", border: "none" }}
                                        onClick={() => handleDeleteParameter(p)}>
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Connection Parameters (existing) */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[var(--border)]"
                      style={{ background: "rgba(99,102,241,.04)" }}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        Connection Parameters
                      </h3>
                    </div>
                    <div className="px-5">
                      <DetailRow label="Driver" value={source.driver} />
                      <DetailRow label="Trusted Connection" value={source.trusted_connection ? "Yes" : "No"} />
                      <DetailRow label="Connection Timeout" value={source.connection_timeout ? `${source.connection_timeout}s` : "—"} />
                      <DetailRow label="Command Timeout" value={source.command_timeout ? `${source.command_timeout}s` : "—"} />
                      <DetailRow label="Destination Path" value={source.destination_path} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Settings Tab ── */}
              {activeTab === "settings" && (
                <div className="w-full max-w-none space-y-4">

                  {/* Sync Configuration — editable inline form */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[var(--border)]">
                      <h3 className="text-sm font-bold text-[var(--text)]">Sync Configuration</h3>
                    </div>
                    <div className="px-5 py-4 space-y-5">

                      {/* Enable Automatic Sync toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[var(--text)]">Enable Automatic Sync</p>
                        </div>
                        <button className="w-10 h-5 rounded-full relative cursor-pointer transition-colors flex-shrink-0"
                          style={{ background: settingsForm.sync_enabled ? "var(--nav-active)" : "var(--track-color)", border: "none" }}
                          onClick={() => setSettingsForm((f) => ({ ...f, sync_enabled: !f.sync_enabled }))}>
                          <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                            style={{ left: settingsForm.sync_enabled ? 22 : 2 }} />
                        </button>
                      </div>

                      <hr style={{ borderColor: "var(--border)" }} />

                      {/* Sync Method */}
                      <div>
                        <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">Sync Method</label>
                        <select
                          className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] cursor-pointer"
                          style={{ colorScheme: "dark light" }}
                          value={settingsForm.sync_method}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, sync_method: e.target.value }))}>
                          <option value="full" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Full Sync</option>
                          <option value="incremental" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Incremental</option>
                          <option value="schema_only" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Schema Only</option>
                        </select>
                        <p className="text-[0.65rem] text-[var(--nav-active)] mt-1">
                          {settingsForm.sync_method === "full" ? "Full sync reloads all data, incremental only syncs new/modified data" :
                            settingsForm.sync_method === "incremental" ? "Incremental sync only processes new or modified records" :
                              "Schema only syncs table and column structure without data"}
                        </p>
                      </div>

                      {/* Sync Frequency */}
                      <div>
                        <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">Sync Frequency</label>
                        <select
                          className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] cursor-pointer"
                          style={{ colorScheme: "dark light" }}
                          value={settingsForm.sync_frequency}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, sync_frequency: e.target.value }))}>
                          <option value="manual" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Manual</option>
                          <option value="hourly" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Hourly</option>
                          <option value="daily" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Daily</option>
                          <option value="weekly" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Weekly</option>
                          <option value="custom" style={{ background: "var(--bg-card)", color: "var(--text)" }}>Custom (Cron)</option>
                        </select>
                        <p className="text-[0.65rem] text-[var(--text-muted)] mt-1">How often to automatically sync data from the source</p>
                      </div>

                      {/* Cron Expression — shown only when frequency = custom */}
                      {settingsForm.sync_frequency === "custom" && (
                        <div>
                          <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">Cron Expression</label>
                          <input
                            className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] font-mono"
                            placeholder="0 0 * * *"
                            value={settingsForm.sync_cron_expression}
                            onChange={(e) => setSettingsForm((f) => ({ ...f, sync_cron_expression: e.target.value }))} />
                          <p className="text-[0.65rem] text-[var(--text-muted)] mt-1">Custom cron expression for advanced scheduling (e.g., "0 0 * * *" for daily at midnight)</p>
                        </div>
                      )}

                    </div>
                    {/* Save button */}
                    <div className="px-5 py-3 border-t border-[var(--border)] flex justify-end">
                      <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: settingsSaving ? 0.7 : 1 }}
                        disabled={settingsSaving} onClick={handleSaveSettings}>
                        {settingsSaving ? <Spin /> : <I d={ico.db} size={14} color="#fff" />} Save Settings
                      </button>
                    </div>
                  </div>

                  {/* Connection Settings — read-only display */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[var(--border)]"
                      style={{ background: "rgba(99,102,241,.04)" }}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Connection Settings</h3>
                    </div>
                    <div className="px-5">
                      <DetailRow label="Host" value={source.host} />
                      <DetailRow label="Port" value={source.port} />
                      <DetailRow label="Database Name" value={source.database_name} />
                      <DetailRow label="Username" value={source.username} />
                      <DetailRow label="Driver" value={source.driver} />
                      <DetailRow label="Trusted Connection" value={source.trusted_connection ? "Yes" : "No"} />
                      <DetailRow label="Connection Timeout" value={source.connection_timeout ? `${source.connection_timeout}s` : "—"} />
                      <DetailRow label="Command Timeout" value={source.command_timeout ? `${source.command_timeout}s` : "—"} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className={btnS} onClick={handleTest} disabled={testing}>
                      {testing ? <Spin /> : <I d={ico.check} size={14} />} Test Connection
                    </button>
                    <button className={btnS} onClick={handleSync} disabled={syncing}>
                      {syncing ? <Spin /> : <I d={ico.sync} size={14} />} Sync Now
                    </button>
                  </div>

                </div>
              )}

              {/* ── Activity Tab ── sync-inheritance-stats ── */}
              {activeTab === "activity" && (
                <div className="w-full">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[var(--border)]"
                      style={{ background: "rgba(99,102,241,.04)" }}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Sync Activity</h3>
                        <button className={btnS}
                          onClick={fetchActivity}
                          title="Refresh">
                          <I d={ico.refresh} size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      {activityLoading ? (
                        <div className="flex items-center gap-2 py-4">
                          <Spin /><span className="text-sm text-[var(--text-muted)]">Loading stats...</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-4 gap-3">
                            <div className="rounded-lg border border-[var(--border)] p-4" style={{ background: "var(--bg-input)" }}>
                              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)]">Total Runs</span>
                              <p className="text-xl font-bold mt-1">{syncSummary?.total_syncs ?? syncSummary?.total_runs ?? "—"}</p>
                            </div>
                            <div className="rounded-lg border border-[var(--border)] p-4" style={{ background: "var(--bg-input)" }}>
                              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)]">Success Rate</span>
                              <p className="text-xl font-bold mt-1">{syncSummary?.success_rate != null ? `${Number(syncSummary.success_rate).toFixed(1)}%` : "—"}</p>
                            </div>
                            <div className="rounded-lg border border-[var(--border)] p-4" style={{ background: "var(--bg-input)" }}>
                              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)]">Avg Duration</span>
                              <p className="text-xl font-bold mt-1">{syncSummary?.avg_duration_seconds != null ? `${Math.round(syncSummary.avg_duration_seconds)}s` : "—"}</p>
                            </div>
                            <div className="rounded-lg border border-[var(--border)] p-4" style={{ background: "var(--bg-input)" }}>
                              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)]">Rows Synced</span>
                              <p className="text-xl font-bold mt-1">{syncSummary?.total_rows_synced != null ? Number(syncSummary.total_rows_synced).toLocaleString() : "—"}</p>
                            </div>
                          </div>

                          {syncLogs.length > 0 ? (
                            <>
                              <div className="rounded-lg border border-[var(--border)] overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]"
                                      style={{ background: "rgba(99,102,241,.04)", borderBottom: "1px solid var(--border)" }}>
                                      <th className="text-left px-3 py-2">Table</th>
                                      <th className="text-left px-3 py-2">Status</th>
                                      <th className="text-left px-3 py-2">Type</th>
                                      <th className="text-left px-3 py-2">Started</th>
                                      <th className="text-left px-3 py-2">Duration</th>
                                      <th className="text-left px-3 py-2">Rows</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {paginatedActivityLogs.map((log, index) => {
                                      const status = log.status || "unknown";
                                      const success = status === "success";
                                      return (
                                        <tr key={log.id || `sync-log-${index}`} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)]">
                                          <td className="px-3 py-2 text-xs text-[var(--text)]">{log.table_name || log.table?.name || "—"}</td>
                                          <td className="px-3 py-2">
                                            <Badge
                                              label={status}
                                              bg={success ? "rgba(74,222,128,.12)" : "rgba(248,113,113,.12)"}
                                              color={success ? "#4ade80" : "#f87171"}
                                              border={success ? "rgba(74,222,128,.25)" : "rgba(248,113,113,.25)"}
                                            />
                                          </td>
                                          <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{log.sync_type || "—"}</td>
                                          <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{formatDateTime(log.start_time || log.started_at)}</td>
                                          <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{log.duration_seconds != null ? `${Math.round(log.duration_seconds)}s` : "—"}</td>
                                          <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{log.rows_processed != null ? Number(log.rows_processed).toLocaleString() : (log.rows_synced != null ? Number(log.rows_synced).toLocaleString() : "—")}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                              {syncLogs.length > ACTIVITY_PAGE_SIZE && (
                                <div className="pt-3 flex items-center justify-end gap-2">
                                  <button
                                    className={btnS}
                                    disabled={activityPage === 1}
                                    onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                                    style={{ opacity: activityPage === 1 ? 0.5 : 1, cursor: activityPage === 1 ? "not-allowed" : "pointer" }}>
                                    Prev
                                  </button>
                                  <span className="text-xs text-[var(--text-sub)] px-1">Page {activityPage} / {activityTotalPages}</span>
                                  <button
                                    className={btnS}
                                    disabled={activityPage === activityTotalPages}
                                    onClick={() => setActivityPage((p) => Math.min(activityTotalPages, p + 1))}
                                    style={{ opacity: activityPage === activityTotalPages ? 0.5 : 1, cursor: activityPage === activityTotalPages ? "not-allowed" : "pointer" }}>
                                    Next
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <I d={ico.activity} size={28} color="var(--text-muted)" />
                              <p className="text-sm font-semibold text-[var(--text-sub)] mt-3">No sync logs available</p>
                              <p className="text-xs text-[var(--text-muted)] mt-1">Run sync to generate activity records</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between text-[0.65rem] text-[var(--text-muted)]">
          <span>© 2026 PCSoft Analytics</span>
          <span>v1.0.0</span>
        </footer>
      </div>

      {/* ── Create Parameter Modal ── */}
      {showParamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} onClick={() => setShowParamModal(false)}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-lg mx-4 flex flex-col"
            style={{ animation: "fadeUp .2s ease both", maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-base font-bold text-[var(--text)]">Create New Parameter</h2>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-input)] transition-colors cursor-pointer"
                style={{ background: "none", border: "1px solid var(--border)" }}
                onClick={() => setShowParamModal(false)}>
                <I d={ico.x} size={16} />
              </button>
            </div>

            {/* Tab indicator */}
            <div className="px-6 border-b border-[var(--border)]">
              <span className="text-xs font-semibold text-[var(--nav-active)] pb-2 inline-block"
                style={{ borderBottom: "2px solid var(--nav-active)" }}>Basic Information</span>
            </div>

            {/* Scrollable form body */}
            <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4" style={{ maxHeight: "60vh" }}>
              {/* Parameter Name */}
              <div>
                <label className="text-xs font-semibold text-[var(--text)] mb-1 block">Parameter Name <span style={{ color: "#ef4444" }}>*</span></label>
                <input className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] transition-[border-color]"
                  placeholder="e.g., current_fiscal_year"
                  value={paramForm.name}
                  onChange={(e) => setParamForm((f) => ({ ...f, name: e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase() }))} />
                <p className="text-[0.6rem] text-[var(--text-muted)] mt-1">Use lowercase letters, numbers, and underscores only</p>
              </div>

              {/* Display Name */}
              <div>
                <label className="text-xs font-semibold text-[var(--text)] mb-1 block">Display Name <span style={{ color: "#ef4444" }}>*</span></label>
                <input className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] transition-[border-color]"
                  placeholder="e.g., Current Fiscal Year"
                  value={paramForm.display_name}
                  onChange={(e) => setParamForm((f) => ({ ...f, display_name: e.target.value }))} />
              </div>

              <hr style={{ borderColor: "var(--border)" }} />

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-[var(--text)] mb-1 block">Description</label>
                <textarea className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] transition-[border-color] resize-y"
                  rows={3} placeholder="Describe what this parameter is used for..."
                  value={paramForm.description}
                  onChange={(e) => setParamForm((f) => ({ ...f, description: e.target.value }))} />
              </div>

              <hr style={{ borderColor: "var(--border)" }} />

              {/* Data Type */}
              <div>
                <label className="text-xs font-semibold text-[var(--text)] mb-1 block">Data Type <span style={{ color: "#ef4444" }}>*</span></label>
                <select className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] cursor-pointer"
                  style={{ colorScheme: "dark light" }}
                  value={paramForm.data_type}
                  onChange={(e) => setParamForm((f) => ({ ...f, data_type: e.target.value }))}>
                  {["string", "integer", "decimal", "boolean", "date", "datetime", "list"].map((t) => (
                    <option key={t} value={t} style={{ background: "var(--bg-card)", color: "var(--text)" }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Default Value */}
              <div>
                <label className="text-xs font-semibold text-[var(--text)] mb-1 block">Default Value</label>
                <input className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] transition-[border-color]"
                  placeholder={`Enter default ${paramForm.data_type} value...`}
                  value={paramForm.default_value}
                  onChange={(e) => setParamForm((f) => ({ ...f, default_value: e.target.value }))} />
              </div>

              <hr style={{ borderColor: "var(--border)" }} />

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-[var(--text)] mb-1 block">Category</label>
                <input className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] transition-[border-color]"
                  placeholder="e.g., Financial, Operations"
                  value={paramForm.category}
                  onChange={(e) => setParamForm((f) => ({ ...f, category: e.target.value }))} />
              </div>

              {/* Toggle: Required */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-semibold text-[var(--text)]">Required</span>
                <button className="w-10 h-5 rounded-full relative cursor-pointer transition-colors"
                  style={{ background: paramForm.is_required ? "var(--nav-active)" : "var(--track-color)", border: "none" }}
                  onClick={() => setParamForm((f) => ({ ...f, is_required: !f.is_required }))}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{ left: paramForm.is_required ? 22 : 2 }} />
                </button>
              </div>

              {/* Toggle: Allow Multiple */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-semibold text-[var(--text)]">Allow Multiple Values</span>
                <button className="w-10 h-5 rounded-full relative cursor-pointer transition-colors"
                  style={{ background: paramForm.allow_multiple ? "var(--nav-active)" : "var(--track-color)", border: "none" }}
                  onClick={() => setParamForm((f) => ({ ...f, allow_multiple: !f.allow_multiple }))}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{ left: paramForm.allow_multiple ? 22 : 2 }} />
                </button>
              </div>

              {/* Toggle: Active */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-semibold text-[var(--text)]">Active</span>
                <button className="w-10 h-5 rounded-full relative cursor-pointer transition-colors"
                  style={{ background: paramForm.is_active ? "var(--nav-active)" : "var(--track-color)", border: "none" }}
                  onClick={() => setParamForm((f) => ({ ...f, is_active: !f.is_active }))}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{ left: paramForm.is_active ? 22 : 2 }} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
              <button className={btnS} onClick={() => setShowParamModal(false)}>Cancel</button>
              <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: paramSaving ? 0.7 : 1 }}
                disabled={paramSaving} onClick={handleCreateParameter}>
                {paramSaving ? <Spin /> : <I d={ico.db} size={14} color="#fff" />} Create Parameter
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} onClick={() => setDeleting(false)}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-sm mx-4"
            style={{ animation: "fadeUp .2s ease both" }} onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)" }}>
                  <I d={ico.trash} size={18} color="#f87171" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text)]">Delete Data Source</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Are you sure you want to delete "{source?.name}"? This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
              <button className={btnS} onClick={() => setDeleting(false)}>Cancel</button>
              <button className={btnP}
                style={{ background: "#ef4444", opacity: deleteLoading ? 0.7 : 1 }}
                disabled={deleteLoading} onClick={handleDelete}>
                {deleteLoading ? <Spin /> : null} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}
