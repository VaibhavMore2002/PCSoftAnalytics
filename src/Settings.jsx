import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useTheme } from "./ThemeContext.jsx";

const navItems = [
    { label: "Home", icon: "home" },
    { label: "Data Sources", icon: "db" },
    { label: "Data Sets", icon: "layers" },
    { label: "Reports", icon: "report" },
    { label: "Dashboards", icon: "dash" },
    { label: "Analytics Expert", icon: "ai", aiBadge: true },
    { label: "Questions", icon: "question" },
];

function Icon({ name, size = 18, color = "currentColor" }) {
    const s = { width: size, height: size };
    const icons = {
        home: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        settings: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
        check: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>,
    };
    return icons[name] || null;
}

const palettes = [
    { id: 'default', name: 'Default Purple', primary: '#7c3aed', bg: '#f8f7fc', darkBg: '#12111a' },
    { id: 'oceanic', name: 'Oceanic Blue', primary: '#0284c7', bg: '#f0f9ff', darkBg: '#0f172a' },
    { id: 'sun-steel', name: 'Sun & Steel', primary: '#ffbf00', bg: '#fffbeb', darkBg: '#111111' },
];

export default function Settings() {
    const { isDark, toggleDark, palette, changePalette } = useTheme();
    const navigate = useNavigate();

    const handleNavClick = (label) => {
        if (label === "Home") navigate("/");
        if (label === "Dashboards") navigate("/dashboards");
        if (label === "Settings") navigate("/settings");
    };

    const logo = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );

    return (
        <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-[var(--bg)] text-[var(--text)] font-sans">
            <Sidebar
                navItems={navItems}
                onNavClick={handleNavClick}
                activeNav="Settings"
                logo={logo}
                isDark={isDark}
                onToggleDark={toggleDark}
            />

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Top bar */}
                <div className="flex items-center justify-between px-7 pt-7 pb-3 shrink-0 transition-colors duration-300 gap-6 border-b border-b-[var(--border)] bg-[var(--topbar-bg)]">
                    <div className="flex items-center gap-2">
                        <Icon name="settings" size={20} color="var(--nav-active)" />
                        <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">Settings</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div
                            className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[0.68rem] font-bold text-white cursor-pointer tracking-[0.02em] [box-shadow:0_2px_8px_rgba(124,58,237,0.30)]"
                            style={{ background: "var(--nav-active-bg)" }}
                        >
                            JD
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-7">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Theme Section */}
                        <section className="fade-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-[0.62rem] font-bold tracking-[0.11em] uppercase text-[var(--text-muted)] mb-4">
                                Appearance
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Light/Dark Toggle Card */}
                                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--text)]">Mode</h3>
                                        <p className="text-sm text-[var(--text-sub)]">Switch between light and dark themes</p>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border)]">
                                        <span className="font-medium">{isDark ? "Dark Mode" : "Light Mode"}</span>
                                        <button
                                            onClick={toggleDark}
                                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--nav-active)] transition-colors focus:outline-none"
                                        >
                                            <span
                                                className={`${isDark ? 'translate-x-6' : 'translate-x-1'
                                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex flex-col justify-center">
                                    <p className="text-sm text-[var(--text-sub)] italic">
                                        "Themes are applied globally across all pages of the PCSoft Analytics platform."
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Palette Section */}
                        <section className="fade-up" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-[0.62rem] font-bold tracking-[0.11em] uppercase text-[var(--text-muted)] mb-4">
                                Color Palettes
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {palettes.map((p) => {
                                    const isActive = palette === p.id;
                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => changePalette(p.id)}
                                            className={`group cursor-pointer p-5 rounded-2xl bg-[var(--bg-card)] border ${isActive ? 'border-[var(--nav-active)] ring-2 ring-[var(--nav-active)] ring-opacity-20' : 'border-[var(--border)]'
                                                } hover:shadow-md transition-all duration-200 relative overflow-hidden`}
                                        >
                                            {isActive && (
                                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--nav-active)] flex items-center justify-center">
                                                    <Icon name="check" size={12} color="#fff" />
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-4">
                                                {/* Preview UI */}
                                                <div className="h-24 rounded-lg overflow-hidden flex flex-col border border-[var(--border)]" style={{ background: isDark ? p.darkBg : p.bg }}>
                                                    <div className="h-6 w-full border-b border-[var(--border)] px-2 flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.primary }}></div>
                                                        <div className="w-2.5 h-1 rounded-full bg-[var(--text-muted)] opacity-20"></div>
                                                    </div>
                                                    <div className="flex-1 p-2 flex gap-2">
                                                        <div className="w-1/3 h-full rounded bg-[var(--bg-active)] opacity-50" style={{ background: isActive ? 'var(--nav-active-bg)' : p.primary, opacity: 0.1 }}></div>
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            <div className="h-2 w-3/4 rounded bg-[var(--text-muted)] opacity-10"></div>
                                                            <div className="h-2 w-1/2 rounded bg-[var(--text-muted)] opacity-10"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-[var(--text)]">{p.name}</h4>
                                                    <p className="text-xs text-[var(--text-sub)]">
                                                        {p.id === 'default' ? 'Standard workspace colors' :
                                                            p.id === 'oceanic' ? 'Deep blues and clear skies' :
                                                                'Golden sun meets dark steel'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
