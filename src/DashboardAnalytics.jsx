import Chart from 'react-apexcharts';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";
import { useApp } from "./AppContext.jsx";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

// ── Helpers ──────────────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1100 }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (!target) return;
    let v = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      v += step;
      if (v >= target) { setCur(target); clearInterval(id); }
      else setCur(Math.floor(v));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return <span>{cur}</span>;
}

function CircularProgress({ value, size = 120, sw = 10, color, trackColor, textColor }) {
  const r = (size - sw) / 2;
  const circ = r * 2 * Math.PI;
  const [p, setP] = useState(0);
  useEffect(() => { const id = setTimeout(() => setP(value), 200); return () => clearTimeout(id); }, [value]);
  const offset = circ - (p / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 5px ${color}55)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "1.6rem", fontWeight: 800, color: textColor, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{value}%</span>
      </div>
    </div>
  );
}

function Card({ children, delay = 0, span = 1, t, glow = null }) {
  return (
    <div
      className="fade-up"
      style={{
        background: t.bgCard, border: `1px solid ${t.border}`,
        borderRadius: 16, padding: 18, boxShadow: t.shadow,
        animationDelay: `${delay}s`, gridColumn: `span ${span}`,
        position: "relative", overflow: "hidden",
        transition: "transform .2s ease, box-shadow .2s ease",
      }}
    >
      {glow && (
        <div style={{
          position: "absolute", width: glow.size, height: glow.size, borderRadius: "50%",
          background: glow.color, filter: `blur(${glow.size / 2}px)`,
          opacity: glow.op ?? 0.1, top: glow.top ?? -30, left: glow.left ?? -30, pointerEvents: "none",
        }} />
      )}
      {children}
    </div>
  );
}

function CardLabel({ t, children, right }) {
  return (
    <div style={{
      fontSize: "0.6rem", color: t.textMuted, letterSpacing: "0.12em",
      textTransform: "uppercase", marginBottom: 14,
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span>{children}</span>
      {right}
    </div>
  );
}

function makeTooltip(t) {
  return function CT({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 14px", boxShadow: t.shadow }}>
        <p style={{ color: t.textMuted, fontSize: "0.68rem", marginBottom: 4 }}>{label}</p>
        {payload.map((e, i) => (
          <p key={i} style={{ color: e.color, fontSize: "0.78rem", fontFamily: "'DM Mono',monospace" }}>
            {e.name}: {e.value}
          </p>
        ))}
      </div>
    );
  };
}

const PALETTE = ["#7c3aed", "#3b82f6", "#4ade80", "#f59e0b", "#f43f5e", "#06b6d4", "#ec4899"];
const ACCESS_COLORS = { owner: "#7c3aed", editor: "#3b82f6", viewer: "#4ade80", admin: "#f59e0b", view: "#4ade80" };

// ── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { navItems, handleNavClick, activeNav, user, api } = useApp();

  const [loading, setLoading] = useState(true);
  const [dash, setDash] = useState(null);
  const [an, setAn] = useState(null);

  const T = isDark ? DARK : LIGHT;
  const CT = makeTooltip(T);

  useEffect(() => {
    if (!id || !api) return;
    let cancelled = false;
    setLoading(true);
    setAn(null);

    api(`/api/v1/dashboards/${id}`)
      .then((data) => {
        if (cancelled) return;
        const obj = (data?.data && !Array.isArray(data.data) && typeof data.data === "object") ? data.data : data;
        setDash(obj);
      })
      .catch(() => {});

    Promise.all([
      api(`/api/v1/dashboards/${id}/columns`).catch(() => null),
      api(`/api/v1/dashboards/${id}/filters`).catch(() => null),
      api(`/api/v1/dashboards/${id}/access`).catch(() => null),
      api(`/api/v1/dashboards/${id}/filter-sets`).catch(() => null),
      api(`/api/v1/dashboards/${id}/me/access`).catch(() => null),
    ]).then(([cols, filters, access, filterSets, myAccess]) => {
      if (cancelled) return;
      const colData = cols?.data || (Array.isArray(cols) ? cols : []);
      const filterData = Array.isArray(filters) ? filters : [];
      const accessData = Array.isArray(access) ? access : [];
      const filterSetData = Array.isArray(filterSets) ? filterSets : [];
      setAn({
        columns: colData,
        columnTotal: cols?.total ?? colData.length,
        dimensions: colData.filter((c) => c.is_dimension).length,
        measures: colData.filter((c) => c.is_measure).length,
        filters: filterData,
        activeFilters: filterData.filter((f) => f.is_active).length,
        access: accessData,
        filterSets: filterSetData,
        myAccessLevel: myAccess?.data?.access_level ?? null,
        accessByLevel: accessData.reduce((acc, a) => {
          const lvl = a.access_level || "unknown";
          acc[lvl] = (acc[lvl] || 0) + 1;
          return acc;
        }, {}),
      });
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [id, api]);

  // ── Derived chart data ───────────────────────────────────
  const colTypeData = an ? [
    { name: "Dimensions", value: an.dimensions },
    { name: "Measures",   value: an.measures },
    { name: "Other",      value: Math.max(0, an.columnTotal - an.dimensions - an.measures) },
  ].filter((d) => d.value > 0) : [];

  const filterStatusData = an ? [
    { name: "Active",   value: an.activeFilters },
    { name: "Inactive", value: an.filters.length - an.activeFilters },
  ].filter((d) => d.value > 0) : [];

  const accessData = an ? Object.entries(an.accessByLevel).map(([lvl, cnt]) => ({
    name: lvl.charAt(0).toUpperCase() + lvl.slice(1), value: cnt,
    color: ACCESS_COLORS[lvl.toLowerCase()] || "#94a3b8",
  })) : [];

  const topCols = an ? [...an.columns]
    .sort((a, b) => (b.widget_count || 0) - (a.widget_count || 0))
    .slice(0, 8)
    .map((c) => ({ label: c.column_name || c.name || "—", value: c.widget_count || 0 }))
    .filter((x) => x.value > 0) : [];

  const sourceTypeData = an ? Object.entries(
    an.columns.reduce((acc, c) => {
      const t = c.source_type || "unknown";
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value], i) => ({ name, value, fill: PALETTE[i % PALETTE.length] })) : [];

  const filterTrendData = an ? an.filters.slice(0, 8).map((f, i) => ({
    label: f.name ? f.name.slice(0, 12) : `F${i+1}`,
    active: f.is_active ? 1 : 0,
  })) : [];

  const filterRatio = an && an.filters.length > 0
    ? Math.round((an.activeFilters / an.filters.length) * 100)
    : 0;

  const accessRatio = an && an.columnTotal > 0
    ? Math.round((an.dimensions / an.columnTotal) * 100)
    : 0;

  const statusCfg = {
    draft:    { bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.22)",  color: "#fbbf24" },
    active:   { bg: "rgba(74,222,128,0.10)",  border: "rgba(74,222,128,0.22)",  color: "#4ade80" },
    archived: { bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.22)", color: "#94a3b8" },
  };
  const statusKey = (dash?.status || "draft").toLowerCase();
  const sBadge = statusCfg[statusKey] || statusCfg.draft;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${T.trackColor};border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade-up{animation:fadeUp .45s ease both}
        .da-spin{animation:spin 1s linear infinite}
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans',sans-serif", color: T.text, overflow: "hidden" }}>
        {/* Sidebar */}
        <Sidebar
          navItems={navItems}
          onNavClick={handleNavClick}
          activeNav={activeNav}
          theme={T}
          logo={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
          user={user}
        />

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: `1px solid ${T.border}`, background: T.bgCard, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Back button */}
              <button
                onClick={() => navigate("/dashboards")}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, background: T.bgInput, border: `1px solid ${T.border}`, color: T.textSub, fontSize: "0.73rem", fontWeight: 500, cursor: "pointer" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                Dashboards
              </button>
              <span style={{ color: T.textMuted }}>·</span>
              {loading && !dash ? (
                <span style={{ fontSize: "0.88rem", color: T.textMuted }}>Loading…</span>
              ) : (
                <>
                  <span style={{ fontSize: "0.92rem", fontWeight: 700 }}>{dash?.name || "Dashboard"}</span>
                  {dash?.status && (
                    <span style={{ fontSize: "0.58rem", fontWeight: 700, padding: "2px 9px", borderRadius: 99, letterSpacing: "0.06em", textTransform: "uppercase", background: sBadge.bg, border: `1px solid ${sBadge.border}`, color: sBadge.color }}>
                      {dash.status}
                    </span>
                  )}
                  {an?.myAccessLevel && (
                    <span style={{ fontSize: "0.58rem", color: T.textMuted, background: T.bgInput, padding: "2px 8px", borderRadius: 99, border: `1px solid ${T.border}` }}>
                      {an.myAccessLevel}
                    </span>
                  )}
                </>
              )}
            </div>
            <span style={{ fontSize: "0.68rem", color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Dashboard Analytics</span>
          </div>

          {/* Loading overlay */}
          {loading && !an && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <svg className="da-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.navActive} strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span style={{ fontSize: "0.85rem", color: T.textMuted }}>Loading analytics…</span>
            </div>
          )}

          {/* Grid */}
          {an && (
            <div style={{ flex: 1, padding: "18px 22px", overflow: "auto", display: "grid", gridTemplateColumns: "1fr 1fr 1.55fr", gap: 13 }}>

              {/* Card 1 — Column overview */}
              <Card t={T} delay={0.05} glow={isDark ? { color: T.navActive, size: 80, op: 0.1 } : null}>
                <CardLabel t={T}>Columns · Overview</CardLabel>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
                  <div>
                    <div style={{ fontSize: "2.3rem", fontWeight: 800, fontFamily: "'DM Mono',monospace", lineHeight: 1, color: T.navActive, letterSpacing: "-0.02em" }}>
                      <AnimatedNumber target={an.columnTotal} />
                    </div>
                    <div style={{ fontSize: "0.62rem", color: T.textMuted, marginTop: 3 }}>Total Columns</div>
                  </div>
                  <div style={{ flex: 1, height: 46 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={colTypeData.length ? colTypeData.map((d, i) => ({ month: d.name, val: d.value })) : [{ month: "—", val: 0 }]}>
                        <defs>
                          <linearGradient id="dag1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={T.navActive} stopOpacity={isDark ? 0.28 : 0.18} />
                            <stop offset="95%" stopColor={T.navActive} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke={T.navActive} strokeWidth={2} fill="url(#dag1)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.divider}` }}>
                  {[["Dimensions", an.dimensions, T.accent2], ["Measures", an.measures, T.positive]].map(([lbl, val, col]) => (
                    <div key={lbl}>
                      <div style={{ fontSize: "0.58rem", color: T.textMuted }}>{lbl}</div>
                      <div style={{ fontSize: "0.72rem", color: col, fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 2 — Filter status */}
              <Card t={T} delay={0.09} glow={isDark ? { color: T.accent2, size: 80, op: 0.08 } : null}>
                <CardLabel t={T}>Filters · Status</CardLabel>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
                  <div>
                    <div style={{ fontSize: "2.3rem", fontWeight: 800, fontFamily: "'DM Mono',monospace", lineHeight: 1, color: T.positive, letterSpacing: "-0.02em" }}>
                      <AnimatedNumber target={an.activeFilters} /><span style={{ fontSize: "1rem", color: T.textMuted }}>/{an.filters.length}</span>
                    </div>
                    <div style={{ fontSize: "0.62rem", color: T.textMuted, marginTop: 3 }}>Active / Total</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.divider}` }}>
                  {[["Filter Sets", an.filterSets.length, T.accent3], ["Active Rate", `${filterRatio}%`, T.positive]].map(([lbl, val, col]) => (
                    <div key={lbl}>
                      <div style={{ fontSize: "0.58rem", color: T.textMuted }}>{lbl}</div>
                      <div style={{ fontSize: "0.72rem", color: col, fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 3 — Widget + access summary */}
              <Card t={T} delay={0.13}>
                <CardLabel t={T}>Dashboard · Summary</CardLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                  {[
                    { label: "Widgets",      value: dash?.widget_count ?? 0, color: T.positive,  trend: "total" },
                    { label: "Total Users",  value: an.access.length,       color: T.accent2,   trend: "with access" },
                    { label: "Col Types",    value: colTypeData.length,     color: T.accent3,   trend: "distinct" },
                    { label: "Source Types", value: sourceTypeData.length,  color: T.navActive, trend: "distinct" },
                    { label: "Dimensions",   value: an.dimensions,          color: T.accent2,   trend: "cols" },
                    { label: "Measures",     value: an.measures,            color: T.positive,  trend: "cols" },
                  ].map((item, i) => (
                    <div key={item.label} style={{ marginBottom: "0.7rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "0.72rem", color: T.textSub, fontWeight: 500 }}>{item.label}</span>
                        <span style={{ fontSize: "0.62rem", color: item.color, fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>{item.trend}</span>
                      </div>
                      <div style={{ height: 5, background: T.trackColor, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(100, (item.value / Math.max(an.columnTotal, 1)) * 100)}%`, background: item.color, borderRadius: 99, transition: "width 1s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 6px ${item.color}55` }} />
                      </div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: T.text, fontFamily: "'DM Mono',monospace", marginTop: 2 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 4 — Column type distribution (span 2) */}
              <Card t={T} delay={0.17} span={2} glow={isDark ? { color: T.navActive, size: 120, op: 0.05, top: -40, left: "45%" } : null}>
                <CardLabel t={T}>Column type distribution</CardLabel>
                {colTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={colTypeData} barSize={32}>
                      <CartesianGrid vertical={false} stroke={T.gridLine} />
                      <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 10, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip content={<CT />} cursor={{ fill: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)" }} />
                      <defs>
                        <linearGradient id="dag2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={T.navActive} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={T.navActive} stopOpacity={isDark ? 0.35 : 0.5} />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="value" fill="url(#dag2)" radius={[5, 5, 0, 0]}
                        label={{ position: "insideBottom", offset: 8, fill: T.barLabel, fontSize: 10, fontFamily: "'DM Mono',monospace" }} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: T.textMuted }}>No column data available</span>
                  </div>
                )}
              </Card>

              {/* Card 5 — Filter active ratio */}
              <Card t={T} delay={0.21}>
                <CardLabel t={T}>Active filters · ratio</CardLabel>
                <CircularProgress value={filterRatio} size={120} sw={10} color={T.positive} trackColor={T.trackColor} textColor={T.text} />
                <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 0 }}>
                  {[["Active", an.activeFilters, T.positive], ["Inactive", an.filters.length - an.activeFilters, T.negative], ["Sets", an.filterSets.length, T.accent3]].map(([lbl, val, col], i) => (
                    <div key={lbl} style={{ display: "flex", alignItems: "stretch" }}>
                      {i > 0 && <div style={{ width: 1, background: T.divider, margin: "0 12px" }} />}
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "'DM Mono',monospace", color: col }}>{val}</div>
                        <div style={{ fontSize: "0.57rem", color: T.textMuted, letterSpacing: "0.1em", marginTop: 2 }}>{lbl}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 6 — Access levels */}
              <Card t={T} delay={0.25}>
                <CardLabel t={T}>Access levels · breakdown</CardLabel>
                <CircularProgress
                  value={an.access.length > 0 ? Math.min(100, Math.round((accessData[0]?.value / an.access.length) * 100)) : 0}
                  size={120} sw={10}
                  color={accessData[0]?.color || T.accent2}
                  trackColor={T.trackColor} textColor={T.text}
                />
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "6px 12px", justifyContent: "center" }}>
                  {accessData.length > 0 ? accessData.map((a) => (
                    <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.color }} />
                      <span style={{ fontSize: "0.63rem", color: T.textSub, textTransform: "capitalize" }}>{a.name}</span>
                      <span style={{ fontSize: "0.63rem", fontWeight: 700, color: T.text, fontFamily: "'DM Mono',monospace" }}>{a.value}</span>
                    </div>
                  )) : <span style={{ fontSize: "0.72rem", color: T.textMuted }}>No access records</span>}
                </div>
              </Card>

              {/* Card 7 — Top columns by widget usage (span 2) */}
              {topCols.length > 0 && (
                <Card t={T} delay={0.29} span={2} glow={isDark ? { color: T.accent2, size: 160, op: 0.04, top: -60, left: "35%" } : null}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontSize: "0.6rem", color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Top columns · by widget usage</div>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 18, height: 2, background: T.accent2, borderRadius: 1 }} />
                        <span style={{ fontSize: "0.65rem", color: T.textMuted }}>Widget Count</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={94}>
                    <AreaChart data={topCols.map((c) => ({ month: c.label, value: c.value }))}>
                      <defs>
                        <linearGradient id="dag3" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={T.accent2} stopOpacity={isDark ? 0.2 : 0.12} />
                          <stop offset="95%" stopColor={T.accent2} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 9, fontFamily: "'DM Mono',monospace" }} axisLine={false} tickLine={false} />
                      <CartesianGrid stroke={T.gridLine} />
                      <Tooltip content={<CT />} />
                      <Area type="monotone" dataKey="value" stroke={T.accent2} strokeWidth={2} fill="url(#dag3)" dot={false} name="Widgets" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Card 8 — Source type distribution */}
              {sourceTypeData.length > 0 && (
                <Card t={T} delay={0.33} span={topCols.length > 0 ? 1 : 3}>
                  <CardLabel t={T}>Columns · source type</CardLabel>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={sourceTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={56} innerRadius={28}
                        paddingAngle={3} label={({ name, percent }) => percent > 0.06 ? `${name} ${(percent * 100).toFixed(0)}%` : ""}
                        labelLine={false}
                        style={{ fontSize: "0.6rem", fill: T.textMuted }}>
                        {sourceTypeData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip content={<CT />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Card 9 — Filter sets */}
              {an.filterSets.length > 0 && (
                <Card t={T} delay={0.37} span={2}>
                  <CardLabel t={T}>Filter sets · {an.filterSets.length} total</CardLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                    {an.filterSets.map((fs) => (
                      <div key={fs.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 8, background: T.bgInput, border: `1px solid ${T.border}` }}>
                        <span style={{ fontSize: "0.70rem", fontWeight: 500, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{fs.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                          {fs.is_default && <span style={{ fontSize: "0.53rem", fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: "var(--nav-active-bg, rgba(124,58,237,0.18))", color: T.navActive }}>default</span>}
                          <span style={{ fontSize: "0.60rem", color: T.textMuted, fontFamily: "'DM Mono',monospace" }}>{fs.filters?.length ?? 0}f</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Theme tokens ─────────────────────────────────────────────────────────────
const DARK = {
  bg: "#070b1a", bgSidebar: "rgba(255,255,255,0.02)", bgCard: "rgba(255,255,255,0.03)",
  bgInput: "rgba(255,255,255,0.05)", bgActive: "rgba(99,102,241,0.18)",
  border: "rgba(255,255,255,0.07)", borderActive: "rgba(99,102,241,0.45)",
  text: "#f1f5f9", textSub: "rgba(255,255,255,0.45)", textMuted: "rgba(255,255,255,0.25)",
  navActive: "#818cf8", navInactive: "rgba(255,255,255,0.28)",
  positive: "#34d399", negative: "#f87171", accent1: "#818cf8", accent2: "#38bdf8", accent3: "#fbbf24",
  gridLine: "rgba(255,255,255,0.04)", tooltipBg: "rgba(10,12,28,0.96)",
  badgeBg: "rgba(255,255,255,0.06)", shadow: "0 8px 32px rgba(0,0,0,0.35)",
  trackColor: "rgba(255,255,255,0.06)", logoGrad: "linear-gradient(135deg,#818cf8,#38bdf8)",
  barLabel: "rgba(255,255,255,0.55)", divider: "rgba(255,255,255,0.07)",
};
const LIGHT = {
  bg: "#eef2fb", bgSidebar: "#ffffff", bgCard: "#ffffff",
  bgInput: "#f1f5f9", bgActive: "rgba(99,102,241,0.08)",
  border: "#e2e8f0", borderActive: "rgba(99,102,241,0.5)",
  text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
  navActive: "#6366f1", navInactive: "#94a3b8",
  positive: "#059669", negative: "#dc2626", accent1: "#6366f1", accent2: "#0284c7", accent3: "#d97706",
  gridLine: "#f1f5f9", tooltipBg: "#ffffff",
  badgeBg: "#f1f5f9", shadow: "0 2px 16px rgba(15,23,42,0.07)",
  trackColor: "#e2e8f0", logoGrad: "linear-gradient(135deg,#6366f1,#0284c7)",
  barLabel: "rgba(0,0,0,0.45)", divider: "#e2e8f0",
};
