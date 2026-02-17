import Parser from "rss-parser";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const CHANNEL_URL = "https://www.youtube.com/@a_e.s_4";
const CHANNEL_ID = "UCQeJiBS72gxrZXw5GmqtocA";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

const OUT_PATH = "src/data/youtube.json";
const MAX_ITEMS = 24;

const parser = new Parser({
  customFields: {
    item: [["yt:videoId", "ytVideoId"], ["media:group", "mediaGroup"]]
  }
});

function sha256(s) {
  return createHash("sha256").update(s).digest("hex");
}

function seriesTags(title = "") {
  const t = title.toLowerCase();
  const out = [];
  if (t.includes("rap demo")) out.push("Rap Demo");
  if (t.includes("beat demo")) out.push("Beat Demo");
  if (t.includes("idea collage")) out.push("Idea Collage");
  if (t.includes("stream")) out.push("Streams");
  return out.length ? out : ["Uploads"];
}

function thumb(videoId) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}

async function readExisting() {
  try {
    const raw = await readFile(OUT_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function main() {
  const existing = await readExisting();

  let feed;
  try {
    feed = await parser.parseURL(FEED_URL);
  } catch (e) {
    // Keep last known-good file
    if (existing) return;
    throw e;
  }

  const items = (feed.items || [])
    .map((it) => {
      const url = it.link || "";
      const videoId = it.ytVideoId || (url.match(/[?&]v=([^&]+)/)?.[1] ?? null);

      const publishedAt =
        it.isoDate || it.pubDate ? new Date(it.isoDate || it.pubDate).toISOString() : null;

      return {
        id: sha256(`yt|${videoId || url}`),
        title: it.title || "Untitled",
        url,
        videoId,
        publishedAt,
        series: seriesTags(it.title || ""),
        thumbnailUrl: thumb(videoId)
      };
    })
    .filter((x) => x.videoId && x.url)
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""))
    .slice(0, MAX_ITEMS);

  const out = {
    meta: {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      channelUrl: CHANNEL_URL,
      channelId: CHANNEL_ID,
      feedUrl: FEED_URL
    },
    items
  };

  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
