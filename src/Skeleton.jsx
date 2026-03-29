/* ═══════════════════════════════════════════════════════════
   Skeleton — reusable shimmer loading components
   Import: import { Sk, PageSkeleton, TableSkeleton, CardGridSkeleton } from "./Skeleton.jsx";
   ═══════════════════════════════════════════════════════════ */

/** Raw shimmer block */
export function Sk({ w = "100%", h = 14, r = 6, className = "", style = {} }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }}
    />
  );
}

/** Full-page skeleton wrapping sidebar + content */
export function PageSkeleton({ sidebar }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* Sidebar placeholder */}
      <div className="w-[64px] shrink-0 bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col items-center py-4 gap-4">
        <Sk w={36} h={36} r={10} />
        {Array.from({ length: 6 }).map((_, i) => <Sk key={i} w={36} h={36} r={10} />)}
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
          <div className="flex items-center gap-3">
            <Sk w={32} h={32} r={8} />
            <Sk w={32} h={32} r={8} />
            <div className="flex flex-col gap-2">
              <Sk w={180} h={14} />
              <Sk w={100} h={10} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sk w={80} h={30} r={8} />
            <Sk w={80} h={30} r={8} />
            <Sk w={60} h={30} r={8} />
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-[var(--border)] bg-[var(--bg-card)]">
          {[60, 80, 100].map((w, i) => <Sk key={i} w={w} h={28} r={8} />)}
        </div>
        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
          <TableSkeleton rows={8} cols={5} />
        </div>
      </div>
    </div>
  );
}

/** Table skeleton — header + N rows of M cols */
export function TableSkeleton({ rows = 6, cols = 5 }) {
  const colWidths = [40, 160, 130, 90, 110, 90, 80, 70, 100, 120];
  return (
    <div className="w-full rounded-xl overflow-hidden border border-[var(--border)]">
      {/* header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-card)] border-b border-[var(--border)]">
        {Array.from({ length: cols }).map((_, i) => (
          <Sk key={i} w={colWidths[i % colWidths.length]} h={10} />
        ))}
      </div>
      {/* rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]"
          style={{ opacity: 1 - r * 0.08 }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Sk key={i} w={colWidths[i % colWidths.length] * (0.6 + Math.random() * 0.4)} h={12} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Grid of card skeletons */
export function CardGridSkeleton({ cards = 6, cols = 3 }) {
  return (
    <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Sk w={42} h={42} r={10} />
            <div className="flex flex-col gap-2 flex-1">
              <Sk w="75%" h={13} />
              <Sk w="50%" h={10} />
            </div>
          </div>
          <Sk w="100%" h={10} />
          <Sk w="85%" h={10} />
          <div className="flex gap-2 mt-1">
            <Sk w={56} h={22} r={20} />
            <Sk w={56} h={22} r={20} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Stat cards row skeleton */
export function StatRowSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <Sk w={42} h={42} r={10} />
          <div className="flex flex-col gap-2">
            <Sk w={50} h={18} />
            <Sk w={70} h={9} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** List skeleton — vertical rows */
export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
          style={{ opacity: 1 - i * 0.1 }}>
          <Sk w={40} h={40} r={10} />
          <div className="flex-1 flex flex-col gap-2">
            <Sk w="55%" h={13} />
            <Sk w="35%" h={10} />
          </div>
          <Sk w={68} h={22} r={20} />
          <Sk w={68} h={22} r={20} />
          <Sk w={28} h={28} r={8} />
        </div>
      ))}
    </div>
  );
}

/** Inline detail-page skeleton (no sidebar, used inside a tab content area) */
export function DetailSkeleton() {
  return (
    <div className="px-6 py-5 space-y-5">
      <StatRowSkeleton count={4} />
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map(i => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 flex flex-col gap-3">
            <Sk w="60%" h={10} />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <Sk w="40%" h={10} />
                <Sk w="30%" h={10} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
