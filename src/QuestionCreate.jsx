import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useApp } from "./AppContext.jsx";

/** Allowed v2 chart types (openapi ChartTypeV2). Others map to bar on save. */
const CHART_TYPE_V2 = new Set([
  "bar",
  "line",
  "pie",
  "scatter",
  "area",
  "heatmap",
  "kpi_card",
  "gauge",
  "funnel",
  "waterfall",
  "pareto",
  "control_chart",
]);

function normalizeV2ChartType(raw) {
  if (!raw) return "bar";
  const aliases = { auto: "bar", table: "bar" };
  const v = aliases[raw] || raw;
  return CHART_TYPE_V2.has(v) ? v : "bar";
}

function unwrapColumnList(data) {
  if (
    !rawColumnList(data).length &&
    data &&
    typeof data === "object" &&
    !Array.isArray(data)
  ) {
    const nested =
      data.columns ||
      data.data?.columns ||
      data.dataset?.columns ||
      data.result?.columns;
    return rawColumnList(nested);
  }
  return rawColumnList(data);
}

function rawColumnList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.columns)) return data.columns;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function columnEntries(list) {
  return list
    .map((c) => {
      if (typeof c === "string") return { raw: c, value: c, label: c };
      const value = c.name ?? c.column_name ?? c.field ?? c.alias ?? c.id;
      const label = c.display_name ?? c.label ?? value;
      return {
        raw: c,
        value: value != null ? String(value) : "",
        label: label != null ? String(label) : String(value),
      };
    })
    .filter((x) => x.value);
}

function columnsFromDatasetRecord(ds) {
  const def = ds?.definition;
  const candidates = [
    def?.columns,
    def?.output_columns,
    ds?.output_columns,
    ds?.columns,
  ];
  for (const c of candidates) {
    const entries = columnEntries(rawColumnList(c));
    if (entries.length) return entries.map((e) => e.raw);
  }
  return [];
}

async function fetchDatasetColumns(api, datasetId) {
  const id = String(datasetId);
  const paths = [
    `/api/v1/datasets/${id}/output-columns`,
    `/api/v1/datasets/${id}/columns`,
  ];
  for (const path of paths) {
    try {
      const data = await api(path);
      const list = unwrapColumnList(data);
      if (list.length) return list;
    } catch {
      /* try next */
    }
  }
  try {
    const ds = await api(`/api/v1/datasets/${id}`);
    const fromDef = columnsFromDatasetRecord(ds);
    if (fromDef.length) return fromDef;
  } catch {
    /* empty */
  }
  return [];
}

/* ═══════════════════════════════════════════════════════════
   Shared helpers
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
  chevDown: "M6 9l6 6 6-6",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  db: "M12 2C6.5 2 2 4.5 2 7.5v9C2 19.5 6.5 22 12 22s10-2.5 10-5.5v-9C22 4.5 17.5 2 12 2zM12 12C6.5 12 2 9.5 2 7.5M22 12c0 2-4.5 4.5-10 4.5S2 14 2 12",
  plus: "M12 5v14M5 12h14",
  bar: "M18 20V10M12 20V4M6 20v-6",
  line: "M23 6l-9.5 9.5-5-5L1 18",
  pie: "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z",
  scatter: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
  table:
    "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  gauge:
    "M12 22a10 10 0 0 0 10-10H2a10 10 0 0 0 10 10z M4.93 4.93l.7.7M12 2v2M19.07 4.93l-.7.7",
  kpi: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
  funnel: "M22 3H2l8 9.46V19l4 2v-8.54L22 3",
  waterfall: "M2 14h5v7H2zM9.5 5h5v16h-5zM17 9h5v12h-5z",
  auto: "M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83",
};

const CHART_TYPES = [
  {
    value: "auto",
    label: "Auto (saves as Bar)",
    icon: ico.auto,
    color: "var(--text-muted)",
  },
  { value: "bar", label: "Bar", icon: ico.bar, color: "var(--accent1)" },
  { value: "line", label: "Line", icon: ico.line, color: "var(--positive)" },
  { value: "pie", label: "Pie", icon: ico.pie, color: "var(--accent4)" },
  { value: "area", label: "Area", icon: ico.line, color: "var(--accent2)" },
  {
    value: "scatter",
    label: "Scatter",
    icon: ico.scatter,
    color: "var(--accent3)",
  },
  {
    value: "heatmap",
    label: "Heatmap",
    icon: ico.scatter,
    color: "var(--accent2)",
  },
  {
    value: "kpi_card",
    label: "KPI Card",
    icon: ico.kpi,
    color: "var(--accent3)",
  },
  { value: "gauge", label: "Gauge", icon: ico.gauge, color: "var(--negative)" },
  {
    value: "funnel",
    label: "Funnel",
    icon: ico.funnel,
    color: "var(--accent2)",
  },
  {
    value: "waterfall",
    label: "Waterfall",
    icon: ico.waterfall,
    color: "var(--accent2)",
  },
  { value: "pareto", label: "Pareto", icon: ico.line, color: "var(--accent3)" },
  {
    value: "control_chart",
    label: "Control",
    icon: ico.line,
    color: "var(--accent2)",
  },
  {
    value: "table",
    label: "Table (saves as Bar)",
    icon: ico.table,
    color: "var(--text-muted)",
  },
];

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
  "px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer text-white border-none flex items-center gap-2 transition-all duration-150";
const btnS =
  "px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-sub)] flex items-center gap-2 transition-all duration-150";

/* ── Select dropdown ── */
function Select({ value, onChange, options, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel = options.find((o) => String(o.value) === String(value));
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-left outline-none cursor-pointer flex items-center justify-between gap-2 transition-[border-color] duration-150 hover:border-[var(--text-muted)] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          color: sel ? "var(--text)" : "var(--text-muted)",
          borderColor: open ? "var(--nav-active)" : undefined,
        }}
      >
        <span className="truncate">
          {sel ? sel.label : placeholder || "Select…"}
        </span>
        <I
          d={ico.chevDown}
          size={12}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl max-h-60 overflow-y-auto"
          style={{ animation: "fadeUp .15s ease both" }}
        >
          {options.map((o) => {
            const act = String(o.value) === String(value);
            return (
              <button
                key={o.value}
                type="button"
                className="w-full text-left px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between gap-2 transition-colors"
                style={{
                  background: act ? "var(--nav-active-bg)" : "transparent",
                  color: act ? "#fff" : "var(--text)",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  if (!act)
                    e.currentTarget.style.background = "var(--bg-input)";
                }}
                onMouseLeave={(e) => {
                  if (!act) e.currentTarget.style.background = "transparent";
                }}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
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

/* ── Step indicator ── */
function StepIndicator({ step, steps }) {
  return (
    <div className="flex items-center gap-0 shrink-0">
      {steps.map((s, i) => {
        const active = i + 1 === step;
        const done = i + 1 < step;
        return (
          <div key={s} className="flex items-center">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: active
                  ? "var(--nav-active-bg)"
                  : done
                    ? "var(--bg-active)"
                    : "transparent",
                color: active
                  ? "#fff"
                  : done
                    ? "var(--accent1)"
                    : "var(--text-muted)",
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] font-bold border"
                style={{
                  background: done
                    ? "var(--accent1)"
                    : active
                      ? "rgba(255,255,255,.25)"
                      : "transparent",
                  borderColor: done || active ? "transparent" : "var(--border)",
                }}
              >
                {done ? (
                  <I d={ico.check} size={10} color="#fff" sw={2.5} />
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-6 h-px"
                style={{ background: "var(--border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   QuestionCreate — 2-step wizard
   ═══════════════════════════════════════════════════════════ */
const STEPS = ["Data Connection", "Data and Chart"];

export default function QuestionCreate() {
  const { navItems, activeNav, handleNavClick, api } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [datasets, setDatasets] = useState([]);
  const [columns, setColumns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dsLoading, setDsLoading] = useState(true);
  const [colLoading, setColLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* Form state */
  const [form, setForm] = useState({
    name: "",
    description: "",
    dataset_id: "",
    chart_type: "",
    category_id: "",
    x_column: "",
    y_columns: [],
    color_column: "",
    status: "draft",
  });

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  /* ── Load datasets & categories ── */
  useEffect(() => {
    if (!api) return;
    setDsLoading(true);
    Promise.allSettled([
      api("/api/v1/datasets/?skip=0&limit=200"),
      api("/api/v1/questions-v2/categories"),
    ])
      .then(([dsRes, catRes]) => {
        if (dsRes.status === "fulfilled") {
          const list = Array.isArray(dsRes.value)
            ? dsRes.value
            : Array.isArray(dsRes.value?.data)
              ? dsRes.value.data
              : dsRes.value?.datasets || [];
          setDatasets(list);
        }
        if (catRes.status === "fulfilled") {
          const list = Array.isArray(catRes.value)
            ? catRes.value
            : Array.isArray(catRes.value?.data)
              ? catRes.value.data
              : [];
          setCategories(list);
        }
      })
      .finally(() => setDsLoading(false));
  }, [api]);

  /* ── Load columns when dataset changes ── */
  useEffect(() => {
    if (!form.dataset_id || !api) {
      setColumns([]);
      return;
    }
    setColLoading(true);
    fetchDatasetColumns(api, form.dataset_id)
      .then(setColumns)
      .catch(() => setColumns([]))
      .finally(() => setColLoading(false));
  }, [form.dataset_id, api]);

  /* ── Validate step 1 ── */
  const step1Valid = !!form.dataset_id;

  /* ── Save ── */
  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Question name is required.");
      return;
    }
    if (!form.chart_type) {
      setError("Please select a chart type.");
      return;
    }
    if (!form.y_columns?.length) {
      setError("Select at least one measure (Y).");
      return;
    }
    const ct = normalizeV2ChartType(form.chart_type);
    const singleValueCharts = new Set(["kpi_card", "gauge"]);
    if (!form.x_column?.trim() && !singleValueCharts.has(ct)) {
      setError("Select an X axis / dimension, or choose KPI / Gauge.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const yAxis = [...form.y_columns];
      const dimensions = form.x_column?.trim() ? [form.x_column.trim()] : [];
      const xAxis = form.x_column?.trim() || yAxis[0];
      const themePref =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";

      const question = {
        name: form.name.trim(),
        description: form.description?.trim() || null,
        created_with_wizard: true,
        data_foundation: {
          dataset_id: Number(form.dataset_id),
          columns: {
            dimensions,
            measures: yAxis.map((name) => ({ name, aggregation: "sum" })),
          },
          grouping_hierarchy: dimensions,
          derived_measures: [],
          base_filters: [],
        },
        visualization: {
          chart_type: ct,
          mapping: {
            x_axis: xAxis,
            y_axis: yAxis,
            color_by: form.color_column?.trim() || null,
          },
          styling: {
            theme: themePref,
            title: form.name.trim(),
            show_legend: true,
            show_grid: true,
          },
        },
      };

      const res = await api("/api/v1/questions-v2/", {
        method: "POST",
        body: JSON.stringify({ question }),
      });
      const created = res?.data ?? res;
      const newId = created?.id;
      if (!newId) {
        throw new Error(
          res?.message ||
            res?.error ||
            "Create succeeded but no question id returned.",
        );
      }
      navigate(`/questions/${newId}`);
    } catch (e) {
      setError(e.message || "Failed to create question.");
    } finally {
      setSaving(false);
    }
  };

  const dsOptions = datasets.map((d) => ({
    value: String(d.id),
    label: d.name || `Dataset ${d.id}`,
  }));
  const colOptions = columnEntries(columns);
  const catOptions = [
    { value: "", label: "No group" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const logo = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="text-white"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  );

  /* ════════════════════════ render ════════════════════════ */
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <Sidebar
        navItems={navItems}
        onNavClick={handleNavClick}
        activeNav={activeNav}
        logo={logo}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Wizard header ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <h1 className="text-sm font-bold">Create New Chart</h1>
          <StepIndicator step={step} steps={STEPS} />
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <div className="w-72 shrink-0 border-r border-[var(--border)] bg-[var(--bg-card)] flex flex-col">
            {/* Step 1: Dataset selector */}
            <div className="px-4 pt-4 pb-3 border-b border-[var(--border)]">
              <label className="text-[0.65rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)] mb-2 block">
                Dataset
              </label>
              {dsLoading ? (
                <div className="flex items-center gap-2 py-2 text-xs text-[var(--text-muted)]">
                  <Spin /> Loading datasets…
                </div>
              ) : (
                <Select
                  value={form.dataset_id}
                  onChange={(v) => {
                    setF("dataset_id", v);
                    setF("x_column", "");
                    setF("y_columns", []);
                  }}
                  options={dsOptions}
                  placeholder="Select…"
                />
              )}
            </div>

            {/* Columns panel (visible after dataset selected) */}
            {form.dataset_id && (
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <p className="text-[0.65rem] font-bold tracking-[0.08em] uppercase text-[var(--text-muted)] mb-2">
                  Columns{" "}
                  {colLoading && (
                    <span className="normal-case font-normal text-[var(--text-muted)]">
                      (loading…)
                    </span>
                  )}
                </p>
                {colLoading ? (
                  <div className="flex items-center gap-2 py-3 text-xs text-[var(--text-muted)]">
                    <Spin /> Fetching columns…
                  </div>
                ) : columns.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] py-2">
                    No columns found
                  </p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {colOptions.map((c) => (
                      <div
                        key={c.value}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs hover:bg-[var(--bg-input)] transition-colors group"
                        style={{
                          background:
                            form.y_columns.includes(c.value) ||
                            form.x_column === c.value
                              ? "var(--bg-active)"
                              : "transparent",
                          border:
                            form.y_columns.includes(c.value) ||
                            form.x_column === c.value
                              ? "1px solid var(--border-active)"
                              : "1px solid transparent",
                        }}
                      >
                        <span className="truncate text-[var(--text)]">
                          {c.label}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            className="text-[0.55rem] px-1.5 py-0.5 rounded border cursor-pointer transition-colors"
                            style={{
                              background:
                                form.x_column === c.value
                                  ? "var(--nav-active-bg)"
                                  : "var(--bg-card)",
                              color:
                                form.x_column === c.value
                                  ? "#fff"
                                  : "var(--text-muted)",
                              borderColor: "var(--border)",
                            }}
                            onClick={() =>
                              setF(
                                "x_column",
                                form.x_column === c.value ? "" : c.value,
                              )
                            }
                            title="Set as X axis"
                          >
                            X
                          </button>
                          <button
                            className="text-[0.55rem] px-1.5 py-0.5 rounded border cursor-pointer transition-colors"
                            style={{
                              background: form.y_columns.includes(c.value)
                                ? "var(--nav-active-bg)"
                                : "var(--bg-card)",
                              color: form.y_columns.includes(c.value)
                                ? "#fff"
                                : "var(--text-muted)",
                              borderColor: "var(--border)",
                            }}
                            onClick={() =>
                              setF(
                                "y_columns",
                                form.y_columns.includes(c.value)
                                  ? form.y_columns.filter((x) => x !== c.value)
                                  : [...form.y_columns, c.value],
                              )
                            }
                            title="Toggle Y metric"
                          >
                            Y
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!form.dataset_id && (
              <div className="flex-1 flex items-center justify-center px-4">
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: "rgba(99,102,241,.06)",
                      border: "1px solid rgba(99,102,241,.12)",
                    }}
                  >
                    <I d={ico.db} size={22} color="#818cf8" />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Select a dataset to browse available columns
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="flex-1 overflow-y-auto">
            {step === 1 ? (
              /* ── Step 1: Data Connection ── */
              <div className="flex items-center justify-center h-full px-10">
                {!form.dataset_id ? (
                  <div className="text-center max-w-sm">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{
                        background: "rgba(99,102,241,.06)",
                        border: "1px solid rgba(99,102,241,.12)",
                      }}
                    >
                      <I d={ico.db} size={28} color="#818cf8" />
                    </div>
                    <p className="text-base font-semibold text-[var(--text)] mb-2">
                      Choose your data source
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Select a dataset from the panel on the left to connect
                      your data
                    </p>
                  </div>
                ) : (
                  <div className="text-center max-w-sm">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{
                        background: "rgba(74,222,128,.08)",
                        border: "1px solid rgba(74,222,128,.2)",
                      }}
                    >
                      <I d={ico.check} size={28} color="#4ade80" sw={2.5} />
                    </div>
                    <p className="text-base font-semibold text-[var(--text)] mb-2">
                      Dataset Connected
                    </p>
                    <p className="text-sm text-[var(--text-muted)] mb-1">
                      {datasets.find(
                        (d) => String(d.id) === String(form.dataset_id),
                      )?.name || `Dataset ${form.dataset_id}`}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {colLoading
                        ? "Loading columns…"
                        : `${columns.length} column${columns.length !== 1 ? "s" : ""} available`}
                    </p>
                    <button
                      className={`${btnP} mx-auto mt-5`}
                      style={{ background: "var(--nav-active-bg)" }}
                      onClick={() => setStep(2)}
                    >
                      Continue to Data and Chart →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Step 2: Data and Chart ── */
              <div className="max-w-2xl mx-auto px-8 py-6 flex flex-col gap-5">
                <h2 className="text-base font-bold">Configure Your Chart</h2>

                {error && (
                  <div
                    className="px-4 py-3 rounded-xl text-xs font-semibold"
                    style={{
                      background:
                        "color-mix(in srgb, var(--negative) 12%, transparent)",
                      border:
                        "1px solid color-mix(in srgb, var(--negative) 35%, transparent)",
                      color: "var(--negative)",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Question name */}
                <div>
                  <label className="text-xs font-semibold text-[var(--text-sub)] mb-1.5 block">
                    Question Name *
                  </label>
                  <input
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150"
                    placeholder="e.g. Monthly Revenue by Region"
                    value={form.name}
                    onChange={(e) => setF("name", e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-[var(--text-sub)] mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--nav-active)] caret-[var(--nav-active)] transition-[border-color] duration-150 resize-none"
                    placeholder="What does this chart show?"
                    value={form.description}
                    onChange={(e) => setF("description", e.target.value)}
                  />
                </div>

                {/* Chart Type */}
                <div>
                  <label className="text-xs font-semibold text-[var(--text-sub)] mb-2 block">
                    Chart Type *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CHART_TYPES.map((ct) => (
                      <button
                        key={ct.value}
                        type="button"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-150 text-left"
                        style={{
                          background:
                            form.chart_type === ct.value
                              ? "var(--bg-active)"
                              : "var(--bg-input)",
                          borderColor:
                            form.chart_type === ct.value
                              ? "var(--border-active)"
                              : "var(--border)",
                          color:
                            form.chart_type === ct.value
                              ? "var(--accent1)"
                              : "var(--text-sub)",
                          boxShadow:
                            form.chart_type === ct.value
                              ? "var(--nav-active-shadow)"
                              : "none",
                        }}
                        onClick={() => setF("chart_type", ct.value)}
                      >
                        <I
                          d={ct.icon}
                          size={15}
                          color={
                            form.chart_type === ct.value
                              ? "var(--accent1)"
                              : "var(--text-muted)"
                          }
                        />
                        <span className="text-xs font-semibold">
                          {ct.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* X/Y columns (quick selectors) */}
                {colOptions.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-sub)] mb-1.5 block">
                        X Axis / Dimension
                      </label>
                      <Select
                        value={form.x_column}
                        onChange={(v) => setF("x_column", v)}
                        options={[
                          { value: "", label: "None" },
                          ...colOptions.map(({ value, label }) => ({
                            value,
                            label,
                          })),
                        ]}
                        placeholder="Select column…"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-sub)] mb-1.5 block">
                        Colour Column
                      </label>
                      <Select
                        value={form.color_column}
                        onChange={(v) => setF("color_column", v)}
                        options={[
                          { value: "", label: "None" },
                          ...colOptions.map(({ value, label }) => ({
                            value,
                            label,
                          })),
                        ]}
                        placeholder="Select column…"
                      />
                    </div>
                  </div>
                )}

                {/* Group + Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-sub)] mb-1.5 block">
                      Group
                    </label>
                    <Select
                      value={form.category_id}
                      onChange={(v) => setF("category_id", v)}
                      options={catOptions}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-sub)] mb-1.5 block">
                      Status
                    </label>
                    <Select
                      value={form.status}
                      onChange={(v) => setF("status", v)}
                      options={[
                        { value: "draft", label: "Draft" },
                        { value: "published", label: "Published" },
                        { value: "archived", label: "Archived" },
                      ]}
                    />
                  </div>
                </div>

                {/* Y columns chosen */}
                {form.y_columns.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-sub)] mb-2 block">
                      Selected Metrics (Y columns)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {form.y_columns.map((col) => (
                        <span
                          key={col}
                          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border cursor-pointer"
                          style={{
                            background: "var(--badge-bg)",
                            borderColor: "var(--border-active)",
                            color: "var(--accent1)",
                          }}
                        >
                          {col}
                          <button
                            onClick={() =>
                              setF(
                                "y_columns",
                                form.y_columns.filter((x) => x !== col),
                              )
                            }
                            className="hover:opacity-80 transition-colors cursor-pointer bg-transparent border-none p-0 leading-none text-[var(--negative)]"
                          >
                            <I
                              d={ico.x}
                              size={10}
                              color="currentColor"
                              sw={2.5}
                            />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-card)]">
          <button
            className={btnS}
            onClick={() => (step === 1 ? navigate("/questions") : setStep(1))}
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          <div className="flex items-center gap-2">
            {step === 1 ? (
              <button
                className={btnP}
                style={{
                  background: "var(--nav-active-bg)",
                  opacity: step1Valid ? 1 : 0.45,
                  cursor: step1Valid ? "pointer" : "not-allowed",
                }}
                disabled={!step1Valid}
                onClick={() => setStep(2)}
              >
                Next →
              </button>
            ) : (
              <button
                className={btnP}
                style={{
                  background: "var(--nav-active-bg)",
                  opacity: saving ? 0.7 : 1,
                }}
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? (
                  <>
                    <Spin /> Saving…
                  </>
                ) : (
                  "Save & Create Chart"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
