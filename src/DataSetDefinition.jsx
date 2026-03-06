import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";
import { useApp } from "./AppContext.jsx";

/* ═══════════════════════════════════════════════════════════
   Theme (matches qr.jsx visual style, with light/dark)
   ═══════════════════════════════════════════════════════════ */
const darkT = {
  bg: "#0B0D11", surface: "#14171F", surface2: "#1D212B", surface3: "#272D3A",
  border: "#282E3E", border2: "#3A4356",
  accent: "#3B82F6", accentDim: "rgba(59,130,246,0.12)", accentGlow: "rgba(59,130,246,0.25)",
  green: "#10B981", amber: "#F59E0B", red: "#EF4444", purple: "#8B5CF6",
  text: "#F3F4F6", text2: "#9CA3AF", text3: "#6B7280",
};
const lightT = {
  bg: "#F8F9FC", surface: "#FFFFFF", surface2: "#F1F3F9", surface3: "#E8EBF2",
  border: "#E2E5EE", border2: "#D0D5E0",
  accent: "#3B82F6", accentDim: "rgba(59,130,246,0.08)", accentGlow: "rgba(59,130,246,0.18)",
  green: "#10B981", amber: "#F59E0B", red: "#EF4444", purple: "#8B5CF6",
  text: "#111827", text2: "#4B5563", text3: "#9CA3AF",
};

const MONO = "'JetBrains Mono','Fira Code',monospace";
const SANS = "'Inter',-apple-system,BlinkMacSystemFont,sans-serif";

const DOT_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#F472B6", "#8B5CF6", "#FB923C", "#22D3EE", "#EF4444"];

const TYPE_COLORS = {
  INT: "#60a5fa", INTEGER: "#60a5fa", BIGINT: "#60a5fa", SMALLINT: "#60a5fa", TINYINT: "#60a5fa",
  TEXT: "#10B981", VARCHAR: "#10B981", CHAR: "#10B981", STRING: "#10B981", NVARCHAR: "#10B981", NCHAR: "#10B981",
  DATE: "#F59E0B", DATETIME: "#F59E0B", TIMESTAMP: "#F59E0B", DATETIME2: "#F59E0B",
  DECIMAL: "#F472B6", FLOAT: "#F472B6", DOUBLE: "#F472B6", NUMERIC: "#F472B6", MONEY: "#F472B6", REAL: "#F472B6",
  BOOLEAN: "#FB923C", BOOL: "#FB923C", BIT: "#FB923C",
  JSON: "#8B5CF6", JSONB: "#8B5CF6",
};

const NODE_HEADER_H = 44;
const FIELD_H = 30;
const NODE_WIDTH = 224;

function bez(x1, y1, x2, y2) {
  const dx = Math.max(Math.abs(x2 - x1) * 0.5, 60);
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

function nodeHeight(fieldCount) {
  return NODE_HEADER_H + fieldCount * FIELD_H + 8;
}

function portPos(node, fieldName, side) {
  const idx = (node.cols || []).findIndex((f) => f.name === fieldName);
  if (idx === -1) return null;
  return {
    x: side === "right" ? node.x + NODE_WIDTH : node.x,
    y: node.y + NODE_HEADER_H + 4 + idx * FIELD_H + FIELD_H / 2,
  };
}

const edgeColor = (t, T) =>
  t === "LEFT" ? T.green : t === "RIGHT" ? T.purple : t === "FULL" ? "#f97316" : T.accent;

/* ── SQL Panel ── */
function SqlPanel({ nodes, edges, T }) {
  const [copied, setCopied] = useState(false);
  const kw = (t) => <span style={{ color: "#c792ea" }}>{t}</span>;
  const tb = (t) => <span style={{ color: T.accent }}>{t}</span>;
  const cl = (t) => <span style={{ color: "#82aaff" }}>{t}</span>;
  const nm = (t) => <span style={{ color: T.amber }}>{t}</span>;

  const lines = [];
  if (!nodes.length) {
    lines.push(<span key="e" style={{ color: T.text3 }}>-- No tables in definition</span>);
  } else {
    const first = nodes[0];
    const prefix = first.schema ? `${first.schema}.` : "";
    lines.push(<span key="s">{kw("SELECT")}{"\n  "}{tb(first.name)}.{cl("*")}{"\n"}</span>);
    lines.push(<span key="f">{kw("FROM")} {tb(`${prefix}${first.name}`)}{"\n"}</span>);
    edges.forEach((e, i) => {
      const toNode = nodes.find((n) => n.id === e.to);
      const fromNode = nodes.find((n) => n.id === e.from);
      if (!toNode || !fromNode) return;
      const toPrefix = toNode.schema ? `${toNode.schema}.` : "";
      lines.push(
        <span key={`j${i}`}>
          {kw((e.type || "INNER") + " JOIN")} {tb(`${toPrefix}${toNode.name}`)}{"\n  "}
          {kw("ON")} {tb(fromNode.name)}.{cl(e.onLeft || "?")} = {tb(toNode.name)}.{cl(e.onRight || "?")}{"\n"}
        </span>
      );
    });
    lines.push(<span key="l">{kw("LIMIT")} {nm("100")}{kw(";")}</span>);
  }

  const plain = !nodes.length
    ? "-- No tables in definition"
    : (() => {
        const first = nodes[0];
        const prefix = first.schema ? `${first.schema}.` : "";
        let sql = `SELECT\n  ${first.name}.*\nFROM ${prefix}${first.name}\n`;
        edges.forEach((e) => {
          const toNode = nodes.find((n) => n.id === e.to);
          const fromNode = nodes.find((n) => n.id === e.from);
          if (!toNode || !fromNode) return;
          const toPrefix = toNode.schema ? `${toNode.schema}.` : "";
          sql += `${e.type || "INNER"} JOIN ${toPrefix}${toNode.name}\n  ON ${fromNode.name}.${e.onLeft || "?"} = ${toNode.name}.${e.onRight || "?"}\n`;
        });
        sql += "LIMIT 100;";
        return sql;
      })();

  const copy = () => {
    navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 18 }}>
      <div style={{ padding: "8px 12px", background: T.surface2, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 6 }}>
        {[T.red, T.amber, T.green].map((c) => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 10, color: T.text3, background: T.border, padding: "2px 7px", borderRadius: 4 }}>SQL</span>
      </div>
      <div style={{ padding: 14, fontFamily: MONO, fontSize: 11.5, lineHeight: 1.85, color: T.text, whiteSpace: "pre", overflowX: "auto", minHeight: 110 }}>{lines}</div>
      <div style={{ padding: "8px 12px", background: T.surface2, borderTop: `1px solid ${T.border}` }}>
        <button onClick={copy} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${T.border2}`, background: "transparent", color: copied ? T.green : T.text2, fontFamily: SANS, transition: "all 0.15s" }}>
          {copied ? "\u2713 Copied" : "\u2398 Copy"}
        </button>
      </div>
    </div>
  );
}

/* ── Joins Panel ── */
function JoinsPanel({ edges, nodes, T }) {
  if (!edges.length)
    return (
      <div style={{ color: T.text3, fontSize: 13, textAlign: "center", marginTop: 40, lineHeight: 1.6 }}>
        No joins defined in this dataset
      </div>
    );
  return (
    <div>
      {edges.map((edge) => {
        const fromNode = nodes.find((n) => n.id === edge.from);
        const toNode = nodes.find((n) => n.id === edge.to);
        const ec = edgeColor(edge.type || "INNER", T);
        return (
          <div key={edge.id} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, marginBottom: 10, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: ec }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontFamily: MONO, color: ec, background: `${ec}18`, border: `1px solid ${ec}40`, padding: "2px 8px", borderRadius: 4 }}>{(edge.type || "INNER")} JOIN</span>
              <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: T.text }}>{fromNode?.name || "?"} \u2192 {toNode?.name || "?"}</span>
            </div>
            {edge.onLeft && edge.onRight && (
              <div style={{ fontFamily: MONO, fontSize: 12, display: "flex", gap: 6, alignItems: "center", marginBottom: 10 }}>
                <span style={{ color: T.accent }}>{fromNode?.name}</span><span style={{ color: T.text3 }}>.</span><span style={{ color: T.text2 }}>{edge.onLeft}</span>
                <span style={{ color: T.text3 }}>\u2500\u2500</span>
                <span style={{ color: T.accent }}>{toNode?.name}</span><span style={{ color: T.text3 }}>.</span><span style={{ color: T.text2 }}>{edge.onRight}</span>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 5 }}>
              {["INNER", "LEFT", "RIGHT", "FULL", "CROSS"].map((jt) => (
                <span key={jt} style={{
                  padding: "4px", borderRadius: 6, fontSize: 10, fontFamily: MONO, textAlign: "center",
                  border: `1px solid ${(edge.type || "INNER") === jt ? edgeColor(jt, T) : T.border}`,
                  background: (edge.type || "INNER") === jt ? `${edgeColor(jt, T)}18` : T.surface,
                  color: (edge.type || "INNER") === jt ? edgeColor(jt, T) : T.text3,
                  opacity: (edge.type || "INNER") === jt ? 1 : 0.4,
                }}>{jt}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Table Node (SVG) ── */
function TableNode({ node, T, onStartDrag }) {
  const fields = node.cols || [];
  const nh = nodeHeight(fields.length);
  const dbColor = node.dotColor || T.accent;

  return (
    <g transform={`translate(${node.x},${node.y})`}>
      <rect x={5} y={8} width={NODE_WIDTH} height={nh} rx={13} fill="rgba(0,0,0,0.3)" />
      <rect x={0} y={0} width={NODE_WIDTH} height={nh} rx={12} fill={T.surface} stroke={T.border2} strokeWidth={1} />
      <rect x={0} y={0} width={NODE_WIDTH} height={NODE_HEADER_H} rx={12} fill={T.surface2} />
      <rect x={0} y={NODE_HEADER_H - 12} width={NODE_WIDTH} height={12} fill={T.surface2} />
      <line x1={0} y1={NODE_HEADER_H} x2={NODE_WIDTH} y2={NODE_HEADER_H} stroke={T.border} strokeWidth={1} />

      <circle cx={16} cy={NODE_HEADER_H / 2} r={4.5} fill={dbColor} style={{ filter: `drop-shadow(0 0 4px ${dbColor})` }} />

      <text x={30} y={NODE_HEADER_H / 2 + 1} dominantBaseline="middle" fill={T.text}
        fontSize={13} fontWeight={600} fontFamily={SANS}>{node.name}</text>

      <rect x={NODE_WIDTH - 50} y={12} width={38} height={16} rx={4} fill={T.bg} />
      <text x={NODE_WIDTH - 31} y={20} textAnchor="middle" dominantBaseline="middle"
        fill={T.text3} fontSize={9.5} fontFamily={MONO}>{fields.length} cols</text>

      <rect x={0} y={0} width={NODE_WIDTH} height={NODE_HEADER_H} rx={12}
        fill="transparent" style={{ cursor: "move" }}
        onMouseDown={(e) => { e.stopPropagation(); onStartDrag(e, node.id); }}
      />

      {fields.length === 0 && (
        <text x={NODE_WIDTH / 2} y={NODE_HEADER_H + 24} textAnchor="middle" dominantBaseline="middle"
          fill={T.text3} fontSize={11} fontFamily={SANS}>Loading columns\u2026</text>
      )}

      {fields.map((field, i) => {
        const fy = NODE_HEADER_H + 4 + i * FIELD_H;
        const cy = fy + FIELD_H / 2;
        const typeColor = TYPE_COLORS[(field.type || "").toUpperCase()] || "#94a3b8";
        return (
          <g key={field.name}>
            <rect x={0} y={fy} width={NODE_WIDTH} height={FIELD_H} fill="transparent"
              onMouseEnter={(e) => e.currentTarget.setAttribute("fill", T.surface3)}
              onMouseLeave={(e) => e.currentTarget.setAttribute("fill", "transparent")}
            />
            <rect x={10} y={fy + 7} width={42} height={16} rx={3} fill={T.bg} stroke={T.border} strokeWidth={0.8} />
            <text x={31} y={fy + 15} textAnchor="middle" dominantBaseline="middle"
              fill={typeColor} fontSize={8.5} fontWeight={600} fontFamily={MONO}>{field.type}</text>
            <text x={58} y={cy} dominantBaseline="middle"
              fill={T.text2} fontSize={12} fontFamily={MONO}>{field.name}</text>
            <circle cx={0} cy={cy} r={5} fill={T.surface3} stroke={T.border2} strokeWidth={1.5} opacity={0.5} />
            <circle cx={NODE_WIDTH} cy={cy} r={5} fill={T.surface3} stroke={T.border2} strokeWidth={1.5} opacity={0.5} />
          </g>
        );
      })}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════
   DataSetDefinition \u2014 Main Component
   ═══════════════════════════════════════════════════════════ */
export default function DataSetDefinition() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { navItems, activeNav, handleNavClick, api } = useApp();

  const T = isDark ? darkT : lightT;

  const [ds, setDs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [activeTab, setActiveTab] = useState("sql");

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const scaleRef = useRef(scale);
  const panRef = useRef(pan);
  const nodesRef = useRef(nodes);

  const [expandedSource, setExpandedSource] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { panRef.current = pan; }, [pan]);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);

  const toCanvas = useCallback((sx, sy) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (sx - rect.left - panRef.current.x) / scaleRef.current,
      y: (sy - rect.top - panRef.current.y) / scaleRef.current,
    };
  }, []);

  const applyZoom = useCallback((factor, pivotSx, pivotSy) => {
    setScale((prev) => {
      const next = Math.max(0.2, Math.min(3, prev * factor));
      const r = next / prev;
      setPan((p) => ({
        x: pivotSx - r * (pivotSx - p.x),
        y: pivotSy - r * (pivotSy - p.y),
      }));
      return next;
    });
  }, []);

  const zoomBtn = (dir) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    applyZoom(dir > 0 ? 1.2 : 1 / 1.2, rect.width / 2, rect.height / 2);
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    applyZoom(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX - rect.left, e.clientY - rect.top);
  }, [applyZoom]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  /* ── Load dataset + columns ── */
  useEffect(() => {
    if (!api || !id) return;
    setLoading(true);
    api(`/api/v1/datasets/${id}`)
      .then((data) => {
        setDs(data);
        const sources = data.definition?.sources || data.definition?.tables || [];
        const defJoins = data.definition?.joins || [];

        const builtNodes = sources.map((s, i) => ({
          id: s.id || `src-${i}`,
          name: s.name,
          schema: s.schema || "dbo",
          x: s.position?.x ?? (100 + (i % 3) * 280),
          y: s.position?.y ?? (80 + Math.floor(i / 3) * 250),
          cols: [],
          dataSourceId: s.dataSourceId,
          dataSource: s.dataSource || "Unknown",
          sourceId: s.sourceId,
          tableOrder: s.tableOrder ?? i,
          dotColor: DOT_COLORS[i % DOT_COLORS.length],
        }));
        setNodes(builtNodes);
        setEdges(defJoins);

        if (builtNodes.length > 0) {
          setExpandedSource(builtNodes[0].dataSourceId);
        }

        builtNodes.forEach((t) => {
          if (t.dataSourceId && t.name) {
            const schema = t.schema || "dbo";
            api(`/api/v1/data-sources/${t.dataSourceId}/tables/${schema}/${t.name}/columns`)
              .then((cols) => {
                const normalized = (Array.isArray(cols) ? cols : []).map((c) => ({
                  name: c.column_name,
                  type: (c.data_type || "TEXT").toUpperCase(),
                }));
                setNodes((prev) =>
                  prev.map((n) => (n.id === t.id ? { ...n, cols: normalized } : n))
                );
              })
              .catch(() => {});
          }
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [api, id]);

  /* ── Canvas pan / node drag ── */
  const handleSvgMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    dragRef.current = { type: "pan", startX: e.clientX - panRef.current.x, startY: e.clientY - panRef.current.y };
  }, []);

  const startNodeDrag = useCallback((e, nodeId) => {
    e.stopPropagation();
    const cp = toCanvas(e.clientX, e.clientY);
    const node = nodesRef.current.find((n) => n.id === nodeId);
    if (!node) return;
    dragRef.current = { type: "node", nodeId, sx: cp.x, sy: cp.y, ox: node.x, oy: node.y };
  }, [toCanvas]);

  const handleMouseMove = useCallback((e) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.type === "pan") {
      setPan({ x: e.clientX - d.startX, y: e.clientY - d.startY });
    } else if (d.type === "node") {
      const cp = toCanvas(e.clientX, e.clientY);
      setNodes((p) => p.map((n) => (n.id === d.nodeId ? { ...n, x: d.ox + cp.x - d.sx, y: d.oy + cp.y - d.sy } : n)));
    }
  }, [toCanvas]);

  const handleMouseUp = useCallback(() => { dragRef.current = null; }, []);

  const autoArrange = () => {
    const cols = Math.max(1, Math.ceil(Math.sqrt(nodes.length)));
    setNodes((p) => p.map((n, i) => ({ ...n, x: 80 + (i % cols) * 280, y: 80 + Math.floor(i / cols) * 250 })));
  };

  /* ── Edge paths for SVG ── */
  const edgePaths = useMemo(() =>
    edges.map((e) => {
      const fn = nodes.find((n) => n.id === e.from);
      const tn = nodes.find((n) => n.id === e.to);
      if (!fn || !tn) return null;
      const fp = portPos(fn, e.onLeft, "right");
      const tp = portPos(tn, e.onRight, "left");
      if (!fp || !tp) return null;
      return { ...e, path: bez(fp.x, fp.y, tp.x, tp.y), mx: (fp.x + tp.x) / 2, my: (fp.y + tp.y) / 2 - 10, color: edgeColor(e.type || "INNER", T) };
    }).filter(Boolean),
    [edges, nodes, T]
  );

  /* ── Source groups for sidebar ── */
  const sourceGroups = useMemo(() => {
    const groups = {};
    nodes.forEach((n) => {
      const dsId = n.dataSourceId || "unknown";
      if (!groups[dsId]) {
        groups[dsId] = { id: dsId, name: n.dataSource || "Unknown", tables: [], dotColor: DOT_COLORS[Object.keys(groups).length % DOT_COLORS.length] };
      }
      groups[dsId].tables.push(n);
    });
    if (!search) return Object.values(groups);
    const q = search.toLowerCase();
    return Object.values(groups)
      .map((g) => ({ ...g, tables: g.tables.filter((t) => t.name.toLowerCase().includes(q)) }))
      .filter((g) => g.tables.length > 0 || g.name.toLowerCase().includes(q));
  }, [nodes, search]);

  const zoomPct = Math.round(scale * 100);

  const btnStyle = (color) => ({
    width: 36, height: 36, display: "grid", placeItems: "center", borderRadius: 9,
    border: `1px solid ${T.border2}`, background: T.surface, color: color || T.text2, cursor: "pointer",
    fontSize: 18, fontWeight: 300, fontFamily: "monospace",
    boxShadow: "0 2px 12px rgba(0,0,0,0.2)", transition: "all 0.15s",
  });

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.text, fontFamily: SANS }}>
        <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
          <span style={{ fontSize: 14, color: T.text3 }}>Loading definition\u2026</span>
        </div>
      </div>
    );
  }

  if (!ds) {
    return (
      <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.text, fontFamily: SANS }}>
        <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span style={{ fontSize: 14, color: T.text3 }}>Dataset not found.</span>
          <button onClick={() => navigate("/datasets")} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1px solid ${T.border}`, background: T.surface, color: T.text2, fontFamily: SANS }}>
            \u2190 Back to Datasets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: T.bg, fontFamily: SANS, color: T.text }}>
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} />

      <div style={{ flex: 1, display: "grid", gridTemplateRows: "56px 1fr", gridTemplateColumns: "264px 1fr 310px", overflow: "hidden" }}>

        {/* HEADER */}
        <header style={{ gridColumn: "1/-1", background: T.surface, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 16, zIndex: 200 }}>
          <button onClick={() => navigate(`/datasets/${id}`)}
            style={{ width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", cursor: "pointer", border: `1px solid ${T.border}`, background: T.surface2, color: T.text2, fontSize: 16, transition: "all 0.15s", flexShrink: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.border2; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.text2; e.currentTarget.style.borderColor = T.border; }}
          >\u2190</button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px", flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg,${T.accent},${T.purple})`, display: "grid", placeItems: "center", fontSize: 13, color: "#fff" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
            </div>
            Definition<span style={{ color: T.accent, fontWeight: 600 }}>View</span>
          </div>

          <div style={{ width: 1, height: 20, background: T.border, flexShrink: 0 }} />

          <div style={{ fontFamily: MONO, fontSize: 12, color: T.text3, display: "flex", gap: 6, minWidth: 0 }}>
            <span style={{ color: T.text3 }}>datasets /</span>
            <span style={{ color: T.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{ds.name}</span>
          </div>

          <div style={{ width: 1, height: 20, background: T.border, flexShrink: 0 }} />

          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 10, fontFamily: MONO, color: T.accent, background: T.accentDim, border: `1px solid ${T.accentGlow}`, padding: "3px 10px", borderRadius: 6 }}>{ds.definition_type || "join"}</span>
            <span style={{ fontSize: 10, fontFamily: MONO, color: ds.status === "active" ? T.green : T.amber, background: ds.status === "active" ? `${T.green}18` : `${T.amber}18`, border: `1px solid ${ds.status === "active" ? `${T.green}40` : `${T.amber}40`}`, padding: "3px 10px", borderRadius: 6 }}>{ds.status || "draft"}</span>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: T.text3 }}>
              Tables: <strong style={{ color: T.accent, fontWeight: 500 }}>{nodes.length}</strong>
              <span style={{ marginLeft: 12 }}>Joins: <strong style={{ color: T.green, fontWeight: 500 }}>{edges.length}</strong></span>
            </span>
            <button onClick={() => navigate(`/datasets/${id}/edit`)}
              style={{ padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", fontFamily: SANS, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", background: T.accent, color: "#fff" }}>
              \u270E Edit Definition
            </button>
          </div>
        </header>

        {/* SIDEBAR */}
        <aside style={{ background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 14px 10px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: T.text3, marginBottom: 10 }}>Definition Sources</div>
            <div style={{ display: "flex", alignItems: "center", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 10px", gap: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: 12, fontFamily: SANS, width: "100%" }}
                placeholder="Search tables\u2026"
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px", scrollbarWidth: "thin", scrollbarColor: `${T.border2} transparent` }}>
            {sourceGroups.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 8px", color: T.text3, fontSize: 13 }}>No sources in definition</div>
            ) : sourceGroups.map((grp) => {
              const isExpanded = expandedSource === grp.id;
              return (
                <div key={grp.id} style={{ marginBottom: 2 }}>
                  <div
                    onClick={() => setExpandedSource(isExpanded ? null : grp.id)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px", borderRadius: 8, cursor: "pointer", userSelect: "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.surface2)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: grp.dotColor, boxShadow: `0 0 6px ${grp.dotColor}`, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{grp.name}</div>
                      <div style={{ fontSize: 10, color: T.text3, fontFamily: MONO }}>{grp.tables.length} table{grp.tables.length !== 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ fontSize: 9, color: T.text3, transform: isExpanded ? "rotate(90deg)" : "", transition: "transform 0.2s" }}>\u25B6</div>
                  </div>
                  {isExpanded && (
                    <div style={{ paddingLeft: 14 }}>
                      {grp.tables.map((t) => (
                        <div key={t.id}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "6px 10px", borderRadius: 7, margin: "2px 0",
                            background: T.accentDim, border: `1px solid ${T.accentGlow}`,
                            userSelect: "none",
                          }}
                        >
                          <span style={{ fontSize: 11, color: T.accent }}>\u229E</span>
                          <span style={{ fontSize: 12.5, flex: 1, color: T.accent, fontWeight: 500 }}>{t.schema ? `${t.schema}.` : ""}{t.name}</span>
                          <span style={{ fontSize: 10, color: T.text3, fontFamily: MONO }}>{t.cols.length}c</span>
                          <span style={{ fontSize: 8, color: T.accent }}>\u25CF</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            <span style={{ fontSize: 11, color: T.text3 }}>{nodes.length} tables \u00B7 {edges.length} joins</span>
          </div>
        </aside>

        {/* CANVAS */}
        <div style={{ position: "relative", overflow: "hidden", background: T.bg, cursor: "default" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px,${T.border2} 1px,transparent 0)`, backgroundSize: "24px 24px", opacity: 0.4, pointerEvents: "none" }} />

          {nodes.length === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none", zIndex: 1 }}>
              <div style={{ textAlign: "center", color: T.text3 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: "0 auto 12px" }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.text2 }}>No tables in this definition</div>
                <div style={{ fontSize: 12, marginTop: 6, color: T.text3 }}>This dataset has no source tables configured</div>
              </div>
            </div>
          )}

          <svg ref={svgRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden" }}
            onMouseDown={handleSvgMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              {[["accent", T.accent], ["green", T.green], ["purple", T.purple], ["orange", "#f97316"]].map(([k, color]) => (
                <marker key={k} id={`arr-${k}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill={color} opacity="0.85" />
                </marker>
              ))}
            </defs>

            <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>
              {edgePaths.map((ep) => {
                const ak = ep.color === T.green ? "green" : ep.color === T.purple ? "purple" : ep.color === "#f97316" ? "orange" : "accent";
                return (
                  <g key={ep.id}>
                    <path d={ep.path} fill="none" stroke={ep.color} strokeWidth={8} opacity={0.05} />
                    <path d={ep.path} fill="none" stroke={ep.color} strokeWidth={2}
                      strokeDasharray="5 4" opacity={0.7} markerEnd={`url(#arr-${ak})`}
                      style={{ animation: "dashFlow 1.5s linear infinite" }} />
                    <rect x={ep.mx - 22} y={ep.my - 10} width={44} height={20} rx={4} fill={T.surface2} stroke={ep.color} strokeWidth={1} opacity={0.95} />
                    <text x={ep.mx} y={ep.my + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={ep.color} fontSize={9} fontWeight="500" fontFamily={MONO}>{ep.type || "INNER"}</text>
                  </g>
                );
              })}

              {nodes.map((node) => (
                <TableNode key={node.id} node={node} T={T} onStartDrag={startNodeDrag} />
              ))}
            </g>
          </svg>

          {/* Toolbar */}
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 4, display: "flex", gap: 2, zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            {[
              ["\u2295", "Auto Arrange", autoArrange],
              ["\u22A1", "Reset View", () => { setScale(1); setPan({ x: 0, y: 0 }); }],
            ].map((item, i) => (
              <button key={i} title={item[1]} onClick={item[2]}
                style={{ width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: 4, border: "none", background: "transparent", color: T.text2, cursor: "pointer", fontSize: 14, fontFamily: SANS, transition: "all 0.1s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = T.surface2; e.currentTarget.style.color = T.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.text2; }}
              >{item[0]}</button>
            ))}
          </div>

          {/* Zoom controls */}
          <div style={{ position: "absolute", bottom: 24, right: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 100 }}>
            <button onClick={() => zoomBtn(1)} title="Zoom In" style={btnStyle()}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.surface2; e.currentTarget.style.color = T.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.surface; e.currentTarget.style.color = T.text2; }}>+</button>
            <div onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }} title="Reset zoom"
              style={{ width: 36, height: 36, display: "grid", placeItems: "center", borderRadius: 6, border: `1px solid ${T.border2}`, background: T.surface, color: T.text3, cursor: "pointer", fontSize: 10, fontFamily: MONO, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", userSelect: "none", lineHeight: 1.2, textAlign: "center" }}>
              {zoomPct}%
            </div>
            <button onClick={() => zoomBtn(-1)} title="Zoom Out" style={btnStyle()}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.surface2; e.currentTarget.style.color = T.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.surface; e.currentTarget.style.color = T.text2; }}>\u2212</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside style={{ background: T.surface, borderLeft: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
            {[["sql", "SQL"], ["joins", "Joins"], ["columns", "Columns"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ flex: 1, padding: "14px 8px", fontSize: 11, fontWeight: 600, color: activeTab === key ? T.text : T.text3, cursor: "pointer", border: "none", background: "transparent", fontFamily: SANS, letterSpacing: 0.5, textTransform: "uppercase", borderBottom: `2px solid ${activeTab === key ? T.accent : "transparent"}`, marginBottom: -1, transition: "all 0.15s" }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, scrollbarWidth: "thin", scrollbarColor: `${T.border2} transparent` }}>
            {activeTab === "sql" && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: T.text3, marginBottom: 10 }}>Generated SQL</div>
                <SqlPanel nodes={nodes} edges={edges} T={T} />
              </>
            )}
            {activeTab === "joins" && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: T.text3, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                  <span>Joins</span><span style={{ color: T.accent }}>{edges.length}</span>
                </div>
                <JoinsPanel edges={edges} nodes={nodes} T={T} />
              </>
            )}
            {activeTab === "columns" && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: T.text3, marginBottom: 10 }}>Table Columns</div>
                {nodes.length === 0 ? (
                  <div style={{ color: T.text3, fontSize: 13, textAlign: "center", marginTop: 40 }}>No tables in definition</div>
                ) : nodes.map((n) => (
                  <div key={n.id} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: T.text3, marginBottom: 8, fontFamily: MONO, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: n.dotColor || T.accent }}>\u25CF</span>
                      {n.schema ? `${n.schema}.` : ""}{n.name}
                      <span style={{ marginLeft: "auto", fontSize: 10, color: T.text3 }}>({n.cols.length})</span>
                    </div>
                    {n.cols.length === 0 ? (
                      <div style={{ padding: "8px 12px", fontSize: 11, color: T.text3, fontFamily: MONO }}>Loading\u2026</div>
                    ) : n.cols.map((f) => {
                      const tc = TYPE_COLORS[(f.type || "").toUpperCase()] || "#94a3b8";
                      return (
                        <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, marginBottom: 2 }}>
                          <span style={{ fontFamily: MONO, fontSize: 10, color: tc, background: `${tc}18`, border: `1px solid ${tc}30`, padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>{f.type}</span>
                          <span style={{ fontFamily: MONO, fontSize: 12, color: T.text2, flex: 1 }}>{f.name}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes dashFlow { to { stroke-dashoffset: -10; } }
      `}</style>
    </div>
  );
}