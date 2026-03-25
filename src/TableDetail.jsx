import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

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
  db: "M12 2C6.48 2 3 3.34 3 5v14c0 1.66 3.48 3 9 3s9-1.34 9-3V5c0-1.66-3.48-3-9-3zM3 9c0 1.66 3.48 3 9 3s9-1.34 9-3M3 14c0 1.66 3.48 3 9 3s9-1.34 9-3",
  table: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0H5a2 2 0 01-2-2v-4m6 6h10a2 2 0 002-2v-4M3 9h18M3 15h18",
  columns: "M12 3v18M3 3h18v18H3zM3 9h18M3 15h18",
  link: "M10 13a5 5 0 007.07 0l3.54-3.54a5 5 0 00-7.07-7.07L11 5M14 11a5 5 0 00-7.07 0L3.39 14.54a5 5 0 007.07 7.07L13 19",
  preview: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 9a3 3 0 100 6 3 3 0 000-6z",
  history: "M12 8v5l3 3M3 12a9 9 0 1018 0 9 9 0 10-18 0z",
  refresh: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  search: "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2",
  plus: "M12 5v14M5 12h14",
  play: "M5 3l14 9-14 9V3z",
  power: "M18.36 6.64a9 9 0 11-12.73 0M12 2v10",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] transition-all duration-150";

const TABS = [
  { id: "overview", label: "Overview", icon: "db" },
  { id: "columns", label: "Columns", icon: "columns" },
  { id: "relationships", label: "Relationships", icon: "link" },
  { id: "preview", label: "Data Preview", icon: "preview" },
  { id: "history", label: "Sync History", icon: "history" },
];

const COLUMNS_PAGE_SIZE = 20;
const RELATIONSHIPS_PAGE_SIZE = 10;
const PREVIEW_PAGE_SIZE = 20;
const HISTORY_PAGE_SIZE = 15;

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
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function asArray(payload, keys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of keys) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

function normalizeRow(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {};
}

function toOptionalInteger(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) ? numeric : null;
}

export default function TableDetail() {
  const { id, schema, tableName } = useParams();
  const sourceId = id;
  const decodedSchema = decodeURIComponent(schema || "dbo");
  const decodedTableName = decodeURIComponent(tableName || "");

  const navigate = useNavigate();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const { push, Toast } = useToast();
  const numericSourceId = toOptionalInteger(sourceId);

  const [activeTab, setActiveTab] = useState("overview");
  const [source, setSource] = useState(null);
  const [tableMeta, setTableMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);

  const [columns, setColumns] = useState([]);
  const [columnsTotal, setColumnsTotal] = useState(0);
  const [columnSearch, setColumnSearch] = useState("");
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [columnsPage, setColumnsPage] = useState(1);

  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(new Set()); // bulk selection state
  const [columnForm, setColumnForm] = useState({
    display_name: "",
    description: "",
    sync_enabled: true,
    is_unique_id: false,
    is_sequential: false,
  });
  const [savingColumn, setSavingColumn] = useState(false);

  const [relationships, setRelationships] = useState([]);
  const [relationshipsLoading, setRelationshipsLoading] = useState(false);
  const [relationshipsPage, setRelationshipsPage] = useState(1);
  const [relationshipsHasMore, setRelationshipsHasMore] = useState(false);

  /* Relationship creation modal */
  const [showRelModal, setShowRelModal] = useState(false);
  const [relSubmitting, setRelSubmitting] = useState(false);
  const [relTableSearch, setRelTableSearch] = useState("");
  const [relTableOptions, setRelTableOptions] = useState([]);
  const [relTableSearching, setRelTableSearching] = useState(false);
  const [relForm, setRelForm] = useState({
    name: "",
    description: "",
    relationship_type: "one_to_many",
    join_type: "inner",
    target_table_id: "",
    target_table_label: "",
    column_mappings: [{ source_column: "", target_column: "" }],
  });

  /* Edit / Delete table state */
  const [deleting, setDeleting] = useState(false);

  const [previewRows, setPreviewRows] = useState([]);
  const [previewColumns, setPreviewColumns] = useState([]);
  const [previewTotal, setPreviewTotal] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewHasMore, setPreviewHasMore] = useState(false);

  const [syncLogs, setSyncLogs] = useState([]);
  const [syncLogsTotal, setSyncLogsTotal] = useState(0);
  const [syncLogsLoading, setSyncLogsLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  const [syncConfig, setSyncConfig] = useState(null);
  const [syncConfigLoading, setSyncConfigLoading] = useState(false);

  const selectedColumn = useMemo(() => columns.find((c) => c.id === selectedColumnId) || null, [columns, selectedColumnId]);
  const columnsTotalPages = Math.max(1, Math.ceil((columnsTotal || 0) / COLUMNS_PAGE_SIZE));
  const previewHasKnownTotal = Number.isFinite(previewTotal) && previewTotal > 0;
  const previewTotalPages = previewHasKnownTotal
    ? Math.max(1, Math.ceil(previewTotal / PREVIEW_PAGE_SIZE))
    : Math.max(1, previewPage + (previewHasMore ? 1 : 0));
  const historyTotalPages = Math.max(1, Math.ceil((syncLogsTotal || 0) / HISTORY_PAGE_SIZE));

  const fetchMeta = useCallback(async () => {
    if (!api || !sourceId) return;
    setMetaLoading(true);
    try {
      const [sourceRes, tableRes] = await Promise.allSettled([
        api(`/api/v1/data-sources/${sourceId}`),
        api(
          "/api/v1/tables/",
          {},
          {
            ...(numericSourceId != null ? { data_source_id: numericSourceId } : {}),
            search: decodedTableName,
            skip: 0,
            limit: 1000,
          }
        ),
      ]);

      const src = sourceRes.status === "fulfilled" ? sourceRes.value : null;
      const tableList = tableRes.status === "fulfilled"
        ? asArray(tableRes.value, ["tables", "items", "data", "results"])
        : [];

      let exact = tableList.find((t) =>
        String(t.table_name || "").toLowerCase() === decodedTableName.toLowerCase()
        && String(t.schema_name || "dbo").toLowerCase() === decodedSchema.toLowerCase()
      ) || tableList.find((t) => String(t.table_name || "").toLowerCase() === decodedTableName.toLowerCase());

      if (!exact) {
        try {
          const syncRes = await api(`/api/v1/data-sources/${sourceId}/sync-tables`, {}, {
            table_name: decodedTableName,
            limit: 200,
            offset: 0,
          });
          const syncList = asArray(syncRes, ["tables", "items", "data", "results"]);
          const syncMatch = syncList.find((t) => String(t.table_name || "").toLowerCase() === decodedTableName.toLowerCase());
          if (syncMatch) {
            exact = {
              ...syncMatch,
              id: syncMatch.id,
              table_name: syncMatch.table_name || decodedTableName,
              schema_name: syncMatch.schema_name || decodedSchema,
              data_source_id: numericSourceId ?? sourceId,
            };
          }
        } catch {
          // keep fallback object below
        }
      }

      setSource(src);
      setTableMeta(exact || {
        table_name: decodedTableName,
        schema_name: decodedSchema,
        data_source_id: numericSourceId ?? sourceId,
        sync_enabled: true,
      });
    } catch {
      push("Failed to load table details", "error");
    }
    setMetaLoading(false);
  }, [api, decodedSchema, decodedTableName, numericSourceId, push, sourceId]);

  const fetchColumns = useCallback(async () => {
    if (!api || !tableMeta?.id) return;
    setColumnsLoading(true);
    try {
      const data = await api("/api/v1/columns/", {}, {
        table_id: tableMeta.id,
        search: columnSearch || undefined,
        skip: (columnsPage - 1) * COLUMNS_PAGE_SIZE,
        limit: COLUMNS_PAGE_SIZE,
      });
      const list = asArray(data, ["columns", "items", "data", "results"]);
      const total = Number(data?.total ?? list.length ?? 0);
      setColumns(list);
      setColumnsTotal(total);
      if (list.length > 0) {
        const stillPresent = list.find((c) => c.id === selectedColumnId);
        setSelectedColumnId(stillPresent ? stillPresent.id : list[0].id);
      } else {
        setSelectedColumnId(null);
      }
    } catch {
      push("Failed to load columns", "error");
    }
    setColumnsLoading(false);
  }, [api, columnSearch, columnsPage, push, selectedColumnId, tableMeta?.id]);

  const fetchRelationships = useCallback(async () => {
    if (!api || !tableMeta?.id) return;
    setRelationshipsLoading(true);
    try {
      const data = await api(`/api/v1/relationships/tables/${tableMeta.id}/relationships`, {}, {
        skip: (relationshipsPage - 1) * RELATIONSHIPS_PAGE_SIZE,
        limit: RELATIONSHIPS_PAGE_SIZE + 1,
        is_active: true,
      });
      const list = asArray(data, ["items", "relationships", "data", "results"]);
      setRelationshipsHasMore(list.length > RELATIONSHIPS_PAGE_SIZE);
      setRelationships(list.slice(0, RELATIONSHIPS_PAGE_SIZE));
    } catch {
      setRelationships([]);
      setRelationshipsHasMore(false);
      push("Failed to load relationships", "error");
    }
    setRelationshipsLoading(false);
  }, [api, push, relationshipsPage, tableMeta?.id]);

  const fetchPreview = useCallback(async () => {
    if (!api || !tableMeta?.id) return;
    setPreviewLoading(true);
    try {
      const offset = (previewPage - 1) * PREVIEW_PAGE_SIZE;
      const data = await api(`/api/v1/tables/${tableMeta.id}/data-preview`, {}, { limit: PREVIEW_PAGE_SIZE + 1, offset });
      const rows = asArray(data, ["rows", "data", "items", "results"]);
      const pagedRows = rows.slice(0, PREVIEW_PAGE_SIZE);
      const cols = Array.isArray(data?.columns)
        ? data.columns.map((c) => (typeof c === "string" ? c : c?.name || c?.column_name || c?.field || ""))
        : (pagedRows[0] ? Object.keys(normalizeRow(pagedRows[0])) : []);
      setPreviewRows(pagedRows.map(normalizeRow));
      setPreviewColumns(cols.filter(Boolean));
      if (Number.isFinite(Number(data?.total))) {
        const total = Number(data.total);
        setPreviewTotal(total);
        setPreviewHasMore(previewPage * PREVIEW_PAGE_SIZE < total);
      } else {
        setPreviewTotal(0);
        setPreviewHasMore(rows.length > PREVIEW_PAGE_SIZE);
      }
    } catch {
      setPreviewRows([]);
      setPreviewColumns([]);
      setPreviewTotal(0);
      setPreviewHasMore(false);
      push("Failed to load data preview", "error");
    }
    setPreviewLoading(false);
  }, [api, previewPage, push, tableMeta?.id]);

  const fetchSyncHistory = useCallback(async () => {
    if (!api || !tableMeta?.id) return;
    setSyncLogsLoading(true);
    try {
      const data = await api("/api/v1/sync-logs/", {}, {
        table_id: tableMeta.id,
        skip: (historyPage - 1) * HISTORY_PAGE_SIZE,
        limit: HISTORY_PAGE_SIZE,
      });
      const logs = asArray(data, ["sync_logs", "items", "logs", "data", "results"]);
      setSyncLogs(logs);
      setSyncLogsTotal(Number(data?.total ?? logs.length));
    } catch {
      setSyncLogs([]);
      setSyncLogsTotal(0);
      push("Failed to load sync history", "error");
    }
    setSyncLogsLoading(false);
  }, [api, historyPage, push, tableMeta?.id]);

  const fetchSyncConfig = useCallback(async () => {
    if (!api || !tableMeta?.id) return;
    setSyncConfigLoading(true);
    try {
      const cfg = await api(`/api/v1/tables/${tableMeta.id}/sync-config`);
      setSyncConfig(cfg || {});
    } catch {
      setSyncConfig({});
    }
    setSyncConfigLoading(false);
  }, [api, tableMeta?.id]);

  useEffect(() => { fetchMeta(); }, [fetchMeta]);

  useEffect(() => {
    if (!tableMeta?.id) return;
    fetchColumns();
    fetchSyncConfig();
  }, [tableMeta?.id, fetchColumns, fetchSyncConfig]);

  useEffect(() => {
    if (activeTab === "relationships") fetchRelationships();
    if (activeTab === "preview") fetchPreview();
    if (activeTab === "history") fetchSyncHistory();
  }, [activeTab, fetchPreview, fetchRelationships, fetchSyncHistory]);

  useEffect(() => {
    setColumnsPage(1);
  }, [columnSearch]);

  useEffect(() => {
    if (!tableMeta?.id) return;
    setColumnsPage(1);
    setRelationshipsPage(1);
    setPreviewPage(1);
    setHistoryPage(1);
  }, [tableMeta?.id]);

  useEffect(() => {
    if (columnsPage > columnsTotalPages) setColumnsPage(columnsTotalPages);
  }, [columnsPage, columnsTotalPages]);

  useEffect(() => {
    if (!previewHasKnownTotal) return;
    if (previewPage > previewTotalPages) setPreviewPage(previewTotalPages);
  }, [previewHasKnownTotal, previewPage, previewTotalPages]);

  useEffect(() => {
    if (historyPage > historyTotalPages) setHistoryPage(historyTotalPages);
  }, [historyPage, historyTotalPages]);

  useEffect(() => {
    if (!selectedColumn) return;
    setColumnForm({
      display_name: selectedColumn.display_name || "",
      description: selectedColumn.description || "",
      sync_enabled: Boolean(selectedColumn.sync_enabled),
      is_unique_id: Boolean(selectedColumn.is_unique_id),
      is_sequential: Boolean(selectedColumn.is_sequential),
    });
  }, [selectedColumn]);

  const saveColumn = async () => {
    if (!api || !selectedColumn) return;
    setSavingColumn(true);
    try {
      await api(`/api/v1/columns/${selectedColumn.id}`, {
        method: "PUT",
        body: JSON.stringify({
          display_name: columnForm.display_name || null,
          description: columnForm.description || null,
          sync_enabled: Boolean(columnForm.sync_enabled),
          is_unique_id: Boolean(columnForm.is_unique_id),
          is_sequential: Boolean(columnForm.is_sequential),
        }),
      });
      setColumns((prev) => prev.map((c) => (c.id === selectedColumn.id ? { ...c, ...columnForm } : c)));
      push("Column updated");
    } catch (e) {
      push(e.message || "Failed to update column", "error");
    }
    setSavingColumn(false);
  };

  /* Delete this table's sync-tracking record */
  const handleDeleteTable = async () => {
    if (!tableMeta?.id) return;
    if (!window.confirm(`Delete table "${decodedTableName}" from sync tracking? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api(`/api/v1/tables/${tableMeta.id}`, { method: "DELETE" });
      push("Table deleted");
      navigate(`/datasources/${sourceId}`);
    } catch (e) { push(e?.message || "Failed to delete table", "error"); }
    setDeleting(false);
  };

  /* Search available tables for the relationship target dropdown */
  const searchRelTables = useCallback(async (q) => {
    if (!api) return;
    setRelTableSearching(true);
    try {
      const data = await api("/api/v1/tables/", {}, {
        ...(numericSourceId != null ? { data_source_id: numericSourceId } : {}),
        search: q || undefined,
        skip: 0,
        limit: 30,
      });
      const list = asArray(data, ["tables", "items", "data", "results"]);
      setRelTableOptions(list.filter((t) => t.id !== tableMeta?.id));
    } catch { setRelTableOptions([]); }
    setRelTableSearching(false);
  }, [api, numericSourceId, tableMeta?.id]);

  /* Submit the Create Relationship form */
  const handleCreateRelationship = async () => {
    if (!relForm.name.trim()) { push("Relationship name is required", "error"); return; }
    if (!relForm.target_table_id) { push("Target table is required", "error"); return; }
    const validMappings = relForm.column_mappings.filter((m) => m.source_column && m.target_column);
    if (validMappings.length === 0) { push("At least one column mapping is required", "error"); return; }
    setRelSubmitting(true);
    try {
      await api("/api/v1/relationships/", {
        method: "POST",
        body: JSON.stringify({
          name: relForm.name.trim(),
          description: relForm.description || null,
          relationship_type: relForm.relationship_type,
          join_type: relForm.join_type,
          source_table_id: tableMeta.id,
          target_table_id: Number(relForm.target_table_id),
          column_mappings: validMappings.map((m) => ({ source_column: m.source_column, target_column: m.target_column })),
        }),
      });
      push("Relationship created");
      setShowRelModal(false);
      setRelForm({ name: "", description: "", relationship_type: "one_to_many", join_type: "inner", target_table_id: "", target_table_label: "", column_mappings: [{ source_column: "", target_column: "" }] });
      fetchRelationships();
    } catch (e) { push(e?.message || "Failed to create relationship", "error"); }
    setRelSubmitting(false);
  };

  /* Column Selection Handlers */
  const toggleColumnSelection = (id) => {
    const nextSet = new Set(selectedColumns);
    if (nextSet.has(id)) nextSet.delete(id);
    else nextSet.add(id);
    setSelectedColumns(nextSet);
  };

  const toggleAllSelection = () => {
    if (selectedColumns.size === columns.length && columns.length > 0) {
      setSelectedColumns(new Set());
    } else {
      setSelectedColumns(new Set(columns.map(c => c.id)));
    }
  };

  const handleBulkSync = async (enable) => {
    if (!api || selectedColumns.size === 0) return;
    const items = Array.from(selectedColumns);
    push(`Updating sync status for ${items.length} column(s)...`, "success");
    setSelectedColumns(new Set()); 
    try {
      await Promise.all(items.map(id =>
        api(`/api/v1/columns/${id}`, {
          method: "PUT",
          body: JSON.stringify({ sync_enabled: enable }),
        })
      ));
      setColumns((prev) => prev.map((c) => items.includes(c.id) ? { ...c, sync_enabled: enable } : c));
      if (items.includes(selectedColumnId)) {
        setColumnForm((p) => ({ ...p, sync_enabled: enable }));
      }
      push(`Successfully updated sync status!`, "success");
    } catch (e) {
      push(e?.message || "Failed to bulk update sync status", "error");
      fetchColumns();
    }
  };

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-3 min-w-0">
            <button className={btnS} onClick={() => navigate(`/datasources/${sourceId}`)}>
              <I d={ico.back} size={14} /> Back
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)" }}>
              <I d={ico.table} size={16} color="#818cf8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold truncate">{source?.name || `Data Source ${sourceId}`}</h1>
              <p className="text-[0.65rem] text-[var(--text-muted)] truncate">
                {decodedSchema}.{decodedTableName} · Table Information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={btnS} onClick={fetchMeta}>
              <I d={ico.refresh} size={14} /> Refresh
            </button>
            {tableMeta?.id && (
              <button className={btnS}
                style={{ color: "#f87171", borderColor: "rgba(248,113,113,.3)" }}
                disabled={deleting}
                onClick={handleDeleteTable}>
                {deleting ? <Spin /> : <I d={ico.trash} size={14} color="#f87171" />} Delete
              </button>
            )}
          </div>
        </header>

        <div className="flex items-center gap-0 px-6 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
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

        <main className="flex-1 overflow-auto px-6 py-5">
          {metaLoading ? (
            <div className="flex items-center justify-center gap-3 py-20"><Spin /> Loading table information...</div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className="grid grid-cols-2 gap-5 w-full">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[var(--border)]" style={{ background: "rgba(99,102,241,.04)" }}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Table Details</h3>
                    </div>
                    <div className="px-5 py-2">
                      <InfoRow label="Schema" value={tableMeta?.schema_name || decodedSchema} />
                      <InfoRow label="Table" value={tableMeta?.table_name || decodedTableName} />
                      <InfoRow label="Table ID" value={tableMeta?.id || "-"} />
                      <InfoRow label="Sync Enabled" value={String(tableMeta?.sync_enabled ?? true)} />
                      <InfoRow label="Created" value={formatDateTime(tableMeta?.created_at)} />
                      <InfoRow label="Updated" value={formatDateTime(tableMeta?.updated_at)} />
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[var(--border)]" style={{ background: "rgba(99,102,241,.04)" }}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Sync Configuration</h3>
                    </div>
                    <div className="px-5 py-2">
                      {syncConfigLoading ? (
                        <div className="py-3 text-xs text-[var(--text-muted)] flex items-center gap-2"><Spin /> Loading sync config...</div>
                      ) : (
                        <>
                          <InfoRow label="Strategy" value={syncConfig?.strategy || tableMeta?.sync_method || "-"} />
                          <InfoRow label="Sync Method" value={tableMeta?.sync_method || "-"} />
                          <InfoRow label="Frequency" value={tableMeta?.sync_frequency || "-"} />
                          <InfoRow label="Schedule" value={tableMeta?.sync_schedule_time || "-"} />
                          <InfoRow label="Unique Key Column" value={syncConfig?.unique_key_column_id || "-"} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "columns" && (
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(360px,1fr)] gap-5 min-h-[560px] w-full">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                      <div className="flex-1 relative">
                        <I d={ico.search} size={14} color="var(--text-muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none"
                          placeholder="Search columns by name, type, or description..."
                          value={columnSearch}
                          onChange={(e) => setColumnSearch(e.target.value)}
                          onBlur={fetchColumns}
                        />
                      </div>
                      <button className={btnS} onClick={fetchColumns}><I d={ico.refresh} size={14} /></button>
                    </div>

                    <div className="px-4 py-2.5 border-b border-[var(--border)] min-h-[46px] flex items-center justify-between"
                      style={{ background: selectedColumns.size > 0 ? "rgba(99,102,241,.03)" : "transparent" }}>
                      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: selectedColumns.size > 0 ? "var(--nav-active)" : "var(--text-muted)" }}>
                        {selectedColumns.size > 0 && <I d={ico.check} size={14} color="var(--nav-active)" />}
                        {selectedColumns.size > 0 ? `${selectedColumns.size} column${selectedColumns.size > 1 ? "s" : ""} selected` : "No columns selected"}
                      </div>
                      {selectedColumns.size > 0 && (
                        <div className="flex items-center gap-2">
                          <button className={btnP} style={{ background: "var(--nav-active-bg)" }} onClick={() => handleBulkSync(true)}>
                            <I d={ico.play} size={13} color="#fff" /> Enable Sync
                          </button>
                          <button className={btnP} style={{ background: "#3b82f6" }} onClick={() => handleBulkSync(false)}>
                            <I d={ico.power} size={13} color="#fff" /> Disable Sync
                          </button>
                          <button className="px-3 py-1.5 text-xs text-[var(--text-sub)] hover:text-[var(--text)] transition-colors flex items-center gap-1 cursor-pointer"
                            style={{ background: "none", border: "none" }} onClick={() => setSelectedColumns(new Set())}>
                            <I d={ico.x} size={13} /> Clear
                          </button>
                        </div>
                      )}
                    </div>

                    {columnsLoading ? (
                      <div className="flex items-center justify-center gap-2 py-10"><Spin /> Loading columns...</div>
                    ) : (
                      <>
                        <table className="w-full">
                          <thead>
                            <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]"
                              style={{ background: "rgba(99,102,241,.04)", borderBottom: "1px solid var(--border)" }}>
                              <th className="text-left px-3 py-2 w-10">
                                <input type="checkbox"
                                  className="cursor-pointer"
                                  checked={columns.length > 0 && selectedColumns.size === columns.length}
                                  onChange={toggleAllSelection} />
                              </th>
                              <th className="text-left px-3 py-2">Name</th>
                              <th className="text-left px-3 py-2">Type</th>
                              <th className="text-left px-3 py-2">Nullable</th>
                              <th className="text-left px-3 py-2">Description</th>
                              <th className="text-left px-3 py-2">Sync Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {columns.map((col) => {
                              const isChecked = selectedColumns.has(col.id);
                              return (
                                <tr key={col.id}
                                  onClick={() => setSelectedColumnId(col.id)}
                                  className="border-b border-[var(--border)] cursor-pointer hover:bg-[var(--bg-input)]"
                                  style={{ background: isChecked ? "rgba(99,102,241,.05)" : (selectedColumnId === col.id ? "rgba(99,102,241,.08)" : "transparent") }}>
                                  <td className="px-3 py-2 w-10" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox"
                                      className="cursor-pointer"
                                      checked={isChecked}
                                      onChange={() => toggleColumnSelection(col.id)} />
                                  </td>
                                  <td className="px-3 py-2 text-sm font-semibold">{col.column_name}</td>
                                  <td className="px-3 py-2 text-xs text-[var(--text-sub)]">
                                    <span className="px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)]">{col.data_type || "-"}</span>
                                  </td>
                                  <td className="px-3 py-2 text-[0.6rem] font-bold text-[var(--text-sub)]">{col.is_nullable ? "NULL" : "NOT NULL"}</td>
                                  <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{col.description || "-"}</td>
                                  <td className="px-3 py-2 text-xs">
                                    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full"
                                      style={{
                                        background: col.sync_enabled ? "rgba(74,222,128,.12)" : "rgba(148,163,184,.12)",
                                        color: col.sync_enabled ? "#4ade80" : "#94a3b8",
                                        border: `1px solid ${col.sync_enabled ? "rgba(74,222,128,.25)" : "rgba(148,163,184,.25)"}`,
                                      }}>
                                      {col.sync_enabled ? "Enabled" : "Disabled"}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="px-4 py-2 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
                          {columns.length > 0
                            ? `Showing ${(columnsPage - 1) * COLUMNS_PAGE_SIZE + 1}-${(columnsPage - 1) * COLUMNS_PAGE_SIZE + columns.length} of ${columnsTotal || columns.length} columns`
                            : "No columns found"}
                        </div>
                        {(columnsTotal || columns.length) > COLUMNS_PAGE_SIZE && (
                          <div className="px-4 py-2 border-t border-[var(--border)] flex items-center justify-end gap-2">
                            <button
                              className={btnS}
                              disabled={columnsPage === 1}
                              onClick={() => setColumnsPage((p) => Math.max(1, p - 1))}
                              style={{ opacity: columnsPage === 1 ? 0.5 : 1, cursor: columnsPage === 1 ? "not-allowed" : "pointer" }}>
                              Prev
                            </button>
                            <span className="text-xs text-[var(--text-sub)] px-1">Page {columnsPage} / {columnsTotalPages}</span>
                            <button
                              className={btnS}
                              disabled={columnsPage === columnsTotalPages}
                              onClick={() => setColumnsPage((p) => Math.min(columnsTotalPages, p + 1))}
                              style={{ opacity: columnsPage === columnsTotalPages ? 0.5 : 1, cursor: columnsPage === columnsTotalPages ? "not-allowed" : "pointer" }}>
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden h-fit">
                    <div className="px-5 py-3 border-b border-[var(--border)]" style={{ background: "rgba(99,102,241,.04)" }}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Edit Column</h3>
                    </div>
                    {selectedColumn ? (
                      <div className="px-5 py-4 space-y-3">
                        <Field label="Column Name" value={selectedColumn.column_name} readOnly />
                        <Field label="Display Name" value={columnForm.display_name}
                          onChange={(v) => setColumnForm((p) => ({ ...p, display_name: v }))} />
                        <Field label="Data Type" value={selectedColumn.data_type || "-"} readOnly />
                        <Field label="Description" value={columnForm.description}
                          onChange={(v) => setColumnForm((p) => ({ ...p, description: v }))} />

                        <div className="flex items-center gap-2 mb-4">
                          <div className={`relative w-8 h-4 rounded-full cursor-pointer transition-colors ${columnForm.sync_enabled ? 'bg-[var(--nav-active)]' : 'bg-[var(--border)]'}`}
                            onClick={() => setColumnForm((p) => ({ ...p, sync_enabled: !p.sync_enabled }))}>
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-sm ${columnForm.sync_enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                          <span className="text-sm font-semibold text-[var(--text)]">Sync Enabled</span>
                        </div>

                        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-input)]">
                          <p className="text-xs font-semibold text-[var(--nav-active)] mb-3">Performance Optimization (Keyset Pagination)</p>
                          <div className="space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <div className={`relative w-8 h-4 rounded-full transition-colors ${columnForm.is_unique_id ? 'bg-[var(--nav-active)]' : 'bg-[var(--border)]'}`}
                                onClick={() => setColumnForm((p) => ({ ...p, is_unique_id: !p.is_unique_id }))}>
                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${columnForm.is_unique_id ? 'translate-x-4' : 'translate-x-0'}`} />
                              </div>
                              <span className="text-xs font-medium text-[var(--text)]">Use as Unique ID</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <div className={`relative w-8 h-4 rounded-full transition-colors ${columnForm.is_sequential ? 'bg-[var(--nav-active)]' : 'bg-[var(--border)]'}`}
                                onClick={() => setColumnForm((p) => ({ ...p, is_sequential: !p.is_sequential }))}>
                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${columnForm.is_sequential ? 'translate-x-4' : 'translate-x-0'}`} />
                              </div>
                              <span className="text-xs font-medium text-[var(--text)]">Values are Sequential</span>
                            </label>
                          </div>
                        </div>

                        <div className="text-[0.7rem] text-[var(--text-muted)] p-3 rounded-lg border border-dashed border-[var(--border)]">
                          Tip: Manual override can improve sync performance for very large tables.
                        </div>

                        <button className={btnP} style={{ background: "var(--nav-active-bg)", width: "100%", justifyContent: "center" }}
                          disabled={savingColumn}
                          onClick={saveColumn}>
                          {savingColumn ? <Spin /> : <I d={ico.save} size={14} color="#fff" />} Save Column
                        </button>
                      </div>
                    ) : (
                      <div className="px-5 py-8 text-xs text-[var(--text-muted)]">Select a column to edit.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "relationships" && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Relationships</h3>
                    <div className="flex items-center gap-2">
                      <button className={btnS} onClick={fetchRelationships}><I d={ico.refresh} size={14} /></button>
                      {tableMeta?.id && (
                        <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
                          onClick={() => { setShowRelModal(true); searchRelTables(""); }}>
                          <I d={ico.plus} size={13} color="#fff" /> Create Relationship
                        </button>
                      )}
                    </div>
                  </div>
                  {!tableMeta?.id ? (
                    <div className="py-10 text-center text-sm text-[var(--text-muted)]">Table metadata ID not found. Relationships are not available for this table yet.</div>
                  ) : relationshipsLoading ? (
                    <div className="py-10 flex items-center justify-center gap-2"><Spin /> Loading relationships...</div>
                  ) : relationships.length === 0 ? (
                    <div className="py-10 text-center text-sm text-[var(--text-muted)]">No relationships found</div>
                  ) : (
                    <>
                      <table className="w-full">
                        <thead>
                          <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]"
                            style={{ background: "rgba(99,102,241,.04)", borderBottom: "1px solid var(--border)" }}>
                            <th className="text-left px-3 py-2">Name</th>
                            <th className="text-left px-3 py-2">Type</th>
                            <th className="text-left px-3 py-2">Source</th>
                            <th className="text-left px-3 py-2">Target</th>
                            <th className="text-left px-3 py-2">Mappings</th>
                          </tr>
                        </thead>
                        <tbody>
                          {relationships.map((r) => (
                            <tr key={r.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)]">
                              <td className="px-3 py-2 text-xs text-[var(--text)]">{r.name || "-"}</td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{r.relationship_type || r.join_type || "-"}</td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{r.source_table_name || "-"}</td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{r.target_table_name || "-"}</td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{Array.isArray(r.column_mappings) ? r.column_mappings.length : 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-4 py-2 border-t border-[var(--border)] flex items-center justify-end gap-2">
                        <button className={btnS} disabled={relationshipsPage === 1}
                          onClick={() => setRelationshipsPage((p) => Math.max(1, p - 1))}
                          style={{ opacity: relationshipsPage === 1 ? 0.5 : 1 }}>Prev</button>
                        <span className="text-xs text-[var(--text-sub)] px-1">Page {relationshipsPage}</span>
                        <button className={btnS} disabled={!relationshipsHasMore}
                          onClick={() => setRelationshipsPage((p) => p + 1)}
                          style={{ opacity: relationshipsHasMore ? 1 : 0.5 }}>Next</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "preview" && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Data Preview</h3>
                    <button className={btnS} onClick={fetchPreview}><I d={ico.refresh} size={14} /></button>
                  </div>
                  {!tableMeta?.id ? (
                    <div className="py-10 text-center text-sm text-[var(--text-muted)]">Table metadata ID not found. Data preview is not available for this table yet.</div>
                  ) : previewLoading ? (
                    <div className="py-10 flex items-center justify-center gap-2"><Spin /> Loading preview...</div>
                  ) : previewRows.length === 0 ? (
                    <div className="py-10 text-center text-sm text-[var(--text-muted)]">No preview data available</div>
                  ) : (
                    <div className="overflow-auto">
                      <table className="w-full min-w-[720px]">
                        <thead>
                          <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]"
                            style={{ background: "rgba(99,102,241,.04)", borderBottom: "1px solid var(--border)" }}>
                            {previewColumns.map((c) => (
                              <th key={c} className="text-left px-3 py-2">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewRows.map((row, i) => (
                            <tr key={`row-${i}`} className="border-b border-[var(--border)]">
                              {previewColumns.map((c) => (
                                <td key={`${i}-${c}`} className="px-3 py-2 text-xs text-[var(--text-sub)]">{String(row[c] ?? "-")}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="px-4 py-2 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
                    {previewRows.length > 0
                      ? `Showing ${(previewPage - 1) * PREVIEW_PAGE_SIZE + 1}-${(previewPage - 1) * PREVIEW_PAGE_SIZE + previewRows.length} rows${previewHasKnownTotal ? ` of ${previewTotal}` : ""}`
                      : "No preview rows"}
                  </div>
                  {(previewHasKnownTotal ? previewTotal > PREVIEW_PAGE_SIZE : (previewPage > 1 || previewHasMore)) && (
                    <div className="px-4 py-2 border-t border-[var(--border)] flex items-center justify-end gap-2">
                      <button
                        className={btnS}
                        disabled={previewPage === 1}
                        onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                        style={{ opacity: previewPage === 1 ? 0.5 : 1, cursor: previewPage === 1 ? "not-allowed" : "pointer" }}>
                        Prev
                      </button>
                      <span className="text-xs text-[var(--text-sub)] px-1">Page {previewPage}{previewHasKnownTotal ? ` / ${previewTotalPages}` : ""}</span>
                      <button
                        className={btnS}
                        disabled={previewHasKnownTotal ? previewPage >= previewTotalPages : !previewHasMore}
                        onClick={() => setPreviewPage((p) => Math.min(previewTotalPages, p + 1))}
                        style={{ opacity: (previewHasKnownTotal ? previewPage >= previewTotalPages : !previewHasMore) ? 0.5 : 1, cursor: (previewHasKnownTotal ? previewPage >= previewTotalPages : !previewHasMore) ? "not-allowed" : "pointer" }}>
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Sync History</h3>
                    <button className={btnS} onClick={fetchSyncHistory}><I d={ico.refresh} size={14} /></button>
                  </div>
                  {!tableMeta?.id ? (
                    <div className="py-10 text-center text-sm text-[var(--text-muted)]">Table metadata ID not found. Sync history is not available for this table yet.</div>
                  ) : syncLogsLoading ? (
                    <div className="py-10 flex items-center justify-center gap-2"><Spin /> Loading sync history...</div>
                  ) : syncLogs.length === 0 ? (
                    <div className="py-10 text-center text-sm text-[var(--text-muted)]">No sync history available</div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]"
                          style={{ background: "rgba(99,102,241,.04)", borderBottom: "1px solid var(--border)" }}>
                          <th className="text-left px-3 py-2">Status</th>
                          <th className="text-left px-3 py-2">Type</th>
                          <th className="text-left px-3 py-2">Start</th>
                          <th className="text-left px-3 py-2">End</th>
                          <th className="text-left px-3 py-2">Duration</th>
                          <th className="text-left px-3 py-2">Rows</th>
                          <th className="text-left px-3 py-2">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {syncLogs.map((log) => {
                          const ok = log.status === "success" || log.status === "completed";
                          return (
                            <tr key={log.id} className="border-b border-[var(--border)]">
                              <td className="px-3 py-2 text-xs">
                                <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full"
                                  style={{
                                    background: ok ? "rgba(74,222,128,.12)" : "rgba(248,113,113,.12)",
                                    color: ok ? "#4ade80" : "#f87171",
                                    border: `1px solid ${ok ? "rgba(74,222,128,.25)" : "rgba(248,113,113,.25)"}`,
                                  }}>
                                  {log.status}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{log.sync_type || "-"}</td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{formatDateTime(log.start_time)}</td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{formatDateTime(log.end_time)}</td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{log.duration_seconds != null ? `${log.duration_seconds}s` : "-"}</td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{log.rows_synced != null ? Number(log.rows_synced).toLocaleString() : "-"}</td>
                              <td className="px-3 py-2 text-xs text-[var(--text-sub)]">{log.error_message || "-"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  <div className="px-4 py-2 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
                    {syncLogs.length > 0
                      ? `Showing ${(historyPage - 1) * HISTORY_PAGE_SIZE + 1}-${(historyPage - 1) * HISTORY_PAGE_SIZE + syncLogs.length} of ${syncLogsTotal} logs`
                      : "0 logs"}
                  </div>
                  {syncLogsTotal > HISTORY_PAGE_SIZE && (
                    <div className="px-4 py-2 border-t border-[var(--border)] flex items-center justify-end gap-2">
                      <button
                        className={btnS}
                        disabled={historyPage === 1}
                        onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                        style={{ opacity: historyPage === 1 ? 0.5 : 1, cursor: historyPage === 1 ? "not-allowed" : "pointer" }}>
                        Prev
                      </button>
                      <span className="text-xs text-[var(--text-sub)] px-1">Page {historyPage} / {historyTotalPages}</span>
                      <button
                        className={btnS}
                        disabled={historyPage === historyTotalPages}
                        onClick={() => setHistoryPage((p) => Math.min(historyTotalPages, p + 1))}
                        style={{ opacity: historyPage === historyTotalPages ? 0.5 : 1, cursor: historyPage === historyTotalPages ? "not-allowed" : "pointer" }}>
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>

        <footer className="px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between text-[0.65rem] text-[var(--text-muted)] shrink-0">
          <span>© 2026 PCSoft Analytics</span>
          <span>v1.0.0</span>
        </footer>
      </div>

      <Toast />

      {/* ── Create Relationship Modal ── */}
      {showRelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowRelModal(false); }}>
          <div className="w-full max-w-2xl mx-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl overflow-hidden"
            style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-sm font-bold text-[var(--text)]">Create New Relationship</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Define a new relationship between this table and another table</p>
              </div>
              <div className="flex items-center gap-2">
                <button className={btnS} onClick={() => setShowRelModal(false)}>Cancel</button>
                <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
                  disabled={relSubmitting} onClick={handleCreateRelationship}>
                  {relSubmitting ? <Spin /> : <I d={ico.link} size={14} color="#fff" />} Create Relationship
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="overflow-auto px-6 py-5 space-y-5 flex-1">

              {/* Relationship Name */}
              <div>
                <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">
                  Relationship Name <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)]"
                  placeholder="e.g., user_orders"
                  value={relForm.name}
                  onChange={(e) => setRelForm((f) => ({ ...f, name: e.target.value }))} />
                <p className="text-[0.65rem] text-[var(--nav-active)] mt-1">A unique name to identify this relationship</p>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">Description</label>
                <textarea
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] resize-y"
                  placeholder="Describe this relationship"
                  rows={3}
                  value={relForm.description}
                  onChange={(e) => setRelForm((f) => ({ ...f, description: e.target.value }))} />
                <p className="text-[0.65rem] text-[var(--text-muted)] mt-1">Optional description of what this relationship represents</p>
              </div>

              {/* Relationship Type + Join Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">
                    Relationship Type <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <select
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] cursor-pointer"
                    style={{ colorScheme: "dark light" }}
                    value={relForm.relationship_type}
                    onChange={(e) => setRelForm((f) => ({ ...f, relationship_type: e.target.value }))}>
                    <option value="one_to_many">ONE TO MANY</option>
                    <option value="many_to_one">MANY TO ONE</option>
                    <option value="one_to_one">ONE TO ONE</option>
                    <option value="many_to_many">MANY TO MANY</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">
                    Join Type <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <select
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] cursor-pointer"
                    style={{ colorScheme: "dark light" }}
                    value={relForm.join_type}
                    onChange={(e) => setRelForm((f) => ({ ...f, join_type: e.target.value }))}>
                    <option value="inner">INNER</option>
                    <option value="left">LEFT</option>
                    <option value="right">RIGHT</option>
                    <option value="full">FULL</option>
                  </select>
                </div>
              </div>

              {/* Target Table searchable dropdown */}
              <div>
                <label className="text-xs font-semibold text-[var(--text)] block mb-1.5">
                  Target Table <span style={{ color: "#f87171" }}>*</span>
                </label>
                <div className="relative">
                  <I d={ico.search} size={14} color="var(--text-muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)]"
                    placeholder="Search for a table..."
                    value={relTableSearch}
                    onChange={(e) => { setRelTableSearch(e.target.value); searchRelTables(e.target.value); }}
                  />
                  {relTableSearching && <span className="absolute right-3 top-1/2 -translate-y-1/2"><Spin /></span>}
                </div>
                {relTableOptions.length > 0 && (
                  <div className="mt-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-lg max-h-40 overflow-auto">
                    {relTableOptions.map((t) => {
                      const label = `${t.schema_name || "dbo"}.${t.table_name}`;
                      return (
                        <button key={t.id}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-[var(--text-sub)] hover:bg-[var(--bg-input)] cursor-pointer transition-colors"
                          style={{ background: relForm.target_table_id === String(t.id) ? "var(--bg-input)" : "none", border: "none" }}
                          onClick={() => { setRelForm((f) => ({ ...f, target_table_id: String(t.id), target_table_label: label })); setRelTableSearch(label); setRelTableOptions([]); }}>
                          <I d={ico.table} size={12} color="#818cf8" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
                {relForm.target_table_label && (
                  <p className="text-[0.65rem] text-[var(--nav-active)] mt-1">Selected: {relForm.target_table_label}</p>
                )}
              </div>

              {/* Column Mappings */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[var(--text)]">Column Mappings</label>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-4">
                  {relForm.column_mappings.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] text-center italic">No column mappings defined. Add at least one mapping to create the relationship.</p>
                  ) : (
                    <div className="space-y-2">
                      {relForm.column_mappings.map((m, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--nav-active)]"
                            placeholder="Source column"
                            value={m.source_column}
                            onChange={(e) => setRelForm((f) => { const ms = [...f.column_mappings]; ms[i] = { ...ms[i], source_column: e.target.value }; return { ...f, column_mappings: ms }; })} />
                          <span className="text-xs text-[var(--text-muted)] px-1">→</span>
                          <input
                            className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--nav-active)]"
                            placeholder="Target column"
                            value={m.target_column}
                            onChange={(e) => setRelForm((f) => { const ms = [...f.column_mappings]; ms[i] = { ...ms[i], target_column: e.target.value }; return { ...f, column_mappings: ms }; })} />
                          <button className="text-[var(--text-muted)] hover:text-[#f87171] cursor-pointer"
                            style={{ background: "none", border: "none" }}
                            onClick={() => setRelForm((f) => ({ ...f, column_mappings: f.column_mappings.filter((_, j) => j !== i) }))}>
                            <I d={ico.x} size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--nav-active)] cursor-pointer transition-colors"
                    style={{ background: "none", border: "none" }}
                    onClick={() => setRelForm((f) => ({ ...f, column_mappings: [...f.column_mappings, { source_column: "", target_column: "" }] }))}>
                    <I d={ico.plus} size={13} /> {relForm.column_mappings.length === 0 ? "Add First Mapping" : "Add Column Mapping"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="py-2.5 border-b border-[var(--border)] last:border-0">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.07em] text-[var(--text-muted)]">{label}</p>
      <p className="text-sm text-[var(--text)] mt-0.5">{value ?? "-"}</p>
    </div>
  );
}

function Field({ label, value, onChange, readOnly = false }) {
  return (
    <label className="block">
      <p className="text-[0.65rem] text-[var(--text-muted)] mb-1">{label}</p>
      {readOnly ? (
        <div className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)]">{value || "-"}</div>
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none"
        />
      )}
    </label>
  );
}
