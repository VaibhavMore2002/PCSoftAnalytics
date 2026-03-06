import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";
import { useApp } from "./AppContext.jsx";
import { useAuth } from "./AuthContext.jsx";

/* ═══════════════════════════════════════════════════════════
   SVG helpers & shared UI
   ═══════════════════════════════════════════════════════════ */
function I({ d, size = 16, color = "currentColor", sw = 2, className = "" }) {
  return (
    <svg className={`shrink-0 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const ico = {
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  user: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  param: "M4 7V4h16v3M9 20h6M12 4v16",
  audit: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  userPlus: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 7a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6",
  refresh: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  ban: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);
const inputCls =
  "w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150";
const btnP =
  "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS =
  "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] transition-all duration-150";

/* ── Palette presets ───────────────────────────── */
const palettes = [
  { id: "default", name: "Default Purple", primary: "#7c3aed", bg: "#f8f7fc", darkBg: "#12111a", desc: "Standard workspace colors" },
  { id: "oceanic", name: "Oceanic Blue", primary: "#0284c7", bg: "#f0f9ff", darkBg: "#0f172a", desc: "Deep blues and clear skies" },
  { id: "sun-steel", name: "Sun & Steel", primary: "#ffd92e", bg: "#fffbeb", darkBg: "#111111", desc: "Golden sun meets dark steel" },
];

/* ── Tab definitions ─────────────────────────── */
const TABS = [
  { id: "general", label: "General", icon: ico.settings },
  { id: "parameters", label: "Global Parameters", icon: ico.param },
  { id: "users", label: "Users & Permissions", icon: ico.users, admin: true },
  { id: "groups", label: "User Groups", icon: ico.user, admin: true },
  { id: "audit", label: "Audit Logs", icon: ico.audit, admin: true },
];

/* ── Toast ────────────────────────────────────── */
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
          <div
            key={t.id}
            className="px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border"
            style={{
              background: t.type === "error" ? "rgba(239,68,68,.12)" : "rgba(16,185,129,.12)",
              borderColor: t.type === "error" ? "rgba(239,68,68,.25)" : "rgba(16,185,129,.25)",
              color: t.type === "error" ? "#f87171" : "#34d399",
              animation: "fadeUp .25s ease both",
            }}
          >
            <I d={t.type === "error" ? ico.x : ico.check} size={13} color={t.type === "error" ? "#f87171" : "#34d399"} sw={2.5} />
            {t.msg}
          </div>
        ))}
      </div>
    ) : null;
  return { push, Toast };
}

/* ── Shared components ─────────────────────────── */
function Modal({ title, onClose, wide, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div
        className={`rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl mx-4 max-h-[85vh] flex flex-col ${wide ? "w-full max-w-xl" : "w-full max-w-md"}`}
        style={{ animation: "fadeUp .25s cubic-bezier(.22,1,.36,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <h3 className="text-sm font-bold">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            <I d={ico.x} size={14} sw={2.5} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4" style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} onClick={onCancel}>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-sm mx-4" style={{ animation: "fadeUp .2s ease both" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: danger ? "rgba(239,68,68,.1)" : "rgba(99,102,241,.1)", border: `1px solid ${danger ? "rgba(239,68,68,.2)" : "rgba(99,102,241,.2)"}` }}>
              <I d={danger ? ico.trash : ico.check} size={18} color={danger ? "#f87171" : "#818cf8"} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text)]">{title}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
          <button className={btnS} onClick={onCancel}>Cancel</button>
          <button className={btnP} style={{ background: danger ? "#ef4444" : "var(--nav-active-bg)", opacity: loading ? 0.7 : 1 }} disabled={loading} onClick={onConfirm}>
            {loading ? <Spin /> : null} {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Custom Select (replaces native <select> for styled dropdowns) ── */
function Select({ value, onChange, options, placeholder, disabled, className = "", style = {}, flex1 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => String(o.value) === String(value));

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${flex1 ? "flex-1" : ""} ${className}`} style={style}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-left outline-none cursor-pointer flex items-center justify-between gap-2 transition-[border-color] duration-150 hover:border-[var(--text-muted)]"
        style={{ color: selected ? "var(--text)" : "var(--text-muted)", opacity: disabled ? 0.6 : 1, borderColor: open ? "var(--nav-active)" : undefined }}
      >
        <span className="truncate">{selected ? selected.label : placeholder || "Select..."}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl max-h-56 overflow-y-auto"
          style={{ animation: "fadeUp .15s ease both" }}>
          {options.map((o) => {
            const isActive = String(o.value) === String(value);
            return (
              <button key={o.value} type="button"
                className="w-full text-left px-3 py-2 text-sm cursor-pointer flex items-center justify-between gap-2 transition-colors duration-100"
                style={{
                  background: isActive ? "var(--nav-active)" : "transparent",
                  color: isActive ? "#fff" : "var(--text)",
                  border: "none",
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--bg-input)"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; } }}
                onClick={() => { onChange(o.value); setOpen(false); }}
              >
                <span className="truncate">{o.label}</span>
                {isActive && <I d={ico.check} size={12} color="#fff" sw={2.5} />}
              </button>
            );
          })}
          {options.length === 0 && (
            <div className="px-3 py-4 text-xs text-[var(--text-muted)] text-center">No options available</div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.12)" }}>
        {icon}
      </div>
      <p className="text-sm font-semibold text-[var(--text-sub)] mb-1">{title}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mb-4">{sub}</p>}
      {action}
    </div>
  );
}

function Badge({ label, bg, color, border }) {
  return (
    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap capitalize"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  );
}

const ROLE_COLORS = {
  Admin: { bg: "rgba(245,158,11,.12)", color: "#fbbf24", border: "rgba(245,158,11,.25)" },
  Analyst: { bg: "rgba(59,130,246,.12)", color: "#60a5fa", border: "rgba(59,130,246,.25)" },
  Viewer: { bg: "rgba(74,222,128,.12)", color: "#4ade80", border: "rgba(74,222,128,.25)" },
};

/* ═══════════════════════════════════════════════════════════
   TAB 1 — General Settings
   ═══════════════════════════════════════════════════════════ */
function TabGeneral({ isDark, toggleDark, palette, changePalette }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-1">General Settings</h2>
        <p className="text-sm text-[var(--text-muted)]">Manage your application appearance and preferences</p>
      </div>

      <section>
        <h3 className="text-[0.62rem] font-bold tracking-[0.11em] uppercase text-[var(--text-muted)] mb-4">Appearance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[var(--text)]">Mode</h4>
              <p className="text-xs text-[var(--text-sub)]">Switch between light and dark themes</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border)]">
              <span className="text-sm font-medium">{isDark ? "Dark Mode" : "Light Mode"}</span>
              <button onClick={toggleDark} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
                style={{ background: isDark ? "var(--nav-active)" : "var(--border)" }}>
                <span className={`${isDark ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </button>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-center">
            <p className="text-sm text-[var(--text-sub)] italic">"Themes are applied globally across all pages of the PCSoft Analytics platform."</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-[0.62rem] font-bold tracking-[0.11em] uppercase text-[var(--text-muted)] mb-4">Color Palettes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {palettes.map((p) => {
            const active = palette === p.id;
            return (
              <div key={p.id} onClick={() => changePalette(p.id)}
                className={`group cursor-pointer p-4 rounded-xl bg-[var(--bg-card)] border ${active ? "border-[var(--nav-active)] ring-2 ring-[var(--nav-active)] ring-opacity-20" : "border-[var(--border)]"} hover:shadow-md transition-all relative overflow-hidden`}>
                {active && <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[var(--nav-active)] flex items-center justify-center"><I d={ico.check} size={10} color="#fff" sw={3} /></div>}
                <div className="h-20 rounded-lg overflow-hidden flex flex-col border border-[var(--border)] mb-3" style={{ background: isDark ? p.darkBg : p.bg }}>
                  <div className="h-5 w-full border-b border-[var(--border)] px-2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.primary }} />
                  </div>
                  <div className="flex-1 p-2 flex gap-2">
                    <div className="w-1/3 h-full rounded" style={{ background: p.primary, opacity: 0.1 }} />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="h-1.5 w-3/4 rounded bg-[var(--text-muted)] opacity-10" />
                      <div className="h-1.5 w-1/2 rounded bg-[var(--text-muted)] opacity-10" />
                    </div>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-[var(--text)]">{p.name}</h4>
                <p className="text-xs text-[var(--text-sub)]">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 2 — Global Parameters (full CRUD)
   ═══════════════════════════════════════════════════════════ */
function TabParameters({ api, toast }) {
  const [params, setParams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);

  const empty = { name: "", display_name: "", data_type: "string", scope: "global", default_value: "", description: "", is_active: true };
  const [form, setForm] = useState(empty);

  const load = useCallback(() => {
    setLoading(true);
    api("/api/v1/parameters/global").then((d) => setParams(Array.isArray(d) ? d : d?.data || [])).catch(() => setParams([])).finally(() => setLoading(false));
  }, [api]);
  useEffect(() => { load(); }, [load]);

  const filtered = params.filter((p) => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.display_name?.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setForm(empty); setModal("create"); };
  const openEdit = (p) => {
    setForm({ name: p.name || "", display_name: p.display_name || "", data_type: p.data_type || "string", scope: p.scope || "global", default_value: p.default_value || "", description: p.description || "", is_active: p.is_active !== false });
    setModal(p);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.push("Parameter name is required", "error"); return; }
    if (!form.display_name.trim()) { toast.push("Display name is required", "error"); return; }
    setSaving(true);
    try {
      if (modal === "create") {
        await api("/api/v1/parameters/", { method: "POST", body: JSON.stringify({ ...form, is_active: true }) });
        toast.push("Parameter created successfully");
      } else {
        await api(`/api/v1/parameters/${modal.id}`, { method: "PUT", body: JSON.stringify({ display_name: form.display_name, description: form.description || null, default_value: form.default_value || null, is_active: form.is_active }) });
        toast.push("Parameter updated successfully");
      }
      setModal(null);
      load();
    } catch (e) { toast.push(e.message || "Failed to save parameter", "error"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await api(`/api/v1/parameters/${deleting.id}`, { method: "DELETE" });
      toast.push("Parameter deleted");
      setDeleting(null);
      load();
    } catch (e) { toast.push(e.message || "Delete failed", "error"); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold mb-1">Global Parameters</h2>
          <p className="text-sm text-[var(--text-muted)]">Define parameters that can be used across all datasources and datasets</p>
        </div>
        <button className={btnP} style={{ background: "var(--nav-active-bg)" }} onClick={openCreate}>
          <I d={ico.plus} size={12} color="#fff" sw={2.5} /> New Parameter
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-[var(--bg-input)] border border-[var(--border)] max-w-sm">
        <I d={ico.search} size={14} color="var(--text-muted)" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search parameters..." className="text-sm w-full bg-transparent outline-none text-[var(--text)] caret-[var(--nav-active)]" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Spin /> <span className="ml-2 text-sm text-[var(--text-muted)]">Loading...</span></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<I d={ico.param} size={22} color="var(--nav-active)" />} title="No Parameters Yet" sub="Create your first parameter to get started"
          action={<button className={btnP} style={{ background: "var(--nav-active-bg)" }} onClick={openCreate}><I d={ico.plus} size={12} color="#fff" sw={2.5} /> Create Parameter</button>} />
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-card)]">
          <table className="w-full text-left">
            <thead><tr className="border-b border-[var(--border)] bg-[var(--bg-input)]">
              {["Name", "Display Name", "Type", "Scope", "Default", "Status", "Actions"].map((h) => (
                <th key={h} className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)] px-4 py-3">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-input)]/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-[var(--text)]">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-sub)]">{p.display_name}</td>
                  <td className="px-4 py-3"><Badge label={p.data_type} bg="rgba(59,130,246,.1)" color="#60a5fa" border="rgba(59,130,246,.2)" /></td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{p.scope}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-sub)] font-mono">{p.default_value ?? "—"}</td>
                  <td className="px-4 py-3"><Badge label={p.is_active ? "Active" : "Inactive"} bg={p.is_active ? "rgba(16,185,129,.1)" : "rgba(148,163,184,.1)"} color={p.is_active ? "#34d399" : "#94a3b8"} border={p.is_active ? "rgba(16,185,129,.2)" : "rgba(148,163,184,.2)"} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--nav-active)] hover:border-[var(--nav-active)]/50 transition-colors" title="Edit"><I d={ico.edit} size={12} /></button>
                      <button onClick={() => setDeleting(p)} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/50 transition-colors" title="Delete"><I d={ico.trash} size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === "create" ? "Create Parameter" : "Edit Parameter"} onClose={() => setModal(null)}>
          <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Name *</label>
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="parameter_name" disabled={modal !== "create"} style={modal !== "create" ? { opacity: 0.6 } : {}} /></div>
          <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Display Name *</label>
            <input className={inputCls} value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="My Parameter" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Data Type</label>
              <Select value={form.data_type} onChange={(v) => setForm({ ...form, data_type: v })} disabled={modal !== "create"}
                options={["string", "integer", "decimal", "boolean", "date", "datetime", "list"].map((t) => ({ value: t, label: t }))} /></div>
            <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Default Value</label>
              <input className={inputCls} value={form.default_value} onChange={(e) => setForm({ ...form, default_value: e.target.value })} placeholder="Optional" /></div>
          </div>
          <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Description</label>
            <textarea className={inputCls + " resize-none"} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" /></div>
          {modal !== "create" && (
            <div className="flex items-center gap-3">
              <label className="text-[0.68rem] font-semibold text-[var(--text-sub)]">Active</label>
              <button onClick={() => setForm({ ...form, is_active: !form.is_active })} className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer" style={{ background: form.is_active ? "var(--nav-active)" : "var(--border)" }}>
                <span className={`${form.is_active ? "translate-x-4.5" : "translate-x-0.5"} inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform`} />
              </button>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button className={btnS} onClick={() => setModal(null)}>Cancel</button>
            <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: saving ? 0.7 : 1 }} disabled={!form.name.trim() || !form.display_name.trim() || saving} onClick={handleSave}>
              {saving ? <><Spin /> Saving...</> : modal === "create" ? <><I d={ico.plus} size={12} color="#fff" sw={2.5} /> Create</> : <><I d={ico.check} size={12} color="#fff" sw={2.5} /> Update</>}
            </button>
          </div>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete Parameter" message={`Are you sure you want to delete "${deleting.display_name || deleting.name}"? This cannot be undone.`} confirmLabel="Delete" danger loading={busy} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 3 — Users & Permissions (full CRUD + edit + role)
   ═══════════════════════════════════════════════════════════ */
function TabUsers({ api, toast }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const limit = 15;
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);

  const emptyForm = { email: "", full_name: "", role: "Viewer", password: "", is_active: true };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(() => {
    setLoading(true);
    api("/api/v1/users", {}, { skip: page * limit, limit }).then((d) => {
      const items = d?.items || d?.data || (Array.isArray(d) ? d : []);
      setUsers(items);
      setTotal(d?.total ?? items.length);
    }).catch(() => { setUsers([]); setTotal(0); }).finally(() => setLoading(false));
  }, [api, page]);
  useEffect(() => { load(); }, [load]);

  let filtered = users;
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter((u) => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)); }
  if (roleFilter) filtered = filtered.filter((u) => u.role?.toLowerCase() === roleFilter.toLowerCase());
  if (statusFilter) filtered = filtered.filter((u) => (statusFilter === "active" ? u.is_active : !u.is_active));

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "Viewer";
  const openCreate = () => { setForm(emptyForm); setModal("create"); };
  const openEdit = (u) => { setForm({ email: u.email || "", full_name: u.full_name || "", role: capitalize(u.role), password: "", is_active: u.is_active !== false }); setModal(u); };

  const handleSave = async () => {
    if (modal === "create") {
      if (!form.email.trim()) { toast.push("Email is required", "error"); return; }
      if (!form.password.trim()) { toast.push("Password is required", "error"); return; }
      if (form.password.trim().length < 8) { toast.push("Password must be at least 8 characters", "error"); return; }
    } else {
      if (!form.email.trim()) { toast.push("Email is required", "error"); return; }
      if (form.password.trim() && form.password.trim().length < 8) { toast.push("Password must be at least 8 characters", "error"); return; }
    }
    setSaving(true);
    try {
      if (modal === "create") {
        await api("/api/v1/users", { method: "POST", body: JSON.stringify({ email: form.email.trim(), full_name: form.full_name.trim() || null, role: form.role, password: form.password.trim(), is_active: form.is_active }) });
        toast.push("User created successfully");
      } else {
        const body = {
          email: form.email.trim() || null,
          full_name: form.full_name.trim() || null,
          role: form.role || null,
          is_active: form.is_active,
          password: form.password.trim() || null,
        };
        await api(`/api/v1/users/${modal.id}`, { method: "PUT", body: JSON.stringify(body) });
        toast.push("User updated successfully");
      }
      setModal(null); load();
    } catch (e) { toast.push(e.message || "Failed to save user", "error"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await api(`/api/v1/users/${deleting.id}`, { method: "DELETE" });
      toast.push("User deactivated successfully");
      setDeleting(null);
      load();
    } catch (e) { toast.push(e.message || "Delete failed", "error"); } finally { setBusy(false); }
  };

  const handleReactivate = async (u) => {
    try {
      await api(`/api/v1/users/${u.id}`, { method: "PUT", body: JSON.stringify({ is_active: true }) });
      toast.push(`${u.full_name || u.email} reactivated`);
      load();
    } catch (e) { toast.push(e.message || "Reactivate failed", "error"); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold mb-1">Users & Permissions</h2>
          <p className="text-sm text-[var(--text-muted)]">Manage user accounts, roles, and access permissions</p>
        </div>
        <button className={btnP} style={{ background: "var(--nav-active-bg)" }} onClick={openCreate}>
          <I d={ico.userPlus} size={13} color="#fff" /> Add User
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-[var(--bg-input)] border border-[var(--border)] flex-1 max-w-xs">
          <I d={ico.search} size={14} color="var(--text-muted)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="text-sm w-full bg-transparent outline-none text-[var(--text)] caret-[var(--nav-active)]" />
        </div>
        <Select value={roleFilter} onChange={setRoleFilter} placeholder="All Roles" style={{ maxWidth: 150 }}
          options={[{ value: "", label: "All Roles" }, { value: "Admin", label: "Admin" }, { value: "Analyst", label: "Analyst" }, { value: "Viewer", label: "Viewer" }]} />
        <Select value={statusFilter} onChange={setStatusFilter} placeholder="All Status" style={{ maxWidth: 150 }}
          options={[{ value: "", label: "All Status" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Spin /> <span className="ml-2 text-sm text-[var(--text-muted)]">Loading...</span></div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-card)]">
          <table className="w-full text-left">
            <thead><tr className="border-b border-[var(--border)] bg-[var(--bg-input)]">
              {["Name", "Email", "Role", "Status", "Last Login", "Actions"].map((h) => (
                <th key={h} className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)] px-4 py-3">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-[var(--text-muted)]">No users found</td></tr>
              ) : filtered.map((u) => {
                const rs = ROLE_COLORS[u.role] || ROLE_COLORS.Viewer;
                return (
                  <tr key={u.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-input)]/50 transition-colors" style={{ opacity: u.is_active ? 1 : 0.55 }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[0.62rem] font-bold text-white shrink-0" style={{ background: rs.color }}>
                          {(u.full_name || u.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-[var(--text)]">{u.full_name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-sub)]">{u.email}</td>
                    <td className="px-4 py-3"><Badge label={u.role} bg={rs.bg} color={rs.color} border={rs.border} /></td>
                    <td className="px-4 py-3"><Badge label={u.is_active ? "Active" : "Inactive"} bg={u.is_active ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)"} color={u.is_active ? "#34d399" : "#f87171"} border={u.is_active ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)"} /></td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{u.last_login ? new Date(u.last_login).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(u)} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--nav-active)] hover:border-[var(--nav-active)]/50 transition-colors" title="Edit"><I d={ico.edit} size={12} /></button>
                        {u.is_active ? (
                          <button onClick={() => setDeleting(u)} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/50 transition-colors" title="Deactivate"><I d={ico.ban} size={12} /></button>
                        ) : (
                          <button onClick={() => handleReactivate(u)} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-emerald-400 hover:border-emerald-400/50 transition-colors" title="Reactivate"><I d={ico.check} size={12} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-input)]">
            <span className="text-xs text-[var(--text-muted)]">Showing {filtered.length > 0 ? page * limit + 1 : 0} to {Math.min((page + 1) * limit, total)} of {total} users</span>
            <div className="flex items-center gap-1.5">
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] cursor-pointer disabled:opacity-40">Prev</button>
              <span className="text-xs text-[var(--text-sub)] px-2">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] cursor-pointer disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <Modal title={modal === "create" ? "Add New User" : "Edit User"} onClose={() => setModal(null)}>
          <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Email *</label>
            <input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" /></div>
          <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Full Name</label>
            <input className={inputCls} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Role *</label>
              <Select value={form.role} onChange={(v) => setForm({ ...form, role: v })}
                options={[{ value: "Admin", label: "Admin" }, { value: "Analyst", label: "Analyst" }, { value: "Viewer", label: "Viewer" }]} /></div>
            <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">{modal === "create" ? "Password *" : "New Password"}</label>
              <input className={inputCls} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={modal === "create" ? "Required" : "Leave blank to keep"} /></div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[0.68rem] font-semibold text-[var(--text-sub)]">Active</label>
            <button onClick={() => setForm({ ...form, is_active: !form.is_active })} className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer" style={{ background: form.is_active ? "var(--nav-active)" : "var(--border)" }}>
              <span className={`${form.is_active ? "translate-x-4.5" : "translate-x-0.5"} inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform`} />
            </button>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className={btnS} onClick={() => setModal(null)}>Cancel</button>
            <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: saving ? 0.7 : 1 }} disabled={saving || (modal === "create" && (!form.email.trim() || !form.password.trim()))} onClick={handleSave}>
              {saving ? <><Spin /> Saving...</> : modal === "create" ? <><I d={ico.userPlus} size={12} color="#fff" /> Add User</> : <><I d={ico.check} size={12} color="#fff" sw={2.5} /> Update</>}
            </button>
          </div>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog title="Deactivate User" message={`Deactivate "${deleting.full_name || deleting.email}"? The user will be marked inactive and lose access. You can view inactive users using the Status filter.`} confirmLabel="Deactivate" danger loading={busy} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 4 — User Groups (CRUD + member management)
   ═══════════════════════════════════════════════════════════ */
function TabGroups({ api, toast }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);

  const [membersGroup, setMembersGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [addUserId, setAddUserId] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);

  const emptyForm = { name: "", description: "", color: "#7c3aed" };
  const [form, setForm] = useState(emptyForm);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [modalUsers, setModalUsers] = useState([]);
  const [loadingModalUsers, setLoadingModalUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#8b5cf6"];

  const load = useCallback(() => {
    setLoading(true);
    api("/api/v1/groups").then((d) => setGroups(d?.groups || d?.data || (Array.isArray(d) ? d : []))).catch(() => setGroups([])).finally(() => setLoading(false));
  }, [api]);
  useEffect(() => { load(); }, [load]);

  const filtered = groups.filter((g) => !search || g.name?.toLowerCase().includes(search.toLowerCase()));

  const fetchModalUsers = async (groupId) => {
    setLoadingModalUsers(true);
    try {
      const uRes = await api("/api/v1/users", {}, { skip: 0, limit: 100 });
      const all = (uRes?.items || uRes?.data || (Array.isArray(uRes) ? uRes : [])).filter((u) => u.is_active);
      if (groupId) {
        const mRes = await api(`/api/v1/groups/${groupId}/members`);
        const mems = Array.isArray(mRes) ? mRes : mRes?.members || mRes?.data || [];
        const memIds = new Set(mems.map((m) => m.id || m.user_id));
        setSelectedUserIds([...memIds]);
        setModalUsers(all);
      } else {
        setSelectedUserIds([]);
        setModalUsers(all);
      }
    } catch { setModalUsers([]); } finally { setLoadingModalUsers(false); }
  };

  const openCreate = () => { setForm(emptyForm); setUserSearch(""); setModal("create"); fetchModalUsers(null); };
  const openEdit = (g) => { setForm({ name: g.name || "", description: g.description || "", color: g.color || "#7c3aed" }); setUserSearch(""); setModal(g); fetchModalUsers(g.id); };

  const toggleUser = (uid) => setSelectedUserIds((prev) => prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.push("Group name is required", "error"); return; }
    setSaving(true);
    try {
      let groupId;
      if (modal === "create") {
        const created = await api("/api/v1/groups", { method: "POST", body: JSON.stringify(form) });
        groupId = created?.id;
        toast.push("Group created successfully");
      } else {
        groupId = modal.id;
        await api(`/api/v1/groups/${groupId}`, { method: "PUT", body: JSON.stringify(form) });
        toast.push("Group updated successfully");
      }
      // Sync members: add new, remove old
      if (groupId) {
        const mRes = await api(`/api/v1/groups/${groupId}/members`);
        const currentMembers = Array.isArray(mRes) ? mRes : mRes?.members || mRes?.data || [];
        const currentIds = new Set(currentMembers.map((m) => m.id || m.user_id));
        const toAdd = selectedUserIds.filter((id) => !currentIds.has(id));
        const toRemove = [...currentIds].filter((id) => !selectedUserIds.includes(id));
        if (toAdd.length) await api(`/api/v1/groups/${groupId}/members`, { method: "POST", body: JSON.stringify({ user_ids: toAdd }) });
        for (const uid of toRemove) await api(`/api/v1/groups/${groupId}/members/${uid}`, { method: "DELETE" });
        if (toAdd.length || toRemove.length) toast.push(`Members updated (${toAdd.length} added, ${toRemove.length} removed)`);
      }
      setModal(null); load();
    } catch (e) { toast.push(e.message || "Failed to save group", "error"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await api(`/api/v1/groups/${deleting.id}`, { method: "DELETE" }, { hard_delete: true });
      toast.push("Group deleted permanently");
      setDeleting(null);
      if (membersGroup?.id === deleting.id) setMembersGroup(null);
      load();
    } catch (e) { toast.push(e.message || "Delete failed", "error"); } finally { setBusy(false); }
  };

  const openMembers = async (g) => {
    setMembersGroup(g);
    setLoadingMembers(true);
    setAddUserId("");
    try {
      const [mRes, uRes] = await Promise.all([
        api(`/api/v1/groups/${g.id}/members`),
        api("/api/v1/users", {}, { skip: 0, limit: 100 }),
      ]);
      setMembers(Array.isArray(mRes) ? mRes : mRes?.members || mRes?.data || []);
      setAllUsers((uRes?.items || uRes?.data || (Array.isArray(uRes) ? uRes : [])).filter((u) => u.is_active));
    } catch { setMembers([]); setAllUsers([]); } finally { setLoadingMembers(false); }
  };

  const handleAddMember = async () => {
    if (!addUserId) { toast.push("Please select a user first", "error"); return; }
    setAddingMember(true);
    try {
      await api(`/api/v1/groups/${membersGroup.id}/members`, { method: "POST", body: JSON.stringify({ user_ids: [Number(addUserId)] }) });
      toast.push("Member added");
      setAddUserId("");
      openMembers(membersGroup);
      load();
    } catch (e) { toast.push(e.message || "Failed to add member", "error"); } finally { setAddingMember(false); }
  };

  const handleRemoveMember = async (userId) => {
    setRemovingMember(userId);
    try {
      await api(`/api/v1/groups/${membersGroup.id}/members/${userId}`, { method: "DELETE" });
      toast.push("Member removed");
      openMembers(membersGroup);
      load();
    } catch (e) { toast.push(e.message || "Failed to remove member", "error"); } finally { setRemovingMember(null); }
  };

  const memberIds = new Set(members.map((m) => m.id || m.user_id));
  const availableUsers = allUsers.filter((u) => !memberIds.has(u.id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold mb-1">User Groups</h2>
          <p className="text-sm text-[var(--text-muted)]">Organize users into groups for easier permission management</p>
        </div>
        <button className={btnP} style={{ background: "var(--nav-active-bg)" }} onClick={openCreate}>
          <I d={ico.plus} size={12} color="#fff" sw={2.5} /> New Group
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-[var(--bg-input)] border border-[var(--border)] max-w-sm">
        <I d={ico.search} size={14} color="var(--text-muted)" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search groups..." className="text-sm w-full bg-transparent outline-none text-[var(--text)] caret-[var(--nav-active)]" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Spin /> <span className="ml-2 text-sm text-[var(--text-muted)]">Loading...</span></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<I d={ico.user} size={22} color="var(--nav-active)" />} title="No groups created yet." sub="Create your first user group to organize permissions"
          action={<button className={btnP} style={{ background: "var(--nav-active-bg)" }} onClick={openCreate}><I d={ico.plus} size={12} color="#fff" sw={2.5} /> Create Group</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => (
            <div key={g.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 hover:shadow-lg transition-all group" style={{ borderLeft: `3px solid ${g.color || "#7c3aed"}` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.65rem] font-bold text-white shrink-0" style={{ background: g.color || "#7c3aed" }}>
                    {g.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text)]">{g.name}</h4>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(g)} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--nav-active)] transition-colors" title="Edit"><I d={ico.edit} size={11} /></button>
                  <button onClick={() => setDeleting(g)} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-red-400 transition-colors" title="Delete"><I d={ico.trash} size={11} /></button>
                </div>
              </div>
              {g.description && <p className="text-xs text-[var(--text-sub)] line-clamp-2 mb-3">{g.description}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <span className="text-[0.60rem] text-[var(--text-muted)]">{g.member_count ?? 0} members</span>
                <button onClick={() => openMembers(g)} className="text-[0.62rem] font-semibold text-[var(--nav-active)] hover:underline cursor-pointer flex items-center gap-1" style={{ background: "none", border: "none" }}>
                  <I d={ico.users} size={11} color="var(--nav-active)" /> Manage Members
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === "create" ? "Create User Group" : "Edit Group"} onClose={() => setModal(null)} wide>
          <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Group Name *</label>
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Engineering Team" /></div>
          <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Description</label>
            <textarea className={inputCls + " resize-none"} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" /></div>
          <div><label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-2 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (<button key={c} onClick={() => setForm({ ...form, color: c })} className="w-7 h-7 rounded-full cursor-pointer border-2 transition-transform hover:scale-110" style={{ background: c, borderColor: form.color === c ? "var(--text)" : "transparent" }} />))}
            </div></div>
          {/* ── User selection ── */}
          <div>
            <label className="text-[0.68rem] font-semibold text-[var(--text-sub)] mb-1.5 block">Members {selectedUserIds.length > 0 && <span className="text-[var(--nav-active)]">({selectedUserIds.length} selected)</span>}</label>
            {loadingModalUsers ? (
              <div className="flex items-center gap-2 py-4 justify-center text-sm text-[var(--text-muted)]"><Spin /> Loading users...</div>
            ) : modalUsers.length === 0 ? (
              <div className="text-xs text-[var(--text-muted)] py-3 text-center">No active users found</div>
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border)] mb-2">
                  <I d={ico.search} size={12} color="var(--text-muted)" />
                  <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search users..." className="text-xs w-full bg-transparent outline-none text-[var(--text)] caret-[var(--nav-active)]" />
                </div>
                <div className="rounded-xl border border-[var(--border)] overflow-hidden max-h-48 overflow-y-auto">
                  {modalUsers.filter((u) => !userSearch || u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase())).map((u) => {
                    const selected = selectedUserIds.includes(u.id);
                    const rs = ROLE_COLORS[u.role] || ROLE_COLORS.Viewer;
                    return (
                      <div key={u.id} onClick={() => toggleUser(u.id)}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors border-b border-[var(--border)] last:border-0 ${selected ? "bg-[var(--nav-active)]/8" : "hover:bg-[var(--bg-input)]"}`}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-[var(--nav-active)] bg-[var(--nav-active)]" : "border-[var(--border)]"}`}>
                          {selected && <I d={ico.check} size={10} color="#fff" sw={3} />}
                        </div>
                        <div className="w-7 h-7 rounded-md flex items-center justify-center text-[0.55rem] font-bold text-white shrink-0" style={{ background: rs.color }}>
                          {(u.full_name || u.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-[var(--text)] truncate">{u.full_name || u.email}</div>
                          <div className="text-[0.6rem] text-[var(--text-muted)] truncate">{u.email}</div>
                        </div>
                        <Badge label={u.role} bg={rs.bg} color={rs.color} border={rs.border} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className={btnS} onClick={() => setModal(null)}>Cancel</button>
            <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: saving ? 0.7 : 1 }} disabled={!form.name.trim() || saving} onClick={handleSave}>
              {saving ? <><Spin /> Saving...</> : modal === "create" ? <><I d={ico.plus} size={12} color="#fff" sw={2.5} /> Create Group</> : <><I d={ico.check} size={12} color="#fff" sw={2.5} /> Update</>}
            </button>
          </div>
        </Modal>
      )}

      {membersGroup && (
        <Modal title={`Members — ${membersGroup.name}`} onClose={() => setMembersGroup(null)} wide>
          {loadingMembers ? (
            <div className="flex items-center justify-center py-8"><Spin /> <span className="ml-2 text-sm text-[var(--text-muted)]">Loading members...</span></div>
          ) : (
            <>
              <div className="flex gap-2">
                <Select value={addUserId} onChange={setAddUserId} placeholder="Select user to add..." flex1
                  options={availableUsers.map((u) => ({ value: String(u.id), label: `${u.full_name || u.email} (${u.email})` }))} />
                <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: addingMember ? 0.7 : 1 }} disabled={!addUserId || addingMember} onClick={handleAddMember}>
                  {addingMember ? <Spin /> : <I d={ico.userPlus} size={13} color="#fff" />} Add
                </button>
              </div>
              {members.length === 0 ? (
                <div className="text-center py-8 text-sm text-[var(--text-muted)]">No members in this group yet</div>
              ) : (
                <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                  <table className="w-full text-left table-fixed">
                    <colgroup>
                      <col style={{ width: "35%" }} />
                      <col style={{ width: "35%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "12%" }} />
                    </colgroup>
                    <thead><tr className="bg-[var(--bg-input)] border-b border-[var(--border)]">
                      {["User", "Email", "Role", ""].map((h) => (<th key={h} className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 py-2.5">{h}</th>))}
                    </tr></thead>
                    <tbody>
                      {members.map((m) => {
                        const uid = m.id || m.user_id;
                        const rs = ROLE_COLORS[m.role] || ROLE_COLORS.Viewer;
                        return (
                          <tr key={uid} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-input)]/50 transition-colors">
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-md flex items-center justify-center text-[0.58rem] font-bold text-white shrink-0" style={{ background: rs.color }}>
                                  {(m.full_name || m.email || "?").charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold text-[var(--text)] truncate">{m.full_name || "—"}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-xs text-[var(--text-sub)] truncate">{m.email}</td>
                            <td className="px-3 py-2.5"><Badge label={m.role || "viewer"} bg={rs.bg} color={rs.color} border={rs.border} /></td>
                            <td className="px-3 py-2.5 text-right">
                              <button onClick={() => handleRemoveMember(uid)} className="w-6 h-6 rounded-lg inline-flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/50 transition-colors" title="Remove" disabled={removingMember === uid}>
                                {removingMember === uid ? <Spin /> : <I d={ico.x} size={10} sw={2.5} />}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete Group" message={`Permanently delete "${deleting.name}"? This will remove the group and all member associations. This cannot be undone.`} confirmLabel="Delete Group" danger loading={busy} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 5 — Audit Logs
   ═══════════════════════════════════════════════════════════ */
function TabAudit({ api }) {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState([]);
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => { api("/api/v1/audit/audit/actions").then((d) => setActions(Array.isArray(d) ? d : [])).catch(() => {}); }, [api]);

  const load = useCallback(() => {
    setLoading(true);
    const params = { skip: page * limit, limit };
    if (actionFilter) params.action = actionFilter;
    api("/api/v1/audit/audit", {}, params).then((d) => {
      setLogs(d?.items || d?.data || (Array.isArray(d) ? d : []));
      setTotal(d?.total ?? 0);
    }).catch(() => { setLogs([]); setTotal(0); }).finally(() => setLoading(false));
  }, [api, page, actionFilter]);
  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const AC = { create: "#10b981", update: "#f59e0b", delete: "#ef4444", activate: "#10b981", deactivate: "#ef4444", password: "#f97316", role: "#8b5cf6", login: "#3b82f6", logout: "#94a3b8", profile: "#06b6d4", share: "#ec4899", view: "#8b5cf6", export: "#06b6d4" };
  const actionColor = (a) => { const k = Object.keys(AC).find((k) => a?.toLowerCase().includes(k)); return AC[k] || "#94a3b8"; };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold mb-1">Audit Logs</h2>
          <p className="text-sm text-[var(--text-muted)]">Track all system activities and user actions</p>
        </div>
        <button className={btnS + " flex items-center gap-1.5"} onClick={() => { setPage(0); load(); }}>
          <I d={ico.refresh} size={12} /> Refresh
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Select value={actionFilter} onChange={(v) => { setActionFilter(v); setPage(0); }} placeholder="All Actions" style={{ maxWidth: 200 }}
          options={[{ value: "", label: "All Actions" }, ...actions.map((a) => ({ value: a, label: a }))]} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Spin /> <span className="ml-2 text-sm text-[var(--text-muted)]">Loading...</span></div>
      ) : logs.length === 0 ? (
        <EmptyState icon={<I d={ico.audit} size={22} color="var(--nav-active)" />} title="No audit logs found" sub="System activities will appear here" />
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-card)]">
          <table className="w-full text-left">
            <thead><tr className="border-b border-[var(--border)] bg-[var(--bg-input)]">
              {["Action", "Description", "Actor", "Target", "IP Address", "Date & Time"].map((h) => (
                <th key={h} className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-muted)] px-4 py-3">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {logs.map((log) => {
                const ac = actionColor(log.action);
                return (
                  <tr key={log.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-input)]/50 transition-colors">
                    <td className="px-4 py-3"><Badge label={log.action} bg={`${ac}15`} color={ac} border={`${ac}30`} /></td>
                    <td className="px-4 py-3 text-xs text-[var(--text-sub)] max-w-[200px] truncate">{log.description || "—"}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text)]">{log.actor_email || "System"}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{log.target_email || "—"}</td>
                    <td className="px-4 py-3 text-[0.62rem] text-[var(--text-muted)] font-mono">{log.ip_address || "—"}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">{new Date(log.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}<br/><span className="text-[0.6rem] opacity-70">{new Date(log.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-input)]">
            <span className="text-xs text-[var(--text-muted)]">Showing {logs.length > 0 ? page * limit + 1 : 0} to {Math.min((page + 1) * limit, total)} of {total} logs</span>
            <div className="flex items-center gap-1.5">
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] cursor-pointer disabled:opacity-40">Prev</button>
              <span className="text-xs text-[var(--text-sub)] px-2">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] cursor-pointer disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN — Settings Page
   ═══════════════════════════════════════════════════════════ */
export default function Settings() {
  const { isDark, toggleDark, palette, changePalette } = useTheme();
  const { navItems, activeNav, handleNavClick, user } = useApp();
  const { api, user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const toast = useToast();

  const userRole = (authUser?.role || user?.role || "viewer").toLowerCase();
  const isAdmin = userRole === "admin";
  const visibleTabs = TABS.filter((t) => !t.admin || isAdmin);

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-[var(--bg)] text-[var(--text)] font-sans">
      <toast.Toast />
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} isDark={isDark} onToggleDark={toggleDark} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-7 pt-6 pb-3 shrink-0 border-b border-b-[var(--border)] bg-[var(--topbar-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.15)" }}>
              <I d={ico.settings} size={18} color="var(--nav-active)" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[var(--text)]">Settings</h1>
              <p className="text-[0.62rem] text-[var(--text-muted)]">Manage your platform configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Badge label="Admin" bg="rgba(245,158,11,.12)" color="#fbbf24" border="rgba(245,158,11,.25)" />
            ) : (
              <Badge label={userRole} bg="rgba(124,58,237,.12)" color="#a78bfa" border="rgba(124,58,237,.25)" />
            )}
            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[0.68rem] font-bold text-white cursor-pointer" style={{ background: "var(--nav-active-bg)" }}>
              {authUser?.full_name ? authUser.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
            </div>
          </div>
        </div>

        {/* Horizontal tab bar */}
        <div className="flex items-center gap-1.5 px-7 pt-3 pb-0 shrink-0 border-b border-[var(--border)] bg-[var(--bg-card)] overflow-x-auto">
          {visibleTabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg cursor-pointer transition-all shrink-0 border-b-2 -mb-px ${
                  active
                    ? "border-[var(--nav-active)] text-[var(--nav-active)] font-bold"
                    : "border-transparent text-[var(--text-sub)] font-medium hover:text-[var(--text)] hover:bg-[var(--bg-input)]/50"
                }`}
                style={{ fontSize: "0.78rem", background: active ? "rgba(124,58,237,.04)" : undefined }}>
                <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                  active ? "bg-[var(--nav-active)]/10" : "bg-[var(--bg-input)]"
                }`}>
                  <I d={t.icon} size={13} color={active ? "var(--nav-active)" : "var(--text-muted)"} />
                </span>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-7">
          <div className="max-w-5xl mx-auto">
            {activeTab === "general" && <TabGeneral isDark={isDark} toggleDark={toggleDark} palette={palette} changePalette={changePalette} />}
            {activeTab === "parameters" && <TabParameters api={api} toast={toast} />}
            {activeTab === "users" && <TabUsers api={api} toast={toast} />}
            {activeTab === "groups" && <TabGroups api={api} toast={toast} />}
            {activeTab === "audit" && <TabAudit api={api} />}
          </div>

          <div className="flex items-center justify-between mt-12 pt-4 border-t border-[var(--border)]">
            <span className="text-[0.60rem] text-[var(--text-muted)]">&copy; 2026 PCSoft Analytics</span>
            <span className="text-[0.58rem] text-[var(--text-muted)]">v1.0.0 &middot; PCSoft Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
