// api/f1-proxy.js — Vercel serverless function
// Proxies Jolpica F1 API and OpenF1 with caching and JSON normalization

const JOLPICA_BASE = "https://api.jolpi.ca/ergast/f1";
const OPENF1_BASE = "https://api.openf1.org/v1";

function normalizeJson(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return { raw: body };
    }
  }
  return body;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const { path, source = "jolpica" } = req.query;

  if (!path || typeof path !== "string") {
    return res.status(400).json({ error: "Missing 'path' query parameter" });
  }

  const base = source === "openf1" ? OPENF1_BASE : JOLPICA_BASE;
  const targetUrl = `${base}/${path.replace(/^\//, "")}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; F1Guide/1.0)",
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const contentType = response.headers.get("content-type") || "";
    let body;

    if (contentType.includes("application/json")) {
      body = await response.json();
    } else {
      const text = await response.text();
      body = normalizeJson(text);
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Upstream API error",
        status: response.status,
        statusText: response.statusText,
        body,
      });
    }

    return res.status(200).json({
      source: source === "openf1" ? "openf1" : "jolpica",
      path: `/${path.replace(/^\//, "")}`,
      cachedAt: new Date().toISOString(),
      data: body,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(502).json({
      error: "Proxy failed",
      message,
      targetUrl,
    });
  }
}
