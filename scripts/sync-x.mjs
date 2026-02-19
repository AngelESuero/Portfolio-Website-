import { readFile, writeFile } from "node:fs/promises";

const OUT_PATH = "src/data/x-feed.json";
const X_API_BASE = "https://api.x.com/2";
const DEFAULT_HANDLE = "a_e_s_4";
const DEFAULT_MAX_ITEMS = 24;
const REQUEST_MAX_RESULTS_CAP = 40;

function normalizeHandle(value) {
  return String(value || "")
    .trim()
    .replace(/^@/, "");
}

function clampMaxItems(value) {
  const parsed = Number.parseInt(String(value || DEFAULT_MAX_ITEMS), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_MAX_ITEMS;
  return Math.min(parsed, 200);
}

function trimText(value, limit) {
  const normalized = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return "";
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function toIsoDate(value) {
  const parsed = new Date(String(value || ""));
  if (Number.isNaN(parsed.valueOf())) return "";
  return parsed.toISOString();
}

function buildEmptyManifest(handle, reason) {
  const generatedAt = new Date().toISOString();
  return {
    meta: {
      schemaVersion: 1,
      generatedAt,
      handle: `@${handle}`,
      source: "x-api-v2",
      fetchedCount: 0,
      reason: reason || "No posts available"
    },
    items: []
  };
}

function isValidFeedManifest(value) {
  if (!value || typeof value !== "object") return false;
  if (!Array.isArray(value.items)) return false;

  return value.items.every((item) => {
    if (!item || typeof item !== "object") return false;
    const title = String(item.title || "").trim();
    const url = String(item.url || "").trim();
    return Boolean(title && url);
  });
}

async function readExistingManifest() {
  try {
    const raw = await readFile(OUT_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeManifest(data) {
  await writeFile(OUT_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function xGetJson(path, token, params = new URLSearchParams()) {
  const url = new URL(`${X_API_BASE}${path}`);
  if (params.size > 0) {
    url.search = params.toString();
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "user-agent": "AngelESuero-XSync/1.0 (+https://portfolio-website-9c9.pages.dev)"
    }
  });

  if (!response.ok) {
    const body = (await response.text()).slice(0, 240);
    throw new Error(`X API ${response.status}: ${body}`);
  }

  return response.json();
}

async function fetchXPosts({ token, handle, maxItems }) {
  const userPayload = await xGetJson(
    `/users/by/username/${encodeURIComponent(handle)}`,
    token,
    new URLSearchParams({ "user.fields": "id,username" })
  );

  const userId = String(userPayload?.data?.id || "").trim();
  const username = String(userPayload?.data?.username || handle).trim();
  if (!userId) throw new Error(`Could not resolve user id for @${handle}`);

  const requestMaxResults = Math.min(Math.max(maxItems, 5), REQUEST_MAX_RESULTS_CAP);
  const tweetsPayload = await xGetJson(
    `/users/${encodeURIComponent(userId)}/tweets`,
    token,
    new URLSearchParams({
      "tweet.fields": "created_at,entities",
      exclude: "replies,retweets",
      max_results: String(requestMaxResults)
    })
  );

  const tweets = Array.isArray(tweetsPayload?.data) ? tweetsPayload.data : [];
  const items = tweets
    .map((tweet) => {
      const tweetId = String(tweet?.id || "").trim();
      const rawText = String(tweet?.text || "");
      const summary = trimText(rawText, 420);
      const firstLine = rawText.split(/\r?\n/).find((line) => String(line || "").trim());
      const title = trimText(firstLine || summary || `Post by @${username}`, 160);
      const publishedAt = toIsoDate(tweet?.created_at);

      if (!tweetId || !title) return null;

      return {
        id: `x:${tweetId}`,
        title,
        url: `https://x.com/${username}/status/${tweetId}`,
        publishedAt,
        summary
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.publishedAt || 0).valueOf() - new Date(a.publishedAt || 0).valueOf())
    .slice(0, maxItems);

  return { username, items };
}

async function main() {
  const handle = normalizeHandle(process.env.X_HANDLE || DEFAULT_HANDLE);
  const maxItems = clampMaxItems(process.env.X_MAX_ITEMS || DEFAULT_MAX_ITEMS);
  const token = String(process.env.X_BEARER_TOKEN || "").trim();

  const existingManifest = await readExistingManifest();
  const hasValidExisting = isValidFeedManifest(existingManifest);

  if (!token) {
    const message = "X_BEARER_TOKEN is missing";
    if (hasValidExisting) {
      console.warn(`[warn] ${message}; keeping last known x-feed.json`);
      return;
    }

    await writeManifest(buildEmptyManifest(handle, message));
    throw new Error(message);
  }

  try {
    const { username, items } = await fetchXPosts({ token, handle, maxItems });
    const manifest = {
      meta: {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        handle: `@${username}`,
        source: "x-api-v2",
        fetchedCount: items.length,
        maxItems,
        excludes: ["replies", "retweets"]
      },
      items
    };

    await writeManifest(manifest);
    console.log(`[ok] Synced ${items.length} X posts for @${username}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (hasValidExisting) {
      console.warn(`[warn] X sync failed; keeping last known x-feed.json: ${message}`);
      return;
    }

    await writeManifest(buildEmptyManifest(handle, message));
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
