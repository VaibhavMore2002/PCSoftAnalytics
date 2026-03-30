import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

/* ═══════════════════════════════════════════════════════════
   Design tokens — align with app :root / .dark (index.css)
   ═══════════════════════════════════════════════════════════ */
const T = {
  bgVoid:     "var(--bg)",
  bgDeep:     "var(--bg-input)",
  bgCard:     "var(--bg-card)",
  bgElevated: "var(--bg-card-alt)",
  bgHover:    "var(--bg-hover)",
  cyan:       "var(--nav-active)",
  blue:       "var(--accent2)",
  violet:     "var(--accent1)",
  green:      "var(--positive)",
  amber:      "var(--accent3)",
  red:        "var(--negative)",
  borderFaint:  "var(--divider)",
  borderSubtle: "var(--border)",
  borderMid:    "var(--border-active)",
  textPrimary:  "var(--text)",
  textSec:      "var(--text-sub)",
  textMuted:    "var(--text-muted)",
};

/* ════════════════════════════════════════
   TINY ATOMS
   ════════════════════════════════════════ */
const Spin = () => (
  <svg style={{animation:"pcsSpin 0.7s linear infinite",flexShrink:0}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
  </svg>
);

function Badge({ children, variant = "cyan", extra }) {
  const map = {
    cyan:   ["var(--badge-bg)", "var(--nav-active)", "var(--border-active)"],
    blue:   ["var(--badge-bg)", "var(--accent2)", "var(--border-active)"],
    violet: ["var(--badge-bg)", "var(--accent1)", "var(--border-active)"],
    amber:  ["var(--badge-bg)", "var(--accent3)", "var(--border-active)"],
    muted:  ["var(--bg-input)", "var(--text-muted)", "var(--border)"],
  };
  const [bg, color, border] = map[variant]||map.cyan;
  return (
    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:600,padding:"2px 7px",borderRadius:20,background:bg,color,border:`1px solid ${border}`,...extra}}>
      {children}
    </span>
  );
}

function Toggle({ on, onClick }) {
  return (
    <div onClick={onClick} style={{width:32,height:17,borderRadius:9,cursor:"pointer",position:"relative",flexShrink:0,
      background:on?"var(--bg-active)":T.bgElevated,
      border:on?`1px solid ${T.borderMid}`:`1px solid ${T.borderSubtle}`,
      boxShadow:on?"var(--nav-active-shadow)":"none",transition:"all 0.2s"}}>
      <div style={{position:"absolute",top:2,left:on?17:2,width:11,height:11,borderRadius:"50%",
        background:on?T.cyan:T.textMuted,transition:"all 0.2s"}}/>
    </div>
  );
}

function Select({ value, onChange, options, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel = options.find(o => String(o.value) === String(value));
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{position:"relative",width:"100%"}}>
      <button type="button" disabled={disabled} onClick={() => !disabled && setOpen(p=>!p)} style={{
        width:"100%",background:T.bgDeep,border:`1px solid ${open?T.cyan:T.borderMid}`,borderRadius:8,
        color:sel?T.textPrimary:T.textMuted,fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:500,
        padding:"9px 32px 9px 12px",cursor:disabled?"not-allowed":"pointer",outline:"none",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        transition:"border-color 0.2s",boxSizing:"border-box",opacity:disabled?0.5:1,
      }}>
        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sel?sel.label:placeholder||"Select…"}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{position:"absolute",zIndex:300,marginTop:4,width:"100%",borderRadius:10,
          border:`1px solid ${T.borderMid}`,background:T.bgCard,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
          maxHeight:220,overflowY:"auto",animation:"pcsFadeUp 0.12s ease both"}}>
          {options.map(o => {
            const act = String(o.value)===String(value);
            return (
              <button key={o.value} type="button" onClick={() => {onChange(o.value);setOpen(false);}} style={{
                width:"100%",textAlign:"left",padding:"9px 12px",fontSize:12,fontFamily:"'Syne',sans-serif",
                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,
                background:act?"var(--bg-active)":"transparent",color:act?T.cyan:T.textPrimary,
                border:"none",boxSizing:"border-box",transition:"background 0.12s",
              }}
                onMouseEnter={e=>{if(!act)e.currentTarget.style.background=T.bgElevated;}}
                onMouseLeave={e=>{if(!act)e.currentTarget.style.background="transparent";}}>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.label}</span>
                {act&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.cyan} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StepIndicator({ step }) {
  const steps = ["Data Connection","Data & Chart"];
  return (
    <div style={{display:"flex",alignItems:"center"}}>
      {steps.map((label, i) => {
        const n = i+1, active = n===step, done = n<step;
        return (
          <div key={label} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{
                width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",
                border:active?`1.5px solid ${T.cyan}`:done?`1.5px solid ${T.blue}`:`1.5px solid ${T.borderMid}`,
                color:active?T.cyan:done?T.blue:T.textMuted,
                background:active?"var(--bg-active)":done?"var(--bg-hover)":"transparent",
                boxShadow:active?"var(--nav-active-shadow)":"none",
              }}>
                {done?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>:n}
              </div>
              <span style={{fontSize:10,fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",
                fontFamily:"'Syne',sans-serif",color:active?T.textPrimary:T.textMuted}}>{label}</span>
            </div>
            {i<steps.length-1&&<div style={{width:40,height:1,background:T.borderSubtle,margin:"0 12px"}}/>}
          </div>
        );
      })}
    </div>
  );
}

function GripDots() {
  return (
    <svg viewBox="0 0 16 24" width="14" height="20" style={{display:"block"}}>
      {[4,10,16].flatMap(cy=>[5,11].map(cx=>(
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" fill={T.textMuted}/>
      )))}
    </svg>
  );
}

function ColItem({ colId, colKey, type, checked, onToggle }) {
  const ckBg = { dimension:T.cyan, measure:T.blue, date:T.violet };
  return (
    <div onClick={onToggle} style={{
      display:"flex",alignItems:"center",gap:10,padding:"6px 8px",borderRadius:7,cursor:"pointer",marginBottom:2,
      background:checked?"var(--bg-active)":"transparent",
      border:checked?`1px solid ${T.borderSubtle}`:"1px solid transparent",
      transition:"all 0.15s",
    }}>
      <div style={{width:15,height:15,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
        border:checked?"none":`1.5px solid ${T.borderMid}`,background:checked?ckBg[type]:"transparent",
        boxShadow:checked?`0 0 8px ${ckBg[type]}40`:"none",transition:"all 0.15s"}}>
        {checked&&<svg width="9" height="9" viewBox="0 0 12 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5 6 4.5 9 10.5 1"/></svg>}
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:600,color:T.textPrimary,fontFamily:"'Syne',sans-serif"}}>{colId}</div>
        <div style={{fontSize:10,color:T.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{colKey}</div>
      </div>
    </div>
  );
}

function ColGroup({ icon, label, badge, badgeVariant, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div onClick={()=>setOpen(p=>!p)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:8,cursor:"pointer",userSelect:"none",transition:"background 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.background=T.bgElevated}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <span style={{fontSize:12}}>{icon}</span>
        <span style={{fontSize:11,fontWeight:600,flex:1,color:T.textSec,fontFamily:"'Syne',sans-serif"}}>{label}</span>
        <Badge variant={badgeVariant}>{badge}</Badge>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{transform:open?"rotate(0)":"rotate(-90deg)",transition:"transform 0.25s",flexShrink:0}}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <div style={{overflow:"hidden",maxHeight:open?1000:0,transition:"max-height 0.25s ease"}}>{children}</div>
    </div>
  );
}

function DragItem({ id, label, type, isActive, onEdit, onRemove, aggBadge,
                    onDragStart, onDragEnd, onDragEnter, onDragLeave, onDrop,
                    isDragging, isDropTarget }) {
  const accentColor = { dimension:T.cyan, measure:T.blue, date:T.violet }[type]||T.cyan;
  return (
    <div draggable
      onDragStart={onDragStart} onDragEnd={onDragEnd}
      onDragEnter={onDragEnter} onDragLeave={onDragLeave}
      onDragOver={e=>e.preventDefault()} onDrop={onDrop}
      style={{
        display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:T.bgCard,borderRadius:10,
        position:"relative",overflow:"hidden",userSelect:"none",marginBottom:5,
        border:isDropTarget?`1px solid ${T.borderMid}`:isActive?`1px solid ${T.borderMid}`:`1px solid ${T.borderSubtle}`,
        opacity:isDragging?0.3:1,
        boxShadow:isActive?"var(--shadow-hover)":isDropTarget?"var(--nav-active-shadow)":"none",
        transition:"border-color 0.2s,box-shadow 0.2s,opacity 0.2s",
      }}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:accentColor,borderRadius:"10px 0 0 10px"}}/>
      <div style={{color:T.textMuted,cursor:"grab",flexShrink:0,paddingLeft:4}}><GripDots/></div>
      <div style={{flex:1,fontSize:12,fontWeight:600,color:T.textPrimary,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.03em"}}>{label}</div>
      {aggBadge&&<Badge variant="blue" extra={{fontSize:9,marginRight:4}}>{aggBadge}</Badge>}
      <div style={{display:"flex",gap:3,flexShrink:0}}>
        <div onClick={onEdit} style={{width:27,height:27,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
          border:isActive?`1px solid ${T.borderMid}`:"1px solid transparent",color:isActive?T.cyan:T.textMuted,
          background:isActive?"var(--bg-active)":"transparent",transition:"all 0.15s"}}
          onMouseEnter={e=>{if(!isActive){e.currentTarget.style.color=T.cyan;e.currentTarget.style.background=T.bgHover;}}}
          onMouseLeave={e=>{if(!isActive){e.currentTarget.style.color=T.textMuted;e.currentTarget.style.background="transparent";}}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
        </div>
        <div onClick={onRemove} style={{width:27,height:27,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
          border:"1px solid transparent",color:T.textMuted,background:"transparent",transition:"all 0.15s"}}
          onMouseEnter={e=>{e.currentTarget.style.color=T.red;e.currentTarget.style.background="color-mix(in srgb, var(--negative) 10%, transparent)";e.currentTarget.style.borderColor="color-mix(in srgb, var(--negative) 28%, transparent)";}}
          onMouseLeave={e=>{e.currentTarget.style.color=T.textMuted;e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent";}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function SegCtrl({ options, value, onChange }) {
  return (
    <div style={{display:"flex",gap:3,background:T.bgDeep,border:`1px solid ${T.borderSubtle}`,borderRadius:8,padding:3}}>
      {options.map(o=>(
        <button key={o.value} onClick={()=>onChange(o.value)} style={{
          flex:1,padding:"5px 3px",borderRadius:6,fontSize:10,fontWeight:700,cursor:"pointer",
          border:"none",fontFamily:"'Syne',sans-serif",
          background:String(value)===String(o.value)?T.bgElevated:"transparent",
          color:String(value)===String(o.value)?T.cyan:T.textMuted,
          boxShadow:String(value)===String(o.value)?`0 0 0 1px ${T.borderMid}`:"none",
          transition:"all 0.15s",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

function PillBtns({ options, value, onChange }) {
  return (
    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
      {options.map(o=>{
        const act = String(value)===String(o.value);
        return (
          <button key={o.value} onClick={()=>onChange(o.value)} style={{
            padding:"5px 9px",borderRadius:6,fontSize:10,fontWeight:700,
            fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",
            border:act?`1px solid ${T.cyan}`:`1px solid ${T.borderSubtle}`,
            color:act?T.cyan:T.textMuted,background:act?"var(--bg-active)":"transparent",transition:"all 0.15s",
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function GranItem({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,cursor:"pointer",marginBottom:5,
      background:active?"var(--bg-active)":"transparent",
      border:active?`1px solid ${T.borderMid}`:`1px solid ${T.borderFaint}`,transition:"all 0.15s",
    }}>
      <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,transition:"all 0.15s",
        background:active?T.violet:"transparent",
        border:active?`1.5px solid ${T.violet}`:`1.5px solid ${T.textMuted}`,
        boxShadow:active?"var(--nav-active-shadow)":"none"}}/>
      <span style={{fontSize:12,fontWeight:500,fontFamily:"'Syne',sans-serif",color:active?T.textPrimary:T.textSec}}>{label}</span>
    </div>
  );
}

function PropSec({ children }) {
  return <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.borderFaint}`}}>{children}</div>;
}

const FL = { fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:T.textMuted,fontFamily:"'Syne',sans-serif",marginBottom:6,display:"block" };

/* ════════════════════════════════════════
   DERIVED MODAL
   ════════════════════════════════════════ */
function DerivedModal({ open, draft, setDraft, measures, onCancel, onAdd }) {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",background:"color-mix(in srgb, var(--bg) 88%, transparent)",backdropFilter:"blur(4px)"}}>
      <div style={{width:"100%",maxWidth:640,borderRadius:16,overflow:"hidden",border:`1px solid ${T.borderMid}`,background:T.bgCard,boxShadow:"0 24px 64px rgba(0,0,0,0.8)",fontFamily:"'Syne',sans-serif"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.borderFaint}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:13,fontWeight:700,color:T.textPrimary}}>Add Derived Measure</span>
          <div onClick={onCancel} style={{width:28,height:28,borderRadius:7,border:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.textMuted,fontSize:16}}>×</div>
        </div>
        <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <input placeholder="Technical Name (e.g. profit_margin)" value={draft.name} onChange={e=>setDraft(p=>({...p,name:e.target.value.replace(/\s+/g,"_")}))}
              style={{background:T.bgDeep,border:`1px solid ${T.borderSubtle}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:T.textPrimary,fontFamily:"'JetBrains Mono',monospace",outline:"none"}}/>
            <input placeholder="Display Name" value={draft.display_name} onChange={e=>setDraft(p=>({...p,display_name:e.target.value}))}
              style={{background:T.bgDeep,border:`1px solid ${T.borderSubtle}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:T.textPrimary,fontFamily:"'Syne',sans-serif",outline:"none"}}/>
          </div>
          <textarea rows={4} placeholder="Expression (e.g. [sales]-[cost])" value={draft.expression} onChange={e=>setDraft(p=>({...p,expression:e.target.value}))}
            style={{width:"100%",background:T.bgDeep,border:`1px solid ${T.borderSubtle}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:T.textPrimary,fontFamily:"'JetBrains Mono',monospace",outline:"none",resize:"none",boxSizing:"border-box"}}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {measures.map(m=>(
              <button key={m} onClick={()=>setDraft(p=>({...p,expression:`${p.expression}${p.expression?" ":""}[${m}]`}))}
                style={{padding:"3px 8px",fontSize:10,fontFamily:"'JetBrains Mono',monospace",borderRadius:5,border:`1px solid ${T.borderSubtle}`,background:T.bgElevated,color:T.textSec,cursor:"pointer"}}>
                [{m}]
              </button>
            ))}
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:`1px solid ${T.borderFaint}`,display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={onCancel} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:8,fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",border:`1px solid ${T.borderSubtle}`,color:T.textSec,background:"transparent"}}>Cancel</button>
          <button onClick={onAdd} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:8,fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",border:"none",color:"#fff",background:"var(--nav-active-bg)",boxShadow:"var(--nav-active-shadow)"}}>Add Measure</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════ */
const CHART_TYPES = [
  { value: "auto", label: "Auto (saves as Bar)" },
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
  { value: "pie", label: "Pie" },
  { value: "area", label: "Area" },
  { value: "scatter", label: "Scatter" },
  { value: "table", label: "Table (saves as Bar)" },
  { value: "kpi_card", label: "KPI Card" },
  { value: "gauge", label: "Gauge" },
  { value: "funnel", label: "Funnel" },
  { value: "waterfall", label: "Waterfall" },
  { value: "heatmap", label: "Heatmap" },
  { value: "pareto", label: "Pareto" },
  { value: "control_chart", label: "Control Chart" },
];
const CHART_TYPE_V2 = new Set([
  "bar","line","pie","scatter","area","heatmap","kpi_card","gauge",
  "funnel","waterfall","pareto","control_chart",
]);
function normalizeV2ChartType(raw) {
  if (!raw) return "bar";
  const aliases = { auto: "bar", table: "bar" };
  const v = aliases[raw] || String(raw);
  return CHART_TYPE_V2.has(v) ? v : "bar";
}
function unwrapSavedQuestion(res) {
  if (!res || typeof res !== "object") return null;
  if (res.id != null) return res;
  const inner = res.data;
  if (!inner || typeof inner !== "object") return null;
  if (inner.id != null) return inner;
  if (inner.data && typeof inner.data === "object" && inner.data.id != null) return inner.data;
  return null;
}
const AGG_OPS   = ["sum","avg","count","count_distinct","min","max"];
const DATE_GRANS = ["auto","year","quarter","month","week","day","hour"];
const FILTER_OPS = ["equals","not_equals","contains","in","greater_than","less_than"];

const isNullish = v => v==null||String(v).trim().toLowerCase()==="null"||String(v).trim().toLowerCase()==="undefined";
const firstNN   = (...vals) => vals.find(v=>!isNullish(v));
const moveInList = (list,index,dir) => { const n=[...list],t=dir==="up"?index-1:index+1; if(t<0||t>=n.length)return n; [n[t],n[index]]=[n[index],n[t]]; return n; };
const normalizeDfColumns = cols => {
  if(!cols||typeof cols!=="object")return[];
  const out=[]; const push=(arr,kind)=>{if(!Array.isArray(arr))return;arr.forEach(item=>{if(typeof item==="string"){out.push({name:item,data_type:kind==="measure"?"numeric":kind==="date"?"date":"string"});return;}const name=item?.name||item?.column_name;if(!name)return;out.push({name,data_type:item?.source_metadata?.data_type||item?.data_type||item?.type||(kind==="measure"?"numeric":kind==="date"?"date":"string"),is_measure:kind==="measure",is_date:kind==="date"});});};
  push(cols.dimensions,"dimension");push(cols.measures,"measure");push(cols.dates,"date");return out;
};
const fmtPreview = cfg => {
  const val=12500000;
  const sm={none:1,thousands:1e3,lakhs:1e5,millions:1e6,billions:1e9,auto:1e6,crores:1e7};
  const sx={none:"",thousands:"K",lakhs:"L",millions:"M",billions:"B",auto:"M",crores:"Cr"};
  const scale=cfg.scale||"auto";
  const num=(val/(sm[scale]||1e6)).toFixed(Number(cfg.decimals??2));
  const pfx=(cfg.currency||cfg.format_type==="currency")?"₹":"";
  const end=cfg.format_type==="percentage"?"%":(sx[scale]||"M");
  return `${pfx}${num}${end}`;
};

/** API sometimes returns { name, aggregation } instead of strings — never use String(obj) for SQL ids. */
function toColumnId(v) {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "object") {
    const id = v.name ?? v.column_name ?? v.measure_name ?? v.field ?? v.id;
    if (id != null && typeof id !== "object") return String(id).trim();
    return "";
  }
  return "";
}
function toColumnIdList(arr) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const v of arr) {
    const s = toColumnId(v);
    if (s) out.push(s);
  }
  return [...new Set(out)];
}

function normalizeAggregationForApi(agg) {
  if (agg == null) return "sum";
  let s = String(agg).trim().toLowerCase().replace(/\s+/g, "_");
  if (s === "average") s = "avg";
  if (s === "distinct_count" || s === "distinct") s = "count_distinct";
  return s || "sum";
}

const DERIVED_FORMAT_API = new Set(["number", "currency", "percent", "integer"]);
function normalizeDerivedFormatForApi(ft) {
  if (!ft) return "number";
  const s = String(ft).trim().toLowerCase();
  if (s === "percentage") return "percent";
  if (DERIVED_FORMAT_API.has(s)) return s;
  return "number";
}

/** Strip/sanitize derived measure for questions-v2 (avoid echoing DB-only fields). */
function derivedMeasureForApi(d) {
  if (!d || typeof d !== "object") return null;
  const name = String(d.name || "").trim();
  if (!name) return null;
  const expr = String(d.configuration?.expression ?? d.expression ?? "").trim();
  const depsFromExpr = Array.from(expr.matchAll(/\[([^\]]+)\]/g)).map((m) => m[1].trim()).filter(Boolean);
  const deps = Array.isArray(d.depends_on) && d.depends_on.length
    ? d.depends_on.map((x) => String(x).trim()).filter(Boolean)
    : depsFromExpr;
  const fcRaw = d.format_config && typeof d.format_config === "object" ? d.format_config : {};
  const format_config = {
    decimal_places: fcRaw.decimal_places ?? d.decimal_places ?? 2,
    use_thousand_separator: fcRaw.use_thousand_separator ?? d.use_thousand_separator ?? true,
    locale: fcRaw.locale ?? d.locale ?? "en-IN",
    scale: fcRaw.scale ?? d.scale ?? "none",
    show_currency_symbol: fcRaw.show_currency_symbol ?? !!d.show_currency_symbol,
    currency_symbol: fcRaw.currency_symbol ?? d.currency_symbol ?? "₹",
    prefix: fcRaw.prefix ?? null,
    suffix: fcRaw.suffix ?? null,
    negative_format: fcRaw.negative_format ?? "minus",
  };
  return {
    name,
    display_name: String(d.display_name || name).trim(),
    description: d.description != null && String(d.description).trim() ? String(d.description).trim() : null,
    measure_type: String(d.measure_type || "calculated").trim(),
    configuration: {
      ...(typeof d.configuration === "object" && d.configuration ? d.configuration : {}),
      expression: expr,
    },
    format_type: normalizeDerivedFormatForApi(d.format_type),
    format_config,
    depends_on: [...new Set(deps)],
  };
}

function normalizeDerivedFromApi(d) {
  const cleaned = derivedMeasureForApi(d);
  if (!cleaned) return null;
  return {
    ...d,
    name: cleaned.name,
    display_name: cleaned.display_name,
    description: cleaned.description,
    measure_type: cleaned.measure_type,
    configuration: cleaned.configuration,
    expression: cleaned.configuration.expression,
    format_type: cleaned.format_type === "percent" ? "percentage" : cleaned.format_type,
    decimal_places: cleaned.format_config.decimal_places,
    use_thousand_separator: cleaned.format_config.use_thousand_separator,
    locale: cleaned.format_config.locale,
    currency_symbol: cleaned.format_config.currency_symbol,
    show_currency_symbol: cleaned.format_config.show_currency_symbol,
    scale: cleaned.format_config.scale,
    depends_on: cleaned.depends_on,
  };
}

/* ════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════ */
export default function QuestionCreate() {
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const navigate  = useNavigate();
  const { id }    = useParams();
  const isEdit    = Boolean(id);

  const [step, setStep]           = useState(1);
  const [datasets, setDatasets]   = useState([]);
  const [columns, setColumns]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [dsLoading, setDsLoading] = useState(true);
  const [colLoading, setColLoading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError]         = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [columnSettings, setColumnSettings] = useState({});
  const [filters, setFilters]     = useState([]);
  const [datasetMeasures, setDatasetMeasures] = useState([]);
  const [columnSearch, setColumnSearch] = useState("");
  const [derivedMeasures, setDerivedMeasures] = useState([]);
  const [showDerivedModal, setShowDerivedModal] = useState(false);
  const [derivedDraft, setDerivedDraft] = useState({name:"",display_name:"",description:"",measure_type:"calculated",expression:"",format_type:"number",locale:"en-IN",currency_symbol:"₹",decimal_places:2,use_thousand_separator:true});
  const [editFallbackColumns, setEditFallbackColumns] = useState([]);
  const [editFallbackDatasetId, setEditFallbackDatasetId] = useState("");
  const [activeEditId, setActiveEditId] = useState(null);
  const [dragId, setDragId]       = useState(null);
  const [dragType, setDragType]   = useState(null);

  const [form, setForm] = useState({name:"",description:"",dataset_id:"",chart_type:"",category_id:"",dimension_columns:[],x_column:"",y_columns:[],date_columns:[],color_column:"",status:"draft"});
  const setF = (k,v) => setForm(p=>({...p,[k]:v}));
  const setCS = (col,patch) => setColumnSettings(prev=>({...prev,[col]:{...(prev[col]||{}), ...patch}}));
  const resetDD = () => setDerivedDraft({name:"",display_name:"",description:"",measure_type:"calculated",expression:"",format_type:"number",locale:"en-IN",currency_symbol:"₹",decimal_places:2,use_thousand_separator:true});

  /* ── Inject keyframes ── */
  useEffect(() => {
    if (document.getElementById("pcs-kf")) return;
    const el = document.createElement("style");
    el.id = "pcs-kf";
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
      @keyframes pcsPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
      @keyframes pcsSpin{to{transform:rotate(360deg)}}
      @keyframes pcsFadeUp{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
    `;
    document.head.appendChild(el);
  }, []);

  /* ── API Loads ── */
  useEffect(()=>{
    if(!api)return; setDsLoading(true);
    Promise.allSettled([api("/api/v1/datasets/?skip=0&limit=200"),api("/api/v1/questions-v2/categories")]).then(([dr,cr])=>{
      if(dr.status==="fulfilled"){const l=Array.isArray(dr.value)?dr.value:Array.isArray(dr.value?.data)?dr.value.data:dr.value?.datasets||[];setDatasets(l);}
      if(cr.status==="fulfilled"){const l=Array.isArray(cr.value)?cr.value:Array.isArray(cr.value?.data)?cr.value.data:[];setCategories(l);}
    }).finally(()=>setDsLoading(false));
  },[api]);

  useEffect(()=>{
    if(!api||!isEdit||!id)return; let cancelled=false; setInitialLoading(true);
    api(`/api/v1/questions-v2/${id}`).then(resp=>{
      if(cancelled)return;
      const q0=resp?.data||resp,q=q0?.data||q0; if(!q||typeof q!=="object")return;
      const dsId=firstNN(q.data_foundation?.dataset_id,q.dataset_id,q.definition?.datasource_id,q.definition?.dataset_id);
      const ct=firstNN(q.visualization?.chart_type,q.visualization?.chartType,q.definition?.visualization?.chart_type,q.chart_type);
      const xCol=firstNN(q.visualization?.mapping?.x_axis,q.definition?.groupby?.[0],q.definition?.x_column);
      const dims=Array.isArray(q.data_foundation?.columns?.dimensions)?q.data_foundation.columns.dimensions.map(d=>typeof d==="string"?d:d?.name).filter(Boolean):Array.isArray(q.definition?.groupby)?q.definition.groupby.filter(Boolean):(!isNullish(xCol)?[String(xCol)]:[]);
      const yAxis=q.visualization?.mapping?.y_axis;
      const yRaw=Array.isArray(yAxis)?yAxis:Array.isArray(q.definition?.columns)?q.definition.columns:Array.isArray(q.definition?.metrics)?q.definition.metrics:[];
      const yCols=toColumnIdList(yRaw);
      const dateCols=Array.isArray(q.data_foundation?.columns?.dates)?q.data_foundation.columns.dates.map(d=>typeof d==="string"?d:d?.name).filter(Boolean).map(s=>String(s).trim()).filter(Boolean):[];
      const colorColRaw=firstNN(q.visualization?.mapping?.color_by,q.definition?.color_column);
      const colorCol=toColumnId(colorColRaw);
      const rf=Array.isArray(q.data_foundation?.base_filters)?q.data_foundation.base_filters:Array.isArray(q.definition?.filters)?q.definition.filters:[];
      const derived=Array.isArray(q.data_foundation?.derived_measures)?q.data_foundation.derived_measures:[];
      const dfCols=normalizeDfColumns(q.data_foundation?.columns);
      setForm(prev=>({...prev,
        name:!isNullish(q.name)?q.name:prev.name,description:!isNullish(q.description)?q.description:"",
        dataset_id:!isNullish(dsId)?String(dsId):"",chart_type:!isNullish(ct)?String(ct):"",
        category_id:!isNullish(q.category_id)?String(q.category_id):"",
        dimension_columns:dims.filter(v=>!isNullish(v)).map(String),
        x_column:!isNullish(xCol)?String(xCol):"",
        y_columns:yCols.filter(v=>!isNullish(v)).map(String),
        date_columns:dateCols.filter(v=>!isNullish(v)).map(String),
        color_column:colorCol||"",
        status:!isNullish(q.status)?String(q.status):"draft",
      }));
      setFilters(rf.map((f,i)=>({id:`${Date.now()}-${i}`,column:toColumnId(f.column)||String(f.column||""),operator:f.operator||"equals",value:isNullish(f.value)?"":String(f.value)})));
      setEditFallbackColumns(dfCols); setEditFallbackDatasetId(!isNullish(dsId)?String(dsId):"");
      setDerivedMeasures(derived.map(normalizeDerivedFromApi).filter(Boolean));

      const apiMeasures = q.data_foundation?.columns?.measures;
      if (Array.isArray(apiMeasures) && apiMeasures.length > 0) {
        setColumnSettings((prev) => {
          const next = { ...prev };
          apiMeasures.forEach((m) => {
            const col = toColumnId(m);
            if (!col) return;
            const agg = typeof m === "object" && m ? m.aggregation : null;
            const alias = typeof m === "object" && m ? (m.display_name || m.alias) : null;
            next[col] = {
              ...(next[col] || {}),
              ...(agg != null && String(agg).trim() ? { aggregation: normalizeAggregationForApi(agg) } : {}),
              ...(alias != null && String(alias).trim() ? { alias: String(alias).trim() } : {}),
            };
          });
          return next;
        });
      }
    }).catch(()=>{if(!cancelled)setError("Failed to load question details for editing.");})
      .finally(()=>{if(!cancelled)setInitialLoading(false);});
    return()=>{cancelled=true;};
  },[api,isEdit,id]);

  useEffect(()=>{
    if(!form.dataset_id||!api){setColumns([]);return;} setColLoading(true);
    (async()=>{
      const toList=(d)=>{
        if (!d) return [];
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.data)) return d.data;
        if (Array.isArray(d?.columns)) return d.columns;
        if (Array.isArray(d?.data?.columns)) return d.data.columns;
        if (Array.isArray(d?.output_columns)) return d.output_columns;
        if (d?.definition && typeof d.definition === "object") {
          const c = d.definition.columns;
          if (Array.isArray(c)) return c;
        }
        return [];
      };
      for(const ep of[`/api/v1/datasets/${form.dataset_id}/output-columns`,`/api/v1/datasets/${form.dataset_id}/columns`,`/api/v1/datasets/${form.dataset_id}`]){
        try{
          const r=await api(ep);
          let l=toList(r);
          if (!l.length && r && typeof r === "object" && !Array.isArray(r) && r.definition) l=toList(r);
          if(l.length>0){setColumns(l);return;}
        }catch{/* next endpoint */}
      }
      if(isEdit&&String(form.dataset_id)===String(editFallbackDatasetId)&&editFallbackColumns.length>0)setColumns(editFallbackColumns);
      else setColumns([]);
    })().finally(()=>setColLoading(false));
  },[form.dataset_id,api,isEdit,editFallbackColumns,editFallbackDatasetId]);

  useEffect(()=>{
    if(!form.dataset_id||!api){setDatasetMeasures([]);return;}
    api(`/api/v1/datasets/${form.dataset_id}/measures`).then(r=>{const l=Array.isArray(r?.data)?r.data:Array.isArray(r?.measures)?r.measures:Array.isArray(r)?r:[];setDatasetMeasures(l);}).catch(()=>setDatasetMeasures([]));
  },[form.dataset_id,api]);

  useEffect(()=>{
    const dims=form.dimension_columns||[];
    if((form.x_column||"")!==(dims[0]||""))setForm(p=>({...p,x_column:dims[0]||""}));
  },[form.dimension_columns]);

  useEffect(()=>{
    setColumnSettings(prev=>{
      const next={};
      const keys=[...(form.y_columns||[]),...(form.date_columns||[]),...(form.dimension_columns?.length?form.dimension_columns:(form.x_column?[form.x_column]:[]))];
      keys.forEach(name=>{next[name]=prev[name]||{alias:name,description:"",aggregation:"sum",format_type:"number",scale:"auto",decimals:2,locale:"en-IN",currency_symbol:"₹",date_pattern:"MM/DD/YYYY",time_granularity:"auto",default_aggregation:"auto",show_incomplete_periods:true,fill_missing_periods:false,fiscal_year_start_month:"january",show_tooltip:true,hide_by_default:false,sort:"none"};});
      return next;
    });
  },[form.y_columns,form.dimension_columns,form.x_column,form.date_columns]);

  /* ── Derived column data ── */
  const parsedColumns = columns.map(c=>{
    if(typeof c==="string"){const lc=c.toLowerCase();return{value:c,label:c,kind:lc.includes("date")||lc.includes("time")?"date":"dimension"};}
    const value=c.name||c.column_name||String(c);
    const dt=String(c.data_type||c.type||"").toLowerCase();
    const isMeasure=c.is_measure||["int","float","double","decimal","number","numeric","bigint"].some(t=>dt.includes(t));
    const isDate=c.is_date||["date","time","timestamp","datetime"].some(t=>dt.includes(t));
    return{value,label:value,kind:isDate?"date":isMeasure?"measure":"dimension"};
  });
  const dimCols     = parsedColumns.filter(c=>c.kind==="dimension");
  const measureCols = parsedColumns.filter(c=>c.kind==="measure");
  const dateCols    = parsedColumns.filter(c=>c.kind==="date");
  const datasetMeasureCols = datasetMeasures.map(m=>{const v=m?.name||m?.measure_name||m?.id;if(!v)return null;return{value:String(v),label:String(m?.display_name||v),kind:"measure"};}).filter(Boolean).filter(m=>!measureCols.some(c=>c.value===m.value));

  const q = columnSearch.trim().toLowerCase();
  const bySearch = c=>!q||c.label.toLowerCase().includes(q)||c.value.toLowerCase().includes(q);

  const selectedDims     = form.dimension_columns?.length?form.dimension_columns:(form.x_column?[form.x_column]:[]);
  const selectedMeasures = form.y_columns||[];
  const selectedDates    = form.date_columns||[];
  const colOptions       = columns.map(c=>{const v=typeof c==="string"?c:c.name||c.column_name||String(c);return{value:v,label:v};});
  const catOptions       = [{value:"",label:"No group"},...categories.map(c=>({value:String(c.id),label:c.name}))];

  const selectedColumnKind = (()=>{
    if(!selectedColumn)return"";
    if((form.y_columns||[]).includes(selectedColumn))return"measure";
    if((form.date_columns||[]).includes(selectedColumn))return"date";
    if((form.dimension_columns||[]).includes(selectedColumn)||form.x_column===selectedColumn)return"dimension";
    return"";
  })();
  const selectedCfg = columnSettings[selectedColumn]||{};
  const sourceMeta  = (()=>{
    const c=columns.find(x=>{const name=typeof x==="string"?x:x?.name||x?.column_name;return String(name)===String(selectedColumn);});
    if(!c||typeof c==="string")return{data_type:selectedColumnKind||"unknown"};
    return{data_type:c.data_type||c.type||c.source_metadata?.data_type||(selectedColumnKind||"unknown"),...c.source_metadata};
  })();

  /* ── Save ── */
  const handleSave = async () => {
    if(!form.name.trim()){setError("Question name is required.");return;}
    if(!form.chart_type){setError("Please select a chart type.");return;}
    setError(""); setSaving(true);
    try {
      const derivedNames=new Set((derivedMeasures||[]).map(d=>d.name));
      const baseY=(form.y_columns||[]).filter(c=>!derivedNames.has(c));
      const chartType = normalizeV2ChartType(form.chart_type);
      const vizTheme = typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light";
      const v2={
        id:isEdit?Number(id):undefined,name:form.name.trim(),description:form.description||null,
        data_foundation:{
          dataset_id:Number(form.dataset_id),
          columns:{
            dimensions:selectedDims,
            measures:baseY.map((name)=>({
              name,
              aggregation: normalizeAggregationForApi(columnSettings[name]?.aggregation),
            })),
            dates: toColumnIdList(form.date_columns || []),
          },
          derived_measures: derivedMeasures.map(derivedMeasureForApi).filter(Boolean),
          base_filters: filters
            .filter((f) => f.column && f.operator)
            .map((f) => ({
              column: toColumnId(f.column) || String(f.column || ""),
              operator: f.operator,
              value: f.value,
            })),
          grouping_hierarchy:selectedDims,
        },
        visualization:{
          chart_type:chartType,
          mapping:{
            x_axis:selectedDims[0]||form.x_column||toColumnIdList(form.date_columns||[])[0]||form.y_columns[0]||"value",
            y_axis:form.y_columns.length>0?toColumnIdList(form.y_columns):["value"],
            color_by:toColumnId(form.color_column)||null,
            size_by:null,
          },
          styling:{theme:vizTheme,colors:["#3B82F6","#10B981","#F59E0B","#EF4444"],title:form.name.trim(),show_legend:true,show_grid:true},
        },
        ...(form.category_id?{category_id:Number(form.category_id)}:{}),status:form.status,
      };
      const ep=isEdit?`/api/v1/questions-v2/${id}`:"/api/v1/questions-v2/";
      const result=await api(ep,{method:isEdit?"PUT":"POST",body:JSON.stringify({question:v2}),headers:{"Content-Type":"application/json"}});
      const saved = unwrapSavedQuestion(result);
      const newId = saved?.id;
      if (newId == null && !isEdit) {
        throw new Error(result?.error || result?.message || "Saved but no question id returned.");
      }
      navigate(`/questions/${newId != null ? String(newId) : String(id)}`);
    } catch(e){setError(e.message||`Failed to ${isEdit?"update":"create"} question.`);}
    finally{setSaving(false);}
  };

  /* ── Drag ── */
  const doDrop = (targetId, type) => {
    if(!dragId||dragType!==type||dragId===targetId)return;
    const key=type==="dimension"?"dimension_columns":type==="measure"?"y_columns":"date_columns";
    const arr=[...(form[key]||[])];
    const fi=arr.indexOf(dragId),ti=arr.indexOf(targetId);
    if(fi<0||ti<0)return; arr.splice(fi,1);arr.splice(ti,0,dragId);
    setF(key,arr);
  };

  const totalCols = selectedDims.length+selectedMeasures.length+selectedDates.length;

  /* ── Render drag list ── */
  const renderList = (ids, type) => ids.map(cid => {
    const cfg=columnSettings[cid]||{};
    return (
      <DragItem key={cid} id={cid} type={type} label={cfg.alias||cid}
        isActive={activeEditId===cid} aggBadge={type==="measure"?(cfg.aggregation||"sum"):null}
        isDragging={dragId===cid&&dragType===type} isDropTarget={!!dragId&&dragType===type&&dragId!==cid}
        onEdit={()=>{if(activeEditId===cid){setActiveEditId(null);setSelectedColumn("");}else{setActiveEditId(cid);setSelectedColumn(cid);}}}
        onRemove={()=>{const key=type==="dimension"?"dimension_columns":type==="measure"?"y_columns":"date_columns";setF(key,(form[key]||[]).filter(x=>x!==cid));if(activeEditId===cid){setActiveEditId(null);setSelectedColumn("");}}}
        onDragStart={()=>{setDragId(cid);setDragType(type);}} onDragEnd={()=>{setDragId(null);setDragType(null);}}
        onDragEnter={e=>e.preventDefault()} onDragLeave={()=>{}} onDrop={()=>doDrop(cid,type)}
      />
    );
  });

  /* ── Section group helper ── */
  const SectionGroup = ({icon, label, badge, badgeV, ids, type, addBtn}) => (
    <div style={{marginBottom:22}}>
      <div style={{display:"flex",alignItems:"center",gap:8,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:T.textMuted,fontFamily:"'Syne',sans-serif",marginBottom:8}}>
        {icon} {label} <Badge variant={badgeV} extra={{marginLeft:6}}>{badge}</Badge>
        <div style={{flex:1,height:1,background:T.borderFaint}}/>
      </div>
      {renderList(ids, type)}
      {ids.length===0&&!addBtn&&<div style={{textAlign:"center",padding:12,border:`1px dashed ${T.borderFaint}`,borderRadius:10,fontSize:10,color:T.textMuted,fontFamily:"'Syne',sans-serif"}}>No {label.toLowerCase()} selected</div>}
      {addBtn}
    </div>
  );

  const AddBtn = ({label, onClick}) => (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",width:"100%",border:`1px dashed ${T.borderSubtle}`,borderRadius:10,cursor:"pointer",color:T.textMuted,fontSize:11,fontWeight:500,background:"transparent",fontFamily:"'Syne',sans-serif",transition:"all 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.color=T.cyan;e.currentTarget.style.borderColor=T.borderMid;e.currentTarget.style.background="var(--bg-hover)";}}
      onMouseLeave={e=>{e.currentTarget.style.color=T.textMuted;e.currentTarget.style.borderColor=T.borderSubtle;e.currentTarget.style.background="transparent";}}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      {label}
    </button>
  );

  /* ── Props panel content ── */
  const renderProps = () => {
    if(!selectedColumn) return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:"40px 24px",textAlign:"center",color:T.textMuted}}>
        <div style={{fontSize:32,opacity:0.3,marginBottom:12}}>⚙️</div>
        <div style={{fontSize:12,fontWeight:600,fontFamily:"'Syne',sans-serif",marginBottom:6}}>No column selected</div>
        <div style={{fontSize:10,opacity:0.6,lineHeight:1.5,fontFamily:"'Syne',sans-serif"}}>Click the ✏️ edit button on any column in the center panel to configure its properties here.</div>
      </div>
    );

    const inputSt = {width:"100%",background:T.bgDeep,border:`1px solid ${T.borderSubtle}`,borderRadius:7,color:T.textPrimary,fontFamily:"'Syne',sans-serif",fontSize:12,padding:"8px 11px",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"};
    const textSt  = {...inputSt,resize:"none",height:56};

    return (
      <>
        <PropSec>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:T.textSec,fontFamily:"'Syne',sans-serif",marginBottom:6}}>
                {selectedColumnKind==="measure"?"Measure":selectedColumnKind==="date"?"Date Column":"Dimension"}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Badge variant={selectedColumnKind==="measure"?"blue":selectedColumnKind==="date"?"violet":"cyan"}>{selectedColumnKind||"column"}</Badge>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textMuted}}>{selectedColumn}</span>
              </div>
            </div>
            <div onClick={()=>{setSelectedColumn("");setActiveEditId(null);}} style={{width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.textMuted,transition:"color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.color=T.textPrimary}
              onMouseLeave={e=>e.currentTarget.style.color=T.textMuted}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={FL}>Display Name</label>
            <input value={selectedCfg.alias||selectedColumn} onChange={e=>setCS(selectedColumn,{alias:e.target.value})} style={inputSt}/>
          </div>
          <div>
            <label style={FL}>Description</label>
            <textarea value={selectedCfg.description||""} onChange={e=>setCS(selectedColumn,{description:e.target.value})} placeholder="Add description…" style={textSt}/>
          </div>
        </PropSec>

        {selectedColumnKind==="measure"&&<>
          <PropSec>
            <label style={FL}>Aggregation</label>
            <Select value={selectedCfg.aggregation||"sum"} onChange={v=>setCS(selectedColumn,{aggregation:v})} options={AGG_OPS.map(v=>({value:v,label:v[0].toUpperCase()+v.slice(1)}))}/>
          </PropSec>
          <PropSec>
            <div style={{...FL,marginBottom:12}}>Formatting</div>
            <div style={{marginBottom:12}}>
              <label style={FL}>Format</label>
              <SegCtrl options={[{value:"number",label:"Number"},{value:"currency",label:"₹ Currency"},{value:"percentage",label:"% Percent"},{value:"text",label:"Text"}]} value={selectedCfg.format_type||"number"} onChange={v=>setCS(selectedColumn,{format_type:v})}/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={FL}>Scale</label>
              <PillBtns options={[{value:"none",label:"Full"},{value:"thousands",label:"K"},{value:"lakhs",label:"L"},{value:"crores",label:"Cr"},{value:"millions",label:"M"},{value:"billions",label:"B"},{value:"auto",label:"Auto"}]} value={selectedCfg.scale||"auto"} onChange={v=>setCS(selectedColumn,{scale:v})}/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={FL}>Decimals</label>
              <PillBtns options={[0,1,2,3,4].map(n=>({value:n,label:String(n)}))} value={selectedCfg.decimals??2} onChange={v=>setCS(selectedColumn,{decimals:Number(v)})}/>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <div style={{flex:1}}>
                <label style={FL}>Locale</label>
                <Select value={selectedCfg.locale||"en-IN"} onChange={v=>setCS(selectedColumn,{locale:v})} options={[{value:"en-IN",label:"IN (₹)"},{value:"en-US",label:"US ($)"},{value:"zh-CN",label:"CN (¥)"}]}/>
              </div>
              <div style={{flex:1}}>
                <label style={{...FL,marginBottom:10}}>Currency ₹</label>
                <Toggle on={selectedCfg.format_type==="currency"} onClick={()=>setCS(selectedColumn,{format_type:selectedCfg.format_type==="currency"?"number":"currency"})}/>
              </div>
            </div>
            <div style={{background:T.bgDeep,border:`1px solid ${T.borderFaint}`,borderRadius:8,padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textMuted}}>12,500,000</span>
              <span style={{color:T.textMuted}}>→</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,color:T.cyan}}>{fmtPreview(selectedCfg)}</span>
            </div>
          </PropSec>
        </>}

        {selectedColumnKind==="date"&&<>
          <PropSec>
            <div style={{...FL,marginBottom:12}}>Granularity</div>
            {DATE_GRANS.map(g=>(
              <GranItem key={g} label={g.charAt(0).toUpperCase()+g.slice(1)} active={(selectedCfg.time_granularity||"auto")===g} onClick={()=>setCS(selectedColumn,{time_granularity:g})}/>
            ))}
          </PropSec>
          <PropSec>
            <label style={FL}>Date Pattern</label>
            <Select value={selectedCfg.date_pattern||"MM/DD/YYYY"} onChange={v=>setCS(selectedColumn,{date_pattern:v})} options={["MM/DD/YYYY","DD/MM/YYYY","YYYY-MM-DD","MMM YYYY","MMMM YYYY"].map(f=>({value:f,label:f}))}/>
          </PropSec>
        </>}

        {selectedColumnKind==="dimension"&&(
          <PropSec>
            <div style={{...FL,marginBottom:12}}>Sorting</div>
            <SegCtrl options={[{value:"none",label:"None"},{value:"asc",label:"↑ Asc"},{value:"desc",label:"↓ Desc"}]} value={selectedCfg.sort||"none"} onChange={v=>setCS(selectedColumn,{sort:v})}/>
          </PropSec>
        )}

        <PropSec>
          <div style={{...FL,marginBottom:12}}>Display Options</div>
          {[{k:"show_tooltip",l:"Show in Tooltip",d:true},{k:"hide_by_default",l:"Hide by Default",d:false}].map(({k,l,d})=>(
            <div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0"}}>
              <span style={{fontSize:12,fontWeight:500,fontFamily:"'Syne',sans-serif",color:T.textSec}}>{l}</span>
              <Toggle on={selectedCfg[k]??d} onClick={()=>setCS(selectedColumn,{[k]:!(selectedCfg[k]??d)})}/>
            </div>
          ))}
        </PropSec>

        <PropSec>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textMuted}}>
            <div>Type: <span style={{color:T.cyan}}>{sourceMeta.data_type}</span></div>
            <div style={{marginTop:4}}>Source: <span style={{color:T.cyan}}>{selectedColumn}</span></div>
          </div>
        </PropSec>
      </>
    );
  };

  const BtnPrimary = ({onClick, disabled, children}) => (
    <button onClick={onClick} disabled={disabled} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:8,fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:disabled?"not-allowed":"pointer",border:"none",color:"#fff",background:"var(--nav-active-bg)",boxShadow:"var(--nav-active-shadow)",opacity:disabled?0.4:1,transition:"all 0.2s"}}>
      {children}
    </button>
  );
  const BtnGhost = ({onClick, children}) => (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:8,fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",border:`1px solid ${T.borderSubtle}`,color:T.textSec,background:"transparent",transition:"all 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.color=T.textPrimary;e.currentTarget.style.borderColor=T.borderMid;e.currentTarget.style.background=T.bgElevated;}}
      onMouseLeave={e=>{e.currentTarget.style.color=T.textSec;e.currentTarget.style.borderColor=T.borderSubtle;e.currentTarget.style.background="transparent";}}>
      {children}
    </button>
  );

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
    </svg>
  );

  /* ════════════════════════════════════════
     RENDER
     ════════════════════════════════════════ */
  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:T.bgVoid,color:T.textPrimary,flexDirection:"column",fontFamily:"'Syne',sans-serif",position:"relative"}}>
      {/* Grid bg */}
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none",zIndex:0,opacity:0.65}}/>

      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative",zIndex:1}}>
        <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo}/>

        <div style={{display:"flex",flex:1,flexDirection:"column",overflow:"hidden"}}>
          {/* ── Topbar ── */}
          <div style={{position:"relative",zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:54,background:"var(--topbar-bg)",borderBottom:`1px solid ${T.borderSubtle}`,flexShrink:0}}>
            <div style={{fontSize:12,fontWeight:800,letterSpacing:"0.18em",textTransform:"uppercase",color:T.cyan,display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:T.cyan,boxShadow:`0 0 8px ${T.cyan},0 0 20px ${T.cyan}`,animation:"pcsPulse 2.5s ease-in-out infinite"}}/>
              PCSoft Analytics
            </div>
            <StepIndicator step={step}/>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"var(--logo-grad)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",cursor:"pointer"}}>A</div>
            </div>
          </div>

          {/* ── 3-col body ── */}
          {initialLoading ? (
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:13,color:T.textMuted}}>
              <Spin/> Loading question...
            </div>
          ) : (
            <div style={{flex:1,display:"grid",gridTemplateColumns:"300px 1fr 300px",overflow:"hidden"}}>

              {/* LEFT */}
              <div style={{background:T.bgVoid,borderRight:`1px solid ${T.borderSubtle}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                <div style={{padding:"14px 18px 12px",borderBottom:`1px solid ${T.borderFaint}`,background:"var(--bg-card)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--text-sub)",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:14,height:1,background:T.cyan,display:"inline-block"}}/>
                    Available Columns
                  </div>
                </div>
                <div style={{flex:1,overflowY:"auto"}}>
                  <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.borderFaint}`}}>
                    <label style={FL}>Dataset</label>
                    {dsLoading ? (
                      <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:T.textMuted}}><Spin/>Loading datasets…</div>
                    ) : (
                      <div style={{marginBottom:12}}>
                        <Select value={form.dataset_id} onChange={v=>{setF("dataset_id",v);setF("dimension_columns",[]);setF("x_column","");setF("y_columns",[]);setF("date_columns",[]);}} options={datasets.map(d=>({value:String(d.id),label:d.name||`Dataset ${d.id}`}))} placeholder="Select dataset…"/>
                      </div>
                    )}
                    {form.dataset_id&&(
                      <div style={{position:"relative"}}>
                        <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.textMuted}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                        <input value={columnSearch} onChange={e=>setColumnSearch(e.target.value)} placeholder="Search columns…"
                          style={{width:"100%",background:T.bgDeep,border:`1px solid ${T.borderSubtle}`,borderRadius:8,color:T.textPrimary,fontFamily:"'Syne',sans-serif",fontSize:12,padding:"8px 12px 8px 32px",outline:"none",boxSizing:"border-box"}}/>
                      </div>
                    )}
                  </div>
                  {form.dataset_id&&(
                    <div style={{padding:"14px 18px"}}>
                      {colLoading ? (
                        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:T.textMuted,padding:"12px 0"}}><Spin/>Loading columns…</div>
                      ) : <>
                        <ColGroup icon="📊" label="Dimensions" badge={`${selectedDims.length} / ${dimCols.length}`} badgeVariant="cyan">
                          {dimCols.filter(bySearch).map(c=>(
                            <ColItem key={c.value} colId={c.label} colKey={c.value} type="dimension" checked={selectedDims.includes(c.value)}
                              onToggle={()=>setF("dimension_columns",selectedDims.includes(c.value)?selectedDims.filter(x=>x!==c.value):[...selectedDims,c.value])}/>
                          ))}
                        </ColGroup>
                        <div style={{height:1,background:T.borderFaint,margin:"8px 0"}}/>
                        <ColGroup icon="📈" label="Measures" badge={`${selectedMeasures.length} / ${measureCols.length}`} badgeVariant="blue">
                          {measureCols.filter(bySearch).map(c=>(
                            <ColItem key={c.value} colId={c.label} colKey={c.value} type="measure" checked={selectedMeasures.includes(c.value)}
                              onToggle={()=>setF("y_columns",selectedMeasures.includes(c.value)?selectedMeasures.filter(x=>x!==c.value):[...selectedMeasures,c.value])}/>
                          ))}
                        </ColGroup>
                        <div style={{height:1,background:T.borderFaint,margin:"8px 0"}}/>
                        <ColGroup icon="📅" label="Date Columns" badge={`${selectedDates.length} / ${dateCols.length}`} badgeVariant="violet">
                          {dateCols.filter(bySearch).map(c=>(
                            <ColItem key={c.value} colId={c.label} colKey={c.value} type="date" checked={selectedDates.includes(c.value)}
                              onToggle={()=>setF("date_columns",selectedDates.includes(c.value)?selectedDates.filter(x=>x!==c.value):[...selectedDates,c.value])}/>
                          ))}
                        </ColGroup>
                        {datasetMeasureCols.length>0&&<>
                          <div style={{height:1,background:T.borderFaint,margin:"8px 0"}}/>
                          <div style={{padding:"10px 0 0"}}>
                            <label style={FL}>Dataset Measures</label>
                            {datasetMeasureCols.filter(bySearch).map(c=>(
                              <ColItem key={c.value} colId={c.label} colKey={c.value} type="measure" checked={selectedMeasures.includes(c.value)}
                                onToggle={()=>setF("y_columns",selectedMeasures.includes(c.value)?selectedMeasures.filter(x=>x!==c.value):[...selectedMeasures,c.value])}/>
                            ))}
                          </div>
                        </>}
                      </>}
                    </div>
                  )}
                  {!form.dataset_id&&(
                    <div style={{padding:18}}>
                      <div style={{textAlign:"center",padding:16,border:`1px dashed ${T.borderFaint}`,borderRadius:10}}>
                        <div style={{fontSize:11,fontWeight:600,color:T.textMuted}}>No dataset selected</div>
                        <div style={{fontSize:10,color:T.textMuted,opacity:0.6,marginTop:3}}>Select a dataset to browse columns</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER */}
              <div style={{background:T.bgDeep,borderRight:`1px solid ${T.borderSubtle}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                <div style={{padding:"14px 18px 12px",borderBottom:`1px solid ${T.borderFaint}`,background:"var(--bg-card)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--text-sub)",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:14,height:1,background:T.cyan,display:"inline-block"}}/>
                    Selected Columns
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    <Badge variant="cyan">{selectedDims.length} Dims</Badge>
                    <Badge variant="blue">{selectedMeasures.length} Meas</Badge>
                    <Badge variant="violet">{selectedDates.length} Date</Badge>
                  </div>
                </div>

                {/* Step 1 content */}
                {step===1&&!form.dataset_id&&(
                  <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,padding:40}}>
                    <div style={{width:64,height:64,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg-active)",border:`1px solid ${T.borderSubtle}`}}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.cyan} strokeWidth="2"><path d="M12 2C6.5 2 2 4.5 2 7.5v9C2 19.5 6.5 22 12 22s10-2.5 10-5.5v-9C22 4.5 17.5 2 12 2zM2 7.5c0 1.66 4.5 3 10 3s10-1.34 10-3"/></svg>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Choose your data source</div>
                      <div style={{fontSize:12,color:T.textMuted,lineHeight:1.6}}>Select a dataset from the panel on the left to connect your data</div>
                    </div>
                  </div>
                )}
                {step===1&&form.dataset_id&&(
                  <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,padding:40}}>
                    <div style={{width:64,height:64,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",background:"color-mix(in srgb, var(--positive) 18%, var(--bg-card))",border:`1px solid ${T.borderSubtle}`}}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>Dataset Connected</div>
                      <div style={{fontSize:12,color:T.textMuted,marginBottom:4}}>{datasets.find(d=>String(d.id)===String(form.dataset_id))?.name||`Dataset ${form.dataset_id}`}</div>
                      <div style={{fontSize:11,color:T.textMuted}}>{colLoading?"Loading columns…":`${columns.length} column${columns.length!==1?"s":""} available`}</div>
                    </div>
                    <BtnPrimary onClick={()=>setStep(2)}>Continue to Data & Chart →</BtnPrimary>
                  </div>
                )}

                {/* Step 2 content */}
                {step===2&&(
                  <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}}>
                    {/* Name + chart type */}
                    <div style={{display:"flex",gap:8,marginBottom:16}}>
                      <input value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="Question / chart name…"
                        style={{flex:1,background:T.bgDeep,border:`1px solid ${T.borderMid}`,borderRadius:8,color:T.textPrimary,fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:600,padding:"9px 12px",outline:"none"}}/>
                      <div style={{width:150,flexShrink:0}}><Select value={form.chart_type} onChange={v=>setF("chart_type",v)} options={CHART_TYPES} placeholder="Chart Type"/></div>
                      <div style={{width:120,flexShrink:0}}><Select value={form.status} onChange={v=>setF("status",v)} options={[{value:"draft",label:"Draft"},{value:"published",label:"Published"},{value:"archived",label:"Archived"}]}/></div>
                    </div>

                    {error&&<div style={{padding:"10px 14px",borderRadius:8,marginBottom:14,background:"color-mix(in srgb, var(--negative) 12%, transparent)",border:"1px solid color-mix(in srgb, var(--negative) 32%, transparent)",color:"var(--negative)",fontSize:11}}>{error}</div>}

                    <SectionGroup icon="📊" label="Dimensions"      badge={selectedDims.length}     badgeV="cyan"   ids={selectedDims}     type="dimension"/>
                    <SectionGroup icon="📈" label="Measures"        badge={selectedMeasures.length} badgeV="blue"   ids={selectedMeasures} type="measure"/>

                    {/* Derived measures */}
                    <div style={{marginBottom:22}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:T.textMuted,marginBottom:8}}>
                        🧮 Derived Measures <Badge variant="amber" extra={{marginLeft:6}}>{derivedMeasures.length}</Badge>
                        <div style={{flex:1,height:1,background:T.borderFaint}}/>
                      </div>
                      {derivedMeasures.map(d=>(
                        <DragItem key={d.name} id={d.name} type="measure" label={d.display_name||d.name} aggBadge="calc"
                          isActive={activeEditId===d.name} isDragging={false} isDropTarget={false}
                          onEdit={()=>{setActiveEditId(d.name);setSelectedColumn(d.name);}}
                          onRemove={()=>{setDerivedMeasures(prev=>prev.filter(x=>x.name!==d.name));setF("y_columns",(form.y_columns||[]).filter(x=>x!==d.name));if(activeEditId===d.name){setActiveEditId(null);setSelectedColumn("");}}}
                          onDragStart={()=>{}} onDragEnd={()=>{}} onDragEnter={e=>e.preventDefault()} onDragLeave={()=>{}} onDrop={()=>{}}/>
                      ))}
                      <AddBtn label="Add derived measure" onClick={()=>{resetDD();setShowDerivedModal(true);}}/>
                    </div>

                    <SectionGroup icon="📅" label="Dates"           badge={selectedDates.length}    badgeV="violet" ids={selectedDates}    type="date"/>

                    {/* Filters */}
                    <div style={{marginBottom:22}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:T.textMuted,marginBottom:8}}>
                        🔍 Filters <Badge variant="muted" extra={{marginLeft:6}}>{filters.length}</Badge>
                        <div style={{flex:1,height:1,background:T.borderFaint}}/>
                      </div>
                      {filters.length===0&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:18,border:`1px dashed ${T.borderFaint}`,borderRadius:10,marginBottom:8}}><div style={{fontSize:11,fontWeight:600,color:T.textMuted}}>No filters applied</div><div style={{fontSize:10,color:T.textMuted,opacity:0.6}}>Add filters to narrow your data</div></div>}
                      {filters.map(f=>(
                        <div key={f.id} style={{padding:"10px 12px",background:T.bgCard,border:`1px solid ${T.borderSubtle}`,borderRadius:10,marginBottom:6}}>
                          <div style={{display:"flex",flexDirection:"column",gap:6}}>
                            <Select value={f.column} onChange={v=>setFilters(p=>p.map(x=>x.id===f.id?{...x,column:v}:x))} options={colOptions}/>
                            <Select value={f.operator} onChange={v=>setFilters(p=>p.map(x=>x.id===f.id?{...x,operator:v}:x))} options={FILTER_OPS.map(v=>({value:v,label:v}))}/>
                            <input value={f.value} onChange={e=>setFilters(p=>p.map(x=>x.id===f.id?{...x,value:e.target.value}:x))} placeholder="Value"
                              style={{background:T.bgDeep,border:`1px solid ${T.borderSubtle}`,borderRadius:7,color:T.textPrimary,fontFamily:"'Syne',sans-serif",fontSize:12,padding:"8px 11px",outline:"none"}}/>
                            <button onClick={()=>setFilters(p=>p.filter(x=>x.id!==f.id))} style={{color:T.red,border:`1px solid ${T.borderFaint}`,background:"transparent",borderRadius:6,padding:"5px 10px",fontSize:11,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>Remove</button>
                          </div>
                        </div>
                      ))}
                      <AddBtn label="Add filter" onClick={()=>setFilters(p=>[...p,{id:`${Date.now()}-${p.length}`,column:colOptions[0]?.value||"",operator:"equals",value:""}])}/>
                    </div>

                    {/* Description */}
                    <div style={{marginBottom:22}}>
                      <label style={FL}>Description</label>
                      <textarea value={form.description} onChange={e=>setF("description",e.target.value)} rows={2} placeholder="Add description…"
                        style={{width:"100%",background:T.bgDeep,border:`1px solid ${T.borderSubtle}`,borderRadius:8,color:T.textPrimary,fontFamily:"'Syne',sans-serif",fontSize:12,padding:"8px 12px",outline:"none",resize:"none",boxSizing:"border-box"}}/>
                    </div>
                  </div>
                )}

                {step===2&&<div style={{padding:"8px 18px",borderTop:`1px solid ${T.borderFaint}`,fontSize:10,color:T.textMuted,display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                  💡 Grab <strong style={{color:T.textSec}}>⠿</strong> handle to reorder · Click ✏️ to configure properties
                </div>}
              </div>

              {/* RIGHT: Properties */}
              <div style={{background:T.bgVoid,borderLeft:`1px solid ${T.borderSubtle}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                <div style={{padding:"14px 18px 12px",borderBottom:`1px solid ${T.borderFaint}`,background:"var(--bg-card)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--text-sub)",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:14,height:1,background:T.cyan,display:"inline-block"}}/>
                    Properties
                  </div>
                  {selectedColumn&&<Badge variant="blue">{selectedColumn}</Badge>}
                </div>
                <div style={{flex:1,overflowY:"auto"}}>{renderProps()}</div>
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div style={{position:"relative",zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 24px",background:"var(--topbar-bg)",borderTop:`1px solid ${T.borderSubtle}`,flexShrink:0}}>
            <div style={{fontSize:11,color:T.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>
              {isEdit?"Edit Chart":"Create Chart"} · Step {step} of 2 · {totalCols} columns selected
            </div>
            <div style={{display:"flex",gap:10}}>
              <BtnGhost onClick={()=>step===1?navigate("/questions"):setStep(1)}>
                {step===1?"Cancel":"← Back"}
              </BtnGhost>
              {step===1 ? (
                <BtnPrimary onClick={()=>setStep(2)} disabled={!form.dataset_id}>
                  Next <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </BtnPrimary>
              ) : (
                <BtnPrimary onClick={handleSave} disabled={saving}>
                  {saving?<><Spin/>Saving…</>:isEdit?"Save Changes":"Save & Create Chart"}
                </BtnPrimary>
              )}
            </div>
          </div>
        </div>
      </div>

      <DerivedModal
        open={showDerivedModal} draft={derivedDraft} setDraft={setDerivedDraft}
        measures={[...new Set([...(form.y_columns||[]),...measureCols.map(m=>m.value)])]}
        onCancel={()=>{setShowDerivedModal(false);resetDD();}}
        onAdd={()=>{
          if(!derivedDraft.name.trim()||!derivedDraft.expression.trim())return;
          const deps=Array.from(derivedDraft.expression.matchAll(/\[([^\]]+)\]/g)).map(m=>m[1]);
          const item={name:derivedDraft.name.trim(),display_name:(derivedDraft.display_name||derivedDraft.name).trim(),description:derivedDraft.description?.trim()||null,measure_type:derivedDraft.measure_type||"calculated",configuration:{expression:derivedDraft.expression.trim()},expression:derivedDraft.expression.trim(),format_type:derivedDraft.format_type||"number",locale:derivedDraft.locale||"en-IN",currency_symbol:derivedDraft.currency_symbol||"₹",decimal_places:derivedDraft.decimal_places??2,use_thousand_separator:!!derivedDraft.use_thousand_separator,show_currency_symbol:(derivedDraft.format_type||"number")==="currency",scale:"none",depends_on:deps};
          setDerivedMeasures(prev=>{const others=prev.filter(x=>x.name!==item.name);return[...others,item];});
          if(!form.y_columns.includes(item.name))setF("y_columns",[...form.y_columns,item.name]);
          setShowDerivedModal(false);resetDD();
        }}
      />
    </div>
  );
}
