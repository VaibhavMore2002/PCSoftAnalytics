import { readFileSync } from 'fs';
const s = JSON.parse(readFileSync('./openapi.json','utf8'));
const paths = [
  '/api/v1/dashboards/{dashboard_id}/data',
  '/api/v1/dashboards/{dashboard_id}/columns',
  '/api/v1/dashboards/{dashboard_id}/filters',
  '/api/v1/dashboards/{dashboard_id}/access',
  '/api/v1/dashboards/{dashboard_id}/filter-sets',
  '/api/v1/dashboards/{dashboard_id}/me/access',
];
function resolveRef(ref, spec) {
  if (!ref) return null;
  const parts = ref.replace('#/','').split('/');
  let cur = spec;
  for (const p of parts) cur = cur?.[p];
  return cur;
}
paths.forEach(p => {
  const op = s.paths[p]?.get;
  if (!op) { console.log(p, '-> no GET'); return; }
  const schema = op.responses?.['200']?.content?.['application/json']?.schema;
  const schemaRef = schema?.['$ref'];
  let resolved = schemaRef ? resolveRef(schemaRef, s) : schema;
  console.log('\n==', p);
  console.log(JSON.stringify(resolved, null, 2).slice(0, 600));
});
