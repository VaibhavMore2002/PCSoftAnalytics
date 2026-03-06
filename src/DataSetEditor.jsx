import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

/* ═══════════════════════════════════════════════════════════
   SVG helper
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
  save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  db: "M12 2C6.48 2 3 3.34 3 5v14c0 1.66 3.48 3 9 3s9-1.34 9-3V5c0-1.66-3.48-3-9-3zM3 12c0 1.66 3.48 3 9 3s9-1.34 9-3",
  table: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0H5a2 2 0 01-2-2v-4m6 6h10a2 2 0 002-2v-4M3 9h18M3 15h18",
  search: "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  plus: "M12 5v14M5 12h14",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  chevDown: "M6 9l6 6 6-6",
  chevRight: "M9 18l6-6-6-6",
  folder: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  grip: "M12 5v.01M12 12v.01M12 19v.01M19 5v.01M19 12v.01M19 19v.01M5 5v.01M5 12v.01M5 19v.01",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22",
  col: "M10 3H3v7h7V3zM21 3h-7v7h7V3zM21 14h-7v7h7v-7zM10 14H3v7h7v-7z",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] transition-all duration-150";
const inputCls = "w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150";

const JOIN_TYPES = ["INNER", "LEFT", "RIGHT", "FULL", "CROSS"];
const DOT_COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#fb923c", "#22d3ee", "#f87171"];

const TYPE_COLOR_MAP = {
  INT: "#60a5fa", INTEGER: "#60a5fa", BIGINT: "#60a5fa", SMALLINT: "#60a5fa", TINYINT: "#60a5fa",
  TEXT: "#4ade80", VARCHAR: "#4ade80", CHAR: "#4ade80", STRING: "#4ade80", NVARCHAR: "#4ade80", NCHAR: "#4ade80",
  DATE: "#fbbf24", DATETIME: "#fbbf24", TIMESTAMP: "#fbbf24", DATETIME2: "#fbbf24",
  DECIMAL: "#f472b6", FLOAT: "#f472b6", DOUBLE: "#f472b6", NUMERIC: "#f472b6", MONEY: "#f472b6", REAL: "#f472b6",
  BOOLEAN: "#fb923c", BOOL: "#fb923c", BIT: "#fb923c",
};

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

/* ═══════════════════════════════════════════════════════════
   DataSetEditor — Main Component
   ═══════════════════════════════════════════════════════════ */
export default function DataSetEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const { push, Toast } = useToast();

  /* ── State ── */
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Dataset fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defType, setDefType] = useState("join");
  const [status, setStatus] = useState("draft");
  const [syncMethod, setSyncMethod] = useState("full");
  const [syncFrequency, setSyncFrequency] = useState("manual");
  const [syncEnabled, setSyncEnabled] = useState(false);

  // Definition
  const [canvasTables, setCanvasTables] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [joins, setJoins] = useState([]);

  // Data sources tree
  const [dataSources, setDataSources] = useState([]);
  const [dsLoading, setDsLoading] = useState(true);
  const [expandedSources, setExpandedSources] = useState({});
  const [sourceTables, setSourceTables] = useState({});
  const [sourceSearch, setSourceSearch] = useState("");

  // Config panel
  const [configTab, setConfigTab] = useState("config");
  const [selectedTable, setSelectedTable] = useState(null);

  /* ── Load dataset (edit mode) ── */
  useEffect(() => {
    if (!api || isNew) { setLoading(false); return; }
    api(`/api/v1/datasets/${id}`)
      .then((ds) => {
        setName(ds.name || "");
        setDescription(ds.description || "");
        setDefType(ds.definition_type || "join");
        setStatus(ds.status || "draft");
        setSyncMethod(ds.sync_method || "full");
        setSyncFrequency(ds.sync_frequency || "manual");
        setSyncEnabled(ds.sync_enabled || false);
        setCanvasTables(ds.definition?.sources || ds.definition?.tables || []);
        setSelectedColumns(ds.definition?.columns || []);
        setJoins(ds.definition?.joins || []);
      })
      .catch(() => push("Failed to load dataset", "error"))
      .finally(() => setLoading(false));
  }, [api, id, isNew, push]);

  /* ── Load data sources tree ── */
  useEffect(() => {
    if (!api) return;
    api("/api/v1/data-sources/")
      .then((data) => {
        const list = data?.data_sources || (Array.isArray(data) ? data : []);
        setDataSources(list);
      })
      .catch(() => push("Failed to load data sources", "error"))
      .finally(() => setDsLoading(false));
  }, [api, push]);

  /* ── Load tables for a source ── */
  const loadSourceTables = useCallback(async (sourceId) => {
    if (sourceTables[sourceId]) return;
    try {
      const data = await api(`/api/v1/data-sources/${sourceId}/tables`);
      const tables = Array.isArray(data) ? data : data?.tables || data?.data || [];
      setSourceTables((prev) => ({ ...prev, [sourceId]: tables }));
    } catch {
      push("Failed to load tables", "error");
    }
  }, [api, sourceTables, push]);

  const toggleSource = (sourceId) => {
    setExpandedSources((prev) => {
      const next = { ...prev, [sourceId]: !prev[sourceId] };
      if (next[sourceId]) loadSourceTables(sourceId);
      return next;
    });
  };

  /* ── Add table to canvas ── */
  const addTableToCanvas = (table, sourceId, sourceName) => {
    const already = canvasTables.find(
      (t) => t.sourceId === (table.id || table.table_id) && String(t.dataSourceId) === String(sourceId)
    );
    if (already) { push("Table already added", "error"); return; }

    const newTable = {
      id: `table-${table.id || table.table_id || Date.now()}`,
      name: table.name || table.table_name,
      tableOrder: canvasTables.length,
      position: { x: 100 + canvasTables.length * 220, y: 120 },
      sourceType: "table",
      sourceId: table.id || table.table_id,
      schema: table.schema || "dbo",
      dataSourceId: sourceId,
      dataSource: sourceName,
    };
    setCanvasTables((prev) => [...prev, newTable]);
    push(`Added "${newTable.name}"`);
  };

  /* ── Remove table from canvas ── */
  const removeTable = (tableId) => {
    setCanvasTables((prev) => prev.filter((t) => t.id !== tableId));
    setJoins((prev) => prev.filter((j) => j.from !== tableId && j.to !== tableId));
    setSelectedColumns((prev) => prev.filter((c) => c.tableId !== tableId));
    if (selectedTable === tableId) setSelectedTable(null);
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!name.trim()) { push("Name is required", "error"); return; }
    setSaving(true);

    const definition = {
      type: defType,
      sources: canvasTables,
      tables: canvasTables,
      columns: selectedColumns,
      joins,
    };

    const body = {
      name: name.trim(),
      description: description.trim(),
      definition,
      definition_type: defType,
      status,
      sync_method: syncMethod,
      sync_frequency: syncFrequency,
      sync_enabled: syncEnabled,
    };

    try {
      if (isNew) {
        const created = await api("/api/v1/datasets/", {
          method: "POST",
          body: JSON.stringify(body),
        });
        push("Dataset created");
        navigate(`/datasets/${created.id}`);
      } else {
        await api(`/api/v1/datasets/${id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        push("Dataset saved");
      }
    } catch { push("Save failed", "error"); }
    setSaving(false);
  };

  /* ── Filtered sources ── */
  const filteredSources = dataSources.filter((s) =>
    !sourceSearch || s.name?.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} />
        <div className="flex-1 flex items-center justify-center gap-3">
          <Spin /> <span className="text-sm text-[var(--text-muted)]">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
          <div className="flex items-center gap-2.5">
            <button className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              onClick={() => navigate(isNew ? "/datasets" : `/datasets/${id}`)}>
              <I d={ico.back} size={14} />
            </button>
            <I d={ico.layers} size={16} color="#818cf8" />
            <input
              className="bg-transparent border-none outline-none text-sm font-bold text-[var(--text)] w-56 px-1"
              placeholder="Untitled Dataset"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onChange={setStatus} className="w-28"
              options={[
                { value: "draft", label: "Draft" },
                { value: "active", label: "Active" },
                { value: "archived", label: "Archived" },
              ]} />
            <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: saving ? 0.7 : 1 }}
              disabled={saving} onClick={handleSave}>
              {saving ? <Spin /> : <I d={ico.save} size={14} color="#fff" />} Save
            </button>
          </div>
        </header>

        {/* ── 3 Panel Layout ── */}
        <div className="flex-1 flex overflow-hidden">

          {/* ═══ Left Panel: Data Sources Tree ═══ */}
          <div className="w-64 border-r border-[var(--border)] bg-[var(--bg-card)] flex flex-col shrink-0 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[var(--border)]">
              <p className="text-[0.62rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-2">Data Sources</p>
              <div className="relative">
                <I d={ico.search} size={12} color="var(--text-muted)" className="absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-7 pr-2 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--nav-active)]"
                  placeholder="Search sources…"
                  value={sourceSearch}
                  onChange={(e) => setSourceSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto py-1">
              {dsLoading ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Spin /> <span className="text-xs text-[var(--text-muted)]">Loading…</span>
                </div>
              ) : filteredSources.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] text-center py-8">No data sources</p>
              ) : (
                filteredSources.map((src) => (
                  <SourceNode
                    key={src.id}
                    source={src}
                    expanded={!!expandedSources[src.id]}
                    tables={sourceTables[src.id]}
                    onToggle={() => toggleSource(src.id)}
                    onAddTable={(t) => addTableToCanvas(t, src.id, src.name)}
                  />
                ))
              )}
            </div>
          </div>

          {/* ═══ Center Panel: Canvas ═══ */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <CanvasPanel
              tables={canvasTables}
              setTables={setCanvasTables}
              joins={joins}
              setJoins={setJoins}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              onRemoveTable={removeTable}
            />
          </div>

          {/* ═══ Right Panel: Config ═══ */}
          <div className="w-80 border-l border-[var(--border)] bg-[var(--bg-card)] flex flex-col shrink-0 overflow-hidden">
            <div className="flex border-b border-[var(--border)]">
              {[
                { id: "config", label: "Configuration" },
                { id: "columns", label: `Columns (${selectedColumns.length})` },
              ].map((t) => (
                <button key={t.id}
                  className="flex-1 px-3 py-2.5 text-xs font-semibold cursor-pointer transition-colors"
                  style={{
                    background: configTab === t.id ? "var(--nav-active)" : "transparent",
                    color: configTab === t.id ? "#fff" : "var(--text-muted)",
                    border: "none", borderBottom: configTab === t.id ? "2px solid var(--nav-active)" : "2px solid transparent",
                  }}
                  onClick={() => setConfigTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto p-4">
              {configTab === "config" ? (
                <ConfigPanel
                  name={name} setName={setName}
                  description={description} setDescription={setDescription}
                  defType={defType} setDefType={setDefType}
                  syncMethod={syncMethod} setSyncMethod={setSyncMethod}
                  syncFrequency={syncFrequency} setSyncFrequency={setSyncFrequency}
                  syncEnabled={syncEnabled} setSyncEnabled={setSyncEnabled}
                />
              ) : (
                <ColumnsPanel
                  columns={selectedColumns}
                  setColumns={setSelectedColumns}
                  canvasTables={canvasTables}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Source Tree Node
   ═══════════════════════════════════════════════════════════ */
function SourceNode({ source, expanded, tables, onToggle, onAddTable }) {
  return (
    <div>
      <button
        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer transition-colors hover:bg-[var(--bg-input)]"
        style={{ border: "none", background: "transparent", color: "var(--text)" }}
        onClick={onToggle}>
        <I d={expanded ? ico.chevDown : ico.chevRight} size={10} className="transition-transform" />
        <I d={ico.db} size={13} color="#60a5fa" />
        <span className="truncate font-medium">{source.name}</span>
        <span className="ml-auto text-[0.55rem] text-[var(--text-muted)]">{source.type}</span>
      </button>
      {expanded && (
        <div className="ml-5 border-l border-[var(--border)]">
          {!tables ? (
            <div className="flex items-center gap-2 px-3 py-2">
              <Spin /> <span className="text-[0.6rem] text-[var(--text-muted)]">Loading…</span>
            </div>
          ) : tables.length === 0 ? (
            <p className="text-[0.6rem] text-[var(--text-muted)] px-3 py-2">No tables found</p>
          ) : (
            tables.map((t, i) => {
              const tableName = t.name || t.table_name || `Table ${i + 1}`;
              const schema = t.schema || "";
              return (
                <button key={t.id || t.table_id || i}
                  className="w-full flex items-center gap-2 px-3 py-1 text-[0.68rem] cursor-pointer transition-colors hover:bg-[var(--bg-input)]"
                  style={{ border: "none", background: "transparent", color: "var(--text-sub)" }}
                  onClick={() => onAddTable(t)}
                  title={`Add ${schema ? schema + "." : ""}${tableName}`}>
                  <I d={ico.table} size={11} color="#94a3b8" />
                  <span className="truncate">
                    {schema ? <span className="text-[var(--text-muted)]">{schema}.</span> : null}
                    {tableName}
                  </span>
                  <I d={ico.plus} size={10} color="var(--text-muted)" className="ml-auto opacity-0 group-hover:opacity-100" />
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Canvas Panel (visual table layout)
   ═══════════════════════════════════════════════════════════ */
function CanvasPanel({ tables, setTables, joins, setJoins, selectedTable, setSelectedTable, onRemoveTable }) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [joinMode, setJoinMode] = useState(null); // { from, type }
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, tableId) => {
    if (joinMode) {
      // Complete join
      if (joinMode.from !== tableId) {
        setJoins((prev) => {
          const exists = prev.find(
            (j) => (j.from === joinMode.from && j.to === tableId) || (j.from === tableId && j.to === joinMode.from)
          );
          if (exists) return prev;
          return [...prev, { from: joinMode.from, to: tableId, type: "INNER", onLeft: "", onRight: "" }];
        });
      }
      setJoinMode(null);
      return;
    }
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    setDragOffset({
      x: e.clientX - rect.left - panOffset.x - (table.position?.x || 0),
      y: e.clientY - rect.top - panOffset.y - (table.position?.y || 0),
    });
    setDragging(tableId);
    setSelectedTable(tableId);
  };

  const handleMouseMove = useCallback((e) => {
    if (panning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setTables((prev) =>
      prev.map((t) =>
        t.id === dragging
          ? { ...t, position: { x: e.clientX - rect.left - panOffset.x - dragOffset.x, y: e.clientY - rect.top - panOffset.y - dragOffset.y } }
          : t
      )
    );
  }, [dragging, dragOffset, panOffset, panning, panStart, setTables]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    setPanning(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.closest("[data-canvas-bg]")) {
      setPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      setSelectedTable(null);
      if (joinMode) setJoinMode(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Canvas toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <span className="text-[0.62rem] font-bold tracking-wider uppercase text-[var(--text-muted)]">
          Canvas · {tables.length} table{tables.length !== 1 ? "s" : ""}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button className={`${btnS} !px-2.5 !py-1.5 text-[0.65rem]`}
            style={{ background: joinMode ? "var(--nav-active)" : undefined, color: joinMode ? "#fff" : undefined }}
            onClick={() => setJoinMode(joinMode ? null : { from: null, type: "INNER" })}>
            <I d={ico.link} size={12} /> {joinMode ? "Cancel Join" : "Add Join"}
          </button>
          <button className={`${btnS} !px-2.5 !py-1.5 text-[0.65rem]`}
            onClick={() => setPanOffset({ x: 0, y: 0 })}>
            Reset View
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div ref={canvasRef} className="flex-1 relative overflow-hidden cursor-grab"
        style={{ background: "var(--bg)", backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        onMouseDown={handleCanvasMouseDown}>
        <div data-canvas-bg className="absolute inset-0" style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}>
          {/* Join lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            {joins.map((j, i) => {
              const from = tables.find((t) => t.id === j.from);
              const to = tables.find((t) => t.id === j.to);
              if (!from || !to) return null;
              const fx = (from.position?.x || 0) + 100;
              const fy = (from.position?.y || 0) + 20;
              const tx = (to.position?.x || 0) + 100;
              const ty = (to.position?.y || 0) + 20;
              return (
                <g key={i}>
                  <line x1={fx} y1={fy} x2={tx} y2={ty}
                    stroke="var(--nav-active)" strokeWidth="2" strokeDasharray="6,3" opacity="0.6" />
                  <text x={(fx + tx) / 2} y={(fy + ty) / 2 - 8}
                    fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontWeight="bold">
                    {j.type}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Table nodes */}
          {tables.map((t, i) => (
            <TableNode
              key={t.id}
              table={t}
              index={i}
              selected={selectedTable === t.id}
              joinMode={joinMode}
              onMouseDown={(e) => handleMouseDown(e, t.id)}
              onRemove={() => onRemoveTable(t.id)}
              onStartJoin={() => setJoinMode({ from: t.id, type: "INNER" })}
            />
          ))}

          {tables.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <I d={ico.layers} size={40} color="var(--text-muted)" className="mx-auto mb-3 opacity-30" />
                <p className="text-sm text-[var(--text-muted)]">Drag tables from the left panel</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Click a data source to expand and add tables</p>
              </div>
            </div>
          )}
        </div>

        {/* Join mode indicator */}
        {joinMode?.from && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "var(--nav-active)", color: "#fff", animation: "fadeUp .15s ease" }}>
            Click another table to complete the join
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Table Node on Canvas ── */
function TableNode({ table, index, selected, joinMode, onMouseDown, onRemove, onStartJoin }) {
  const color = DOT_COLORS[index % DOT_COLORS.length];
  return (
    <div
      className="absolute select-none"
      style={{ left: table.position?.x || 0, top: table.position?.y || 0 }}
      onMouseDown={onMouseDown}>
      <div className="w-[200px] rounded-xl border bg-[var(--bg-card)] shadow-lg transition-shadow"
        style={{
          borderColor: selected ? "var(--nav-active)" : joinMode ? `${color}60` : "var(--border)",
          boxShadow: selected ? "0 0 0 2px var(--nav-active)" : "0 2px 8px rgba(0,0,0,.08)",
          cursor: joinMode?.from ? "pointer" : "grab",
        }}>
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-t-xl"
          style={{ background: `${color}15`, borderBottom: `1px solid ${color}30` }}>
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
          <span className="text-xs font-bold truncate flex-1">{table.name}</span>
          <button className="w-5 h-5 rounded flex items-center justify-center cursor-pointer hover:bg-[rgba(0,0,0,.1)] transition-colors"
            style={{ border: "none", background: "transparent" }}
            onClick={(e) => { e.stopPropagation(); onStartJoin(); }}
            title="Create join">
            <I d={ico.link} size={10} color={color} />
          </button>
          <button className="w-5 h-5 rounded flex items-center justify-center cursor-pointer hover:bg-[rgba(239,68,68,.15)] transition-colors"
            style={{ border: "none", background: "transparent" }}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            title="Remove">
            <I d={ico.x} size={10} color="#f87171" />
          </button>
        </div>
        {/* Body */}
        <div className="px-3 py-2 space-y-0.5">
          <p className="text-[0.6rem] text-[var(--text-muted)]">
            {table.schema && `${table.schema}.`}{table.name}
          </p>
          <p className="text-[0.55rem] text-[var(--text-muted)]">
            Source: {table.dataSource || "Unknown"} · #{table.tableOrder}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Config Panel (right side)
   ═══════════════════════════════════════════════════════════ */
function ConfigPanel({ name, setName, description, setDescription, defType, setDefType, syncMethod, setSyncMethod, syncFrequency, setSyncFrequency, syncEnabled, setSyncEnabled }) {
  return (
    <div className="space-y-5">
      <section>
        <h3 className="text-[0.62rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3">Dataset Info</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Name</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Dataset name" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Description</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this dataset…" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Definition Type</label>
            <Select value={defType} onChange={setDefType}
              options={[
                { value: "join", label: "Join" },
                { value: "union", label: "Union" },
                { value: "sql", label: "SQL" },
              ]} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-[0.62rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3">Sync Configuration</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Sync Method</label>
            <Select value={syncMethod} onChange={setSyncMethod}
              options={[
                { value: "full", label: "Full Sync" },
                { value: "incremental", label: "Incremental" },
              ]} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Frequency</label>
            <Select value={syncFrequency} onChange={setSyncFrequency}
              options={[
                { value: "manual", label: "Manual" },
                { value: "minute", label: "Every Minute" },
                { value: "hourly", label: "Hourly" },
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ]} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border)]">
            <span className="text-xs font-medium">Sync Enabled</span>
            <button onClick={() => setSyncEnabled(!syncEnabled)}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer"
              style={{ background: syncEnabled ? "var(--nav-active)" : "var(--border)" }}>
              <span className={`${syncEnabled ? "translate-x-4.5" : "translate-x-0.5"} inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform`} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Columns Panel (right side)
   ═══════════════════════════════════════════════════════════ */
function ColumnsPanel({ columns, setColumns, canvasTables }) {
  const toggleVisibility = (idx) => {
    setColumns((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, visible: !c.visible } : c))
    );
  };

  const moveColumn = (idx, dir) => {
    setColumns((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((c, i) => ({ ...c, columnOrder: i, order: i }));
    });
  };

  const removeColumn = (idx) => {
    setColumns((prev) => prev.filter((_, i) => i !== idx));
  };

  if (!columns.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <I d={ico.col} size={28} color="var(--text-muted)" className="mb-3 opacity-40" />
        <p className="text-xs text-[var(--text-muted)]">No columns selected</p>
        <p className="text-[0.6rem] text-[var(--text-muted)] mt-1">Columns will appear here when tables are configured</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {columns.map((col, i) => {
        const dt = (col.dataType || "").toUpperCase();
        const dtColor = TYPE_COLOR_MAP[dt] || "#94a3b8";
        return (
          <div key={col.id || i}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-input)] transition-colors group">
            <span className="text-[0.55rem] text-[var(--text-muted)] w-4 text-center">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{col.displayName || col.name}</p>
              <p className="text-[0.55rem] text-[var(--text-muted)]">
                <span style={{ color: dtColor }}>{col.dataType || "?"}</span>
                {col.tableId && ` · ${col.tableId}`}
              </p>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-5 h-5 rounded flex items-center justify-center cursor-pointer"
                style={{ border: "none", background: "transparent" }}
                onClick={() => toggleVisibility(i)} title="Toggle visibility">
                <I d={col.visible !== false ? ico.eye : ico.eyeOff} size={10} color={col.visible !== false ? "#4ade80" : "#94a3b8"} />
              </button>
              <button className="w-5 h-5 rounded flex items-center justify-center cursor-pointer"
                style={{ border: "none", background: "transparent" }}
                onClick={() => moveColumn(i, -1)} title="Move up" disabled={i === 0}>
                <I d="M18 15l-6-6-6 6" size={10} />
              </button>
              <button className="w-5 h-5 rounded flex items-center justify-center cursor-pointer"
                style={{ border: "none", background: "transparent" }}
                onClick={() => moveColumn(i, 1)} title="Move down" disabled={i === columns.length - 1}>
                <I d={ico.chevDown} size={10} />
              </button>
              <button className="w-5 h-5 rounded flex items-center justify-center cursor-pointer hover:text-[#f87171]"
                style={{ border: "none", background: "transparent" }}
                onClick={() => removeColumn(i)} title="Remove">
                <I d={ico.x} size={10} color="#f87171" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
