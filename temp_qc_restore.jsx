import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";

/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
   Icons & shared helpers
   ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */
function I({ d, size = 16, color = "currentColor", sw = 2, className = "" }) {
  return (
    <svg className={`shrink-0 ${className}`} width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const ico = {
  chevDown:  "M6 9l6 6 6-6",
  chevRight: "M9 18l6-6-6-6",
  check:     "M20 6L9 17l-5-5",
  x:         "M18 6L6 18M6 6l12 12",
  search:    "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  edit:      "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:     "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  plus:      "M12 5v14M5 12h14",
  db:        "M12 2C6.5 2 2 4.5 2 7.5v9C2 19.5 6.5 22 12 22s10-2.5 10-5.5v-9C22 4.5 17.5 2 12 2zM12 12C6.5 12 2 9.5 2 7.5M22 12c0 2-4.5 4.5-10 4.5S2 14 2 12",
  bar:       "M18 20V10M12 20V4M6 20v-6",
  line:      "M23 6l-9.5 9.5-5-5L1 18",
  pie:       "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z",
  scatter:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
  table:     "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  pivot:     "M3 3h18v18H3z M3 9h18 M9 3v18 M15 3v18",
  measure:   "M7 20V4 h2 v16 z M11 20V4 h2 v16 z M15 20V4 h2 v16 z M3 8h18 M3 16h18",
  dim:       "M3 5h18/M3 12h18/M3 19h18 M8 3v18 M16 3v18",
  kpi:       "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center justify-center gap-1.5 transition-all duration-150";
const btnS = "px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] flex items-center justify-center gap-1.5 transition-all duration-150 hover:border-[var(--text-muted)]";

const COLORS = ["#818cf8","#34d399","#f472b6","#fb923c","#a78bfa","#38bdf8","#4ade80","#fbbf24"];

const CHART_TYPES = [
  { id: "table", label: "Table", icon: ico.table },
  { id: "pivot", label: "Pivot Table", icon: ico.pivot },
  { id: "bar", label: "Bar", icon: ico.bar },
  { id: "area", label: "Area", icon: ico.line },
  { id: "line", label: "Line", icon: ico.line },
  { id: "pie", label: "Pie", icon: ico.pie },
  { id: "scatter", label: "Scatter", icon: ico.scatter },
  { id: "kpi_card", label: "KPI", icon: ico.kpi },
];

const AGGREGATIONS = [
  { id: "SUM", label: "SUM" },
  { id: "AVG", label: "AVERAGE" },
  { id: "MIN", label: "MIN" },
  { id: "MAX", label: "MAX" },
  { id: "COUNT", label: "COUNT" },
  { id: "COUNT_DISTINCT", label: "COUNT DISTINCT" },
];

/* ÔöÇÔöÇ Select dropdown ÔöÇÔöÇ */
function BaseSelect({ value, onChange, options, placeholder, disabled, className = "" }) {
  const [open, setOpen] = useState(false);
  const sel = options.find(o => String(o.value) === String(value));
  return (
    <div className={`relative ${className}`} tabIndex={0} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <button type="button" disabled={disabled} onClick={() => !disabled && setOpen(p => !p)}
        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-md px-3 py-1.5 text-xs text-left cursor-pointer flex items-center justify-between gap-2 hover:border-[var(--nav-active)] outline-none"
        style={{ color: sel ? "var(--text)" : "var(--text-muted)", borderColor: open ? "var(--nav-active)" : undefined }}>
        <span className="truncate">{sel ? sel.label : placeholder || "SelectÔÇª"}</span>
        <I d={ico.chevDown} size={11} className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-md border border-[var(--border)] bg-[var(--bg-card)] shadow-xl max-h-48 overflow-y-auto" style={{ animation: "fadeUp .15s ease both" }}>
          {options.map(o => (
            <button key={o.value} type="button"
              className="w-full text-left px-3 py-1.5 text-xs cursor-pointer flex items-center justify-between hover:bg-[var(--bg-input)] border-none bg-transparent text-[var(--text)] transition-colors"
              onClick={() => { onChange(o.value); setOpen(false); }}>
              <span className="truncate">{o.label}</span>
              {String(o.value) === String(value) && <I d={ico.check} size={11} color="var(--nav-active)" sw={3} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ÔöÇÔöÇ Chart Renderer ÔöÇÔöÇ */
function ChartRenderer({ type, mappedData, data }) {
  if (!data || data.length === 0) return <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">No data to preview</div>;
  if (!mappedData.values.length && !(type === 'table')) {
    return <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">Select columns/values to render chart</div>;
  }

  const axisStyle = { fontSize: 10, fill: "var(--text-muted)" };
  const gridStyle = { stroke: "var(--border)", strokeDasharray: "3 3" };
  const xKey = mappedData.rows[0] || mappedData.columns[0] || "name";

  try {
    if (type === "pie") {
      const pieData = data.map((d, i) => ({ name: String(d[xKey] || `Row ${i}`), value: Number(d[mappedData.values[0]] || d.value || 0) }));
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="75%" 
                 label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (type === "line" || type === "area") {
      const Comp = type === "area" ? AreaChart : LineChart;
      const SubC = type === "area" ? Area : Line;
      return (
        <ResponsiveContainer width="100%" height="100%">
          <Comp data={data}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey={xKey} tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {mappedData.values.map((v, i) => (
              <SubC key={v} type="monotone" dataKey={v} name={v} stroke={COLORS[i % COLORS.length]} 
                    fill={type === "area" ? `${COLORS[i % COLORS.length]}30` : undefined} 
                    dot={type === "line"} strokeWidth={2} />
            ))}
          </Comp>
        </ResponsiveContainer>
      );
    }

    if (type === "table" || type === "pivot") {
      const headers = Object.keys(data[0] || {});
      return (
        <div className="w-full h-full overflow-auto text-xs bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-[var(--bg-input)] sticky top-0 border-b border-[var(--border)]">
              <tr>{headers.map(h => <th key={h} className="px-3 py-2 font-semibold text-[var(--text-sub)] border-r border-[var(--border)] last:border-r-0">{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)]/50">
                  {headers.map(h => <td key={h} className="px-3 py-1.5 text-[var(--text)] border-r border-[var(--border)] last:border-r-0">{String(row[h] ?? "")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // fallback: bar
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={xKey} tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {mappedData.values.map((v, i) => (
            <Bar key={v} dataKey={v} name={v} fill={COLORS[i % COLORS.length]} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  } catch(e) {
    return <div className="flex p-4 text-xs text-red-400">Error rendering chart: {e.message}</div>;
  }
}

/* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
   WIZARD COMPONENT (Matches Screenshots)
   ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */
export default function QuestionCreate() {
  const { id } = useParams();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const navigate = useNavigate();

  // ÔöÇÔöÇ Global Context State ÔöÇÔöÇ
  const [step, setStep]           = useState(1); // 1 = Data Conn, 2 = Config
  const [datasets, setDatasets]   = useState([]);
  const [categories, setCategories]= useState([]);
  const [loadingDs, setLoadingDs] = useState(true);
  
  // ÔöÇÔöÇ Question Definition State ÔöÇÔöÇ
  const [qName, setQName] = useState("Untitled chart");
  const [qGroup, setQGroup] = useState("");
  const [qStatus, setQStatus] = useState("draft");
  const [qDesc, setQDesc] = useState("");
  const [datasetId, setDatasetId] = useState("");
  
  // ÔöÇÔöÇ Columns & Data State ÔöÇÔöÇ
  const [allCols, setAllCols] = useState([]);
  const [colLoading, setColLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dimsOpen, setDimsOpen] = useState(true);
  const [measOpen, setMeasOpen] = useState(true);

  // Selections: { name: str, role: "DIM"|"MEASURE"|"DATE", agg: "SUM", alias: str }
  const [selections, setSelections] = useState([]); 
  const [propCol, setPropCol] = useState(null); // column currently open in PROPERTIES
  
  // Mappings for step 2: specific to chart
  const [chartType, setChartType] = useState("table");
  const [mapColumns, setMapColumns] = useState([]); // columns in the chart mapping
  const [mapRows, setMapRows] = useState([]);
  const [mapValues, setMapValues] = useState([]);
  
  // Chart preview
  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  // ÔöÇÔöÇ INIT ÔöÇÔöÇ
  useEffect(() => {
    if (!api) return;
    setLoadingDs(true);
    Promise.allSettled([
      api("/api/v1/datasets/?skip=0&limit=200"),
      api("/api/v1/questions-v2/categories"),
    ]).then(([dsRes, catRes]) => {
      setDatasets(Array.isArray(dsRes.value?.data) ? dsRes.value.data : Array.isArray(dsRes.value?.datasets) ? dsRes.value.datasets : Array.isArray(dsRes.value) ? dsRes.value : []);
      setCategories(Array.isArray(catRes.value?.data) ? catRes.value.data : Array.isArray(catRes.value) ? catRes.value : []);
    }).finally(() => setLoadingDs(false));
  }, [api]);

  // Load existing question if edit mode
  useEffect(() => {
    if (id && api) {
      api(`/api/v1/questions-v2/${id}`).then(resp => {
        const q = resp?.data || resp;
        setQName(q.name && q.name !== "null" ? q.name : "Untitled chart");
        setQDesc(q.description && q.description !== "null" ? q.description : "");
        setQGroup(q.category_id ? String(q.category_id) : "");
        setQStatus(q.status && q.status !== "null" ? q.status : "draft");
        setChartType(q.chart_type || "table");
        if (q.dataset_id) setDatasetId(String(q.dataset_id));
        
        // Hydrate selections from definition
        if (q.definition) {
          const dims = (q.definition.groupby || []).map(d => ({ name: d, role: "DIM" }));
          const meas = (q.definition.columns || []).map(m => ({ name: m, role: "MEASURE", agg: "SUM" })); // crude parse
          setSelections([...dims, ...meas]);
          setMapRows(q.definition.groupby || []);
          setMapValues(q.definition.columns || []);
        }
      });
      // Try to load preview immediately
      setPreviewLoading(true);
      api(`/api/v1/questions-v2/${id}/data`).then(d => {
        setPreviewData(Array.isArray(d?.data) ? d.data : Array.isArray(d?.rows) ? d.rows : Array.isArray(d) ? d : []);
      }).finally(() => setPreviewLoading(false));
    }
  }, [id, api]);

  // Load columns on dataset change
  useEffect(() => {
    if (!datasetId || !api) return;
    setColLoading(true);
    api(`/api/v1/datasets/${datasetId}/columns`).then(raw => {
      const cls = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.columns) ? raw.columns : [];
      setAllCols(cls.map(c => typeof c === "string" ? { name: c, type: "string" } : { name: c.name || c.column_name, type: c.type || "string" }));
    }).finally(() => setColLoading(false));
  }, [datasetId, api]);

  // Sync missing mappings automatically
  useEffect(() => {
    const sNames = selections.map(s => s.name);
    // Remove stale mappings
    setMapColumns(p => p.filter(c => sNames.includes(c)));
    setMapRows(p => p.filter(c => sNames.includes(c)));
    setMapValues(p => p.filter(c => sNames.includes(c)));
    
    // Auto-map new selections by default if they aren't mapped yet
    selections.forEach(s => {
      const mapped = mapColumns.includes(s.name) || mapRows.includes(s.name) || mapValues.includes(s.name);
      if (!mapped) {
        if (s.role === "DIM") setMapRows(p => [...p, s.name]);
        if (s.role === "MEASURE") setMapValues(p => [...p, s.name]);
      }
    });
  }, [selections]);

  // ÔöÇÔöÇ UI Actions ÔöÇÔöÇ
  const toggleSelect = (col) => {
    const isSel = selections.find(s => s.name === col.name);
    if (isSel) setSelections(p => p.filter(s => s.name !== col.name));
    else setSelections(p => [...p, { name: col.name, role: col.type.toLowerCase().includes("int") || col.type.toLowerCase().includes("float") || col.type.toLowerCase().includes("num") ? "MEASURE" : "DIM", agg: "SUM" }]);
  };

  const getColsByType = (cols, isMeasure) => cols.filter(c => {
    const num = c.type?.toLowerCase().includes("int") || c.type?.toLowerCase().includes("float") || c.type?.toLowerCase().includes("num");
    return isMeasure ? num : !num;
  }).filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async () => {
    try {
      const payload = {
        name: qName.trim() || "Untitled chart",
        description: qDesc,
        dataset_id: Number(datasetId),
        chart_type: chartType,
        status: qStatus,
        ...(qGroup ? { category_id: Number(qGroup) } : {}),
        definition: {
          datasource_id: Number(datasetId),
          columns: mapValues,
          groupby: mapRows,
        }
      };
      
      let newId = id;
      if (id) {
        await api(`/api/v1/questions-v2/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        const res = await api("/api/v1/questions-v2/", { method: "POST", body: JSON.stringify(payload) });
        newId = res.id;
      }
      navigate(`/questions/${newId}`);
    } catch { alert("Failed to save chart"); }
  };

  const countD = selections.filter(s => s.role === "DIM").length;
  const countM = selections.filter(s => s.role === "MEASURE").length;

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  );

  /* ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ
     RENDER
     ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ */
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* ÔöÇÔöÇ Header ÔöÇÔöÇ */}
        <div className="shrink-0 bg-[var(--bg-card)] border-b border-[var(--border)] relative z-10">
          <div className="flex items-center justify-between px-5 h-12">
            <h1 className="text-sm font-bold">{id ? "Edit Chart" : "Create Chart"}</h1>
            <div className="flex items-center gap-6">
              {/* Stepper */}
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(1)} className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold cursor-pointer border-none bg-transparent transition-all ${step === 1 ? "text-[var(--nav-active)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem] ${step === 1 ? "bg-[var(--nav-active-bg)] text-white" : "border border-[var(--border)]"}`}>1</span> Data Connection
                </button>
                <div className="w-4 h-px bg-[var(--border)]" />
                <button onClick={() => step === 2 || datasetId ? setStep(2) : null} className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border-none bg-transparent transition-all ${step === 2 ? "text-[var(--nav-active)]" : !datasetId ? "opacity-50 cursor-not-allowed text-[var(--text-muted)]" : "cursor-pointer text-[var(--text-muted)] hover:text-[var(--text)]"}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem] ${step === 2 ? "bg-[var(--nav-active-bg)] text-white" : "border border-[var(--border)]"}`}>2</span> Data and Chart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ÔöÇÔöÇ Body ÔöÇÔöÇ */}
        <div className="flex-1 overflow-hidden">
          {step === 1 ? (
            /* STEP 1: DATA CONNECTION (4-Pane Layout) */
            <div className="h-full flex divide-x divide-[var(--border)]">
              {/* 1. Available Columns */}
              <div className="w-64 bg-[var(--bg-card)] flex flex-col shrink-0">
                <div className="p-4 border-b border-[var(--border)]">
                  <label className="text-[0.6rem] font-bold tracking-[0.05em] uppercase text-[var(--text-muted)] mb-1.5 block">Dataset</label>
                  <BaseSelect value={datasetId} onChange={v => { setDatasetId(v); setSelections([]); }} 
                              options={datasets.map(d => ({ value: d.id, label: d.name || `Dataset ${d.id}`}))} placeholder="Select DatasetÔÇª" />
                </div>
                {datasetId && (
                  <div className="p-4 flex flex-col gap-3 min-h-0 flex-1">
                    <h2 className="text-xs font-bold">Available Columns</h2>
                    <div className="relative">
                      <I d={ico.search} size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded text-xs pl-7 pr-2 py-1.5 outline-none focus:border-[var(--nav-active)]"
                             placeholder="Search columns..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    {colLoading ? <div className="text-xs text-[var(--text-muted)] flex gap-2 p-2"><Spin/> Loading...</div> : (
                      <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                        {/* Dimensions */}
                        <div className="mb-2">
                          <button onClick={() => setDimsOpen(!dimsOpen)} className="w-full flex items-center justify-between text-left text-[0.6rem] font-bold uppercase tracking-wider text-[var(--text-muted)] py-1 hover:text-[var(--text)] border-none bg-transparent cursor-pointer">
                            <span className="flex items-center gap-1.5"><I d={ico.dim} size={10} color="#818cf8" /> Dimensions ({getColsByType(allCols, false).length})</span>
                            <I d={ico.chevDown} size={10} className={`transform ${!dimsOpen ? "rotate-180" : ""}`} />
                          </button>
                          {dimsOpen && <div className="mt-1 flex flex-col gap-0.5 ml-3">
                            {getColsByType(allCols, false).map(c => {
                              const s = selections.find(x => x.name === c.name);
                              return (
                                <button key={c.name} onClick={() => toggleSelect(c)} className={`text-left px-2 py-1.5 rounded text-xs truncate border-none cursor-pointer transition-colors flex items-center justify-between group ${s ? "bg-[var(--nav-active-bg)]/10 text-[var(--nav-active)]" : "bg-transparent text-[var(--text-sub)] hover:bg-[var(--bg-input)]"}`}>
                                  <span className="truncate">{c.name}</span>
                                  {s && <I d={ico.check} size={10} />}
                                </button>
                              );
                            })}
                          </div>}
                        </div>
                        {/* Measures */}
                        <div className="mb-2">
                          <button onClick={() => setMeasOpen(!measOpen)} className="w-full flex items-center justify-between text-left text-[0.6rem] font-bold uppercase tracking-wider text-[var(--text-muted)] py-1 hover:text-[var(--text)] border-none bg-transparent cursor-pointer">
                            <span className="flex items-center gap-1.5"><I d={ico.measure} size={10} color="#34d399" /> Measures ({getColsByType(allCols, true).length})</span>
                            <I d={ico.chevDown} size={10} className={`transform ${!measOpen ? "rotate-180" : ""}`} />
                          </button>
                          {measOpen && <div className="mt-1 flex flex-col gap-0.5 ml-3">
                            {getColsByType(allCols, true).map(c => {
                              const s = selections.find(x => x.name === c.name);
                              return (
                                <button key={c.name} onClick={() => toggleSelect(c)} className={`text-left px-2 py-1.5 rounded text-xs truncate border-none cursor-pointer transition-colors flex items-center justify-between group ${s ? "bg-[var(--nav-active-bg)]/10 text-[var(--nav-active)]" : "bg-transparent text-[var(--text-sub)] hover:bg-[var(--bg-input)]"}`}>
                                  <span className="truncate">{c.name}</span>
                                  {s && <I d={ico.check} size={10} />}
                                </button>
                              );
                            })}
                          </div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Selected Columns */}
              <div className="w-72 bg-[var(--bg-card)] flex flex-col shrink-0 flex-1 min-w-[300px] max-w-sm border-r border-[var(--border)]">
                <div className="p-3 border-b border-[var(--border)] bg-[var(--bg-input)] flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wide">Selected Columns</h2>
                  <span className="bg-[#1f2937] text-[10px] text-white px-2 py-0.5 rounded-full">{selections.length}</span>
                </div>
                <div className="p-3 flex gap-2 border-b border-[var(--border)]">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-input)] text-[#818cf8]">{countD} DIMS</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-input)] text-[#34d399]">{countM} MEASURES</span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto">
                  {selections.length === 0 ? <p className="text-xs text-[var(--text-muted)] text-center py-10">Select columns from the left panel to begin</p> : (
                    <div className="flex flex-col gap-4">
                      {/* Dimensions Block */}
                      {countD > 0 && <div>
                        <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-[#818cf8] mb-2 uppercase"><span><I d={ico.dim} size={10} className="inline mr-1"/> Dimensions</span> <span className="w-4 h-4 flex items-center justify-center rounded-full bg-[#818cf8] text-white">{countD}</span></div>
                        <div className="flex flex-col gap-1.5">
                          {selections.filter(s=>s.role==="DIM").map(s => (
                            <div key={s.name} className={`flex items-center justify-between rounded-lg p-2 cursor-pointer transition-colors ${propCol?.name === s.name ? "bg-[var(--bg-input)] border-[var(--nav-active)] border" : "bg-[var(--bg)] border-transparent border"} hover:border-[var(--border)]`} onClick={() => setPropCol(s)}>
                              <div className="min-w-0 pr-2"><div className="text-xs font-semibold truncate text-[var(--text)]">{s.name}</div></div>
                              <div className="flex gap-1 shrink-0 text-[var(--text-muted)]">
                                <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/10 hover:text-[var(--text)] border-none bg-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); setPropCol(s); }}><I d={ico.edit} size={10} /></button>
                                <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/10 hover:text-red-400 border-none bg-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSelect({name: s.name, type: "int" /* dummy to allow removal */}); if(propCol?.name===s.name)setPropCol(null); }}><I d={ico.trash} size={10} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>}
                      {/* Measures Block */}
                      {countM > 0 && <div>
                        <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-[#34d399] mb-2 uppercase"><span><I d={ico.measure} size={10} className="inline mr-1"/> Measures</span> <span className="w-4 h-4 flex items-center justify-center rounded-full bg-[#34d399] text-white">{countM}</span></div>
                        <div className="flex flex-col gap-1.5">
                          {selections.filter(s=>s.role==="MEASURE").map(s => (
                            <div key={s.name} className={`flex items-center justify-between rounded-lg p-2 cursor-pointer transition-colors ${propCol?.name === s.name ? "bg-[var(--bg-input)] border border-[#34d399]" : "bg-[var(--bg)] border border-transparent"} hover:border-[var(--border)]`} onClick={() => setPropCol(s)}>
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-1.5">
                                  <I d="M12 2v20 M4 8l8 8 8-8" size={12} className="text-[#34d399] opacity-30"/> 
                                  <div className="text-xs font-semibold truncate text-[var(--text)]">{s.name}</div>
                                </div>
                                <div className="text-[9px] font-bold text-[#34d399] mt-0.5 ml-4 px-1 rounded bg-[#34d399]/10 inline-block">{s.agg || "SUM"}</div>
                              </div>
                              <div className="flex gap-1 shrink-0 text-[var(--text-muted)]">
                                <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/10 hover:text-[var(--text)] border-none bg-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); setPropCol(s); }}><I d={ico.edit} size={10} /></button>
                                <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/10 hover:text-red-400 border-none bg-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSelect({name: s.name, type: "int"}); if(propCol?.name===s.name)setPropCol(null); }}><I d={ico.trash} size={10} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Properties */}
              <div className="flex-1 bg-[var(--bg)] flex flex-col items-center justify-center p-4">
                {!propCol ? <p className="text-xs text-[var(--text-muted)]">Select a column to view properties</p> : (
                  <div className="w-full max-w-sm bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
                      <h3 className="text-xs font-bold flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${propCol.role==="DIM" ? "bg-[#818cf8]":"bg-[#34d399]"}`}/> Properties: {propCol.name}</h3>
                      <button className="text-[var(--text-muted)] hover:text-red-400 bg-transparent border-none cursor-pointer" onClick={() => setPropCol(null)}><I d={ico.x} size={12}/></button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {propCol.role === "MEASURE" && (
                        <div>
                          <label className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Aggregation</label>
                          <BaseSelect value={propCol.agg} onChange={(val) => {
                            setSelections(p => p.map(x => x.name === propCol.name ? {...x, agg: val} : x));
                            setPropCol(p => ({...p, agg: val}));
                          }} options={AGGREGATIONS} />
                        </div>
                      )}
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Display Alias</label>
                        <input className="w-full text-xs p-2 rounded bg-[var(--bg-input)] border border-[var(--border)] outline-none focus:border-[var(--nav-active)]" placeholder={propCol.name} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Filters */}
              <div className="w-64 bg-[var(--bg-card)] border-l border-[var(--border)] shrink-0 flex flex-col">
                <div className="p-3 border-b border-[var(--border)] bg-[var(--bg-input)]">
                  <h2 className="text-xs font-bold uppercase tracking-wide">Filters</h2>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center text-[var(--text-muted)]">
                    <I d={ico.search} size={20} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No Filters</p>
                  </div>
                </div>
                <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-input)]">
                  <button className="w-full py-1.5 rounded bg-[#3b82f6] text-white text-xs font-bold border-none cursor-pointer flex items-center justify-center gap-2"><I d={ico.plus} size={12}/> Add Filter</button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: DATA AND CHART CONFIG (2-Pane Layout) */
            <div className="h-full flex divide-x divide-[var(--border)]">
              {/* Left Config Panel */}
              <div className="w-80 bg-[var(--bg-card)] flex flex-col shrink-0">
                <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-input)]">
                  <h2 className="text-xs font-bold uppercase tracking-wide mb-3">Configuration</h2>
                  
                  {/* Name field (inline logic) */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-[var(--text-sub)] block mb-1">Name</label>
                      <input className="w-full text-xs p-1.5 rounded border border-[var(--border)] bg-[var(--bg)] outline-none focus:border-[var(--nav-active)]" value={qName} onChange={e=>setQName(e.target.value)} />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-[var(--text-sub)] block mb-1">Group</label>
                      <BaseSelect value={qGroup} onChange={v=>setQGroup(v)} options={[{value:"",label:"None"}, ...categories.map(c=>({value:String(c.id),label:c.name}))]} />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                  {/* Chart Types */}
                  <div>
                    <label className="text-xs font-bold text-[var(--text)] block mb-2">Chart Type</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {CHART_TYPES.map(ct => (
                        <button key={ct.id} onClick={() => setChartType(ct.id)} title={ct.label}
                                className={`h-12 rounded-lg flex flex-col items-center justify-center gap-1 border border-transparent cursor-pointer transition-colors ${chartType === ct.id ? "bg-[var(--nav-active-bg)]/10 text-[var(--nav-active)] shadow-[inset_0_0_0_1px_var(--nav-active)]" : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]"}`}>
                          <I d={ct.icon} size={16} />
                          <span className="text-[8px] uppercase tracking-wider font-bold truncate max-w-full px-1">{ct.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Data Mapping */}
                  <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                    <div className="bg-[var(--bg-input)] p-2 text-xs font-bold uppercase tracking-wide border-b border-[var(--border)]">Data Mapping</div>
                    <div className="p-3 flex flex-col gap-3">
                      {["Columns/Dimensions", "Rows", "Values/Measures"].map((role, i) => {
                        const isValues = i === 2;
                        const srcArr = i === 0 ? mapColumns : i === 1 ? mapRows : mapValues;
                        const setFn = i === 0 ? setMapColumns : i === 1 ? setMapRows : setMapValues;
                        return (
                          <div key={role}>
                            <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1.5 uppercase">{role}</label>
                            <div className="min-h-[32px] rounded border border-dashed border-[var(--border)] bg-[var(--bg-input)] p-1 flex flex-wrap gap-1 items-center">
                              {srcArr.length === 0 ? <span className="text-[10px] text-[var(--text-muted)] italic px-2">Drop columns here...</span> : (
                                srcArr.map(m => (
                                  <div key={m} className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${isValues ? "bg-[#34d399]/20 text-[#10b981]" : "bg-[#818cf8]/20 text-[#6366f1]"}`}>
                                    {m} <button onClick={() => setFn(p=>p.filter(x=>x!==m))} className="text-current hover:text-black border-none bg-transparent cursor-pointer p-0 opacity-50 hover:opacity-100 flex items-center leading-none"><I d={ico.x} size={8} sw={3}/></button>
                                  </div>
                                ))
                              )}
                              <BaseSelect 
                                placeholder="+" 
                                className="w-6 h-6 ml-1 flex-shrink-0"
                                onChange={(val) => { if (!srcArr.includes(val)) setFn(p => [...p, val]); }}
                                options={selections.filter(s => isValues ? s.role === "MEASURE" : s.role === "DIM").map(s => ({value: s.name, label: s.name}))}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Chart Preview */}
              <div className="flex-1 bg-[var(--bg)] flex flex-col">
                <div className="h-10 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0 shadow-sm">
                  <h2 className="text-xs font-bold flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"/> Chart Preview</h2>
                  <button className="text-[10px] font-bold uppercase tracking-wider text-[var(--nav-active)] border border-[var(--nav-active)] px-2 py-1 rounded hover:bg-[var(--nav-active-bg)] hover:text-white transition-colors cursor-pointer" onClick={() => {/* Fetch preview data if API supports */}}>{previewLoading ? <Spin/> : "Refresh Preview"}</button>
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  {/* The rendering block */}
                  <div className="flex-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm p-4 relative overflow-hidden">
                    <ChartRenderer type={chartType} mappedData={{columns: mapColumns, rows: mapRows, values: mapValues}} data={previewData} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ÔöÇÔöÇ Footer ÔöÇÔöÇ */}
        <div className="shrink-0 h-14 bg-[var(--bg-card)] border-t border-[var(--border)] flex items-center justify-between px-5 z-10">
          <button className={btnS} onClick={() => { if(step === 2) setStep(1); else navigate("/questions"); }}>
            {step === 1 ? "Cancel" : "ÔåÉ Back"}
          </button>
          <div className="flex gap-3">
            {step === 2 && <BaseSelect value={qStatus} onChange={v=>setQStatus(v)} options={[{value:"draft",label:"Draft"},{value:"published",label:"Published"}]} />}
            <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: (!datasetId) ? 0.5 : 1, cursor: (!datasetId) ? "not-allowed" : "pointer" }} 
              disabled={!datasetId} onClick={() => { if(step === 1) setStep(2); else handleSave(); }}>
              {step === 1 ? "Next ÔåÆ" : id ? "Save Changes" : "Create Chart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
