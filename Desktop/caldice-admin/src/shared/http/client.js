// Minimal HTTP client wrapper used by services across the app.
// Exports a default object with helpers: get, post, put, delete.
// Each helper returns a promise that resolves to an object like: { data, status, ok }
// On non-OK responses the promise will reject with an Error that includes `status` and `data`.

const BASE = import.meta.env?.VITE_API_BASE_URL || "";

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  let data = null;
  try {
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  } catch {
    // ignore parse errors, keep data null
    data = null;
  }
  return { data, status: res.status, ok: res.ok };
}

async function request(method, url, body, opts = {}) {
  const u = (BASE || "") + url;
  const headers = Object.assign({}, opts.headers || {});

  const fetchOpts = {
    method,
    headers,
    credentials: opts.credentials || "same-origin",
  };

  if (body != null) {
    // allow FormData to pass through (for file uploads)
    if (!(body instanceof FormData) && typeof body === "object") {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
      fetchOpts.body = JSON.stringify(body);
    } else {
      fetchOpts.body = body;
    }
  }

  const res = await fetch(u, fetchOpts);
  const parsed = await parseResponse(res);
  if (!res.ok) {
    const err = new Error("HTTP request failed");
    err.status = parsed.status;
    err.data = parsed.data;
    throw err;
  }
  return parsed;
}

export default {
  get: (url, opts) => request("GET", url, null, opts),
  post: (url, body, opts) => request("POST", url, body, opts),
  put: (url, body, opts) => request("PUT", url, body, opts),
  delete: (url, opts) => request("DELETE", url, null, opts),
  // helper to build query strings
  buildQuery(params = {}) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    return qs ? `?${qs}` : "";
  },
};
