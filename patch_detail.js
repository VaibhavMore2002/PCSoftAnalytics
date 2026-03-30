const fs = require('fs');
let content = fs.readFileSync('src/QuestionDetail.jsx', 'utf8');

const modernTooltip = `
/* ─ Modern Tooltip ─ */
function CustomTooltip{ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border border-[rgba(255,255,255,0.05)]" 
      style={{
        background: "rgba(15, 23, 42, 0.85)", 
        color: "#f8fafc"
      }}>
      <div className="text-xs font-bold mb-3 text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="flex flex-col gap-2">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-6 text-sm font-semibold">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: p.color || p.fill }}></div>
              <span className="text-slate-300">{p.name}</span>
            </div>
            <span className="text-white">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─ Chart renderer ─ */
`;

content = content.replace("/* ─ Chart renderer ─ */", modernTooltip);

const renderDefs = `
        <defs>
          {COLORS.map((c, i) => (
            <linearGradient key={c} id={\`trad-${i}`\ x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={c} stopOpacity={0.1}/>
            </linearGradient>
          ))}
          {COLORS.map((c, i) => (
            <linearGradient key={`bar-${c}`} id={\`bar-${i}`\x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={1}/>
              <stop offset="100%" stopColor={c} stopOpacity={0.7}/>
            </linearGradient>
          ))}
        </defs>
`;

content = content.replace(/const axisStyle = \{ fontSize: 11, fill: "var\\(--text-muted\\)" \};/g, "const axisStyle = { fontSize: 11, fill: \"var(--text-muted)\" };\n  const axisProps = { axisLine: false, tickLine: false, tick: axisStyle };");
content = content.replace(/const gridStyle = \{ stroke: "var\\(--border\\)", strokeDasharray: "3 3" \};/g, "const gridStyle = { stroke: \"var(--border)\", strokeDasharray: \"4 3\", vertical: false, strokeOpacity: 0.6 };");

content = content.replace(/<CartesianGrid \{\.\.\.gridStyle\} \/>/g, '<CartesianGrid {...gridStyle} />');
content = content.replace(/<XAxis dataKey=\{([^}]+)\} tick=\{axisStyle\} \/>/g, '<XAxis dataKey={$1} {...axisProps} dy={10} />');
content = content.replace(/<XAxis dataKey="name" tick=\{axisStyle\} \/>/g, '<XAxis dataKey="name" {...axisProps} dy={10} />');
content = content.replace(/<YAxis tick=\{axisStyle\} \/>/g, '<YAxis {...axisProps} dx={-4} />');

content = content.replace(/<Tooltip contentStyle=\{[^}]+\} \/>/g, "<Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.4 }} />");

// Bar Charts
content = content.replace(/<BarChart data=\{data\} barCategoryGap="30%">/g, '<BarChart data={data} barCategoryGap="25%" margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>\n' + renderDefs);
content = content.replace(/fill=\{COLORS\\[i % COLORS\\.length\\]\} radius=\{\\[4, 4, 0, 0\\]\}/g, 'fill={`\\url(#bar-${i % COLORS.length})`} radius={[6, 6, 0, 0]}');
content = content.replace(/<BarChart data=\{wfData\}>/g, '<BarChart data={wfData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>');
content = content.replace(/<Bar dataKey="value" stackId="a" radius=\{\\[4, 4, 0, 0\\]\}>/g, '<Bar dataKey="value" stackId="a" radius={[6, 6, 0, 0]}>');

// Area/Line Charts
content = content.replace(/<Component data=\{data\}>/g, '<Component data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>\n' + renderDefs);
content = content.replace(/fill=\{type\\.includes\\("area"\\) \\? \{`b\\\\$\{COLORS\\[i % COLORS\\.length\\]\}30\\`}} : undefined\}/g, 'fill={type.includes("area") ? `url(#grad-${i % COLORS.length})` : undefined}');
content = content.replace(/strokeWidth=\{2\}/g, 'strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: "var(--bg-card)" }}');

// Pie Charts
content = content.replace(/<PieChart>/g, '<PieChart>\n' + renderDefs);
content = content.replace(/outerRadius=\{type\\.includes\\("donut"\\) \\? "70%" : "75%"\}/g, 'outerRadius={type.includes("donut") ? "750" : "75%"}');
content = content.replace(/innerRadius=\{type\\.includes\\("donut"\\) \\? "45%" : 0\}/g, 'innerRadius={type.includes("donut") ? "55%" : 0} paddingAngle={4} cornerRadius={6}');

fs.writeFileSync('src/QuestionDetail.jsx', content);
console.log("Patched QuestionDetail.jsx");