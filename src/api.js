const BASE_URL = 'http://192.168.0.94:8000';

export function getAuthHeader(username, password) {
  return 'Basic ' + btoa(`${username}:${password}`);
}

export async function apiFetch(path, options = {}, authHeader = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authHeader ? { Authorization: authHeader } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    const detail = data?.detail;
    let msg;
    if (Array.isArray(detail)) {
      msg = detail.map((e) => {
        const field = e.loc ? e.loc[e.loc.length - 1] : '';
        const m = e.msg || String(e);
        return field && field !== '__root__' ? `${field}: ${m}` : m;
      }).join(', ');
    } else if (typeof detail === 'string') {
      msg = detail;
    } else if (detail && typeof detail === 'object') {
      msg = detail.message || detail.msg || JSON.stringify(detail);
    } else {
      msg = data?.message || `HTTP ${res.status}`;
    }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

export function buildQuery(params) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== '')
  );
  return Object.keys(filtered).length ? '?' + new URLSearchParams(filtered) : '';
}
