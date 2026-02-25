import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext.jsx";

// ── Icons ──────────────────────────────────────────────────
function Icon({ name, size = 18, color = "currentColor" }) {
  const sAttr = { width: size, height: size };
  const icons = {
    home: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    db: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    layers: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    report: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    question: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    dash: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    ai: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2v1a1 1 0 0 1-2 0v-1H7v1a1 1 0 0 1-2 0v-1a2 2 0 0 1-2-2v-1H2a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z" />
        <circle cx="9" cy="14" r="1" fill={color} stroke="none" />
        <circle cx="15" cy="14" r="1" fill={color} stroke="none" />
      </svg>
    ),
    sub: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
    search: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    logout: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    moon: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    sun: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    trend: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    settings: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    profile: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    bell: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    users: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    history: (
      <svg {...sAttr} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="shrink-0">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  };
  return icons[name] || null;
}

// ── Sidebar ────────────────────────────────────────────────
export default function Sidebar({
  navItems,
  onNavClick,
  activeNav,
  logo,
  minimized: initialMinimized = false,
}) {
  const [minimized, setMinimized] = useState(initialMinimized);
  const { isDark, toggleDark } = useTheme();
  const navigate = useNavigate();

  const handleNavClickInternal = (label) => {
    if (label === "Home") navigate("/");
    else if (label === "Dashboards") navigate("/dashboards");
    else if (label === "Settings") navigate("/settings");
    else if (onNavClick) onNavClick(label);
  };

  return (
    <div
      className="h-screen sticky top-0 flex flex-col shrink-0 overflow-visible z-10 transition-all duration-300 border-r border-r-[var(--border)] [box-shadow:var(--sidebar-shadow)] [background:var(--bg-sidebar)]"
      style={{ width: minimized ? 68 : 240, minWidth: minimized ? 68 : 240 }}
    >
      {/* ── Collapse button ──────────────────────────── */}
      <div
        className="sb-collapse-btn absolute -right-4 top-[60px] w-8 h-8 rounded-full flex items-center justify-center cursor-pointer z-20 shrink-0 bg-[var(--collapse-btn)] [box-shadow:var(--logo-glow)] transition-[box-shadow,background] duration-200"
        onClick={() => setMinimized(!minimized)}
        title={minimized ? "Expand" : "Collapse"}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8">
          {minimized ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
        </svg>
      </div>

      {/* ── Logo / Brand ─────────────────────────────── */}
      <div
        className={`flex items-center ${minimized ? "justify-center gap-0 py-4 px-0" : "justify-start gap-2 pt-5 pb-4 px-4"} shrink-0 border-b border-b-[var(--border)]`}
      >
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 [background:var(--logo-grad)] [box-shadow:var(--logo-glow)]">
          {logo}
        </div>
        {!minimized && (
          <div className="overflow-hidden">
            <div className="text-[0.9rem] font-extrabold tracking-[-0.01em] whitespace-nowrap text-[var(--text)]">
              PCSoft
            </div>
            <div className="text-[0.6rem] tracking-[0.07em] whitespace-nowrap text-[var(--text-muted)]">
              ANALYTICS
            </div>
          </div>
        )}
      </div>

      {/* ── Nav section label ─────────────────────────── */}
      {!minimized && (
        <div className="px-4 pt-3 pb-1 text-[0.58rem] font-bold tracking-[0.1em] uppercase shrink-0 text-[var(--text-muted)]">
          Navigation
        </div>
      )}

      {/* ── Nav items ────────────────────────────────── */}
      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden ${minimized ? "px-3 pt-3" : "px-3 pt-1"} pb-1 flex flex-col gap-px`}
      >
        {navItems.map((item) => {
          const active = activeNav === item.label;
          return (
            <div
              key={item.label}
              className={`sb-nav-item${active ? " sb-nav-active" : ""} flex items-center ${minimized ? "justify-center gap-0 p-2" : "justify-start gap-2 py-2 px-3"} rounded-lg cursor-pointer mb-px relative`}
              onClick={() => handleNavClickInternal(item.label)}
              title={minimized ? item.label : ""}
              style={{
                background: active ? "var(--nav-active-bg)" : "transparent",
                color: active ? "#fff" : "var(--nav-inactive)",
                boxShadow: active ? "var(--nav-active-shadow)" : "none",
              }}
            >
              <Icon
                name={typeof item.icon === "string" ? item.icon : "home"}
                size={17}
                color={active ? "#fff" : "var(--nav-inactive)"}
              />
              {!minimized && (
                <>
                  <span
                    className={`text-[0.82rem] ${active ? "font-semibold" : "font-normal"} flex-1 whitespace-nowrap overflow-hidden text-ellipsis`}
                  >
                    {item.label}
                  </span>
                  {item.aiBadge && (
                    <span
                      className="text-[0.58rem] font-bold text-white py-0.5 px-2 rounded-full tracking-[0.04em] shrink-0"
                      style={{ background: active ? "rgba(255,255,255,0.25)" : "linear-gradient(135deg,#a855f7,#ec4899)" }}
                    >
                      AI
                    </span>
                  )}
                  {item.badge && !item.aiBadge && (
                    <span
                      className="text-[0.6rem] font-bold py-0.5 px-2 rounded-full border shrink-0"
                      style={{
                        background: active ? "rgba(255,255,255,0.22)" : "var(--badge-bg)",
                        color: active ? "#fff" : "var(--text-muted)",
                        borderColor: active ? "transparent" : "var(--border)",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Bottom section ───────────────────────────── */}
      <div
        className={`${minimized ? "py-2 px-0" : "py-2 px-3"} flex flex-col gap-px shrink-0 border-t border-t-[var(--border)]`}
      >
        {/* Subscriptions */}
        {(() => {
          const active = activeNav === "Subscriptions"; return (
            <div
              className={`sb-nav-item${active ? " sb-nav-active" : ""} flex items-center ${minimized ? "justify-center gap-0 p-2" : "justify-start gap-2 py-2 px-3"} rounded-lg cursor-pointer`}
              onClick={() => handleNavClickInternal("Subscriptions")}
              title={minimized ? "Subscriptions" : ""}
              style={{
                background: active ? "var(--nav-active-bg)" : "transparent",
                color: active ? "#fff" : "var(--nav-inactive)",
                boxShadow: active ? "var(--nav-active-shadow)" : "none",
              }}
            >
              <Icon name="sub" size={17} color={active ? "#fff" : "var(--icon-color)"} />
              {!minimized && (
                <span className={`text-[0.82rem] ${active ? "font-semibold" : "font-normal"}`} style={{ color: active ? "#fff" : "var(--text-sub)" }}>
                  Subscriptions
                </span>
              )}
            </div>
          );
        })()}

        {/* Settings */}
        {(() => {
          const active = activeNav === "Settings"; return (
            <div
              className={`sb-nav-item${active ? " sb-nav-active" : ""} flex items-center ${minimized ? "justify-center gap-0 p-2" : "justify-start gap-2 py-2 px-3"} rounded-lg cursor-pointer`}
              onClick={() => handleNavClickInternal("Settings")}
              title={minimized ? "Settings" : ""}
              style={{
                background: active ? "var(--nav-active-bg)" : "transparent",
                color: active ? "#fff" : "var(--nav-inactive)",
                boxShadow: active ? "var(--nav-active-shadow)" : "none",
              }}
            >
              <Icon name="settings" size={17} color={active ? "#fff" : "var(--icon-color)"} />
              {!minimized && (
                <span className={`text-[0.82rem] ${active ? "font-semibold" : "font-normal"}`} style={{ color: active ? "#fff" : "var(--text-sub)" }}>
                  Settings
                </span>
              )}
            </div>
          );
        })()}

        {/* Profile */}
        {(() => {
          const active = activeNav === "Profile"; return (
            <div
              className={`sb-nav-item${active ? " sb-nav-active" : ""} flex items-center ${minimized ? "justify-center gap-0 p-2" : "justify-start gap-2 py-2 px-3"} rounded-lg cursor-pointer`}
              onClick={() => handleNavClickInternal("Profile")}
              title={minimized ? "Profile" : ""}
              style={{
                background: active ? "var(--nav-active-bg)" : "transparent",
                color: active ? "#fff" : "var(--nav-inactive)",
                boxShadow: active ? "var(--nav-active-shadow)" : "none",
              }}
            >
              <Icon name="profile" size={17} color={active ? "#fff" : "var(--icon-color)"} />
              {!minimized && (
                <span className={`text-[0.82rem] ${active ? "font-semibold" : "font-normal"}`} style={{ color: active ? "#fff" : "var(--text-sub)" }}>
                  Profile
                </span>
              )}
            </div>
          );
        })()}

        {/* Logout */}
        <div
          className={`sb-logout flex items-center ${minimized ? "justify-center gap-0 p-2" : "justify-start gap-2 py-2 px-3"} rounded-lg cursor-pointer mt-1 bg-[var(--logout-bg)] border border-[var(--logout-border)] text-[var(--logout-color)]`}
          title={minimized ? "Logout" : ""}
        >
          <Icon name="logout" size={17} color="var(--logout-color)" />
          {!minimized && (
            <span className="text-[0.82rem] font-medium">
              Logout
            </span>
          )}
        </div>

        {/* Dark / Light toggle */}
        {toggleDark && (
          <div
            className={`flex items-center ${minimized ? "justify-center gap-0 p-2" : "justify-start gap-2 py-2 px-3"} rounded-lg cursor-pointer mt-1`}
            onClick={toggleDark}
            title={minimized ? (isDark ? "Switch to Light" : "Switch to Dark") : ""}
          >
            <Icon name={isDark ? "moon" : "sun"} size={17} color="var(--icon-color)" />
            {!minimized && (
              <>
                <span className="text-[0.82rem] font-normal flex-1 text-[var(--text-sub)]">
                  {isDark ? "Dark Mode" : "Light Mode"}
                </span>
                {/* Toggle pill */}
                <div className="sb-toggle-track rounded-full relative shrink-0 bg-[var(--nav-active)] w-[34px] h-[18px]">
                  <div
                    className="sb-toggle-thumb w-3 h-3 rounded-full bg-white absolute top-[3px] shadow-sm"
                    style={{ transform: isDark ? "translateX(18px)" : "translateX(3px)" }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
