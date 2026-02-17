import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import Parser from "rss-parser";

const OUT_FILE = path.resolve("src/data/youtube.json");
const CHANNEL_URL = "https://www.youtube.com/@a_e.s_4";
const MAX_ITEMS = 24;

const parser = new Parser();

function sha1(input) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

async function writeJson(filePath, obj) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

async function loadExisting() {
  try {
    const raw = await fs.readFile(OUT_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fetchText(url, { timeoutMs = 20000 } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "user-agent": "AngelESuero-PortfolioYouTubeBot/1.0 (+https://github.com/AngelESuero/Portfolio-Website-)",
        "accept": "text/html,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) throw new Error(`Fetch failed ${res.status} ${res.statusText} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(id);
  }
}

function inferSeries(title = "") {
  const t = title.toLowerCase();
  const series = [];

  if (t.includes("rap demo")) series.push("Rap Demo");
  if (t.includes("beat demo")) series.push("Beat Demo");
  if (t.includes("idea collage")) series.push("Idea Collage");
  if (t.includes("stream") || t.includes("live")) series.push("Streams");

  return series.length ? series : ["Uploads"];
}

function getVideoId(url) {
  try {
    const u = new URL(url);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

async function discoverChannelId() {
  const html = await fetchText(CHANNEL_URL);
  const m = html.match(/"channelId":"(UC[a-zA-Z0-9_-]{10,})"/);
  if (!m) throw new Error("Could not discover channelId from channel page HTML.");
  return m[1];
}

async function main() {
  const existing = await loadExisting();
  const generatedAt = new Date().toISOString();

  let channelId = null;
  let feedUrl = null;
  let items = [];

  try {
    channelId = await discoverChannelId();
    feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const xml = await fetchText(feedUrl);
    const feed = await parser.parseString(xml);

    items = (feed.items || [])
      .map((it) => {
        const url = it.link?.trim();
        const title = (it.title || "").trim();
        const publishedAt = it.isoDate ? new Date(it.isoDate).toISOString() : null;
        const videoId = url ? getVideoId(url) : null;
        if (!url || !title || !videoId) return null;

        return {
          id: sha1(`youtube|${videoId}`),
          title,
          url,
          videoId,
          publishedAt,
          series: inferSeries(title),
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        };
      })
      .filter(Boolean)
      .slice(0, MAX_ITEMS);
  } catch (err) {
    console.warn("[warn] youtube sync failed:", err?.message || err);
    if (existing?.items?.length) {
      items = existing.items;
      feedUrl = existing?.meta?.feedUrl || null;
      channelId = existing?.meta?.channelId || null;
    }
  }

  if (!items.length) {
    items = [
      {
        id: sha1("youtube|seed"),
        title: "YouTube seed: run sync to populate uploads.",
        url: CHANNEL_URL,
        videoId: null,
        publishedAt: generatedAt,
        series: ["Seed"],
        thumbnailUrl: null,
      },
    ];
  }

  const out = {
    meta: {
      schemaVersion: 1,
      generatedAt,
      channelUrl: CHANNEL_URL,
      channelId,
      feedUrl,
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
