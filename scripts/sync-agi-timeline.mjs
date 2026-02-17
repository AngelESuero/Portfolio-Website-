import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import Parser from "rss-parser";

const OUT_FILE = path.resolve("src/data/agi-timeline.json");
const MAX_ITEMS = 300;

// Lo-fi, reliable: prefer RSS/Atom; parse HTML only when needed.
const SOURCES = [
  {
    id: "openai_news",
    name: "OpenAI — News",
    type: "rss",
    url: "https://openai.com/news/rss.xml",
  },
  {
    id: "anthropic_news",
    name: "Anthropic — News",
    type: "html_anthropic_news",
    url: "https://www.anthropic.com/news",
  },
  {
    id: "deepmind_blog",
    name: "Google DeepMind — Blog",
    type: "rss",
    url: "https://deepmind.com/blog/feed/basic",
  },
  {
    id: "arxiv_cs_ai",
    name: "arXiv — cs.AI",
    type: "rss",
    url: "https://rss.arxiv.org/rss/cs.AI",
  },
  {
    id: "arxiv_cs_cl",
    name: "arXiv — cs.CL",
    type: "rss",
    url: "https://rss.arxiv.org/rss/cs.CL",
  },
];

const parser = new Parser();

function sha1(input) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function isoOrNull(d) {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
}

function stripHtml(s = "") {
  return s
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferTags({ title = "", summary = "" }) {
  const t = `${title} ${summary}`.toLowerCase();
  const tags = new Set();

  // Capability / releases
  if (/(release|launch|introducing|announc|preview|beta|api|model)/.test(t)) tags.add("models");
  if (/(agent|tool|workflow|sdk|developer|platform)/.test(t)) tags.add("product");

  // Safety / governance
  if (/(safety|alignment|red team|eval|evaluation|security|misuse)/.test(t)) tags.add("safety");
  if (/(policy|regulation|executive order|ai act|nist|white house|law)/.test(t)) tags.add("policy");

  // Research
  if (/(paper|arxiv|dataset|benchmark|metric|sota)/.test(t)) tags.add("research");

  // Compute / infra
  if (/(compute|gpu|datacenter|inference|training|energy)/.test(t)) tags.add("compute");

  // Default if nothing matched
  if (tags.size === 0) tags.add("update");

  return [...tags];
}

async function fetchText(url, { timeoutMs = 20000 } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "user-agent": "AngelESuero-PortfolioTimelineBot/1.0 (+https://github.com/AngelESuero/Portfolio-Website-)",
        "accept": "text/html,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) throw new Error(`Fetch failed ${res.status} ${res.statusText} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(id);
  }
}

async function loadExisting() {
  try {
    const raw = await fs.readFile(OUT_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeJson(filePath, obj) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

async function fromRss(source) {
  const xml = await fetchText(source.url);
  const feed = await parser.parseString(xml);

  const items = (feed.items || []).map((it) => {
    const url = it.link?.trim();
    const title = (it.title || "").trim();
    const summary = stripHtml(it.contentSnippet || it.content || it.summary || "");
    const publishedAt = isoOrNull(it.isoDate || it.pubDate || it.date);

    if (!url || !title) return null;

    return {
      id: sha1(`${source.id}|${url}`),
      title,
      url,
      sourceId: source.id,
      sourceName: source.name,
      publishedAt,
      summary: summary.slice(0, 600),
      tags: inferTags({ title, summary }),
      citations: [{ label: "Primary source", url }],
    };
  });

  return items.filter(Boolean);
}

// Minimal-but-robust HTML parse for Anthropic /news list.
// We keep only anchors that start with a month-date prefix after stripping tags.
async function fromAnthropicNews(source) {
  const html = await fetchText(source.url);
  const anchors = [...html.matchAll(/<a[^>]+href="(\/news\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gim)];

  const monthRe = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}\s+/;

  const items = anchors
    .map((m) => {
      const href = m[1];
      const text = stripHtml(m[2]);
      if (!monthRe.test(text)) return null;

      // Pattern: "Feb 17, 2026 Category Title..."
      const [datePart, rest] = (() => {
        const match = text.match(/^([A-Za-z]{3}\s+\d{1,2},\s+\d{4})\s+([\s\S]+)$/);
        return match ? [match[1], match[2]] : [null, null];
      })();

      if (!datePart || !rest) return null;

      const parts = rest.split(" ");
      const category = parts[0] || "News";
      const title = rest.slice(category.length).trim();

      const url = `https://www.anthropic.com${href}`;
      const publishedAt = isoOrNull(datePart);

      return {
        id: sha1(`${source.id}|${url}`),
        title: title || text,
        url,
        sourceId: source.id,
        sourceName: source.name,
        publishedAt,
        summary: "",
        tags: [...new Set(["update", category.toLowerCase()])],
        citations: [{ label: "Primary source", url }],
      };
    })
    .filter(Boolean);

  return items;
}

function dedupeAndSort(items) {
  const byUrl = new Map();
  for (const it of items) {
    const prev = byUrl.get(it.url);
    if (!prev) {
      byUrl.set(it.url, it);
      continue;
    }
    // Keep the one with a newer publishedAt if both exist
    const a = prev.publishedAt ? Date.parse(prev.publishedAt) : 0;
    const b = it.publishedAt ? Date.parse(it.publishedAt) : 0;
    if (b > a) byUrl.set(it.url, it);
  }

  const unique = [...byUrl.values()];
  unique.sort((x, y) => {
    const a = x.publishedAt ? Date.parse(x.publishedAt) : 0;
    const b = y.publishedAt ? Date.parse(y.publishedAt) : 0;
    return b - a;
  });

  return unique.slice(0, MAX_ITEMS);
}

async function main() {
  const existing = await loadExisting();
  const generatedAt = new Date().toISOString();

  const collected = [];
  for (const src of SOURCES) {
    try {
      if (src.type === "rss") {
        collected.push(...(await fromRss(src)));
      } else if (src.type === "html_anthropic_news") {
        collected.push(...(await fromAnthropicNews(src)));
      }
    } catch (err) {
      console.warn(`[warn] ${src.id} failed:`, err?.message || err);
    }
  }

  let items = dedupeAndSort(collected);

  // Never write an empty dataset: if fetch fails, keep last known-good items.
  let note = "Daily sync via GitHub Actions.";
  if (items.length === 0 && existing?.items?.length) {
    items = existing.items;
    note = "Fetch failed; reusing last known-good cached dataset to avoid empty renders.";
  }

  // Still never "blank page": if no existing either, write a seed marker entry.
  if (items.length === 0) {
    const url = "https://github.com/AngelESuero/Portfolio-Website-";
    items = [
      {
        id: sha1(`seed|${url}`),
        title: "Timeline seed: dataset initialized (run sync to populate).",
        url,
        sourceId: "seed",
        sourceName: "Local",
        publishedAt: generatedAt,
        summary: "This is a placeholder so the /agi page never renders empty.",
        tags: ["seed"],
        citations: [{ label: "Repo", url }],
      },
    ];
    note = "Seed dataset written (no sources fetched yet).";
  }

  const out = {
    meta: {
      schemaVersion: 1,
      generatedAt,
      note,
      sources: SOURCES.map(({ id, name, type, url }) => ({ id, name, type, url })),
    },
    items,
  };

  await writeJson(OUT_FILE, out);
  console.log(`[ok] wrote ${OUT_FILE} (${items.length} items)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
