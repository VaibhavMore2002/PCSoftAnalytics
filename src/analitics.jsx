import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, ScatterChart,
  Scatter, ZAxis,
} from "recharts";

/* ── Premium palette ──────────────────────────────────────────────────────── */
const P = [
  "#818cf8","#34d399","#f59e0b","#f43f5e","#0ea5e9",
  "#a78bfa","#fb923c","#06b6d4","#e879f9","#84cc16",
  "#f472b6","#22d3ee","#facc15","#4ade80","#c084fc",
];
const GRAD = [
  ["#818cf8","#6366f1"],["#34d399","#10b981"],["#f59e0b","#d97706"],
  ["#f43f5e","#e11d48"],["#0ea5e9","#0284c7"],["#a78bfa","#7c3aed"],
];

/* ── Inline keyframes (injected once) ─────────────────────────────────────── */
const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse-ring{0%{transform:scale(.85);opacity:.6}70%{transform:scale(1);opacity:0}100%{opacity:0}}
@keyframes glow-float{0%,100%{filter:blur(40px) brightness(1)}50%{filter:blur(55px) brightness(1.15)}}
.fade-card{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}
.widget-card{transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease,border-color .22s ease}
.widget-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px -8px rgba(99,102,241,.18),0 2px 12px rgba(0,0,0,.08)!important;border-color:rgba(99,102,241,.35)!important}
.glow-orb{position:absolute;border-radius:50%;pointer-events:none;animation:glow-float 6s ease-in-out infinite}
.chart-tooltip{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
`;

/* ── Animated counter ─────────────────────────────────────────────────────── */
function AnimNum({ to, dur = 1200 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let n = 0; const step = to / (dur / 16);
    const id = setInterval(() => { n += step; if (n >= to) { setV(to); clearInterval(id); } else setV(Math.floor(n)); }, 16);
    return () => clearInterval(id);
  }, [to, dur]);
  return <>{v.toLocaleString()}</>;
}

/* ── Detect chart type ────────────────────────────────────────────────────── */
function detectType(w) {
  const n = (w.name || w.title || "").toLowerCase();
  if (n.includes("funnel"))    return "funnel";
  if (n.includes("waterfall")) return "waterfall";
  if (n.includes("gauge"))     return "gauge";
  if (n.includes("pie"))       return "pie";
  if (n.includes("line"))      return "line";
  if (n.includes("area"))      return "area";
  if (n.includes("bar"))       return "bar";
  if (n.includes("scatter"))   return "scatter";
  if (n.includes("kpi"))       return "kpi";
  const ct = w.content?.chart_type || w.settings?.chart_type || w.chart_type || "";
  if (ct) return ct.toLowerCase();
  return "bar";
}

/* ── Get chart data ───────────────────────────────────────────────────────── */
function getData(w, wd) {
  if (wd) {
    if (Array.isArray(wd)) return wd;
    for (const k of ["data","rows","results"]) if (Array.isArray(wd[k])) return wd[k];
    if (wd.series) return wd.series;
  }
  const c = w.content || {};
  for (const k of ["data","rows"]) if (Array.isArray(c[k])) return c[k];
  const s = (w.name || w.title || "x").length;
  return Array.from({ length: 7 }, (_, i) => ({
    name: ["Jan","Feb","Mar","Apr","May","Jun","Jul"][i],
    value: Math.round(30 + Math.sin(s + i * 0.9) * 35 + Math.random() * 25),
    v2: Math.round(20 + Math.cos(s + i * 1.1) * 25 + Math.random() * 20),
  }));
}

/* ── Custom tooltip ───────────────────────────────────────────────────────── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip" style={{
      background: "rgba(15,23,42,.88)", border: "1px solid rgba(99,102,241,.25)",
      borderRadius: 12, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,.3)",
    }}>
      {label && <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginBottom: 4, fontWeight: 500 }}>{label}</div>}
      {payload.map((e, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, boxShadow: `0 0 6px ${e.color}66` }} />
          <span style={{ color: "rgba(255,255,255,.7)" }}>{e.name}:</span>
          <span style={{ color: "#fff", fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{e.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Premium Chart Components
   ═══════════════════════════════════════════════════════════════════════════ */

function BarW({ data, idx }) {
  const [g1, g2] = GRAD[idx % GRAD.length];
  const gid = `bg${idx}`;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barSize={22} barGap={4}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={g1} stopOpacity={1} />
            <stop offset="100%" stopColor={g2} stopOpacity={0.6} />
          </linearGradient>
          <filter id={`glow${idx}`}><feGaussianBlur stdDeviation="3" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.08)" />
        <XAxis dataKey="name" tick={{ fill: "rgba(148,163,184,.6)", fontSize: 11, fontFamily: "'DM Sans'" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(148,163,184,.4)", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(99,102,241,.06)" }} />
        <Bar dataKey="value" fill={`url(#${gid})`} radius={[8, 8, 0, 0]} filter={`url(#glow${idx})`} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineW({ data, idx }) {
  const c = P[idx % P.length];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <defs><filter id={`lg${idx}`}><feGaussianBlur stdDeviation="2" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.08)" />
        <XAxis dataKey="name" tick={{ fill: "rgba(148,163,184,.6)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(148,163,184,.4)", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<ChartTip />} />
        <Line type="monotone" dataKey="value" stroke={c} strokeWidth={3} dot={{ r: 5, fill: c, strokeWidth: 2, stroke: "#0f172a" }} activeDot={{ r: 7, strokeWidth: 0, fill: c, filter: `url(#lg${idx})` }} filter={`url(#lg${idx})`} />
        {data[0]?.v2 !== undefined && <Line type="monotone" dataKey="v2" stroke={P[(idx+2)%P.length]} strokeWidth={2} strokeDasharray="6 3" dot={false} />}
      </LineChart>
    </ResponsiveContainer>
  );
}

function AreaW({ data, idx }) {
  const c = P[idx % P.length];
  const gid = `ag${idx}`;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity={0.35} />
            <stop offset="100%" stopColor={c} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.08)" />
        <XAxis dataKey="name" tick={{ fill: "rgba(148,163,184,.6)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(148,163,184,.4)", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<ChartTip />} />
        <Area type="monotone" dataKey="value" stroke={c} strokeWidth={2.5} fill={`url(#${gid})`} dot={false} />
        {data[0]?.v2 !== undefined && <Area type="monotone" dataKey="v2" stroke={P[(idx+3)%P.length]} strokeWidth={1.5} fill="transparent" strokeDasharray="5 3" dot={false} />}
      </AreaChart>
    </ResponsiveContainer>
  );
}

function PieW({ data, idx }) {
  const [hover, setHover] = useState(null);
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ResponsiveContainer width="60%" height={240}>
        <PieChart>
          <defs>{data.map((_, i) => (
            <linearGradient key={i} id={`pg${idx}_${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={P[i % P.length]} stopOpacity={1} />
              <stop offset="100%" stopColor={P[(i+1) % P.length]} stopOpacity={0.7} />
            </linearGradient>
          ))}</defs>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4} strokeWidth={0}
            onMouseEnter={(_, i) => setHover(i)} onMouseLeave={() => setHover(null)}>
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#pg${idx}_${i})`}
                style={{ filter: hover === i ? `drop-shadow(0 0 8px ${P[i%P.length]}88)` : "none", transition: "filter .2s", cursor: "pointer" }} />
            ))}
          </Pie>
          <Tooltip content={<ChartTip />} />
          {/* center label */}
          <text x="50%" y="48%" textAnchor="middle" fill="var(--text)" fontSize={22} fontWeight={800} fontFamily="'DM Mono',monospace">
            {total}
          </text>
          <text x="50%" y="58%" textAnchor="middle" fill="var(--text-muted)" fontSize={10}>TOTAL</text>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {data.slice(0, 6).map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: P[i%P.length], boxShadow: `0 0 6px ${P[i%P.length]}44`, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "var(--text-sub)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "'DM Mono',monospace" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GaugeW({ data, idx }) {
  const val = Math.min(100, Math.max(0, data[0]?.value ?? 65));
  const color = val > 70 ? "#34d399" : val > 40 ? "#f59e0b" : "#f43f5e";
  const r = 80, sw = 14, cx = 100, cy = 95;
  const circ = Math.PI * r;
  const offset = circ - (val / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0" }}>
      <svg width={200} height={120} viewBox="0 0 200 120">
        <defs>
          <linearGradient id={`gg${idx}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <filter id={`ggl${idx}`}><feGaussianBlur stdDeviation="3" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(148,163,184,.1)" strokeWidth={sw} strokeLinecap="round" />
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={`url(#gg${idx})`} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} filter={`url(#ggl${idx})`}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
        <text x={cx} y={cy - 12} textAnchor="middle" fill="var(--text)" fontSize={32} fontWeight={800} fontFamily="'DM Mono',monospace">{val}</text>
        <text x={cx} y={cy + 6} textAnchor="middle" fill="var(--text-muted)" fontSize={11} fontWeight={500}>{data[0]?.name || "Score"}</text>
      </svg>
      <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
        {[["Low","#f43f5e"],["Med","#f59e0b"],["High","#34d399"]].map(([l,c]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 3, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelW({ data, idx }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const max = sorted[0]?.value || 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "8px 0" }}>
      {sorted.map((d, i) => {
        const pct = Math.max(25, (d.value / max) * 100);
        const [g1, g2] = GRAD[i % GRAD.length];
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 56, textAlign: "right", fontSize: 11, color: "var(--text-sub)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</span>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{
                width: `${pct}%`, height: 32, borderRadius: 8,
                background: `linear-gradient(135deg, ${g1}, ${g2})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "'DM Mono',monospace",
                boxShadow: `0 4px 16px ${g1}33`,
                transition: "width .8s cubic-bezier(.22,1,.36,1)",
              }}>
                {d.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WaterfallW({ data, idx }) {
  let run = 0;
  const wd = data.map((d, i) => { const s = run; run += d.value; return { ...d, start: s, end: run, positive: d.value >= 0 }; });
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={wd} barSize={26}>
        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.08)" />
        <XAxis dataKey="name" tick={{ fill: "rgba(148,163,184,.6)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(148,163,184,.4)", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(99,102,241,.04)" }} />
        <Bar dataKey="start" stackId="w" fill="transparent" />
        <Bar dataKey="value" stackId="w" radius={[6, 6, 0, 0]}>
          {wd.map((d, i) => (
            <Cell key={i} fill={d.positive ? "#34d399" : "#f43f5e"}
              style={{ filter: `drop-shadow(0 2px 4px ${d.positive?"rgba(52,211,153,.3)":"rgba(244,63,94,.3)"})` }} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function ScatterW({ data, idx }) {
  const c = P[idx % P.length];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ScatterChart>
        <CartesianGrid stroke="rgba(148,163,184,.08)" />
        <XAxis dataKey="name" tick={{ fill: "rgba(148,163,184,.6)", fontSize: 11 }} axisLine={false} tickLine={false} name="X" />
        <YAxis dataKey="value" tick={{ fill: "rgba(148,163,184,.4)", fontSize: 10 }} axisLine={false} tickLine={false} name="Y" width={32} />
        <ZAxis range={[40, 200]} />
        <Tooltip content={<ChartTip />} />
        <Scatter data={data} fill={c}>
          {data.map((_, i) => <Cell key={i} fill={P[i % P.length]} style={{ filter: `drop-shadow(0 0 4px ${P[i%P.length]}66)` }} />)}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

/* ── Chart router ─────────────────────────────────────────────────────────── */
function WidgetChart({ widget, widgetData, idx }) {
  const type = detectType(widget);
  const data = getData(widget, widgetData);
  switch (type) {
    case "line":      return <LineW data={data} idx={idx} />;
    case "area":      return <AreaW data={data} idx={idx} />;
    case "pie":       return <PieW data={data} idx={idx} />;
    case "gauge":     return <GaugeW data={data} idx={idx} />;
    case "funnel":    return <FunnelW data={data} idx={idx} />;
    case "waterfall": return <WaterfallW data={data} idx={idx} />;
    case "scatter":   return <ScatterW data={data} idx={idx} />;
    default:          return <BarW data={data} idx={idx} />;
  }
}

/* ── Type badge colors ────────────────────────────────────────────────────── */
const BADGE = {
  bar:       ["rgba(99,102,241,.12)","#818cf8","rgba(99,102,241,.3)"],
  line:      ["rgba(52,211,153,.12)","#34d399","rgba(52,211,153,.3)"],
  area:      ["rgba(14,165,233,.12)","#0ea5e9","rgba(14,165,233,.3)"],
  pie:       ["rgba(244,63,94,.12)","#f43f5e","rgba(244,63,94,.3)"],
  gauge:     ["rgba(245,158,11,.12)","#f59e0b","rgba(245,158,11,.3)"],
  funnel:    ["rgba(167,139,250,.12)","#a78bfa","rgba(167,139,250,.3)"],
  waterfall: ["rgba(6,182,212,.12)","#06b6d4","rgba(6,182,212,.3)"],
  scatter:   ["rgba(232,121,249,.12)","#e879f9","rgba(232,121,249,.3)"],
};

function TypeBadge({ type }) {
  const [bg, fg, bd] = BADGE[type] || BADGE.bar;
  return (
    <span style={{ fontSize: "0.58rem", padding: "3px 10px", borderRadius: 99, background: bg, color: fg,
      border: `1px solid ${bd}`, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
      fontFamily: "'DM Mono',monospace" }}>
      {type}
    </span>
  );
}

/* ── Chart type icon ──────────────────────────────────────────────────────── */
function CIcon({ type }) {
  const s = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "pie":       return <svg {...s}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
    case "line":      return <svg {...s}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
    case "area":      return <svg {...s}><path d="M3 20 7 12l5 4 5-8 4 5V20H3z"/></svg>;
    case "gauge":     return <svg {...s}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
    case "funnel":    return <svg {...s}><path d="M22 4H2l7 8v6l6 2V12l7-8z"/></svg>;
    case "waterfall": return <svg {...s}><rect x="2" y="14" width="5" height="7" rx="1"/><rect x="9.5" y="5" width="5" height="16" rx="1"/><rect x="17" y="9" width="5" height="12" rx="1"/></svg>;
    case "scatter":   return <svg {...s}><circle cx="7" cy="15" r="2"/><circle cx="12" cy="9" r="2"/><circle cx="17" cy="14" r="2"/><circle cx="9" cy="5" r="1.5"/><circle cx="16" cy="7" r="1.5"/></svg>;
    default:          return <svg {...s}><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="5" width="4" height="16" rx="1"/><rect x="17" y="8" width="4" height="13" rx="1"/></svg>;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Dashboard Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { navItems, activeNav, handleNavClick, api } = useApp();

  const [dash, setDash] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [filters, setFilters] = useState([]);
  const [widgetData, setWidgetData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !api) return;
    let cancelled = false;
    setLoading(true);

    Promise.all([
      api(`/api/v1/dashboards/${id}`).catch(() => null),
      api(`/api/v1/dashboards/${id}/filters`).catch(() => null),
      api(`/api/v1/dashboards/${id}/data`).catch(() => null),
    ]).then(([dashData, filterData, dataResp]) => {
      if (cancelled) return;
      const d = dashData?.data && !Array.isArray(dashData.data) && typeof dashData.data === "object"
        ? dashData.data : dashData;
      setDash(d);
      setWidgets(Array.isArray(d?.widgets) ? d.widgets : []);
      setFilters(Array.isArray(filterData) ? filterData : []);
      if (dataResp?.data && typeof dataResp.data === "object") setWidgetData(dataResp.data);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [id, api]);

  const wc = dash ? (Array.isArray(dash.widgets) ? dash.widgets.length : (dash.widget_count ?? 0)) : 0;
  const status = dash?.status || "";
  const af = filters.filter((f) => f.is_active);
  const sColor = status.toLowerCase() === "active" ? "#4ade80" : status.toLowerCase() === "draft" ? "#fbbf24" : "#94a3b8";

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ── Premium Header ───────────────────────────────────────── */}
          <header style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 28px", borderBottom: "1px solid var(--border)",
            background: "var(--bg-card)", position: "relative", overflow: "hidden",
          }}>
            {/* Subtle header glow */}
            <div style={{ position: "absolute", top: -30, right: "20%", width: 200, height: 60,
              background: "rgba(99,102,241,.06)", borderRadius: "50%", filter: "blur(30px)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
              <button onClick={() => navigate("/dashboards")}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 10,
                  background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-sub)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,.4)"; e.currentTarget.style.color = "var(--nav-active)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-sub)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Dashboards
              </button>
              <div style={{ width: 1, height: 20, background: "var(--border)" }} />
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>PCSoft Analytics</span>
            </div>

            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
              <div style={{ position: "relative", width: 8, height: 8 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#34d399", animation: "pulse-ring 2s ease infinite" }} />
                <span style={{ position: "absolute", inset: 1, borderRadius: "50%", background: "#34d399" }} />
              </div>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>Live</span>
            </div>
          </header>

          {/* ── Content ──────────────────────────────────────────────── */}
          <main style={{ flex: 1, overflow: "auto", padding: "24px 28px", position: "relative" }}>
            {/* Background orbs */}
            <div className="glow-orb" style={{ width: 300, height: 300, top: -80, right: -60, background: "rgba(99,102,241,.04)" }} />
            <div className="glow-orb" style={{ width: 200, height: 200, bottom: 40, left: -40, background: "rgba(52,211,153,.03)", animationDelay: "3s" }} />

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "80px 0" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </div>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Loading dashboard…</span>
              </div>
            ) : dash ? (
              <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

                {/* ── Dashboard Hero Card ────────────────────────────── */}
                <div className="fade-card" style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16,
                  padding: "20px 24px", marginBottom: 20, position: "relative", overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                }}>
                  {/* Accent stripe */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${sColor}, ${sColor}00)` }} />

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
                    <div style={{ flex: 1 }}>
                      <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                        {dash.name || "Untitled Dashboard"}
                      </h1>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: "0.62rem", fontWeight: 700, padding: "3px 12px", borderRadius: 99,
                          textTransform: "uppercase", letterSpacing: ".08em",
                          background: `${sColor}18`, color: sColor, border: `1px solid ${sColor}30`,
                        }}>{status || "unknown"}</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>•</span>
                        <span style={{ fontSize: 12, color: "var(--text-sub)", fontWeight: 600 }}>
                          <span style={{ fontFamily: "'DM Mono',monospace", color: "var(--nav-active)", fontWeight: 800 }}>{wc}</span> widget{wc !== 1 ? "s" : ""}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>|</span>
                        <span style={{ fontSize: 12, color: "var(--text-sub)", fontWeight: 500 }}>Main Dashboard</span>
                      </div>
                      {dash.description && (
                        <p style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 8, lineHeight: 1.5 }}>{dash.description}</p>
                      )}
                    </div>

                    {/* Quick stats */}
                    <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                      {[
                        ["Widgets", wc, "#818cf8"],
                        ["Filters", filters.length, "#f59e0b"],
                        ["Active", af.length, "#34d399"],
                      ].map(([label, val, col]) => (
                        <div key={label} style={{
                          textAlign: "center", padding: "10px 16px", borderRadius: 12,
                          background: `${col}0a`, border: `1px solid ${col}18`,
                          minWidth: 72,
                        }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: col, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>
                            <AnimNum to={val} />
                          </div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Filters strip ──────────────────────────────────── */}
                <div className="fade-card" style={{ animationDelay: ".08s", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-sub)", textTransform: "uppercase", letterSpacing: ".1em" }}>Dashboard Filters</span>
                  </div>
                  {af.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {af.map((f, i) => (
                        <span key={i} style={{
                          padding: "5px 14px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                          background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-sub)",
                        }}>{f.name}</span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
                      No filters applied. Add filters to refine data across all widgets.
                    </p>
                  )}
                </div>

                {/* ── Widget Grid ─────────────────────────────────────── */}
                {widgets.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))", gap: 16 }}>
                    {widgets.map((w, i) => {
                      const name = w.name || w.title || w.widget_name || `Widget ${i + 1}`;
                      const type = detectType(w);
                      const wd = widgetData[w.id] || widgetData[String(w.id)] || null;
                      const accent = P[i % P.length];
                      return (
                        <div key={w.id || i} className="widget-card fade-card" style={{
                          borderRadius: 16, border: "1px solid var(--border)",
                          background: "var(--bg-card)", overflow: "hidden",
                          boxShadow: "0 2px 12px rgba(0,0,0,.04), 0 0 0 1px rgba(255,255,255,.02) inset",
                          animationDelay: `${0.12 + i * 0.06}s`, position: "relative",
                        }}>
                          {/* Top accent line */}
                          <div style={{ height: 2, background: `linear-gradient(90deg, ${accent}, ${accent}00)` }} />

                          {/* Card glow */}
                          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80,
                            borderRadius: "50%", background: `${accent}08`, filter: "blur(25px)", pointerEvents: "none" }} />

                          {/* Widget header */}
                          <div style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "14px 18px",
                            borderBottom: "1px solid var(--border)",
                          }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                              background: `${accent}12`, border: `1px solid ${accent}22`, color: accent,
                            }}>
                              <CIcon type={type} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>Widget #{i + 1}</div>
                            </div>
                            <TypeBadge type={type} />
                          </div>

                          {/* Chart */}
                          <div style={{ padding: "16px 14px 14px" }}>
                            <WidgetChart widget={w} widgetData={wd} idx={i} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="fade-card" style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "60px 20px", borderRadius: 16, border: "1px solid var(--border)",
                    background: "var(--bg-card)", animationDelay: ".15s",
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12, fontWeight: 500 }}>No widgets in this dashboard</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", fontSize: 14, color: "var(--text-muted)" }}>
                Dashboard not found.
              </div>
            )}
          </main>

          {/* ── Footer ───────────────────────────────────────────────── */}
          <footer style={{
            padding: "10px 28px", borderTop: "1px solid var(--border)", background: "var(--bg-card)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            fontSize: "0.65rem", color: "var(--text-muted)",
          }}>
            <span>© 2026 PCSoft Analytics</span>
            <span>v1.0.0</span>
          </footer>
        </div>
      </div>
    </>
  );
}
