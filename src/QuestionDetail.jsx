import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   Shared helpers
   ═══════════════════════════════════════════════════════════ */
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
  back:    "M19 12H5M12 19l-7-7 7-7",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  share:   "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
  chevDown:"M6 9l6 6 6-6",
  refresh: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  copy:    "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  trash:   "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  x:       "M18 6L6 18M6 6l12 12",
  check:   "M20 6L9 17l-5-5",
  download:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  zoomIn:  "M11 8v6M8 11h6 M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  label:   "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  chart:   "M18 20V10M12 20V4M6 20v-6",
};

const COLORS = ["#818cf8","#34d399","#f472b6","#fb923c","#a78bfa","#38bdf8","#4ade80","#fbbf24"];

const Spin = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] flex items-center gap-1.5 transition-all duration-150";

/* ── Toast ── */
function useToast() {
  const [items, setItems] = useState([]);
  let tc = 0;
  const push = useCallback((msg, type = "success") => {
    const tid = ++tc;
    setItems(p => [...p, { id: tid, msg, type }]);
    setTimeout(() => setItems(p => p.filter(x => x.id !== tid)), 3200);
  }, []);
  const Toast = () => items.length > 0 ? (
    <div className="fixed top-5 right-5 z-[99] flex flex-col gap-2">
      {items.map(t => (
        <div key={t.id} className="px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border"
          style={{ background: t.type === "error" ? "rgba(239,68,68,.12)" : "rgba(16,185,129,.12)", borderColor: t.type === "error" ? "rgba(239,68,68,.25)" : "rgba(16,185,129,.25)", color: t.type === "error" ? "#f87171" : "#34d399", animation: "fadeUp .25s ease both" }}>
          {t.msg}
        </div>
      ))}
    </div>
  ) : null;
  return { push, Toast };
}

/* ── Metadata badge ── */
function MetaBadge({ label, value, color }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}>
      <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase text-[var(--text-muted)]">{label}</span>
      <span className="text-xs font-bold" style={{ color: color || "var(--text)" }}>{value}</span>
    </div>
  );
}

/* ── Chart renderer ── */
function ChartRenderer({ chartType, data, height = 340 }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-40 text-sm text-[var(--text-muted)]">No data available</div>;
  }

  const type = (chartType || "bar").toLowerCase();
  const keys  = Object.keys(data[0] || {}).filter(k => k !== "name" && k !== "label" && k !== "x");
  const xKey  = data[0] && "name" in data[0] ? "name" : Object.keys(data[0])[0];

  const axisStyle = { fontSize: 11, fill: "var(--text-muted)" };
  const gridStyle = { stroke: "var(--border)", strokeDasharray: "3 3" };

  if (type.includes("pie") || type.includes("donut")) {
    const pieData = data.map((d, i) => ({
      name: d.name || d.label || d[xKey] || `Item ${i}`,
      value: Number(d.value || d[keys[0]] || 0),
    }));
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
            outerRadius={type.includes("donut") ? "70%" : "75%"}
            innerRadius={type.includes("donut") ? "45%" : 0}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type.includes("line") || type.includes("area")) {
    const Component = type.includes("area") ? AreaChart : LineChart;
    const SubComp   = type.includes("area") ? Area : Line;
    return (
      <ResponsiveContainer width="100%" height={height}>
        <Component data={data}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={xKey} tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Legend />
          {keys.map((k, i) => (
            <SubComp key={k} type="monotone" dataKey={k}
              stroke={COLORS[i % COLORS.length]}
              fill={type.includes("area") ? `${COLORS[i % COLORS.length]}30` : undefined}
              dot={false} strokeWidth={2} />
          ))}
        </Component>
      </ResponsiveContainer>
    );
  }

  if (type.includes("scatter")) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={keys[0]} tick={axisStyle} name={keys[0]} />
          <YAxis dataKey={keys[1] || keys[0]} tick={axisStyle} name={keys[1] || keys[0]} />
          <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
          <Scatter data={data} fill={COLORS[0]} />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  // Default: bar
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={xKey} tick={axisStyle} />
        <YAxis tick={axisStyle} />
        <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
        <Legend />
        {keys.map((k, i) => (
          <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────────────────────────────────────────── */
function normalizeChartData(raw) {
  if (!raw) return [];
  // API may return { data: [...], columns: [...] } or just an array
  let rows = Array.isArray(raw?.data) ? raw.data
    : Array.isArray(raw?.rows) ? raw.rows
    : Array.isArray(raw) ? raw : [];

  // If rows are objects, return directly; if they're arrays use columns header
  if (rows.length > 0 && Array.isArray(rows[0]) && raw?.columns) {
    const cols = raw.columns;
    rows = rows.map(r => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
  }
  return rows;
}

/* ═══════════════════════════════════════════════════════════
   QuestionDetail — Main Component
   ═══════════════════════════════════════════════════════════ */
export default function QuestionDetail() {
  const { id } = useParams();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const navigate = useNavigate();
  const { push, Toast } = useToast();

  const [question, setQuestion]    = useState(null);
  const [chartData, setChartData]  = useState([]);
  const [loading, setLoading]      = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [materializing, setMaterializing] = useState(false);

  /* ── Fetch question metadata ── */
  const fetchQuestion = useCallback(async () => {
    if (!api || !id) return;
    setLoading(true);
    try {
      const data = await api(`/api/v1/questions-v2/${id}`);
      setQuestion(data);
    } catch {
      push("Failed to load question", "error");
    } finally {
      setLoading(false);
    }
  }, [api, id, push]);

  /* ── Fetch chart data ── */
  const fetchData = useCallback(async () => {
    if (!api || !id) return;
    setDataLoading(true);
    try {
      const raw = await api(`/api/v1/questions-v2/${id}/data`, { method: "GET" });
      setChartData(normalizeChartData(raw));
    } catch {
      setChartData([]);
    } finally {
      setDataLoading(false);
    }
  }, [api, id]);

  useEffect(() => { fetchQuestion(); fetchData(); }, [fetchQuestion, fetchData]);

  /* ── Materialize ── */
  const handleMaterialize = async () => {
    setMaterializing(true);
    try {
      await api(`/api/v1/questions-v2/${id}/materialize`, { method: "POST" });
      push("Materialization started");
      setTimeout(() => fetchData(), 2000);
    } catch { push("Materialize failed", "error"); }
    finally { setMaterializing(false); }
  };

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  );

  const chartType = question?.chart_type || "bar";
  const matEnabled = question?.materialization_enabled ?? false;
  const matLimit   = question?.materialization_config?.limit ?? question?.result_limit ?? null;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Breadcrumb bar ── */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-[var(--border)] bg-[var(--bg-card)] text-xs text-[var(--text-muted)]">
          <button className="hover:text-[var(--nav-active)] cursor-pointer transition-colors" onClick={() => navigate("/questions")}>
            Questions
          </button>
          <span>›</span>
          <span className="text-[var(--text)] font-medium truncate max-w-[300px]">
            {loading ? "Loading…" : question?.name || `Question #${id}`}
          </span>
        </div>

        {/* ── Page header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-3 min-w-0">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--bg-input)] border border-[var(--border)] cursor-pointer text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shrink-0"
              onClick={() => navigate("/questions")}>
              <I d={ico.back} size={16} />
            </button>
            <h1 className="text-lg font-bold truncate">
              {loading ? "Loading…" : question?.name || `Question #${id}`}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Refresh data */}
            <button className={btnS} onClick={() => { fetchQuestion(); fetchData(); }} title="Refresh">
              <I d={ico.refresh} size={13} />
            </button>

            {/* Edit */}
            <button className={btnS} onClick={() => navigate(`/questions/${id}/edit`)}>
              <I d={ico.edit} size={13} /> Edit
            </button>

            {/* Share */}
            <button className={btnS} onClick={() => push("Share link copied!")}>
              <I d={ico.share} size={13} /> Share
            </button>

            {/* Actions dropdown */}
            <div className="relative">
              <button className={btnS} onClick={() => setActionsOpen(p => !p)}>
                Actions <I d={ico.chevDown} size={11} className={actionsOpen ? "rotate-180" : ""} />
              </button>
              {actionsOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl z-50 overflow-hidden" style={{ animation: "fadeUp .15s ease both" }}>
                  <button className="flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-[var(--bg-input)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                    onClick={() => { handleMaterialize(); setActionsOpen(false); }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                    {materializing ? "Materializing…" : "Materialize"}
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-[var(--bg-input)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                    onClick={() => { push("Duplicated successfully"); setActionsOpen(false); }}>
                    <I d={ico.copy} size={13} /> Duplicate
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-[var(--bg-input)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                    onClick={() => { push("Exported"); setActionsOpen(false); }}>
                    <I d={ico.download} size={13} /> Export Data
                  </button>
                  <div className="border-t border-[var(--border)] mx-3 my-1" />
                  <button className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-red-400 hover:bg-[var(--bg-input)] bg-transparent border-none cursor-pointer"
                    onClick={() => { navigate("/questions"); setActionsOpen(false); }}>
                    <I d={ico.trash} size={13} color="#f87171" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto px-5 py-5 flex flex-col gap-5">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20">
              <Spin /><span className="text-sm text-[var(--text-muted)]">Loading question…</span>
            </div>
          ) : !question ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm font-semibold text-[var(--text-sub)]">Question not found</p>
              <button className={`${btnS} mt-4`} onClick={() => navigate("/questions")}>
                Back to Questions
              </button>
            </div>
          ) : (
            <>
              {/* ── Metadata bar (matching screenshot) ── */}
              <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                {question.chart_type && (
                  <MetaBadge label="Chart Type" value={question.chart_type}
                    color={(() => { const c = ["#818cf8","#34d399","#f472b6","#fb923c","#a78bfa"]; let h = 0; for (const ch of (question.chart_type||"")) h = (h*31+ch.charCodeAt(0))&0xffffff; return c[Math.abs(h)%c.length]; })()}
                  />
                )}
                {question.dataset_id && (
                  <MetaBadge label="Dataset" value={`Dataset ${question.dataset_id}`} />
                )}
                <MetaBadge label="Question ID" value={`#${question.id}`} />
                <MetaBadge label="Materialization"
                  value={matEnabled ? "ENABLED" : "DISABLED"}
                  color={matEnabled ? "#4ade80" : "#94a3b8"}
                />
                {matLimit && (
                  <MetaBadge label="Active Configurations" value={`LIMIT: ${matLimit}`} color="#f472b6" />
                )}
                {question.status && (
                  <MetaBadge label="Status" value={question.status}
                    color={question.status === "published" ? "#4ade80" : question.status === "archived" ? "#94a3b8" : "#facc15"}
                  />
                )}
                {question.category?.name && (
                  <MetaBadge label="Group" value={question.category.name} />
                )}
              </div>

              {/* ── Description ── */}
              {question.description && (
                <div className="px-4 py-3 rounded-xl text-sm text-[var(--text-muted)]"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  {question.description}
                </div>
              )}

              {/* ── Chart Visualization ── */}
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
                  <h2 className="text-sm font-bold">Chart Visualization</h2>
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    {dataLoading && <Spin />}
                    {chartData.length > 0 && (
                      <span className="text-[0.65rem]">Showing top {chartData.length} results</span>
                    )}
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--bg-input)] transition-colors cursor-pointer" title="Zoom"
                      onClick={() => {}}>
                      <I d={ico.zoomIn} size={14} />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--bg-input)] transition-colors cursor-pointer" title="Labels"
                      onClick={() => {}}>
                      <I d={ico.label} size={14} />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--bg-input)] transition-colors cursor-pointer" title="Chart type"
                      onClick={() => {}}>
                      <I d={ico.chart} size={14} />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--bg-input)] transition-colors cursor-pointer" title="Download"
                      onClick={() => push("Download started")}>
                      <I d={ico.download} size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  {dataLoading ? (
                    <div className="flex items-center justify-center gap-3 h-64">
                      <Spin /><span className="text-sm text-[var(--text-muted)]">Loading chart data…</span>
                    </div>
                  ) : (
                    <ChartRenderer chartType={chartType} data={chartData} height={380} />
                  )}
                </div>
              </div>

              {/* ── Raw config (collapsible) ── */}
              {question.definition && (
                <details className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
                  <summary className="px-5 py-3.5 text-sm font-semibold cursor-pointer select-none hover:bg-[var(--bg-input)] transition-colors">
                    Question Configuration
                  </summary>
                  <div className="px-5 pb-5">
                    <pre className="text-[0.7rem] text-[var(--text-muted)] overflow-auto max-h-64 bg-[var(--bg-input)] p-3 rounded-lg mt-2 whitespace-pre-wrap">
                      {JSON.stringify(question.definition, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </>
          )}
        </main>

        <footer className="px-6 py-2.5 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between text-[0.65rem] text-[var(--text-muted)]">
          <span>© 2026 PCSoft Analytics</span><span>v1.0.0</span>
        </footer>
      </div>
      <Toast />
    </div>
  );
}
