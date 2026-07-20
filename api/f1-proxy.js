// api/f1-proxy.js — Vercel serverless function
// Proxies API-Sports F1 API with the provided key (server-side only)

const API_SPORTS_BASE = "https://v1.formula-1.api-sports.io";
const API_KEY = process.env.APISPORTS_KEY || "466bdcacaa65cbc2ef93d7afb4353f88";

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

  const { endpoint, ...queryParams } = req.query;

  if (!endpoint || typeof endpoint !== "string") {
    return res.status(400).json({ error: "Missing 'endpoint' query parameter" });
  }

  // Build query string from remaining params
  const searchParams = new URLSearchParams();
  for (const [k, v] of Object.entries(queryParams)) {
    if (v !== undefined && v !== null) {
      searchParams.append(k, String(v));
    }
  }

  const qs = searchParams.toString();
  const targetUrl = `${API_SPORTS_BASE}/${endpoint}${qs ? "?" + qs : ""}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, {
      headers: {
        "x-apisports-key": API_KEY,
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
      source: "api-sports",
      endpoint,
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
