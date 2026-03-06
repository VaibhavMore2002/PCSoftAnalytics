import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";
import { useApp } from "./AppContext.jsx";

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */
const JOIN_TYPES = ["INNER", "LEFT", "RIGHT", "FULL", "CROSS"];

const DOT_COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#fb923c"];

const TYPE_COLORS = {
  INT: "#60a5fa", INTEGER: "#60a5fa", BIGINT: "#60a5fa", SMALLINT: "#60a5fa",
  TEXT: "#4ade80", VARCHAR: "#4ade80", CHAR: "#4ade80", STRING: "#4ade80",
  DATE: "#fbbf24", DATETIME: "#fbbf24", TIMESTAMP: "#fbbf24",
  DECIMAL: "#f472b6", FLOAT: "#f472b6", DOUBLE: "#f472b6", NUMERIC: "#f472b6",
  JSON: "#a78bfa", JSONB: "#a78bfa",
  BOOLEAN: "#fb923c", BOOL: "#fb923c",
};

const navItems = [
  { label: "Home", icon: "home" },
  { label: "Data Sources", icon: "db" },
  { label: "Data Sets", icon: "layers" },
  { label: "Reports", icon: "report" },
  { label: "Dashboards", icon: "dash" },
  { label: "Analytics Expert", icon: "ai", aiBadge: true },
  { label: "Questions", icon: "question" },
];

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */
function findTableByNameInList(name, tableList) {
  const lower = name.toLowerCase().trim();
  return tableList.find((t) => t.name.toLowerCase() === lower) || null;
}

function generateSQL(canvasTables, joins, options) {
  if (canvasTables.length === 0) return "";
  const first = canvasTables[0];
  let selectCols = `${first.name}.*`;
  let sql = `SELECT\n  ${options.distinct ? "DISTINCT " : ""}${selectCols}\nFROM ${first.name}`;
  for (const j of joins) {
    const fromT = canvasTables.find((t) => t.id === j.from);
    const toT = canvasTables.find((t) => t.id === j.to);
    if (!fromT || !toT) continue;
    sql += `\n${j.type} JOIN ${toT.name}`;
    if (j.onLeft && j.onRight) {
      sql += `\n  ON ${fromT.name}.${j.onLeft} = ${toT.name}.${j.onRight}`;
    }
  }
  if (options.limit) sql += `\nLIMIT ${options.limit};`;
  else sql += ";";
  return sql;
}

/** Very basic SQL parser → tables + joins */
function parseSQL(sql, allTables) {
  const errors = [];
  const tables = [];
  const joins = [];
  if (!sql.trim()) return { tables: [], joins: [], errors: [] };
  try {
    const clean = sql.replace(/;/g, "").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    // match FROM <table>
    const fromMatch = clean.match(/FROM\s+(\w+)/i);
    if (!fromMatch) { errors.push("Missing FROM clause"); return { tables, joins, errors }; }
    const firstTable = findTableByNameInList(fromMatch[1], allTables);
    if (!firstTable) { errors.push(`Unknown table: "${fromMatch[1]}"`); return { tables, joins, errors }; }
    tables.push(firstTable.name);

    // match JOINs
    const joinRe = /(INNER|LEFT|RIGHT|FULL|CROSS)\s+JOIN\s+(\w+)(?:\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+))?/gi;
    let m;
    while ((m = joinRe.exec(clean)) !== null) {
      const joinType = m[1].toUpperCase();
      const tableName = m[2];
      const found = findTableByNameInList(tableName, allTables);
      if (!found) { errors.push(`Unknown table: "${tableName}"`); continue; }
      tables.push(found.name);
      const onLeft = m[4] || "";
      const onRight = m[6] || "";
      if (m[3] && m[5]) {
        const leftTable = findTableByNameInList(m[3], allTables);
        const rightTable = findTableByNameInList(m[5], allTables);
        if (leftTable && !leftTable.cols.find((c) => c.name === onLeft)) {
          errors.push(`Column "${onLeft}" not found in "${m[3]}"`);
        }
        if (rightTable && !rightTable.cols.find((c) => c.name === onRight)) {
          errors.push(`Column "${onRight}" not found in "${m[5]}"`);
        }
      }
      joins.push({ type: joinType, table: found.name, onLeft, onRight, fromTable: m[3] || tables[0], toTable: m[5] || found.name });
    }

    if (!/SELECT/i.test(clean)) errors.push("Missing SELECT clause");
    const known = /^SELECT\s+.+\s+FROM\s+/i;
    if (!known.test(clean)) errors.push("Possible syntax error near SELECT/FROM");

  } catch (e) {
    errors.push("Parse error: " + e.message);
  }
  return { tables, joins, errors };
}

function uid() { return Math.random().toString(36).slice(2, 9); }

/* ═══════════════════════════════════════════════════════════
   Chart helpers
   ═══════════════════════════════════════════════════════════ */
function TblDonut({ segments, size = 100, thickness = 18, label, sublabel }) {
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offsetAcc = 0;
  const arcs = segments.map((seg) => {
    const pct = total > 0 ? seg.value / total : 0;
    const dash = pct * circ;
    const arc = { ...seg, dash, gap: circ - dash, offset: offsetAcc * circ };
    offsetAcc += pct;
    return arc;
  });
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {total === 0
          ? <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={thickness} />
          : arcs.map((arc, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={arc.color} strokeWidth={thickness}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="round"
            />
          ))
        }
      </svg>
      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[1.2rem] font-bold leading-none text-[var(--text)]">{label}</span>
        {sublabel && <span className="text-[0.57rem] text-[var(--text-muted)] mt-[2px]">{sublabel}</span>}
      </div>
    </div>
  );
}

function TblHBar({ items }) {
  const max = Math.max(...items.map((x) => x.value), 1);
  return (
    <div className="flex flex-col gap-[7px]">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="text-[0.63rem] text-[var(--text)] truncate" style={{ minWidth: 80, maxWidth: 80 }}>{item.label}</div>
          <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.round((item.value / max) * 100)}%`, background: item.color || "var(--nav-active)" }} />
          </div>
          <div className="text-[0.63rem] font-semibold text-[var(--text-muted)]" style={{ minWidth: 24, textAlign: "right" }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Table Analytics Modal ─────────────────────────────── */
function TableAnalyticsModal({ tableInfo, columns, loading, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const TYPE_FAMILIES = {
    Number: ["INT","INTEGER","BIGINT","SMALLINT","DECIMAL","FLOAT","DOUBLE","NUMERIC","SERIAL","MONEY"],
    Text:   ["TEXT","VARCHAR","CHAR","STRING","NVARCHAR","CLOB"],
    Date:   ["DATE","DATETIME","TIMESTAMP","TIME","INTERVAL"],
    JSON:   ["JSON","JSONB","ARRAY"],
    Bool:   ["BOOLEAN","BOOL","BIT"],
  };
  const FAMILY_COLORS = { Number: "#60a5fa", Text: "#4ade80", Date: "#fbbf24", JSON: "#a78bfa", Bool: "#fb923c", Other: "#94a3b8" };
  const PALETTE = ["#7c3aed","#3b82f6","#4ade80","#f59e0b","#f43f5e","#a78bfa","#fb923c","#06b6d4"];

  const familyCounts = {};
  columns.forEach((c) => {
    const t = (c.type || "").toUpperCase();
    let fam = "Other";
    for (const [name, types] of Object.entries(TYPE_FAMILIES)) {
      if (types.includes(t)) { fam = name; break; }
    }
    familyCounts[fam] = (familyCounts[fam] || 0) + 1;
  });

  const donutSegs = Object.entries(familyCounts).map(([f, n]) => ({ label: f, value: n, color: FAMILY_COLORS[f] }));

  const typeCounts = {};
  columns.forEach((c) => { const t = (c.type || "UNKNOWN").toUpperCase(); typeCounts[t] = (typeCounts[t] || 0) + 1; });
  const typeBarItems = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([t, n], i) => ({ label: t, value: n, color: TYPE_COLORS[t] || PALETTE[i % PALETTE.length] }));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto py-10 px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div ref={ref}
        className="w-full max-w-[820px] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 24px 80px rgba(0,0,0,0.45)" }}>

        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-center w-[44px] h-[44px] rounded-[12px] shrink-0"
            style={{ background: "var(--nav-active-bg)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[0.59rem] font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)]">
              {tableInfo.sourceName} · <span className="text-[var(--nav-active)]">{tableInfo.schema}</span> · Table Analytics
            </div>
            <div className="text-[1.1rem] font-bold text-[var(--text)] truncate">{tableInfo.name}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[0.63rem] font-bold px-[10px] py-[4px] rounded-full tracking-[0.06em] uppercase"
              style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa" }}>
              {tableInfo.dbType}
            </span>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-[8px] cursor-pointer transition-colors hover:bg-[var(--bg-input)]"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-5 divide-x divide-[var(--border)]" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-input)" }}>
          {[
            { label: "Total Columns", val: columns.length },
            { label: "Numeric",       val: familyCounts["Number"] ?? 0 },
            { label: "Text",          val: familyCounts["Text"] ?? 0 },
            { label: "Date / Time",   val: familyCounts["Date"] ?? 0 },
            { label: "Other",         val: (familyCounts["JSON"] ?? 0) + (familyCounts["Bool"] ?? 0) + (familyCounts["Other"] ?? 0) },
          ].map(({ label, val }) => (
            <div key={label} className="flex flex-col items-center justify-center py-3 gap-[2px]">
              <span className="text-[1.1rem] font-bold text-[var(--text)]">{loading ? "…" : val}</span>
              <span className="text-[0.57rem] font-medium tracking-[0.06em] uppercase text-[var(--text-muted)]">{label}</span>
            </div>
          ))}
        </div>

        <div className="p-6 flex flex-col gap-5 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 opacity-60">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--nav-active)" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-[0.78rem] text-[var(--text-muted)]">Loading columns…</span>
            </div>
          ) : columns.length === 0 ? (
            <div className="text-center py-12 text-[0.78rem] text-[var(--text-muted)] opacity-60">No column data available</div>
          ) : (
            <>
              {/* Charts row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Donut: type families */}
                <div className="rounded-xl p-4 flex flex-col" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <div className="text-[0.59rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3">Column Type Families</div>
                  <div className="flex items-center gap-4">
                    <TblDonut segments={donutSegs.length ? donutSegs : [{ value: 1, color: "var(--border)" }]}
                      size={100} thickness={18} label={columns.length} sublabel="cols" />
                    <div className="flex flex-col gap-[7px]">
                      {donutSegs.map((s) => (
                        <div key={s.label} className="flex items-center gap-2">
                          <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: s.color }} />
                          <span className="text-[0.65rem] text-[var(--text)]">{s.label}</span>
                          <span className="text-[0.65rem] font-bold ml-auto pl-3 text-[var(--text)]">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bar: raw data types */}
                <div className="rounded-xl p-4" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <div className="text-[0.59rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3">Columns by Data Type</div>
                  <TblHBar items={typeBarItems} />
                </div>
              </div>

              {/* Full column list */}
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <div className="text-[0.59rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-input)" }}>
                  <span>All Columns</span>
                  <span className="text-[var(--nav-active)]">{columns.length}</span>
                </div>
                <div className="divide-y divide-[var(--divider)] max-h-[300px] overflow-auto">
                  {columns.map((col, i) => {
                    const tc = TYPE_COLORS[(col.type || "").toUpperCase()] || "#94a3b8";
                    return (
                      <div key={i} className="flex items-center gap-3 px-4 py-[7px]"
                        style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                        <span className="text-[0.58rem] font-semibold w-6 text-right shrink-0 text-[var(--text-muted)]">{i + 1}</span>
                        <div className="text-[0.50rem] font-bold px-[5px] py-[2px] rounded-[4px] shrink-0"
                          style={{ background: `${tc}18`, color: tc, border: `1px solid ${tc}30` }}>
                          {col.type || "?"}
                        </div>
                        <span className="text-[0.73rem] font-medium text-[var(--text)] flex-1 truncate">{col.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════ */
export default function DataSourcesPage() {
  const { isDark } = useTheme();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const [search, setSearch] = useState("");
  const [expandedDb, setExpandedDb] = useState(null);

  // API-driven data sources
  const [dataSources, setDataSources] = useState([]);
  const [tablesBySource, setTablesBySource] = useState({}); // sourceId → table[]
  const [columnsByTable, setColumnsByTable] = useState({}); // `${sourceId}-${schema}-${tbl}` → col[]
  const [dsLoading, setDsLoading] = useState(true);

  // Fetch data sources on mount
  useEffect(() => {
    let cancelled = false;
    setDsLoading(true);
    api("/api/v1/data-sources/", {}, { limit: 100 })
      .then((data) => {
        if (cancelled) return;
        const list = data?.data_sources || data?.items || (Array.isArray(data) ? data : []);
        setDataSources(list);
        if (list.length > 0) setExpandedDb(list[0].id);
      })
      .catch(() => { /* ignore – show empty state */ })
      .finally(() => { if (!cancelled) setDsLoading(false); });
    return () => { cancelled = true; };
  }, [api]);

  // Fetch tables when a data source is expanded
  useEffect(() => {
    if (!expandedDb || tablesBySource[expandedDb] !== undefined) return;
    let cancelled = false;
    api(`/api/v1/data-sources/${expandedDb}/tables`)
      .then((tables) => {
        if (cancelled) return;
        const normalized = (Array.isArray(tables) ? tables : []).map((t) => ({
          name: t.table_name,
          schema: t.schema_name || "public",
          cols: [], // lazy-loaded
          _raw: t,
        }));
        setTablesBySource((prev) => ({ ...prev, [expandedDb]: normalized }));
      })
      .catch(() => {
        if (!cancelled) setTablesBySource((prev) => ({ ...prev, [expandedDb]: [] }));
      });
    return () => { cancelled = true; };
  }, [expandedDb, api, tablesBySource]);

  // Canvas tables (tables currently placed on the visual canvas)
  const [canvasTables, setCanvasTables] = useState([]);

  // All flat tables from loaded sources (for SQL parsing)
  const allCanvasTables = useMemo(() => {
    return Object.values(tablesBySource).flat();
  }, [tablesBySource]);
  const [joins, setJoins] = useState([]);
  const [draggingTable, setDraggingTable] = useState(null);
  const [dragOverCanvas, setDragOverCanvas] = useState(false);

  // Connection drawing
  const [connecting, setConnecting] = useState(null); // { tableId, col, portEl }
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Right panel
  const [activeTab, setActiveTab] = useState("SQL");
  const [sqlText, setSqlText] = useState("");
  const [sqlErrors, setSqlErrors] = useState([]);
  const [options, setOptions] = useState({ limit: 100, offset: 0, distinct: true, explain: false });
  const [editingSQL, setEditingSQL] = useState(false);

  // Canvas refs
  const canvasRef = useRef(null);
  const tableRefs = useRef({});
  const portRefs = useRef({});

  // Dragging tables on canvas
  const [dragState, setDragState] = useState(null);

  // Zoom
  const [zoom, setZoom] = useState(100);

  // Table analytics modal
  const [selectedTableInfo, setSelectedTableInfo] = useState(null); // { name, schema, sourceId, sourceName, dbType }
  const [tableAnalyticsColumns, setTableAnalyticsColumns] = useState([]);
  const [tableAnalyticsLoading, setTableAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (!selectedTableInfo) return;
    const { sourceId, schema, name } = selectedTableInfo;
    const cacheKey = `${sourceId}-${schema}-${name}`;
    if (columnsByTable[cacheKey]) {
      setTableAnalyticsColumns(columnsByTable[cacheKey]);
      setTableAnalyticsLoading(false);
      return;
    }
    setTableAnalyticsColumns([]);
    setTableAnalyticsLoading(true);
    let cancelled = false;
    api(`/api/v1/data-sources/${sourceId}/tables/${schema}/${name}/columns`)
      .then((cols) => {
        if (cancelled) return;
        const normalized = (Array.isArray(cols) ? cols : []).map((c) => ({
          name: c.column_name,
          type: (c.data_type || "TEXT").toUpperCase(),
        }));
        setColumnsByTable((prev) => ({ ...prev, [cacheKey]: normalized }));
        setTableAnalyticsColumns(normalized);
      })
      .catch(() => { if (!cancelled) setTableAnalyticsColumns([]); })
      .finally(() => { if (!cancelled) setTableAnalyticsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedTableInfo, api]); // eslint-disable-line react-hooks/exhaustive-deps

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  /* ── Generate SQL from canvas ─────────────────────── */
  const regenerateSQL = useCallback(() => {
    if (!editingSQL) {
      const sql = generateSQL(canvasTables, joins, options);
      setSqlText(sql);
      setSqlErrors([]);
    }
  }, [canvasTables, joins, options, editingSQL]);

  useEffect(() => { regenerateSQL(); }, [regenerateSQL]);

  /* ── Parse SQL → update canvas (vice versa) ─────── */
  const applySQL = useCallback(() => {
    const { tables, joins: parsedJoins, errors } = parseSQL(sqlText, allCanvasTables);
    setSqlErrors(errors);
    if (errors.length > 0 && tables.length === 0) return;
    // Build canvas tables
    const newTables = [];
    const baseX = 80;
    const gapX = 280;
    const gapY = 200;
    tables.forEach((tName, i) => {
      const existing = canvasTables.find((ct) => ct.name === tName);
      const meta = findTableByNameInList(tName, allCanvasTables);
      if (!meta) return;
      newTables.push({
        id: existing?.id || uid(),
        name: meta.name,
        cols: meta.cols,
        dbName: meta.dbName || "",
        x: existing?.x ?? baseX + (i % 2) * gapX,
        y: existing?.y ?? 60 + Math.floor(i / 2) * gapY,
      });
    });
    // Build joins
    const newJoins = [];
    parsedJoins.forEach((pj) => {
      const fromT = newTables.find((t) => t.name.toLowerCase() === pj.fromTable?.toLowerCase() || t.name === tables[0]);
      const toT = newTables.find((t) => t.name.toLowerCase() === pj.table.toLowerCase());
      if (fromT && toT) {
        newJoins.push({
          id: uid(),
          from: fromT.id,
          to: toT.id,
          type: pj.type,
          onLeft: pj.onLeft,
          onRight: pj.onRight,
        });
      }
    });
    setCanvasTables(newTables);
    setJoins(newJoins);
    setEditingSQL(false);
  }, [sqlText, canvasTables]);

  /* ── Sidebar drag handlers ──────────────────────── */
  const handleDragStartSidebar = (e, tableMeta) => {
    setDraggingTable(tableMeta);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", tableMeta.name);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setDragOverCanvas(false);
    if (!draggingTable) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100) - 80;
    const y = (e.clientY - rect.top) / (zoom / 100) - 20;
    // Don't duplicate
    if (canvasTables.find((t) => t.name === draggingTable.name)) {
      setDraggingTable(null);
      return;
    }
    const tableId = uid();
    // Add to canvas immediately with empty cols (will be filled when fetched)
    setCanvasTables((prev) => [
      ...prev,
      { id: tableId, name: draggingTable.name, cols: draggingTable.cols || [], dbName: draggingTable.dbName || "", x, y },
    ]);
    // Fetch columns if not cached
    if (draggingTable.cols && draggingTable.cols.length === 0 && draggingTable.sourceId) {
      const cacheKey = `${draggingTable.sourceId}-${draggingTable.schema}-${draggingTable.name}`;
      if (!columnsByTable[cacheKey]) {
        api(`/api/v1/data-sources/${draggingTable.sourceId}/tables/${draggingTable.schema}/${draggingTable.name}/columns`)
          .then((cols) => {
            const normalized = (Array.isArray(cols) ? cols : []).map((c) => ({
              name: c.column_name,
              type: (c.data_type || "TEXT").toUpperCase(),
            }));
            setColumnsByTable((prev) => ({ ...prev, [cacheKey]: normalized }));
            setCanvasTables((prev) =>
              prev.map((t) => t.id === tableId ? { ...t, cols: normalized } : t)
            );
            setTablesBySource((prev) => {
              const src = prev[draggingTable.sourceId];
              if (!src) return prev;
              return {
                ...prev,
                [draggingTable.sourceId]: src.map((t) =>
                  t.name === draggingTable.name ? { ...t, cols: normalized } : t
                ),
              };
            });
          })
          .catch(() => {/* silently fail – show table without cols */});
      }
    }
    setDraggingTable(null);
    setEditingSQL(false);
  };

  /* ── Move tables on canvas ──────────────────────── */
  const handleTableMouseDown = (e, tableId) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const tbl = canvasTables.find((t) => t.id === tableId);
    if (!tbl) return;
    setDragState({ id: tableId, startX: e.clientX, startY: e.clientY, origX: tbl.x, origY: tbl.y });
  };

  useEffect(() => {
    if (!dragState) return;
    const handleMove = (e) => {
      const dx = (e.clientX - dragState.startX) / (zoom / 100);
      const dy = (e.clientY - dragState.startY) / (zoom / 100);
      setCanvasTables((prev) =>
        prev.map((t) =>
          t.id === dragState.id ? { ...t, x: dragState.origX + dx, y: dragState.origY + dy } : t
        )
      );
    };
    const handleUp = () => setDragState(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [dragState, zoom]);

  /* ── Connection drawing ──────────────────────────── */
  const startConnect = (tableId, colName, side, e) => {
    e.stopPropagation();
    setConnecting({ tableId, col: colName, side });
  };

  useEffect(() => {
    if (!connecting) return;
    const handleMove = (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({ x: (e.clientX - rect.left) / (zoom / 100), y: (e.clientY - rect.top) / (zoom / 100) });
    };
    const handleUp = () => setConnecting(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [connecting, zoom]);

  const handlePortDrop = (tableId, colName) => {
    if (!connecting || connecting.tableId === tableId) return;
    // Create a join
    setJoins((prev) => [
      ...prev,
      {
        id: uid(),
        from: connecting.tableId,
        to: tableId,
        type: "INNER",
        onLeft: connecting.col,
        onRight: colName,
      },
    ]);
    setConnecting(null);
    setEditingSQL(false);
  };

  /* ── Remove table/join ────────────────────────────── */
  const removeTable = (tableId) => {
    setCanvasTables((prev) => prev.filter((t) => t.id !== tableId));
    setJoins((prev) => prev.filter((j) => j.from !== tableId && j.to !== tableId));
    setEditingSQL(false);
  };

  const removeJoin = (joinId) => {
    setJoins((prev) => prev.filter((j) => j.id !== joinId));
    setEditingSQL(false);
  };

  const changeJoinType = (joinId, newType) => {
    setJoins((prev) => prev.map((j) => j.id === joinId ? { ...j, type: newType } : j));
    setEditingSQL(false);
  };

  /* ── Get port positions for SVG lines ──────────── */
  const getPortPos = useCallback((tableId, colName, side) => {
    const key = `${tableId}-${colName}-${side}`;
    const el = portRefs.current[key];
    const canvas = canvasRef.current;
    if (!el || !canvas) return null;
    const cr = canvas.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return {
      x: (side === "right" ? er.right : er.left) - cr.left,
      y: er.top + er.height / 2 - cr.top,
    };
  }, []);

  /* ── Filtered sidebar tables ───────────────────── */
  const filteredDBs = useMemo(() => {
    const dbList = dataSources.map((src, idx) => ({
      id: src.id,
      name: src.name,
      type: src.database_type || src.type || src.connection_type || "Database",
      tables: tablesBySource[src.id] || [],
      dotColor: DOT_COLORS[idx % DOT_COLORS.length],
    }));
    if (!search) return dbList;
    const q = search.toLowerCase();
    return dbList
      .map((db) => ({
        ...db,
        tables: db.tables.filter(
          (t) => t.name.toLowerCase().includes(q) || t.cols.some((c) => c.name.toLowerCase().includes(q))
        ),
      }))
      .filter((db) => db.tables.length > 0 || db.name.toLowerCase().includes(q));
  }, [dataSources, tablesBySource, search]);

  /* ── Joins panel data ──────────────────────────── */
  const joinsData = joins.map((j) => {
    const from = canvasTables.find((t) => t.id === j.from);
    const to = canvasTables.find((t) => t.id === j.to);
    return { ...j, fromName: from?.name, toName: to?.name };
  });

  /* ── Force re-render for lines ───────────────────── */
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => forceUpdate((n) => n + 1), 50);
    return () => clearTimeout(timer);
  }, [canvasTables, joins, zoom]);

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-[var(--bg)] text-[var(--text)] font-sans">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ═══ Top Bar ═══════════════════════════════════ */}
        <div className="flex items-center justify-between px-5 py-2 shrink-0 gap-3 border-b border-b-[var(--border)] bg-[var(--topbar-bg)] transition-colors duration-300">
          {/* Left: Logo + breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[1rem] font-extrabold tracking-[-0.01em]" style={{ color: "var(--nav-active)" }}>Query</span>
              <span className="text-[1rem] font-extrabold tracking-[-0.01em]" style={{ color: "var(--accent1)" }}>Forge</span>
            </div>
            <span className="text-[0.68rem] text-[var(--text-muted)]">/</span>
            <span className="text-[0.72rem] text-[var(--text-muted)]">queries</span>
            <span className="text-[0.68rem] text-[var(--text-muted)]">/</span>
            <span className="text-[0.72rem] text-[var(--text)]">new-query</span>
          </div>

          {/* Center: Builder/Schema/History tabs */}
          <div className="flex items-center gap-0 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-input)]">
            {["Builder", "Schema", "History"].map((tab) => (
              <button
                key={tab}
                className="text-[0.72rem] font-semibold px-4 py-[6px] cursor-pointer border-none transition-all duration-150"
                style={{
                  background: tab === "Builder" ? "var(--nav-active-bg)" : "transparent",
                  color: tab === "Builder" ? "#fff" : "var(--text-muted)",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            {[
              { label: "Undo", icon: "↩" },
              { label: "Export", icon: "↓" },
            ].map((b) => (
              <button
                key={b.label}
                className="text-[0.70rem] font-medium px-3 py-[5px] rounded-[7px] cursor-pointer border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-muted)] hover:border-[var(--border-active)] transition-colors"
              >
                {b.icon} {b.label}
              </button>
            ))}
            <button
              className="text-[0.72rem] font-bold px-4 py-[5px] rounded-[7px] cursor-pointer border-none text-white [box-shadow:0_2px_8px_rgba(var(--nav-active-rgb,124,58,237),0.30)]"
              style={{ background: "var(--nav-active-bg)" }}
            >
              💾 Save
            </button>
            <button
              className="text-[0.72rem] font-bold px-4 py-[5px] rounded-[7px] cursor-pointer border-none text-white [box-shadow:0_2px_10px_rgba(124,58,237,0.35)]"
              style={{ background: "var(--nav-active-bg)" }}
            >
              ▶ Run
            </button>
          </div>
        </div>

        {/* ═══ Body: 3-column layout ═══════════════════ */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* ─── Left: Data Sources Panel ────────────── */}
          <div
            className="w-[220px] min-w-[220px] flex flex-col border-r border-r-[var(--border)] overflow-hidden shrink-0 transition-colors"
            style={{ background: isDark ? "rgba(255,255,255,0.015)" : "var(--bg-card)" }}
          >
            <div className="px-3 pt-3 pb-2 shrink-0">
              <div className="text-[0.56rem] font-bold tracking-[0.11em] uppercase text-[var(--text-muted)] mb-2">
                Data Sources
              </div>
              <div className="flex items-center gap-1.5 rounded-[8px] px-2.5 py-[5px] bg-[var(--bg-input)] border border-[var(--border)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tables..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-[0.72rem] w-full bg-transparent outline-none text-[var(--text)] caret-[var(--nav-active)]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-3 qf-scrollbar">
              {dsLoading ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--nav-active)" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span className="text-[0.68rem] text-[var(--text-muted)]">Loading…</span>
                </div>
              ) : filteredDBs.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-[0.68rem] text-[var(--text-muted)]">No data sources</span>
                </div>
              ) : filteredDBs.map((db) => {
                const isExpanded = expandedDb === db.id;
                const tablesLoading = !tablesBySource[db.id];
                return (
                  <div key={db.id} className="mb-0.5">
                    <div
                      className="flex items-center gap-2 px-2 py-[6px] rounded-[7px] cursor-pointer transition-all duration-150 hover:bg-[var(--bg-hover)]"
                      onClick={() => setExpandedDb(isExpanded ? null : db.id)}
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: db.dotColor }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.74rem] font-semibold text-[var(--text)] truncate">{db.name}</div>
                        <div className="text-[0.58rem] text-[var(--text-muted)]">{db.type}</div>
                      </div>
                      <svg
                        width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"
                        style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s ease" }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>

                    {isExpanded && (
                      <div className="ml-4 border-l border-l-[var(--border)] pl-2 py-0.5 space-y-0.5">
                        {tablesLoading ? (
                          <div className="flex items-center gap-1.5 py-2 px-2">
                            <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            <span className="text-[0.64rem] text-[var(--text-muted)]">Loading tables…</span>
                          </div>
                        ) : db.tables.length === 0 ? (
                          <div className="py-2 px-2">
                            <span className="text-[0.64rem] text-[var(--text-muted)]">No tables found</span>
                          </div>
                        ) : db.tables.map((t) => {
                          const meta = { ...t, dbId: db.id, sourceId: db.id, dbName: db.name, dbType: db.type };
                          const onCanvas = canvasTables.some((ct) => ct.name === t.name);
                          const isSelected = selectedTableInfo?.name === t.name && selectedTableInfo?.sourceId === db.id;
                          return (
                            <div
                              key={t.name}
                              draggable
                              onDragStart={(e) => handleDragStartSidebar(e, meta)}
                              onClick={() => setSelectedTableInfo({
                                name: t.name,
                                schema: t.schema || "public",
                                sourceId: db.id,
                                sourceName: db.name,
                                dbType: db.type,
                              })}
                              className={`flex items-center gap-2 px-2 py-[5px] rounded-[6px] cursor-pointer transition-all duration-100 ${isSelected ? "" : onCanvas ? "" : "hover:bg-[var(--bg-hover)]"}`}
                              style={{
                                background: isSelected ? "var(--nav-active-bg)" : onCanvas ? "var(--bg-active)" : "transparent",
                                border: isSelected ? "1px solid var(--nav-active)" : onCanvas ? "1px solid var(--border-active)" : "1px solid transparent",
                              }}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isSelected ? "#fff" : onCanvas ? "var(--nav-active)" : "var(--text-muted)"} strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" />
                              </svg>
                              <span className={`text-[0.70rem] flex-1 truncate ${isSelected ? "text-white font-semibold" : onCanvas ? "text-[var(--nav-active)] font-semibold" : "text-[var(--text-muted)]"}`}>
                                {t.name}
                              </span>
                              {t.cols.length > 0 && (
                                <span className="text-[0.55rem] px-[4px] py-[1px] rounded-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)]">
                                  {t.cols.length}c
                                </span>
                              )}
                              {onCanvas && <span className="text-[0.50rem] text-[var(--nav-active)]">●</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom button */}
            <div className="p-3 border-t border-t-[var(--border)] shrink-0">
              <button
                className="w-full flex items-center justify-center gap-1.5 text-[0.72rem] font-semibold py-[7px] rounded-[8px] cursor-pointer text-white border-none [box-shadow:0_2px_10px_rgba(124,58,237,0.30)]"
                style={{ background: "var(--nav-active-bg)" }}
              >
                + Connect New Database
              </button>
            </div>
          </div>

          {/* ─── Center: Canvas ──────────────────────── */}
          <div
            ref={canvasRef}
            className={`flex-1 relative overflow-auto qf-canvas transition-colors duration-200 ${dragOverCanvas ? "qf-canvas-dragover" : ""}`}
            style={{
              background: isDark
                ? "radial-gradient(circle at 50% 50%, rgba(189,147,249,0.02) 0%, transparent 70%)"
                : "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.02) 0%, transparent 70%)",
              backgroundSize: "100% 100%",
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOverCanvas(true); }}
            onDragLeave={() => setDragOverCanvas(false)}
            onDrop={handleCanvasDrop}
            onMouseMove={(e) => {
              if (connecting) {
                const rect = canvasRef.current.getBoundingClientRect();
                setMousePos({ x: (e.clientX - rect.left) / (zoom / 100), y: (e.clientY - rect.top) / (zoom / 100) });
              }
            }}
          >
            {/* Grid dots */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: "2000px", minHeight: "1200px" }}>
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.6" fill={isDark ? "rgba(255,255,255,0.06)" : "rgba(124,58,237,0.08)"} />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Toolbar overlay */}
            <div className="sticky top-3 left-3 z-20 flex items-center gap-1.5 ml-3 mt-3" style={{ width: "fit-content" }}>
              {[
                { icon: "⊕", title: "Add table", action: () => {} },
                { icon: "⧉", title: "Fit view", action: () => setZoom(100) },
                { icon: "🗑", title: "Clear canvas", action: () => { setCanvasTables([]); setJoins([]); setEditingSQL(false); } },
              ].map((b, i) => (
                <button
                  key={i}
                  onClick={b.action}
                  title={b.title}
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center cursor-pointer text-[0.85rem] border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--border-active)] hover:text-[var(--nav-active)] transition-all duration-150 [box-shadow:var(--shadow)]"
                >
                  {b.icon}
                </button>
              ))}
            </div>

            {/* SVG connection lines */}
            <svg
              className="absolute inset-0 pointer-events-none z-10"
              style={{ minWidth: "2000px", minHeight: "1200px", transform: `scale(${zoom / 100})`, transformOrigin: "0 0" }}
            >
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="none" stroke="var(--nav-active)" strokeWidth="1" />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Existing joins */}
              {joins.map((j) => {
                const fromP = getPortPos(j.from, j.onLeft, "right");
                const toP = getPortPos(j.to, j.onRight, "left");
                if (!fromP || !toP) return null;
                const cpOff = Math.abs(toP.x - fromP.x) * 0.4 + 40;
                const path = `M${fromP.x},${fromP.y} C${fromP.x + cpOff},${fromP.y} ${toP.x - cpOff},${toP.y} ${toP.x},${toP.y}`;
                return (
                  <g key={j.id} className="qf-join-line">
                    <path d={path} fill="none" stroke="var(--nav-active)" strokeWidth="2" strokeDasharray="8 4" opacity="0.6" filter="url(#glow)" className="qf-line-anim" />
                    <path d={path} fill="none" stroke="var(--nav-active)" strokeWidth="2" strokeDasharray="8 4" opacity="0.9" className="qf-line-anim" />
                    {/* Join type badge */}
                    <foreignObject x={(fromP.x + toP.x) / 2 - 28} y={(fromP.y + toP.y) / 2 - 12} width="56" height="24" style={{ pointerEvents: "auto" }}>
                      <div
                        className="qf-join-badge flex items-center justify-center h-full rounded-full text-[0.55rem] font-bold tracking-[0.04em] cursor-pointer select-none"
                        style={{
                          background: isDark ? "rgba(189,147,249,0.18)" : "rgba(124,58,237,0.10)",
                          border: "1.5px solid var(--nav-active)",
                          color: "var(--nav-active)",
                          backdropFilter: "blur(8px)",
                        }}
                        onClick={() => {
                          const idx = JOIN_TYPES.indexOf(j.type);
                          changeJoinType(j.id, JOIN_TYPES[(idx + 1) % JOIN_TYPES.length]);
                        }}
                        title="Click to cycle join type"
                      >
                        {j.type}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {/* Active connection being drawn */}
              {connecting && (() => {
                const fromP = getPortPos(connecting.tableId, connecting.col, connecting.side || "right");
                if (!fromP) return null;
                const cpOff = Math.abs(mousePos.x - fromP.x) * 0.4 + 30;
                const path = `M${fromP.x},${fromP.y} C${fromP.x + cpOff},${fromP.y} ${mousePos.x - cpOff},${mousePos.y} ${mousePos.x},${mousePos.y}`;
                return (
                  <path d={path} fill="none" stroke="var(--nav-active)" strokeWidth="2" strokeDasharray="6 3" opacity="0.5" className="qf-line-drawing" />
                );
              })()}
            </svg>

            {/* Table cards on canvas */}
            <div className="absolute inset-0" style={{ minWidth: "2000px", minHeight: "1200px", transform: `scale(${zoom / 100})`, transformOrigin: "0 0" }}>
              {canvasTables.map((tbl) => (
                <div
                  key={tbl.id}
                  ref={(el) => (tableRefs.current[tbl.id] = el)}
                  className="qf-table-card absolute rounded-xl overflow-hidden border bg-[var(--bg-card)] [box-shadow:var(--shadow)] select-none z-[5]"
                  style={{
                    left: tbl.x,
                    top: tbl.y,
                    width: 210,
                    borderColor: "var(--border)",
                  }}
                >
                  {/* Header */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 cursor-grab active:cursor-grabbing qf-table-header"
                    style={{
                      background: isDark ? "rgba(189,147,249,0.08)" : "rgba(124,58,237,0.05)",
                      borderBottom: "1px solid var(--border)",
                    }}
                    onMouseDown={(e) => handleTableMouseDown(e, tbl.id)}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "var(--nav-active)", boxShadow: "0 0 6px var(--nav-active)" }} />
                    <span className="text-[0.78rem] font-bold text-[var(--text)] flex-1 truncate">{tbl.name}</span>
                    <span className="text-[0.55rem] text-[var(--text-muted)]">{tbl.cols.length} cols</span>
                    {/* Close button */}
                    <button
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] cursor-pointer border-none bg-transparent text-[var(--text-muted)] hover:text-[#f87171] hover:bg-[rgba(248,113,113,0.12)] transition-all"
                      onClick={(e) => { e.stopPropagation(); removeTable(tbl.id); }}
                      title="Remove table"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Columns */}
                  <div className="py-0.5">
                    {tbl.cols.map((col) => {
                      const typeColor = TYPE_COLORS[col.type] || "#94a3b8";
                      return (
                        <div
                          key={col.name}
                          className="flex items-center gap-0 px-0 py-[3px] qf-col-row group relative"
                          style={{ borderBottom: "1px solid var(--divider)" }}
                        >
                          {/* Left port */}
                          <div
                            ref={(el) => (portRefs.current[`${tbl.id}-${col.name}-left`] = el)}
                            className="qf-port qf-port-left"
                            onMouseDown={(e) => startConnect(tbl.id, col.name, "left", e)}
                            onMouseUp={() => handlePortDrop(tbl.id, col.name)}
                          />

                          {/* Type badge */}
                          <div
                            className="text-[0.50rem] font-bold px-[5px] py-[1px] rounded-[4px] tracking-[0.04em] shrink-0 ml-2.5"
                            style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30` }}
                          >
                            {col.type}
                          </div>

                          {/* Column name */}
                          <span className="text-[0.72rem] text-[var(--text)] ml-2 flex-1 truncate">{col.name}</span>

                          {/* Right port */}
                          <div
                            ref={(el) => (portRefs.current[`${tbl.id}-${col.name}-right`] = el)}
                            className="qf-port qf-port-right"
                            onMouseDown={(e) => startConnect(tbl.id, col.name, "right", e)}
                            onMouseUp={() => handlePortDrop(tbl.id, col.name)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Empty prompt */}
              {canvasTables.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" />
                    </svg>
                    <div className="text-[0.85rem] font-medium text-[var(--text-muted)]">Drag tables here to start building</div>
                    <div className="text-[0.70rem] text-[var(--text-muted)]">Or write SQL in the editor panel →</div>
                  </div>
                </div>
              )}
            </div>

            {/* Zoom controls */}
            <div className="sticky bottom-3 left-[calc(100%-80px)] z-20 flex flex-col gap-1 items-center" style={{ width: "fit-content", marginLeft: "auto", marginRight: "12px" }}>
              <button onClick={() => setZoom((z) => Math.min(z + 10, 150))} className="w-7 h-7 rounded-[7px] flex items-center justify-center cursor-pointer text-[0.9rem] border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--nav-active)] transition-colors">+</button>
              <span className="text-[0.55rem] font-bold text-[var(--text-muted)]">{zoom}%</span>
              <button onClick={() => setZoom((z) => Math.max(z - 10, 50))} className="w-7 h-7 rounded-[7px] flex items-center justify-center cursor-pointer text-[0.9rem] border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--nav-active)] transition-colors">−</button>
            </div>

          </div>

          {/* ─── Right: SQL / Joins / Columns / Filters ─ */}
          <div
            className="w-[320px] min-w-[280px] flex flex-col border-l border-l-[var(--border)] overflow-hidden shrink-0 transition-colors"
            style={{ background: isDark ? "rgba(255,255,255,0.015)" : "var(--bg-card)" }}
          >
            {/* Tabs */}
            <div className="flex items-center gap-0 px-4 pt-3 pb-0 border-b border-b-[var(--border)] shrink-0">
              {["SQL", "JOINS", "COLUMNS", "FILTERS"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="text-[0.62rem] font-bold tracking-[0.08em] px-3 pb-2 border-b-2 cursor-pointer bg-transparent transition-all duration-150"
                  style={{
                    borderColor: activeTab === tab ? "var(--nav-active)" : "transparent",
                    color: activeTab === tab ? "var(--nav-active)" : "var(--text-muted)",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto p-4 qf-scrollbar">

              {/* ── SQL Tab ─────────────────────────── */}
              {activeTab === "SQL" && (
                <div className="space-y-4">
                  <div className="text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)]">Generated SQL</div>

                  {/* Code block */}
                  <div
                    className="qf-code-block rounded-xl overflow-hidden border border-[var(--border)]"
                    style={{ background: isDark ? "#1a1a2e" : "#f8f7fc" }}
                  >
                    {/* Title bar */}
                    <div className="flex items-center justify-between px-3 py-1.5" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <span className="text-[0.55rem] font-bold tracking-[0.05em] text-[var(--text-muted)] uppercase">SQL</span>
                    </div>

                    {/* SQL editor */}
                    <textarea
                      value={sqlText}
                      onChange={(e) => { setSqlText(e.target.value); setEditingSQL(true); }}
                      className="qf-sql-editor w-full min-h-[180px] p-3 text-[0.75rem] font-mono leading-relaxed bg-transparent text-[var(--text)] border-none outline-none resize-y"
                      placeholder="Write your SQL here..."
                      spellCheck={false}
                    />
                  </div>

                  {/* Errors */}
                  {sqlErrors.length > 0 && (
                    <div className="space-y-1.5 qf-error-shake">
                      {sqlErrors.map((err, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2.5 rounded-lg text-[0.70rem]"
                          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.22)", color: "#f87171" }}
                        >
                          <span className="shrink-0 mt-0.5">⚠</span>
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { navigator.clipboard.writeText(sqlText); }}
                      className="flex items-center gap-1 text-[0.70rem] font-medium px-3 py-[5px] rounded-[7px] cursor-pointer border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-muted)] hover:border-[var(--border-active)] transition-colors"
                    >
                      📋 Copy
                    </button>
                    {editingSQL && (
                      <button
                        onClick={applySQL}
                        className="flex items-center gap-1 text-[0.70rem] font-bold px-3 py-[5px] rounded-[7px] cursor-pointer border-none text-white [box-shadow:0_2px_8px_rgba(124,58,237,0.30)]"
                        style={{ background: "var(--nav-active-bg)" }}
                      >
                        ▶ Apply SQL
                      </button>
                    )}
                  </div>

                  {/* Options */}
                  <div>
                    <div className="text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)] mb-2">Options</div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="text-[0.60rem] font-semibold text-[var(--text-muted)] uppercase tracking-[0.05em] mb-1 block">Limit</label>
                        <input
                          type="number"
                          value={options.limit}
                          onChange={(e) => { setOptions((o) => ({ ...o, limit: parseInt(e.target.value) || 0 })); setEditingSQL(false); }}
                          className="w-full text-[0.78rem] font-mono px-2.5 py-[5px] rounded-[7px] bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text)] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[0.60rem] font-semibold text-[var(--text-muted)] uppercase tracking-[0.05em] mb-1 block">Offset</label>
                        <input
                          type="number"
                          value={options.offset}
                          onChange={(e) => setOptions((o) => ({ ...o, offset: parseInt(e.target.value) || 0 }))}
                          className="w-full text-[0.78rem] font-mono px-2.5 py-[5px] rounded-[7px] bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text)] outline-none"
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    {[
                      { key: "distinct", label: "Distinct results" },
                      { key: "explain", label: "Explain results" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className="flex items-center gap-2.5 cursor-pointer py-1.5"
                        onClick={() => {
                          setOptions((o) => ({ ...o, [key]: !o[key] }));
                          if (key === "distinct") setEditingSQL(false);
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-[4px] flex items-center justify-center transition-all duration-150"
                          style={{
                            background: options[key] ? "var(--nav-active-bg)" : "transparent",
                            border: options[key] ? "none" : "1.5px solid var(--border)",
                          }}
                        >
                          {options[key] && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[0.74rem] text-[var(--text)]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ── JOINS Tab ──────────────────────── */}
              {activeTab === "JOINS" && (
                <div className="space-y-3">
                  <div className="text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)]">Active Joins ({joins.length})</div>
                  {joins.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 opacity-50">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span className="text-[0.72rem] text-[var(--text-muted)]">No joins yet</span>
                      <span className="text-[0.62rem] text-[var(--text-muted)]">Connect column ports to create joins</span>
                    </div>
                  ) : (
                    joinsData.map((j) => (
                      <div
                        key={j.id}
                        className="rounded-xl p-3 border border-[var(--border)] bg-[var(--bg-input)] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[0.60rem] font-bold tracking-[0.05em] uppercase text-[var(--text-muted)]">
                            {j.fromName} → {j.toName}
                          </span>
                          <button
                            onClick={() => removeJoin(j.id)}
                            className="text-[0.60rem] text-[var(--text-muted)] hover:text-[#f87171] cursor-pointer bg-transparent border-none transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                        {/* Join type selector */}
                        <div className="flex items-center gap-1">
                          {JOIN_TYPES.map((jt) => (
                            <button
                              key={jt}
                              onClick={() => changeJoinType(j.id, jt)}
                              className="text-[0.58rem] font-bold px-2 py-[3px] rounded-[5px] cursor-pointer border transition-all duration-150"
                              style={{
                                background: j.type === jt ? "var(--bg-active)" : "transparent",
                                borderColor: j.type === jt ? "var(--border-active)" : "var(--border)",
                                color: j.type === jt ? "var(--nav-active)" : "var(--text-muted)",
                              }}
                            >
                              {jt}
                            </button>
                          ))}
                        </div>
                        {/* ON clause */}
                        <div className="flex items-center gap-1 text-[0.65rem] text-[var(--text-muted)] font-mono">
                          <span className="text-[var(--nav-active)]">ON</span>
                          <span>{j.fromName}.{j.onLeft}</span>
                          <span>=</span>
                          <span>{j.toName}.{j.onRight}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── COLUMNS Tab ─────────────────────── */}
              {activeTab === "COLUMNS" && (
                <div className="space-y-3">
                  <div className="text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)]">Available Columns</div>
                  {canvasTables.length === 0 ? (
                    <div className="text-[0.72rem] text-[var(--text-muted)] opacity-50 text-center py-8">Add tables to view columns</div>
                  ) : (
                    canvasTables.map((tbl) => (
                      <div key={tbl.id} className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-input)]">
                        <div className="px-3 py-2 text-[0.70rem] font-bold text-[var(--nav-active)]" style={{ borderBottom: "1px solid var(--border)" }}>
                          {tbl.name}
                        </div>
                        {tbl.cols.map((c) => {
                          const tc = TYPE_COLORS[c.type] || "#94a3b8";
                          return (
                            <div key={c.name} className="flex items-center gap-2 px-3 py-1.5" style={{ borderBottom: "1px solid var(--divider)" }}>
                              <span className="text-[0.50rem] font-bold px-[4px] py-[1px] rounded-[3px]" style={{ background: `${tc}18`, color: tc }}>{c.type}</span>
                              <span className="text-[0.70rem] text-[var(--text)]">{c.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── FILTERS Tab ─────────────────────── */}
              {activeTab === "FILTERS" && (
                <div className="space-y-3">
                  <div className="text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)]">Where Clauses</div>
                  <div className="flex flex-col items-center gap-2 py-8 opacity-50">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <span className="text-[0.72rem] text-[var(--text-muted)]">No filters applied</span>
                    <span className="text-[0.62rem] text-[var(--text-muted)]">Add WHERE conditions to filter results</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom actions */}
            <div className="flex items-center gap-2 p-3 border-t border-t-[var(--border)] shrink-0">
              <button
                onClick={applySQL}
                className="flex-1 flex items-center justify-center gap-1.5 text-[0.74rem] font-bold py-[8px] rounded-[8px] cursor-pointer text-white border-none [box-shadow:0_2px_10px_rgba(var(--nav-active-rgb,124,58,237),0.30)]"
                style={{ background: "var(--nav-active-bg)" }}
              >
                ▶ Execute Query
              </button>
              <button
                className="flex items-center justify-center gap-1 text-[0.70rem] font-medium py-[8px] px-3 rounded-[8px] cursor-pointer border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-muted)]"
              >
                📋 SQL
              </button>
            </div>
          </div>

        </div>

        {/* ═══ Footer stats bar ═══════════════════ */}
        <div
          className="flex items-center justify-center gap-5 py-1.5 px-4 border-t border-t-[var(--border)] shrink-0"
          style={{ background: "var(--bg)" }}
        >
          <span className="text-[0.68rem] text-[var(--text-muted)]">Tables: <strong className="text-[var(--nav-active)]">{canvasTables.length}</strong></span>
          <span className="text-[0.68rem] text-[var(--text-muted)]">Joins: <strong className="text-[var(--nav-active)]">{joins.length}</strong></span>
        </div>
      </div>

      {/* Table analytics modal */}
      {selectedTableInfo && (
        <TableAnalyticsModal
          tableInfo={selectedTableInfo}
          columns={tableAnalyticsColumns}
          loading={tableAnalyticsLoading}
          onClose={() => setSelectedTableInfo(null)}
        />
      )}
    </div>
  );
}
