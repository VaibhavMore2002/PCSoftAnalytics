import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

/* ═══════════════════════════════════════════════════════════
   Icons & shared helpers
   ═══════════════════════════════════════════════════════════ */
function I({ d, size = 16, color = "currentColor", sw = 2, className = "" }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
const ico = {
  search: "M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:
    "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",
  copy: "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  chevDown: "M6 9l6 6 6-6",
  refresh:
    "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  view: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  users:
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3",
  q: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
};

const Spin = () => (
  <svg
    className="animate-spin"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP =
  "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS =
  "px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] flex items-center gap-1.5 transition-all duration-150";

const STATUS_COLORS = {
  draft: {
    bg: "rgba(250,204,21,.15)",
    color: "#facc15",
    border: "rgba(250,204,21,.3)",
  },
  published: {
    bg: "rgba(74,222,128,.15)",
    color: "#4ade80",
    border: "rgba(74,222,128,.3)",
  },
  archived: {
    bg: "rgba(148,163,184,.12)",
    color: "#94a3b8",
    border: "rgba(148,163,184,.25)",
  },
};

const CHART_PALETTE = [
  "#818cf8",
  "#34d399",
  "#f472b6",
  "#fb923c",
  "#a78bfa",
  "#38bdf8",
  "#4ade80",
  "#fbbf24",
  "#f87171",
  "#22d3ee",
];
function colorForType(t) {
  if (!t) return CHART_PALETTE[0];
  let h = 0;
  for (const c of t) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
  return CHART_PALETTE[Math.abs(h) % CHART_PALETTE.length];
}

function Badge({ label, bg, color, border, className = "" }) {
  return (
    <span
      className={`text-[0.62rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap capitalize inline-block ${className}`}
      style={{
        background: bg,
        color,
        border: border ? `1px solid ${border}` : undefined,
      }}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = (status || "draft").toLowerCase();
  const c = STATUS_COLORS[s] || STATUS_COLORS.draft;
  return <Badge label={status || "Draft"} {...c} />;
}

function ChartBadge({ type }) {
  if (!type) return <span className="text-xs text-[var(--text-muted)]">—</span>;
  const col = colorForType(type);
  return <Badge label={type} bg={`${col}18`} color={col} border={`${col}30`} />;
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
          <div
            key={t.id}
            className="px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border"
            style={{
              background:
                t.type === "error"
                  ? "rgba(239,68,68,.12)"
                  : "rgba(16,185,129,.12)",
              borderColor:
                t.type === "error"
                  ? "rgba(239,68,68,.25)"
                  : "rgba(16,185,129,.25)",
              color: t.type === "error" ? "#f87171" : "#34d399",
              animation: "fadeUp .25s ease both",
            }}
          >
            <I
              d={t.type === "error" ? ico.x : ico.check}
              size={13}
              color={t.type === "error" ? "#f87171" : "#34d399"}
              sw={2.5}
            />
            {t.msg}
          </div>
        ))}
      </div>
    ) : null;
  return { push, Toast };
}

/* ── Confirm Dialog ── */
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
  loading,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-sm mx-4"
        style={{ animation: "fadeUp .2s ease both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-2 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(239,68,68,.1)",
              border: "1px solid rgba(239,68,68,.2)",
            }}
          >
            <I d={ico.trash} size={18} color="#f87171" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">{title}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
          <button className={btnS} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={btnP}
            style={{
              background: danger ? "#ef4444" : "var(--nav-active-bg)",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading && <Spin />}
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Manage Groups Modal
   ═══════════════════════════════════════════════════════════ */
function GroupsModal({ api, onClose, push }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/api/v1/questions-v2/categories");
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];
      setGroups(list);
    } catch {
      push("Failed to load groups", "error");
    } finally {
      setLoading(false);
    }
  }, [api, push]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await api("/api/v1/questions-v2/categories", {
        method: "POST",
        body: JSON.stringify({ name: newName.trim() }),
      });
      push(`Group "${newName.trim()}" created`);
      setNewName("");
      setAdding(false);
      load();
    } catch {
      push("Failed to create group", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (g) => {
    setDeleting(g.id);
    try {
      await api(`/api/v1/questions-v2/categories/${g.id}`, {
        method: "DELETE",
      });
      push(`"${g.name}" deleted`);
      setGroups((prev) => prev.filter((x) => x.id !== g.id));
    } catch {
      push("Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl w-full max-w-md mx-4"
        style={{ animation: "fadeUp .2s ease both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-[var(--text)]">
            Manage Question Groups
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--bg-input)] border border-[var(--border)] cursor-pointer"
          >
            <I d={ico.x} size={14} />
          </button>
        </div>

        {/* Subheader */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)]">
          <span className="text-xs text-[var(--text-muted)]">
            Groups ({groups.length})
          </span>
          <button
            className={btnP}
            style={{ background: "var(--nav-active-bg)" }}
            onClick={() => setAdding(true)}
          >
            <I d={ico.plus} size={13} color="#fff" /> Add Group
          </button>
        </div>

        {/* Add new group row */}
        {adding && (
          <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-input)]">
            <input
              autoFocus
              className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)]"
              placeholder="Group name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") setAdding(false);
              }}
            />
            <button
              className={btnP}
              style={{
                background: "var(--nav-active-bg)",
                opacity: saving ? 0.7 : 1,
              }}
              disabled={saving}
              onClick={handleAdd}
            >
              {saving ? (
                <Spin />
              ) : (
                <I d={ico.check} size={13} color="#fff" sw={2.5} />
              )}{" "}
              Save
            </button>
            <button
              className={btnS}
              onClick={() => {
                setAdding(false);
                setNewName("");
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Group list */}
        <div className="overflow-y-auto max-h-72">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-[var(--text-muted)] text-xs">
              <Spin /> Loading…
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm font-semibold text-[var(--text-sub)] mb-1">
                No groups created yet
              </p>
              <button
                className="text-xs text-[var(--nav-active)] cursor-pointer hover:underline"
                onClick={() => setAdding(true)}
              >
                Create your first group
              </button>
            </div>
          ) : (
            groups.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {g.name}
                  </p>
                  {g.description && (
                    <p className="text-[0.6rem] text-[var(--text-muted)]">
                      {g.description}
                    </p>
                  )}
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-red-400 bg-[var(--bg-input)] border border-[var(--border)] cursor-pointer transition-opacity"
                  disabled={deleting === g.id}
                  onClick={() => handleDelete(g)}
                  title="Delete group"
                >
                  {deleting === g.id ? (
                    <Spin />
                  ) : (
                    <I d={ico.trash} size={13} color="#f87171" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-[var(--border)]">
          <button
            className={btnP}
            style={{ background: "var(--nav-active-bg)" }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Questions List — Main Component
   ═══════════════════════════════════════════════════════════ */
const STATUS_TABS = ["All", "Draft", "Published", "Archived"];

export default function Questions() {
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const navigate = useNavigate();
  const { push, Toast } = useToast();
  const PAGE_SIZE = 20;

  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper handling literal "null" strings case-insensitively
  const f = (val, fallback) =>
    !val ||
    String(val).trim().toLowerCase() === "null" ||
    String(val).trim().toLowerCase() === "undefined"
      ? fallback
      : val;
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [groupFilter, setGroupFilter] = useState("all");
  const [groupDropOpen, setGroupDropOpen] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const groupDropRef = useRef(null);

  /* ── Fetch data ── */
  const fetchAll = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    try {
      const [qRes, catRes] = await Promise.allSettled([
        api("/api/v1/questions-v2/?skip=0&limit=100"),
        api("/api/v1/questions-v2/categories"),
      ]);
      if (qRes.status === "fulfilled") {
        const list = Array.isArray(qRes.value?.data)
          ? qRes.value.data
          : Array.isArray(qRes.value)
            ? qRes.value
            : [];
        setQuestions(list);
      } else {
        setQuestions([]);
        push("Failed to load questions", "error");
      }
      if (catRes.status === "fulfilled") {
        const list = Array.isArray(catRes.value?.data)
          ? catRes.value.data
          : Array.isArray(catRes.value)
            ? catRes.value
            : [];
        setCategories(list);
      }
    } finally {
      setLoading(false);
    }
  }, [api, push]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ── Close group dropdown on outside click ── */
  useEffect(() => {
    const h = (e) => {
      if (groupDropRef.current && !groupDropRef.current.contains(e.target))
        setGroupDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── Close action menus on outside click ── */
  useEffect(() => {
    const h = () => setOpenMenu(null);
    window.addEventListener("click", h);
    return () => window.removeEventListener("click", h);
  }, []);

  /* ── Filter logic ── */
  const filtered = questions.filter((q) => {
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      q.name?.toLowerCase().includes(term) ||
      q.description?.toLowerCase().includes(term);
    const status = (q.status || "draft").toLowerCase();
    const matchTab = statusTab === "All" || status === statusTab.toLowerCase();
    const matchGroup =
      groupFilter === "all" ||
      String(q.category_id) === String(groupFilter) ||
      String(q.category?.id) === String(groupFilter);
    return matchSearch && matchTab && matchGroup;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusTab, groupFilter]);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  /* ── Actions ── */
  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api(`/api/v1/questions-v2/${deleting.id}`, { method: "DELETE" });
      push(`"${deleting.name}" deleted`);
      setQuestions((prev) => prev.filter((q) => q.id !== deleting.id));
    } catch {
      push("Delete failed", "error");
    }
    setDeleteLoading(false);
    setDeleting(null);
  };

  const handleDuplicate = async (q) => {
    try {
      await api(`/api/v1/questions-v2/${q.id}/duplicate`, { method: "POST" });
      push(`"${q.name}" duplicated`);
      fetchAll();
    } catch {
      push("Duplicate failed", "error");
    }
  };

  const handleMaterialize = async (q) => {
    try {
      await api(`/api/v1/questions-v2/${q.id}/materialize`, { method: "POST" });
      push(`Materialization started for "${q.name}"`);
    } catch {
      push("Materialize failed", "error");
    }
  };

  /* ── Stats ── */
  const counts = {
    all: questions.length,
    draft: questions.filter(
      (q) => (q.status || "draft").toLowerCase() === "draft",
    ).length,
    published: questions.filter(
      (q) => (q.status || "").toLowerCase() === "published",
    ).length,
    archived: questions.filter(
      (q) => (q.status || "").toLowerCase() === "archived",
    ).length,
  };

  const selectedGroup = categories.find(
    (c) => String(c.id) === String(groupFilter),
  );

  const logo = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  );

  /* ═══════════════════════════════════════ render ═ */
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar
        navItems={navItems}
        onNavClick={handleNavClick}
        activeNav={activeNav}
        logo={logo}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Top bar ── */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-[var(--border)] bg-[var(--bg-card)]">
          {/* Title + search */}
          <span className="text-sm font-bold shrink-0">Questions</span>
          <div className="relative w-52">
            <I
              d={ico.search}
              size={13}
              color="var(--text-muted)"
              className="absolute left-2.5 top-1/2 -translate-y-1/2"
            />
            <input
              id="questions-search"
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150"
              placeholder="Search questions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-0.5 ml-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className="px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors duration-150 border-none"
                style={{
                  background:
                    statusTab === tab ? "var(--nav-active-bg)" : "transparent",
                  color: statusTab === tab ? "#fff" : "var(--text-muted)",
                }}
              >
                {tab}
                {tab !== "All" && (
                  <span className="ml-1 text-[0.58rem] opacity-70">
                    ({counts[tab.toLowerCase()] || 0})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Filter by groups dropdown */}
          <div ref={groupDropRef} className="relative">
            <button
              onClick={() => setGroupDropOpen((p) => !p)}
              className={`${btnS} text-xs`}
              style={{
                borderColor:
                  groupFilter !== "all" ? "var(--nav-active)" : undefined,
                color: groupFilter !== "all" ? "var(--nav-active)" : undefined,
              }}
            >
              <I d={ico.filter} size={13} />
              {selectedGroup
                ? `Group: ${selectedGroup.name}`
                : "Filter by groups…"}
              <I
                d={ico.chevDown}
                size={11}
                className={`transition-transform ${groupDropOpen ? "rotate-180" : ""}`}
              />
            </button>
            {groupDropOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl z-50 overflow-hidden"
                style={{ animation: "fadeUp .15s ease both" }}
              >
                <button
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-input)] transition-colors border-none cursor-pointer"
                  style={{
                    color:
                      groupFilter === "all"
                        ? "var(--nav-active)"
                        : "var(--text)",
                  }}
                  onClick={() => {
                    setGroupFilter("all");
                    setGroupDropOpen(false);
                  }}
                >
                  All Groups
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-input)] transition-colors border-none cursor-pointer"
                    style={{
                      color:
                        String(groupFilter) === String(c.id)
                          ? "var(--nav-active)"
                          : "var(--text)",
                    }}
                    onClick={() => {
                      setGroupFilter(String(c.id));
                      setGroupDropOpen(false);
                    }}
                  >
                    {c.name}
                  </button>
                ))}
                {categories.length === 0 && (
                  <p className="px-3 py-4 text-xs text-[var(--text-muted)] text-center">
                    No groups yet
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Settings / Groups manager */}
          <button
            className={btnS}
            title="Manage Groups"
            onClick={() => setShowGroups(true)}
          >
            <I d={ico.settings} size={14} />
          </button>

          {/* Refresh */}
          <button className={btnS} onClick={fetchAll} title="Refresh">
            <I d={ico.refresh} size={14} />
            Refresh
          </button>

          {/* Create */}
          <button
            className={btnP}
            style={{ background: "var(--nav-active-bg)" }}
            onClick={() => navigate("/questions/new")}
          >
            <I d={ico.plus} size={14} color="#fff" sw={2.5} /> Create
          </button>
        </div>

        {/* ── Table content ── */}
        <main className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20">
              <Spin />
              <span className="text-sm text-[var(--text-muted)]">
                Loading questions…
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(99,102,241,.06)",
                  border: "1px solid rgba(99,102,241,.12)",
                }}
              >
                <I d={ico.q} size={24} color="#818cf8" />
              </div>
              <p className="text-sm font-semibold text-[var(--text-sub)] mb-1">
                {search || statusTab !== "All" || groupFilter !== "all"
                  ? "No matching questions"
                  : "No questions yet"}
              </p>
              <p className="text-xs text-[var(--text-muted)] mb-4">
                {search || statusTab !== "All" || groupFilter !== "all"
                  ? "Try adjusting your filters or search term"
                  : "Create your first question to visualize data"}
              </p>
              {!search && statusTab === "All" && groupFilter === "all" && (
                <button
                  className={btnP}
                  style={{ background: "var(--nav-active-bg)" }}
                  onClick={() => navigate("/questions/new")}
                >
                  <I d={ico.plus} size={14} color="#fff" sw={2.5} /> Create
                  Question
                </button>
              )}
            </div>
          ) : (
            <div className="px-5 py-0">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "11%" }} />
                </colgroup>
                <thead className="sticky top-0 bg-[var(--bg-card)] z-10">
                  <tr className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)]">
                    <th className="text-left px-3 py-2.5">Name</th>
                    <th className="text-left px-3 py-2.5">Description</th>
                    <th className="text-left px-3 py-2.5">Groups</th>
                    <th className="text-left px-3 py-2.5">Chart Type</th>
                    <th className="text-left px-3 py-2.5">Status</th>
                    <th className="text-left px-3 py-2.5">Updated</th>
                    <th className="text-center px-3 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((q) => {
                    const groupName = f(
                      categories.find(
                        (c) => String(c.id) === String(q.category_id),
                      )?.name,
                      null,
                    );
                    return (
                      <tr
                        key={q.id}
                        className="border-b border-[var(--border)] hover:bg-[var(--bg-input)] transition-colors cursor-pointer group"
                        onClick={() => navigate(`/questions/${q.id}`)}
                      >
                        <td className="px-3 py-2.5">
                          <p className="text-xs font-semibold truncate group-hover:text-[var(--nav-active)] transition-colors">
                            {f(q.name, "Untitled")}
                          </p>
                        </td>
                        <td className="px-3 py-2.5">
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {f(q.description, "—")}
                          </p>
                        </td>
                        <td className="px-3 py-2.5">
                          {groupName ? (
                            <Badge
                              label={groupName}
                              bg="rgba(148,163,184,.12)"
                              color="#94a3b8"
                            />
                          ) : (
                            <Badge
                              label="—"
                              bg="rgba(148,163,184,.12)"
                              color="#94a3b8"
                            />
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <ChartBadge
                            type={f(
                              q.chart_type ||
                                q.definition?.visualization?.chart_type ||
                                q.visualization?.chart_type,
                              null,
                            )}
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusBadge status={f(q.status, "draft")} />
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-xs text-[var(--text-muted)]">
                            {q.updated_at
                              ? new Date(q.updated_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "Never"}
                          </span>
                        </td>
                        <td
                          className="px-3 py-2.5 relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-center">
                            <button
                              id={`q-menu-${q.id}`}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--nav-active)] bg-[var(--bg-input)] border border-[var(--border)] cursor-pointer text-center font-bold"
                              onClick={() =>
                                setOpenMenu(openMenu === q.id ? null : q.id)
                              }
                            >
                              ⋮
                            </button>
                          </div>
                          {openMenu === q.id && (
                            <div
                              className="absolute right-6 mt-1 w-44 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg z-50 overflow-hidden"
                              style={{ animation: "fadeUp .15s ease both" }}
                            >
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-[var(--bg-input)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                                onClick={() => navigate(`/questions/${q.id}`)}
                              >
                                <I d={ico.view} size={13} /> View
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-[var(--bg-input)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                                onClick={() =>
                                  navigate(`/questions/${q.id}/edit`)
                                }
                              >
                                <I d={ico.edit} size={13} /> Edit
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-[var(--bg-input)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                                onClick={() => handleDuplicate(q)}
                              >
                                <I d={ico.copy} size={13} /> Duplicate
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-[var(--bg-input)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                                onClick={() => handleMaterialize(q)}
                              >
                                <svg
                                  className="shrink-0"
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                                Materialize
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-[var(--bg-input)] text-[var(--text)] bg-transparent border-none cursor-pointer"
                                onClick={() =>
                                  push("Assign Groups — coming soon")
                                }
                              >
                                <I d={ico.users} size={13} /> Assign Groups
                              </button>
                              <div className="border-t border-[var(--border)] mx-2 my-1" />
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-[var(--bg-input)] bg-transparent border-none cursor-pointer"
                                onClick={() => setDeleting(q)}
                              >
                                <I d={ico.trash} size={13} color="#f87171" />{" "}
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-3 px-1 flex items-center justify-between gap-3 pb-4">
                <span className="text-[0.65rem] text-[var(--text-muted)]">
                  Showing {filtered.length === 0 ? 0 : pageStart + 1}–
                  {Math.min(pageStart + PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length} question{filtered.length !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className={btnS}
                    disabled={currentPage === 1}
                    style={{
                      opacity: currentPage === 1 ? 0.45 : 1,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  <span className="text-[0.65rem] text-[var(--text-muted)] min-w-[72px] text-center">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    className={btnS}
                    disabled={currentPage === totalPages}
                    style={{
                      opacity: currentPage === totalPages ? 0.45 : 1,
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer className="px-6 py-2.5 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between text-[0.65rem] text-[var(--text-muted)]">
          <span>© 2026 PCSoft Analytics</span>
          <span>v1.0.0</span>
        </footer>
      </div>

      {/* ── Modals ── */}
      {showGroups && (
        <GroupsModal
          api={api}
          push={push}
          onClose={() => {
            setShowGroups(false);
            fetchAll();
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete Question"
          message={`Are you sure you want to delete "${deleting.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
      <Toast />
    </div>
  );
}
