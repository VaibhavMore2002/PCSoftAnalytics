import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";
import { Sk, ListSkeleton } from "./Skeleton.jsx";

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
  search: "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  db: "M12 2C6.48 2 3 3.34 3 5v14c0 1.66 3.48 3 9 3s9-1.34 9-3V5c0-1.66-3.48-3-9-3zM3 12c0 1.66 3.48 3 9 3s9-1.34 9-3",
  copy: "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  chevDown: "M6 9l6 6 6-6",
  refresh: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  sync: "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  share: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13", // this is upload? Wait, let's use standard share a copy: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" is actually upload. Share is: "M18 8A3 3 0 1 0 18 2A3 3 0 1 0 18 8zM6 15A3 3 0 1 0 6 9A3 3 0 1 0 6 15zM18 22A3 3 0 1 0 18 16A3 3 0 1 0 18 22zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
  userPlus: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M16 11h6M19 8v6M8.5 7a4 4 0 100 8 4 4 0 000-8z",
};


const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] transition-all duration-150";

/* ── Status / Type / Sync badge colors ── */
const STATUS_COLORS = {
  active: { bg: "rgba(74,222,128,.12)", color: "#4ade80", border: "rgba(74,222,128,.25)" },
  draft: { bg: "rgba(250,204,21,.12)", color: "#facc15", border: "rgba(250,204,21,.25)" },
  archived: { bg: "rgba(148,163,184,.12)", color: "#94a3b8", border: "rgba(148,163,184,.25)" },
};
const SYNC_COLORS = {
  success: { bg: "rgba(74,222,128,.12)", color: "#4ade80", border: "rgba(74,222,128,.25)" },
  running: { bg: "rgba(96,165,250,.12)", color: "#60a5fa", border: "rgba(96,165,250,.25)" },
  failed: { bg: "rgba(248,113,113,.12)", color: "#f87171", border: "rgba(248,113,113,.25)" },
  pending: { bg: "rgba(250,204,21,.12)", color: "#facc15", border: "rgba(250,204,21,.25)" },
};
const TYPE_COLORS = {
  join: { bg: "rgba(99,102,241,.10)", color: "#818cf8", border: "rgba(99,102,241,.25)" },
  union: { bg: "rgba(245,158,11,.10)", color: "#fbbf24", border: "rgba(245,158,11,.25)" },
  sql: { bg: "rgba(6,182,212,.10)", color: "#22d3ee", border: "rgba(6,182,212,.25)" },
};

function Badge({ label, bg, color, border }) {
  return (
    <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap capitalize"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  );
}

function EmptyState({ icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.12)" }}>
        {icon}
      </div>
      <p className="text-sm font-semibold text-[var(--text-sub)] mb-1">{title}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mb-4">{sub}</p>}
      {action}
    </div>
  );
}

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

/* ── Confirm Dialog ── */
function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} onClick={onCancel}>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-sm mx-4" style={{ animation: "fadeUp .2s ease both" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)" }}>
              <I d={ico.trash} size={18} color="#f87171" />
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

/* ── Manage Groups Modal ── */
const GROUP_PALETTE = [
  "#4f8ef7", "#22c55e", "#a855f7", "#f59e0b", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

function ManageGroupsModal({ groups, onClose, onGroupsChange }) {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState(GROUP_PALETTE[0]);
  const [creating, setCreating] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    setCreating(true);
    const newGroup = {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDesc.trim(),
      color: newColor,
    };
    setTimeout(() => {
      onGroupsChange([...groups, newGroup]);
      setNewName("");
      setNewDesc("");
      setNewColor(GROUP_PALETTE[0]);
      setShowForm(false);
      setCreating(false);
    }, 300);
  };

  const handleDeleteGroup = (id) => {
    setDeletingGroup(id);
    setTimeout(() => {
      onGroupsChange(groups.filter((g) => g.id !== id));
      setDeletingGroup(null);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-md mx-4" style={{ animation: "fadeUp .2s ease both", maxHeight: "80vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-[var(--text)]">Manage Dataset Groups</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border border-[var(--border)] bg-[var(--bg-input)] hover:border-[var(--nav-active)] transition-colors">
            <I d={ico.x} size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Create form */}
          {showForm ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-input)] p-4 mb-4">
              <p className="text-xs font-bold text-[var(--text)] mb-3">Create New Group</p>
              <label className="text-[0.65rem] font-semibold text-[var(--text-muted)] mb-1 block">Name <span className="text-red-400">*</span></label>
              <input
                autoFocus
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] mb-3 transition-[border-color]"
                placeholder="Group name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <label className="text-[0.65rem] font-semibold text-[var(--text-muted)] mb-1 block">Description</label>
              <textarea
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] resize-none mb-3 transition-[border-color]"
                placeholder="Optional description"
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <label className="text-[0.65rem] font-semibold text-[var(--text-muted)] mb-2 block">Color</label>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {GROUP_PALETTE.map((c) => (
                  <button key={c} type="button"
                    onClick={() => setNewColor(c)}
                    className="w-7 h-7 rounded-full border-2 transition-all"
                    style={{ background: c, borderColor: newColor === c ? "var(--text)" : "transparent", transform: newColor === c ? "scale(1.2)" : "scale(1)" }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className={btnP} style={{ background: "var(--nav-active-bg)", opacity: creating || !newName.trim() ? 0.6 : 1 }}
                  disabled={creating || !newName.trim()} onClick={handleCreate}>
                  {creating ? <Spin /> : <I d={ico.check} size={13} color="#fff" sw={2.5} />} Create
                </button>
                <button className={btnS} onClick={() => { setShowForm(false); setNewName(""); setNewDesc(""); setNewColor(GROUP_PALETTE[0]); }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {/* Group list */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[var(--text-sub)]">Groups ({groups.length})</span>
            {!showForm && (
              <button className="text-xs font-semibold flex items-center gap-1 text-[var(--nav-active)] hover:opacity-80 cursor-pointer bg-transparent border-none" onClick={() => setShowForm(true)}>
                <I d={ico.plus} size={13} color="var(--nav-active)" sw={2.5} /> Add Group
              </button>
            )}
          </div>

          {groups.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-[var(--text-muted)] mb-1">No groups created yet</p>
              {!showForm && (
                <button className="text-xs font-semibold text-[var(--nav-active)] hover:opacity-80 bg-transparent border-none cursor-pointer" onClick={() => setShowForm(true)}>
                  Create your first group
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map((g) => (
                <div key={g.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-input)]">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: g.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--text)] truncate">{g.name}</p>
                    {g.description && <p className="text-[0.6rem] text-[var(--text-muted)] truncate">{g.description}</p>}
                  </div>
                  <button
                    className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer bg-transparent border-none text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    onClick={() => handleDeleteGroup(g.id)}
                    disabled={deletingGroup === g.id}
                  >
                    <I d={ico.trash} size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-[var(--border)]">
          <button className={btnP} style={{ background: "var(--nav-active-bg)" }} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

/* ── Time helpers ── */
function relativeTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const ms = now - d;
  const min = Math.floor(ms / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return d.toLocaleDateString();
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ═══════════════════════════════════════════════════════════
   DataSets — Main Component
   ═══════════════════════════════════════════════════════════ */
/* ── Assign Groups Modal ── */
function AssignGroupsModal({ dataset, groups, onClose, onAssign, api, push }) {
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(dataset.group_id || "");

  const handleSave = async () => {
    setLoading(true);
    try {
      await api(`/api/v1/datasets/${dataset.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...dataset,
          group_id: selectedGroup || null
        })
      });
      push("Groups assigned successfully");
      onAssign();
    } catch {
      push("Failed to assign groups", "error");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-[var(--text)]">Assign Group</h2>
          <button className="text-[var(--text-muted)] hover:text-[var(--text)]" onClick={onClose}><I d={ico.x} size={14} /></button>
        </div>
        <div className="px-4 py-4">
          <p className="text-xs text-[var(--text-muted)] mb-3">Assign "{dataset.name}" to a group.</p>
          <div className="space-y-2">
            <button
              className="w-full text-left px-3 py-2 text-sm cursor-pointer flex items-center justify-between rounded-lg border"
              style={{
                borderColor: selectedGroup === "" ? "var(--nav-active)" : "var(--border)",
                background: selectedGroup === "" ? "var(--nav-active-bg)" : "var(--bg-input)"
              }}
              onClick={() => setSelectedGroup("")}
            >
              <span>None (Ungrouped)</span>
              {selectedGroup === "" && <I d={ico.check} size={14} color="var(--nav-active)" />}
            </button>
            {groups.map(g => (
              <button
                key={g.id}
                className="w-full text-left px-3 py-2 text-sm cursor-pointer flex items-center justify-between rounded-lg border"
                style={{
                  borderColor: selectedGroup === g.id ? "var(--nav-active)" : "var(--border)",
                  background: selectedGroup === g.id ? "var(--nav-active-bg)" : "var(--bg-input)"
                }}
                onClick={() => setSelectedGroup(g.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
                  <span>{g.name}</span>
                </div>
                {selectedGroup === g.id && <I d={ico.check} size={14} color="var(--nav-active)" />}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-input)] flex justify-end gap-2 rounded-b-xl">
          <button className={btnS} onClick={onClose}>Cancel</button>
          <button className={btnP} style={{ background: "var(--nav-active-bg)" }} onClick={handleSave} disabled={loading}>
            {loading ? <Spin /> : null} Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DataSets() {
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const navigate = useNavigate();
  const { push, Toast } = useToast();
  const PAGE_SIZE = 10;

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [duplicating, setDuplicating] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showManageGroups, setShowManageGroups] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupDropOpen, setGroupDropOpen] = useState(false);
  const groupDropRef = useRef(null);
  const [createDropOpen, setCreateDropOpen] = useState(false);
  const createDropRef = useRef(null);
  const [assigningGroups, setAssigningGroups] = useState(null);

  const fetchDatasets = useCallback(() => {
    if (!api) return;
    setLoading(true);
    api("/api/v1/datasets/?skip=0&limit=100")
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.datasets || [];
        setDatasets(list);
      })
      .catch(() => { setDatasets([]); push("Failed to load datasets", "error"); })
      .finally(() => setLoading(false));
  }, [api, push]);

  useEffect(() => { fetchDatasets(); }, [fetchDatasets]);

  /* ── Filtered list ── */
  const filtered = datasets.filter((ds) => {
    const q = search.toLowerCase();
    const matchSearch = !q || ds.name?.toLowerCase().includes(q) || ds.description?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || ds.status === statusFilter;
    const matchGroup = groupFilter === "all" || (ds.group_id && ds.group_id === groupFilter);
    return matchSearch && matchStatus && matchGroup;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, groupFilter]);

  /* ── Close group/create dropdown on outside click ── */
  useEffect(() => {
    const h = (e) => { 
      if (groupDropRef.current && !groupDropRef.current.contains(e.target)) setGroupDropOpen(false); 
      if (createDropRef.current && !createDropRef.current.contains(e.target)) setCreateDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* ── Actions ── */
  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api(`/api/v1/datasets/${deleting.id}`, { method: "DELETE" });
      push(`"${deleting.name}" deleted`);
      setDatasets((prev) => prev.filter((d) => d.id !== deleting.id));
    } catch { push("Delete failed", "error"); }
    setDeleteLoading(false);
    setDeleting(null);
  };

  const handleDuplicate = async (ds) => {
    setDuplicating(ds.id);
    try {
      await api(`/api/v1/datasets/${ds.id}/duplicate`, { method: "POST" });
      push(`"${ds.name}" duplicated`);
      fetchDatasets();
    } catch { push("Duplicate failed", "error"); }
    setDuplicating(null);
  };

  const handleSync = async (ds) => {
    setSyncing(ds.id);
    try {
      await api(`/api/v1/datasets/${ds.id}/sync`, { method: "POST" });
      push(`Sync started for "${ds.name}"`);
      fetchDatasets();
    } catch { push("Sync failed", "error"); }
    setSyncing(null);
  };

  const handleExport = async (ds) => {
    if (!ds.last_sync_status || ds.last_sync_status !== "success") {
      push("Cannot export data. Dataset has no recent materialization.", "error");
      return;
    }
    // We export using the dataset ID endpoint for direct CSV download. 
    // Since there's no native CSV endpoint mentioned in docs, we fetch JSON data and construct CSV.
    push(`Preparing export for "${ds.name}"...`);
    try {
      const resp = await api(`/api/v1/datasets/${ds.id}/data?limit=100000`);
      const rows = resp.data || [];
      if (rows.length === 0) {
        push("No data to export.", "error");
        return;
      }
      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(","),
        ...rows.map(row => headers.map(h => JSON.stringify(row[h] ?? "")).join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${ds.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      push(`Export complete`);
    } catch {
      push("Export failed", "error");
    }
  };

  const handleShare = async (ds) => {
    const url = `${window.location.origin}/datasets/${ds.id}`;
    try {
      await navigator.clipboard.writeText(url);
      push(`Link for "${ds.name}" copied to clipboard`);
    } catch (err) {
      push("Failed to copy link", "error");
    }
  };

  /* ── Stats ── */
  const stats = {
    total: datasets.length,
    active: datasets.filter((d) => d.status === "active").length,
    draft: datasets.filter((d) => d.status === "draft").length,
    archived: datasets.filter((d) => d.status === "archived").length,
  };

  useEffect(() => {
    const close = () => setOpenMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)" }}>
              <I d={ico.layers} size={16} color="#818cf8" />
            </div>
            <div>
              <h1 className="text-sm font-bold">Data Sets</h1>
              <p className="text-[0.65rem] text-[var(--text-muted)]">
                {stats.total} total · {stats.active} active · {stats.draft} draft
              </p>
            </div>
          </div>
          <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
            onClick={() => navigate("/datasets/new")}>
            <I d={ico.plus} size={14} color="#fff" sw={2.5} /> New Dataset
          </button>
        </header>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)] flex-wrap">
          {/* Search */}
          <div className="relative" style={{ minWidth: 180 }}>
            <I d={ico.search} size={14} color="var(--text-muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150 w-full"
              placeholder="Search datasets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-input)] overflow-hidden">
            {["all", "active", "draft", "archived"].map((s) => (
              <button key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 text-xs font-semibold capitalize cursor-pointer border-none transition-colors duration-150"
                style={{
                  background: statusFilter === s ? "var(--nav-active-bg)" : "transparent",
                  color: statusFilter === s ? "#fff" : "var(--text-muted)",
                }}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Filter by groups dropdown */}
          <div ref={groupDropRef} className="relative">
            <button
              onClick={() => setGroupDropOpen((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-sub)] cursor-pointer hover:border-[var(--nav-active)] transition-colors"
              style={{ borderColor: groupDropOpen ? "var(--nav-active)" : undefined }}
            >
              <I d={ico.tag} size={13} />
              {groupFilter === "all" ? "Filter by groups…" : (groups.find((g) => g.id === groupFilter)?.name || "Filter by groups…")}
              <I d={ico.chevDown} size={11} className={`transition-transform duration-150 ${groupDropOpen ? "rotate-180" : ""}`} />
            </button>
            {groupDropOpen && (
              <div className="absolute left-0 mt-1 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl z-50 overflow-hidden" style={{ animation: "fadeUp .15s ease both" }}>
                <button
                  className="w-full text-left px-3 py-2 text-xs font-semibold cursor-pointer transition-colors border-none"
                  style={{ background: groupFilter === "all" ? "var(--nav-active)" : "transparent", color: groupFilter === "all" ? "#fff" : "var(--text)", border: "none" }}
                  onClick={() => { setGroupFilter("all"); setGroupDropOpen(false); }}
                >
                  All Groups
                </button>
                {groups.map((g) => (
                  <button key={g.id}
                    className="w-full text-left px-3 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2 border-none"
                    style={{ background: groupFilter === g.id ? "var(--nav-active)" : "transparent", color: groupFilter === g.id ? "#fff" : "var(--text)", border: "none" }}
                    onMouseEnter={(e) => { if (groupFilter !== g.id) e.currentTarget.style.background = "var(--bg-input)"; }}
                    onMouseLeave={(e) => { if (groupFilter !== g.id) e.currentTarget.style.background = "transparent"; }}
                    onClick={() => { setGroupFilter(g.id); setGroupDropOpen(false); }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
                    <span className="truncate">{g.name}</span>
                  </button>
                ))}
                {groups.length === 0 && (
                  <div className="px-3 py-3 text-[0.65rem] text-[var(--text-muted)] text-center">No groups yet</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Manage Groups (gear) button */}
            <button
              className={btnS + " relative group/gear"}
              onClick={() => setShowManageGroups(true)}
              title="Manage Groups"
            >
              <I d={ico.gear} size={14} />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[0.6rem] bg-[var(--bg-card)] border border-[var(--border)] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover/gear:opacity-100 transition-opacity pointer-events-none z-10">Manage Groups</span>
            </button>

            {/* Refresh */}
            <button className={btnS} onClick={fetchDatasets} title="Refresh">
              <I d={ico.refresh} size={14} />
              <span className="text-xs">Refresh</span>
            </button>

            {/* Create Dropdown */}
            <div className="relative" ref={createDropRef}>
              <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
                onClick={() => setCreateDropOpen(p => !p)}>
                <I d={ico.plus} size={14} color="#fff" sw={2.5} /> Create
                <I d={ico.chevDown} size={12} className={`ml-0.5 transition-transform duration-150 ${createDropOpen ? "rotate-180" : ""}`} />
              </button>
              {createDropOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl z-50 overflow-hidden" style={{ animation: "fadeUp .15s ease both" }}>
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-[0.8rem] font-medium hover:bg-[var(--bg-hover)] border-none bg-transparent cursor-pointer text-[var(--text)] text-left"
                    onClick={() => { setCreateDropOpen(false); navigate("/datasets/new"); }}
                  >
                    <I d={ico.layers} size={13} color="var(--accent)" /> Visual Dataset
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-[0.8rem] font-medium hover:bg-[var(--bg-hover)] border-none bg-transparent cursor-pointer text-[var(--text)] text-left"
                    onClick={() => { setCreateDropOpen(false); navigate("/datasets/new?type=sql"); }}
                  >
                    <I d={ico.db} size={13} color="var(--amber)" /> SQL Dataset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <main className="flex-1 overflow-auto">
          {loading ? (
            <div className="px-6 py-4 space-y-3">
              <div className="flex items-center gap-4 mb-2">
                {[80, 70, 90, 80].map((w, i) => <Sk key={i} w={w} h={28} r={20} />)}
              </div>
              <ListSkeleton rows={8} />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<I d={ico.layers} size={24} color="#818cf8" />}
              title={search || statusFilter !== "all" || typeFilter !== "all" ? "No matching datasets" : "No datasets yet"}
              sub={search || statusFilter !== "all" || typeFilter !== "all" ? "Try adjusting your filters" : "Create your first dataset to get started"}
              action={
                !search && statusFilter === "all" && typeFilter === "all" ? (
                  <button className={btnP} style={{ background: "var(--nav-active-bg)" }}
                    onClick={() => navigate("/datasets/new")}>
                    <I d={ico.plus} size={14} color="#fff" sw={2.5} /> Create Dataset
                  </button>
                ) : null
              }
            />
          ) : (
            <div className="px-6 py-4">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "8%" }} />
                </colgroup>
                <thead>
                  <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]">
                    <th className="text-left px-3 py-2.5">Name</th>
                    <th className="text-left px-3 py-2.5">Description</th>
                    <th className="text-left px-3 py-2.5">Groups</th>
                    <th className="text-left px-3 py-2.5">Status</th>
                    <th className="text-left px-3 py-2.5">Updated</th>
                    <th className="text-left px-3 py-2.5">Sync</th>
                    <th className="text-center px-3 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((ds) => {
                    const sc = STATUS_COLORS[ds.status] || STATUS_COLORS.draft;
                    const tc = TYPE_COLORS[ds.definition_type] || TYPE_COLORS.join;
                    const syncSt = ds.last_sync_status || (ds.sync_enabled ? "pending" : null);
                    const syncc = syncSt ? (SYNC_COLORS[syncSt] || SYNC_COLORS.pending) : null;
                    const srcCount = ds.definition?.sources?.length || 0;
                    const colCount = ds.definition?.columns?.length || 0;

                    return (
                      <tr key={ds.id}
                        className="border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors cursor-pointer group"
                        onClick={() => navigate(`/datasets/${ds.id}`)}>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: tc.bg, border: `1px solid ${tc.border}` }}>
                              <I d={ico.layers} size={14} color={tc.color} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate group-hover:text-[var(--nav-active)] transition-colors">
                                {ds.name}
                              </p>
                              <p className="text-[0.6rem] text-[var(--text-muted)] truncate">
                                {srcCount} source{srcCount !== 1 ? "s" : ""} · {colCount} col{colCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-xs font-semibold text-[var(--text-sub)] truncate">
                            {ds.description || <span className="text-[var(--text-muted)] italic">—</span>}
                          </p>
                        </td>
                        {/* Groups column */}
                        <td className="px-3 py-3">
                          {(() => {
                            const dsGroup = groups.find((g) => g.id === ds.group_id);
                            return dsGroup ? (
                              <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full" style={{ background: dsGroup.color + "22", color: dsGroup.color, border: `1px solid ${dsGroup.color}44` }}>
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dsGroup.color }} />
                                {dsGroup.name}
                              </span>
                            ) : (
                              <span className="text-xs text-[var(--text-muted)]">—</span>
                            );
                          })()}
                        </td>
                        <td className="px-3 py-3">
                          <Badge label={ds.status || "—"} bg={sc.bg} color={sc.color} border={sc.border} />
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-[var(--text-sub)]" title={formatDate(ds.updated_at)}>
                            {relativeTime(ds.updated_at)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {syncc ? (
                            <Badge label={syncSt} bg={syncc.bg} color={syncc.color} border={syncc.border} />
                          ) : (
                            <span className="text-xs text-[var(--text-muted)]">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 relative" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSync(ds); }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[#fbbf24] hover:border-[#fbbf24] transition-colors"
                              title="Sync / Materialize Dataset"
                              disabled={syncing === ds.id}
                            >
                              {syncing === ds.id ? <Spin /> : <I d={ico.refresh} size={14} />}
                            </button>

                            <button
                              onClick={() => setOpenMenu(openMenu === ds.id ? null : ds.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--nav-active)] transition-colors text-center"
                            >
                              ⋮
                            </button>
                          </div>

                          {openMenu === ds.id && (
                            <div className="absolute right-6 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl z-50 overflow-hidden" style={{ animation: "fadeUp .15s ease both" }}>
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-[0.8rem] font-medium hover:bg-[var(--bg-hover)] border-none bg-transparent cursor-pointer text-[var(--text)] text-left"
                                onClick={() => navigate(`/datasets/${ds.id}`)}
                              >
                                <I d={ico.eye} size={13} color="var(--text-muted)" /> View Details
                              </button>

                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-[0.8rem] font-medium hover:bg-[var(--bg-hover)] border-none bg-transparent cursor-pointer text-[var(--text)] text-left"
                                onClick={() => { setAssigningGroups(ds); setOpenMenu(null); }}
                              >
                                <I d={ico.userPlus} size={13} color="var(--text-muted)" /> Assign Groups
                              </button>
                                
                              <div className="h-px bg-[var(--border)] w-full my-1"></div>

                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-[0.8rem] font-medium hover:bg-[var(--bg-hover)] border-none bg-transparent cursor-pointer text-[var(--text)] text-left"
                                onClick={() => { handleExport(ds); setOpenMenu(null); }}
                              >
                                <I d={ico.download} size={13} color="var(--text-muted)" /> Export
                              </button>

                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-[0.8rem] font-medium hover:bg-[var(--bg-hover)] border-none bg-transparent cursor-pointer text-[var(--text)] text-left"
                                onClick={() => { handleShare(ds); setOpenMenu(null); }}
                              >
                                <I d={ico.share} size={13} color="var(--text-muted)" /> Share
                              </button>
                              
                              <div className="h-px bg-[var(--border)] w-full my-1"></div>

                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-[0.8rem] font-medium hover:bg-[var(--bg-hover)] border-none bg-transparent cursor-pointer text-red-500 hover:text-red-400 text-left"
                                onClick={() => { setDeleting(ds); setOpenMenu(null); }}
                              >
                                <I d={ico.trash} size={13} /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-3 px-1 flex items-center justify-between gap-3">
                <div className="text-[0.65rem] text-[var(--text-muted)]">
                  Showing {filtered.length === 0 ? 0 : pageStart + 1}-{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={btnS}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                  >
                    Prev
                  </button>
                  <span className="text-[0.65rem] text-[var(--text-muted)] min-w-20 text-center">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    className={btnS}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer className="px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between text-[0.65rem] text-[var(--text-muted)]">
          <span>© 2026 PCSoft Analytics</span>
          <span>v1.0.0</span>
        </footer>
      </div>

      {/* ── Delete Confirm ── */}
      {deleting && (
        <ConfirmDialog
          title="Delete Dataset"
          message={`Are you sure you want to delete "${deleting.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          danger
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}

      {/* ── Manage Groups Modal ── */}
      {showManageGroups && (
        <ManageGroupsModal
          groups={groups}
          onClose={() => setShowManageGroups(false)}
          onGroupsChange={setGroups}
        />
      )}

      {/* ── Assign Groups Modal ── */}
      {assigningGroups && (
        <AssignGroupsModal
          dataset={assigningGroups}
          groups={groups}
          onClose={() => setAssigningGroups(null)}
          onAssign={() => {
            setAssigningGroups(null);
            fetchDatasets();
          }}
          api={api}
          push={push}
        />
      )}

      <Toast />
    </div>
  );
}
