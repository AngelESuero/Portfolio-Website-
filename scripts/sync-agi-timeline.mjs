import Parser from "rss-parser";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const OUT_PATH = "src/data/agi-timeline.json";
const MAX_ITEMS = 600;

const SOURCES = [
  {
    id: "openai_news",
    name: "OpenAI — News",
    type: "rss",
    url: "https://openai.com/news/rss.xml",
    defaultTags: ["primary", "release"]
  },
  {
    id: "deepmind_blog",
    name: "Google DeepMind — Blog",
    type: "rss",
    url: "https://deepmind.google/blog/feed/basic",
    defaultTags: ["primary", "research"]
  },
  {
    id: "msr_blog",
    name: "Microsoft Research — Blog",
    type: "rss",
    url: "https://www.microsoft.com/en-us/research/blog/feed/",
    defaultTags: ["research"]
  },
  {
    id: "hf_blog",
    name: "Hugging Face — Blog",
    type: "rss",
    url: "https://huggingface.co/blog/feed.xml",
    defaultTags: ["open-source"]
  },
  {
    id: "nvidia_dev_blog",
    name: "NVIDIA Developer — Blog",
    type: "rss",
    url: "https://developer.nvidia.com/blog/feed/",
    defaultTags: ["compute"]
  },
  {
    id: "arxiv_cs_ai",
    name: "arXiv — cs.AI",
    type: "rss",
    url: "https://rss.arxiv.org/rss/cs.AI",
    defaultTags: ["papers"]
  },
  {
    id: "arxiv_cs_cl",
    name: "arXiv — cs.CL",
    type: "rss",
    url: "https://rss.arxiv.org/rss/cs.CL",
    defaultTags: ["papers", "language"]
  }
];

const parser = new Parser();

function sha256(s) {
  return createHash("sha256").update(s).digest("hex");
}

function stripHtml(s = "") {
  return String(s)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalUrl(u) {
  try {
    const url = new URL(u);
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function guessTags(text, base = []) {
  const t = (text || "").toLowerCase();
  const tags = new Set(base);

  const rules = [
    ["agents", ["agents"]],
    ["agent", ["agents"]],
    ["reasoning", ["reasoning"]],
    ["benchmark", ["eval"]],
    ["evaluation", ["eval"]],
    ["safety", ["safety"]],
    ["alignment", ["safety"]],
    ["policy", ["policy"]],
    ["regulation", ["policy"]],
    ["governance", ["policy"]],
    ["compute", ["compute"]],
    ["gpu", ["compute"]],
    ["inference", ["inference"]],
    ["training", ["training"]],
    ["model", ["model"]],
    ["release", ["release"]],
    ["launch", ["release"]],
    ["paper", ["papers"]],
    ["arxiv", ["papers"]],
    ["dataset", ["data"]]
  ];

  for (const [needle, add] of rules) {
    if (t.includes(needle)) add.forEach((x) => tags.add(x));
  }

  return Array.from(tags);
}

async function readExisting() {
  try {
    const raw = await readFile(OUT_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fetchSource(source) {
  const feed = await parser.parseURL(source.url);
  const items = (feed.items || []).map((it) => {
    const url = canonicalUrl(it.link || it.guid || "");
    if (!url) return null;

    const publishedAt = it.isoDate
      ? new Date(it.isoDate).toISOString()
      : it.pubDate
      ? new Date(it.pubDate).toISOString()
      : null;

    const title = (it.title || "").trim();
    const summary = stripHtml(it.contentSnippet || it.content || "");

    return {
      id: sha256(`${source.id}|${url}`),
      title: title || "Untitled",
      url,
      sourceId: source.id,
      sourceName: source.name,
      publishedAt,
      summary: summary || null,
      tags: guessTags(`${title} ${summary}`, source.defaultTags),
      citations: [
        { label: "Original", url },
        { label: "Feed", url: source.url }
      ]
    };
  });

  return items.filter(Boolean);
}

async function main() {
  const existing = await readExisting();
  const existingItems = Array.isArray(existing?.items) ? existing.items : [];

  const byId = new Map(existingItems.map((x) => [x.id, x]));
  const merged = [...existingItems];

  for (const source of SOURCES) {
    try {
      const got = await fetchSource(source);
      for (const item of got) {
        if (!byId.has(item.id)) {
          byId.set(item.id, item);
          merged.push(item);
        }
      }
    } catch (e) {
      console.warn(`[warn] source failed: ${source.id}`, e?.message || e);
    }
  }

  const sorted = merged
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""))
    .slice(0, MAX_ITEMS);

  // Never-empty guarantee (seed if somehow all sources fail + no existing file)
  const items = sorted.length
    ? sorted
    : [
        {
          id: "seed",
          title: "AGI timeline seed (data sync not yet populated).",
          url: "https://github.com/AngelESuero/Portfolio-Website-",
          sourceId: "seed",
          sourceName: "Local",
          publishedAt: new Date().toISOString(),
          summary: "This placeholder guarantees the page never renders empty.",
          tags: ["seed"],
          citations: [{ label: "Repo", url: "https://github.com/AngelESuero/Portfolio-Website-" }]
        }
      ];

  const out = {
    meta: {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      sources: SOURCES.map(({ id, name, type, url }) => ({ id, name, type, url }))
    },
    items
  };

  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
