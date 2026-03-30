const fs = require('fs');
let content = fs.readFileSync('src/QuestionDetail.jsx', 'utf8');

if (!content.includes('react-apexcharts')) {
  content = content.replace(/import \{/, "import Chart from 'react-apexcharts';\nimport {");
}

let start = content.indexOf('/* ── Modern Tooltip ── */');
if (start === -1) start = content.indexOf('/* ── Chart renderer ── */');

const end = content.indexOf('/* ─────────────────────────────────────────────────────────── */');

const newComponent = `/* ── Apex Chart renderer ── */
function ChartRenderer({ chartType, data, height = 340, questionName = "" }) {  
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-40 text-sm text-[var(--text-muted)]">No data available</div>;
  }

  let type = (chartType || "bar").toLowerCase();

  // Auto-detect based on name or basic heuristics
  if (type === "auto") {
    const n = (questionName || "").toLowerCase();
    if (n.includes("funnel"))    type = "funnel";
    else if (n.includes("waterfall")) type = "waterfall";
    else if (n.includes("gauge"))     type = "gauge";
    else if (n.includes("pie") || n.includes("donut")) type = "pie";
    else if (n.includes("line"))      type = "line";
    else if (n.includes("area"))      type = "area";
    else if (n.includes("scatter"))   type = "scatter";
    else if (n.includes("kpi"))       type = "kpi";
    else if (data.length > 0 && Object.keys(data[0]).length >= 4) type = "table";
    else type = "bar";
  }

  const xKey  = data[0] && "name" in data[0] ? "name" : Object.keys(data[0])[0];
  const keys  = Object.keys(data[0] || {}).filter(k => k !== "name" && k !== "label" && k !== "x" && k !== xKey);

  // Maintain custom HTML widgets
  if (type.includes("table")) {
    const allKeys = Object.keys(data[0] || {});
    return (
      <div className="w-full overflow-auto rounded-xl border border-[var(--border-light)]" style={{ height }}>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 bg-[var(--bg-card)] z-10 shadow-sm">   
            <tr>{allKeys.map(k => <th key={k} className="p-4 text-[var(--text-sub)] font-semibold border-b border-[var(--border-light)] bg-[var(--bg-card)]">{k}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-hover)] transition-colors">
                {allKeys.map(k => <td key={k} className="p-4 text-[var(--text)] whitespace-nowrap">{row[k]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type.includes("kpi")) {
    const val = data[0] ? (data[0].value || data[0][keys[0]] || 0) : 0;
    const label = data[0] ? (data[0].name || data[0].label || data[0][xKey] || keys[0] || "KPI") : "KPI";
    return (
      <div className="flex flex-col items-center justify-center w-full bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-light)] relative overflow-hidden group" style={{ height }}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="text-6xl font-black mb-3 font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 drop-shadow-sm">{val}</div>
        <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest">{label}</div>
      </div>
    );
  }

  if (type.includes("gauge")) {
    const val = Math.min(100, Math.max(0, Number(data[0] ? (data[0].value || data[0][keys[0]] || 0) : 0)));
    const label = data[0] ? (data[0].name || data[0].label || data[0][xKey] || keys[0] || "Score") : "Score";
    const r = 100, sw = 18, cx = 150, cy = 140;
    const circ = Math.PI * r;
    const offset = circ - (val / 100) * circ;
    return (
      <div className="flex flex-col items-center justify-center w-full" style={{ height }}>
        <svg width={300} height={180} viewBox="0 0 300 180" className="drop-shadow-xl">
          <defs>
            <linearGradient id="ggGauge_apex" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="ggBlur_apex"><feGaussianBlur stdDeviation="4" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter> 
          </defs>
          <path d={\`M \${cx-r} \${cy} A \${r} \${r} 0 0 1 \${cx+r} \${cy}\`} fill="none" stroke="var(--border-light)" strokeWidth={sw} strokeLinecap="round" />       
          <path d={\`M \${cx-r} \${cy} A \${r} \${r} 0 0 1 \${cx+r} \${cy}\`} fill="none" stroke="url(#ggGauge_apex)" strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} filter="url(#ggBlur_apex)"
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(.4,auto,.2,1)" }} />
          <text x={cx} y={cy - 15} textAnchor="middle" fill="var(--text)" fontSize={48} fontWeight={800} fontFamily="'DM Mono',monospace">{val}</text>
          <text x={cx} y={cy + 20} textAnchor="middle" fill="var(--text-muted)" fontSize={14} fontWeight={600} letterSpacing="0.05em">{label}</text>
        </svg>
      </div>
    );
  }

  // Formatting for ApexCharts
  const isDark = typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.body.classList.contains("dark"));
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  
  const categories = data.map(d => d.name || d.label || d[xKey] || "");

  const baseOptions = {
    chart: { 
      toolbar: { show: true, tools: { download: true, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true } }, 
      background: 'transparent',
      animations: { enabled: true, easing: 'easeinout', speed: 800, animateGradually: { enabled: true, delay: 150 }, dynamicAnimation: { enabled: true, speed: 350 } },
      fontFamily: 'inherit'
    },
    colors: COLORS,
    stroke: { curve: 'smooth', width: 3 },
    grid: { borderColor: gridColor, strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, padding: { top: 0, right: 0, bottom: 0, left: 10 } },
    xaxis: { categories, labels: { style: { colors: textColor, fontSize: '11px', fontWeight: 500 } }, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false } },
    yaxis: { labels: { style: { colors: textColor, fontSize: '11px', fontWeight: 500 }, formatter: (val) => typeof val === 'number' ? val.toLocaleString() : val } },
    dataLabels: { enabled: false },
    theme: { mode: isDark ? 'dark' : 'light' },
    tooltip: { 
      theme: isDark ? 'dark' : 'light',
      style: { fontSize: '12px' },
      y: { formatter: function (val) { return typeof val === 'number' ? val.toLocaleString() : val } },
      marker: { show: true }
    },
    legend: { show: true, position: 'bottom', horizontalAlign: 'center', labels: { colors: isDark ? '#cbd5e1' : '#475569' }, itemMargin: { horizontal: 10, vertical: 5 } }
  };

  if (type.includes("pie") || type.includes("donut")) {
    const isDonut = type.includes("donut");
    const series = data.map(d => Number(d.value || d[keys[0]] || 0));
    const labels = data.map(d => String(d.name || d.label || d[xKey] || ""));
    
    return (
      <div style={{ height }}>
        <Chart 
          options={{
            ...baseOptions,
            chart: { type: isDonut ? 'donut' : 'pie', background: 'transparent' },
            labels,
            stroke: { show: true, colors: isDark ? ['var(--bg-card)'] : ['var(--bg-card)'], width: 3 },
            plotOptions: { 
              pie: { 
                donut: { 
                  size: '70%',
                  labels: { show: true, name: { show: true, color: textColor }, value: { show: true, fontSize: '24px', fontWeight: 800, color: 'var(--text)' } } 
                },
                expandOnClick: true 
              } 
            },
            dataLabels: { enabled: true, dropShadow: { enabled: false } }
          }} 
          series={series} 
          type={isDonut ? "donut" : "pie"} 
          height={height} 
        />
      </div>
    );
  }

  // Fallback for waterfall/funnel visually as bars
  if (type.includes("waterfall") || type.includes("funnel")) {
    const seriesData = data.map((d, i) => Number(d.value || d[keys[0]] || 0));
    if (type.includes("funnel")) seriesData.sort((a,b) => b - a);

    return (
      <div style={{ height }}>
         <Chart 
          options={{
            ...baseOptions,
            chart: { type: 'bar', background: 'transparent' },
            plotOptions: { bar: { horizontal: type.includes("funnel"), borderRadius: 4, distributed: true, dataLabels: { position: 'bottom' } } },
            colors: COLORS,
            fill: { type: 'gradient', gradient: { shade: isDark ? 'dark' : 'light', type: 'vertical', gradientToColors: COLORS.map(c => c+"aa"), stops: [0, 100] } }
          }} 
          series={[{ name: "Value", data: seriesData }]} 
          type="bar" 
          height={height} 
        />
      </div>
    );
  }

  const series = keys.map(k => ({
    name: k,
    data: data.map(d => Number(d[k] || 0))
  }));

  const chartType = type.includes("area") ? "area" : type.includes("line") ? "line" : type.includes("scatter") ? "scatter" : "bar";

  let specificOptions = {};
  if (chartType === "bar") {
    specificOptions = {
      plotOptions: { bar: { borderRadius: 6, columnWidth: '40%' } },
      stroke: { show: true, width: 3, colors: ['transparent'] },
      fill: { 
        type: 'gradient', 
        gradient: { shade: isDark ? 'dark' : 'light', type: 'vertical', shadeIntensity: 0.5, opacityFrom: 1, opacityTo: 0.8, stops: [0, 100] } 
      }
    };
  } else if (chartType === "area") {
    specificOptions = {
      fill: { 
        type: 'gradient', 
        gradient: { shade: isDark ? 'dark' : 'light', type: 'vertical', shadeIntensity: 0.5, opacityFrom: 0.6, opacityTo: 0.05, stops: [0, 100] } 
      }
    };
  } else if (chartType === "scatter") {
    specificOptions = {
      markers: { size: 6, strokeWidth: 0, hover: { size: 9 } }
    };
  }

  return (
    <div style={{ height }} className="apexcharts-modern-wrapper">
      <Chart 
        options={{ ...baseOptions, ...specificOptions, chart: { ...baseOptions.chart, type: chartType } }} 
        series={series} 
        type={chartType} 
        height={height} 
      />
    </div>
  );
}
\n\n`;

content = content.substring(0, start) + newComponent + content.substring(end);
fs.writeFileSync('src/QuestionDetail.jsx', content);
console.log('ApexCharts wrapper injected successfully into QuestionDetail.');

// Now let's patch DashboardAnalytics.jsx
let analitics = fs.readFileSync('src/DashboardAnalytics.jsx', 'utf8');
if (!analitics.includes('react-apexcharts')) {
  analitics = analitics.replace(/import \{/, "import Chart from 'react-apexcharts';\nimport {");
}
// We shouldn't rewrite everything in DashboardAnalytics blindly without understanding it, 
// so we'll just write our file.
fs.writeFileSync('src/DashboardAnalytics.jsx', analitics);
