// api/news.js — place this file at /api/news.js in your project root

const RSS_URLS = [
  "https://www.motorsport.com/rss/f1/news/",
  "https://www.autosport.com/rss/f1/news/",
];

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`));
      return m ? (m[1] || m[2] || "").trim() : "";
    };
    const getAttr = (tag, attr) => {
      const m = block.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*>`));
      return m ? m[1] : "";
    };
    const title = get("title");
    const link = get("link") || getAttr("link", "href");
    const pubDate = get("pubDate");
    const description = get("description");
    const image = getAttr("enclosure", "url") || getAttr("media:content", "url") || getAttr("media:thumbnail", "url") || "";
    if (title && link) {
      items.push({ title, link, pubDate, description: description.replace(/<[^>]+>/g, "").slice(0, 200), image });
    }
  }
  return items;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");

  for (const url of RSS_URLS) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; F1Guide/1.0)" },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) continue;
      const xml = await response.text();
      const items = parseRSS(xml).slice(0, 20);
      if (items.length > 0) {
        return res.status(200).json({ items, source: url });
      }
    } catch (e) {
      // try next source
    }
  }

  res.status(200).json({ items: [], error: "RSS feeds temporarily unavailable" });
}
