const fs = require('fs');
let t = fs.readFileSync('src/QuestionDetail.jsx', 'utf8');
t = t.replace('const chartType = type.includes', 'const finalChartType = type.includes');
t = t.replace('if (chartType === "bar")', 'if (finalChartType === "bar")');
t = t.replace('} else if (chartType === "area")', '} else if (finalChartType === "area")');
t = t.replace('} else if (chartType === "scatter")', '} else if (finalChartType === "scatter")');
t = t.replace('type={chartType}', 'type={finalChartType}');
t = t.replace('chart: { ...baseOptions.chart, type: chartType }', 'chart: { ...baseOptions.chart, type: finalChartType }');
fs.writeFileSync('src/QuestionDetail.jsx', t);
