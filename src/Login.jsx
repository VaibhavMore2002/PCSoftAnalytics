import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useTheme } from './ThemeContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[var(--bg)] transition-colors duration-300"
      style={{ fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}
    >
      {/* Card */}
      <div
        className="w-full max-w-[380px] mx-4 rounded-2xl p-8 bg-[var(--bg-card)] border border-[var(--border)]"
        style={{ boxShadow: 'var(--shadow)' }}
      >
        {/* Logo + Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--nav-active-bg)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-[1.1rem] font-bold tracking-tight text-[var(--text)]">
              PCSoft Analytics
            </h1>
            <p className="text-[0.72rem] text-[var(--text-muted)] mt-0.5">
              Sign in to your account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username / Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.71rem] font-semibold text-[var(--text-muted)] uppercase tracking-[0.06em]">
              Email or Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@example.com"
              required
              className="rounded-[9px] px-3.5 py-[9px] text-[0.82rem] outline-none w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text)] caret-[var(--nav-active)] transition-all duration-150"
              style={{ boxShadow: 'none' }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.30)')
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.71rem] font-semibold text-[var(--text-muted)] uppercase tracking-[0.06em]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-[9px] px-3.5 py-[9px] pr-10 text-[0.82rem] outline-none w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text)] caret-[var(--nav-active)] transition-all duration-150"
                style={{ boxShadow: 'none' }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.30)')
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                {showPw ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-[0.74rem] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="mt-1 w-full rounded-[9px] py-[10px] text-[0.82rem] font-semibold text-white border-none cursor-pointer transition-all duration-200"
            style={{
              background: loading || !username.trim() || !password
                ? 'rgba(124,58,237,0.4)'
                : 'var(--nav-active-bg)',
              boxShadow: loading || !username.trim() || !password
                ? 'none'
                : '0 2px 12px rgba(124,58,237,0.35)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  className="animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
