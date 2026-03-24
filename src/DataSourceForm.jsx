import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

/* ── icon helper ── */
function I({ d, size = 16, color = "currentColor", sw = 2, className = "" }) {
  return (
    <svg className={`shrink-0 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ico = {
  back:    "M19 12H5M12 19l-7-7 7-7",
  db:      "M12 2C6.48 2 3 3.34 3 5v14c0 1.66 3.48 3 9 3s9-1.34 9-3V5c0-1.66-3.48-3-9-3zM3 9c0 1.66 3.48 3 9 3s9-1.34 9-3M3 14c0 1.66 3.48 3 9 3s9-1.34 9-3",
  check:   "M20 6L9 17l-5-5",
  x:       "M18 6L6 18M6 6l12 12",
  save:    "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
  plug:    "M7 2v11m10-11v11M5 8h14M5 20a2 2 0 01-2-2v-2a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2H5z",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff:  "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22",
};

const Spin = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const btnP = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white border-none flex items-center gap-1.5 transition-all duration-150";
const btnS = "px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] transition-all duration-150";

function useToast() {
  const [items, setItems] = useState([]);
  let _id = 0;
  const push = useCallback((msg, type = "success") => {
    const tid = ++_id;
    setItems((p) => [...p, { id: tid, msg, type }]);
    setTimeout(() => setItems((p) => p.filter((x) => x.id !== tid)), 3500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const Toast = () =>
    items.length > 0 ? (
      <div className="fixed top-5 right-5 z-[99] flex flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} className="px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border"
            style={{
              background:   t.type === "error" ? "rgba(239,68,68,.12)" : "rgba(16,185,129,.12)",
              borderColor:  t.type === "error" ? "rgba(239,68,68,.25)" : "rgba(16,185,129,.25)",
              color:        t.type === "error" ? "#f87171" : "#34d399",
              animation: "fadeUp .25s ease both",
            }}>
            <I d={t.type === "error" ? ico.x : ico.check} size={13}
              color={t.type === "error" ? "#f87171" : "#34d399"} sw={2.5} />
            {t.msg}
          </div>
        ))}
      </div>
    ) : null;
  return { push, Toast };
}

/* ── reusable field components ── */
function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.65rem] font-bold uppercase tracking-[0.07em] text-[var(--text-muted)] flex items-center gap-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[0.6rem] text-[var(--text-muted)]">{hint}</p>}
      {error && <p className="text-[0.6rem] text-red-400">{error}</p>}
    </div>
  );
}

const inputCls = "w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150 placeholder:text-[var(--text-muted)]";

function TextInput({ value, onChange, placeholder, type = "text", error }) {
  return (
    <input
      type={type}
      className={inputCls}
      style={error ? { borderColor: "#f87171" } : {}}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function NumberInput({ value, onChange, placeholder, min, max, error }) {
  return (
    <input
      type="number"
      className={inputCls}
      style={error ? { borderColor: "#f87171" } : {}}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
    />
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={`${inputCls} pr-9`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
      />
      <button type="button" tabIndex={-1}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
        onClick={() => setShow((p) => !p)}>
        <I d={show ? ico.eyeOff : ico.eye} size={14} />
      </button>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-9 h-5 rounded-full transition-colors duration-200"
          style={{ background: checked ? "var(--nav-active)" : "var(--bg-input)", border: "1px solid var(--border)" }} />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }} />
      </div>
      <span className="text-xs text-[var(--text-sub)]">{label}</span>
    </label>
  );
}

const EMPTY_FORM = {
  name: "",
  description: "",
  host: "",
  port: "1433",
  database_name: "",
  username: "",
  password: "",
  trusted_connection: false,
  driver: "{ODBC Driver 18 for SQL Server}",
  connection_timeout: "30",
  command_timeout: "60",
  destination_path: "",
  tags: "",
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.host.trim()) errors.host = "Host is required";
  if (!form.database_name.trim()) errors.database_name = "Database name is required";
  const port = Number(form.port);
  if (!form.port || isNaN(port) || port < 0 || port > 65536) errors.port = "Port must be 0–65536";
  const ct = Number(form.connection_timeout);
  if (form.connection_timeout && (isNaN(ct) || ct < 5 || ct > 300)) errors.connection_timeout = "5–300 seconds";
  const cmd = Number(form.command_timeout);
  if (form.command_timeout && (isNaN(cmd) || cmd < 30 || cmd > 3600)) errors.command_timeout = "30–3600 seconds";
  return errors;
}

function buildPayload(form) {
  const payload = {
    name: form.name.trim(),
    host: form.host.trim(),
    database_name: form.database_name.trim(),
    port: form.port !== "" ? Number(form.port) : 1433,
    trusted_connection: form.trusted_connection,
  };
  if (form.description.trim()) payload.description = form.description.trim();
  if (form.username.trim()) payload.username = form.username.trim();
  if (form.password.trim()) payload.password = form.password.trim();
  if (form.driver.trim()) payload.driver = form.driver.trim();
  if (form.destination_path.trim()) payload.destination_path = form.destination_path.trim();
  if (form.connection_timeout !== "") payload.connection_timeout = Number(form.connection_timeout);
  if (form.command_timeout !== "") payload.command_timeout = Number(form.command_timeout);
  if (form.tags.trim()) {
    payload.tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return payload;
}

export default function DataSourceForm() {
  const { id } = useParams();          // undefined on /datasources/new
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const { push, Toast } = useToast();

  const [form, setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading]   = useState(isEdit);   // loading existing source
  const [saving, setSaving]     = useState(false);
  const [testing, setTesting]   = useState(false);
  const [testStatus, setTestStatus] = useState(null); // null | "ok" | "fail"

  /* populate form from API when editing */
  useEffect(() => {
    if (!isEdit || !api) return;
    setLoading(true);
    api(`/api/v1/data-sources/${id}`)
      .then((data) => {
        setForm({
          name:               data.name            ?? "",
          description:        data.description     ?? "",
          host:               data.host            ?? "",
          port:               String(data.port     ?? 1433),
          database_name:      data.database_name   ?? "",
          username:           data.username        ?? "",
          password:           "",                         // never populate password
          trusted_connection: data.trusted_connection ?? false,
          driver:             data.driver          ?? "{ODBC Driver 18 for SQL Server}",
          connection_timeout: String(data.connection_timeout ?? 30),
          command_timeout:    String(data.command_timeout   ?? 60),
          destination_path:   data.destination_path ?? "",
          tags:               Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags ?? ""),
        });
      })
      .catch(() => push("Failed to load data source", "error"))
      .finally(() => setLoading(false));
  }, [api, id, isEdit, push]);

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setTestStatus(null);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestStatus(null);
    try {
      if (isEdit) {
        await api(`/api/v1/data-sources/${id}/test-connection`, { method: "POST" });
      } else {
        await api("/api/v1/data-sources/test-connection", {
          method: "POST",
          body: JSON.stringify(buildPayload(form)),
        });
      }
      setTestStatus("ok");
      push("Connection successful!");
    } catch (e) {
      setTestStatus("fail");
      push(e?.message || "Connection test failed", "error");
    }
    setTesting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload = buildPayload(form);
      if (isEdit) {
        await api(`/api/v1/data-sources/${id}`, { method: "PUT", body: JSON.stringify(payload) });
        push("Data source updated!");
        setTimeout(() => navigate(`/datasources/${id}`), 600);
      } else {
        const created = await api("/api/v1/data-sources/", { method: "POST", body: JSON.stringify(payload) });
        push("Data source created!");
        const newId = created?.id;
        setTimeout(() => navigate(newId ? `/datasources/${newId}` : "/datasources"), 600);
      }
    } catch (e) {
      push(e?.message || (isEdit ? "Update failed" : "Create failed"), "error");
    }
    setSaving(false);
  };

  const logo = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar navItems={navItems} onNavClick={handleNavClick} activeNav={activeNav} logo={logo} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-3">
            <button className={btnS} onClick={() => navigate(isEdit ? `/datasources/${id}` : "/datasources")}>
              <I d={ico.back} size={14} /> Back
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)" }}>
              <I d={ico.db} size={16} color="#818cf8" />
            </div>
            <div>
              <h1 className="text-sm font-bold">{isEdit ? "Edit Data Source" : "Add Data Source"}</h1>
              <p className="text-[0.65rem] text-[var(--text-muted)]">
                {isEdit ? "Update connection details and settings" : "Configure a new database connection"}
              </p>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20">
              <Spin /> <span className="text-sm text-[var(--text-muted)]">Loading data source...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col gap-5">

              {/* Section: Basic Info */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--border)]" style={{ background: "rgba(99,102,241,.04)" }}>
                  <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Basic Information</h2>
                </div>
                <div className="px-5 py-5 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Field label="Name" required error={errors.name}>
                      <TextInput value={form.name} onChange={set("name")} placeholder="e.g. Production SQL Server" error={errors.name} />
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="Description">
                      <textarea
                        className={`${inputCls} resize-none`}
                        rows={2}
                        value={form.description}
                        onChange={(e) => set("description")(e.target.value)}
                        placeholder="Optional description…"
                      />
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="Tags" hint="Comma-separated list of tags">
                      <TextInput value={form.tags} onChange={set("tags")} placeholder="e.g. production, bi, finance" />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Section: Connection */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--border)]" style={{ background: "rgba(99,102,241,.04)" }}>
                  <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Connection Details</h2>
                </div>
                <div className="px-5 py-5 grid grid-cols-2 gap-4">
                  <Field label="Host" required error={errors.host}>
                    <TextInput value={form.host} onChange={set("host")} placeholder="e.g. sqlexp or 192.168.1.100" error={errors.host} />
                  </Field>
                  <Field label="Port" error={errors.port} hint="Default: 1433">
                    <NumberInput value={form.port} onChange={set("port")} placeholder="1433" min={0} max={65536} error={errors.port} />
                  </Field>
                  <Field label="Database Name" required error={errors.database_name}>
                    <TextInput value={form.database_name} onChange={set("database_name")} placeholder="e.g. MyDatabase" error={errors.database_name} />
                  </Field>
                  <Field label="Destination Path" hint="Optional data destination path">
                    <TextInput value={form.destination_path} onChange={set("destination_path")} placeholder="Optional" />
                  </Field>
                  <Field label="ODBC Driver" hint="Leave default unless using a different driver">
                    <TextInput value={form.driver} onChange={set("driver")} placeholder="{ODBC Driver 18 for SQL Server}" />
                  </Field>
                </div>
              </div>

              {/* Section: Authentication */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--border)]" style={{ background: "rgba(99,102,241,.04)" }}>
                  <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Authentication</h2>
                </div>
                <div className="px-5 py-5 flex flex-col gap-4">
                  <Toggle
                    checked={form.trusted_connection}
                    onChange={set("trusted_connection")}
                    label="Use Windows Authentication (Trusted Connection)"
                  />
                  {!form.trusted_connection && (
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Username">
                        <TextInput value={form.username} onChange={set("username")} placeholder="e.g. sa" />
                      </Field>
                      <Field label="Password" hint={isEdit ? "Leave blank to keep existing password" : ""}>
                        <PasswordInput value={form.password} onChange={set("password")} placeholder={isEdit ? "Leave blank to keep current" : "Enter password"} />
                      </Field>
                    </div>
                  )}
                </div>
              </div>

              {/* Section: Advanced */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--border)]" style={{ background: "rgba(99,102,241,.04)" }}>
                  <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Advanced Settings</h2>
                </div>
                <div className="px-5 py-5 grid grid-cols-2 gap-4">
                  <Field label="Connection Timeout (s)" hint="5–300 seconds" error={errors.connection_timeout}>
                    <NumberInput value={form.connection_timeout} onChange={set("connection_timeout")} placeholder="30" min={5} max={300} error={errors.connection_timeout} />
                  </Field>
                  <Field label="Command Timeout (s)" hint="30–3600 seconds" error={errors.command_timeout}>
                    <NumberInput value={form.command_timeout} onChange={set("command_timeout")} placeholder="60" min={30} max={3600} error={errors.command_timeout} />
                  </Field>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pb-4">
                <div className="flex items-center gap-2">
                  {testStatus === "ok" && (
                    <span className="text-xs text-green-400 flex items-center gap-1 font-semibold">
                      <I d={ico.check} size={13} color="#4ade80" sw={2.5} /> Connection OK
                    </span>
                  )}
                  {testStatus === "fail" && (
                    <span className="text-xs text-red-400 flex items-center gap-1 font-semibold">
                      <I d={ico.x} size={13} color="#f87171" sw={2.5} /> Connection failed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className={btnS} onClick={handleTestConnection} disabled={testing}>
                    {testing ? <Spin /> : <I d={ico.plug} size={14} />} Test Connection
                  </button>
                  <button type="button" className={btnS} onClick={() => navigate(isEdit ? `/datasources/${id}` : "/datasources")}>
                    Cancel
                  </button>
                  <button type="submit" className={btnP} style={{ background: "var(--nav-active-bg)", opacity: saving ? 0.7 : 1 }} disabled={saving}>
                    {saving ? <Spin /> : <I d={ico.save} size={14} color="#fff" sw={2.5} />}
                    {isEdit ? "Save Changes" : "Create Data Source"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>

      <Toast />
    </div>
  );
}
