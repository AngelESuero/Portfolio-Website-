import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const OUT_PATH = "src/data/x-feed.json";
const X_API_BASE = "https://api.x.com/2";
const X_SYNDICATION_BASE = "https://syndication.twitter.com";
const DEFAULT_HANDLE = "a_e_s_4";
const DEFAULT_MAX_ITEMS = 24;
const REQUEST_MAX_RESULTS_CAP = 40;
const execFileAsync = promisify(execFile);

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

function normalizeBearerToken(value) {
  return String(value || "")
    .trim()
    .replace(/^Bearer\s+/i, "")
    .trim();
}

function looksLikePlaceholderToken(value) {
  const token = String(value || "").trim();
  if (!token) return false;
  return /^(your_|paste_|example_|replace_)/i.test(token) || /token/i.test(token) && token.length < 32;
}

function getAuthHelpMessage(handle) {
  const username = normalizeHandle(handle) || DEFAULT_HANDLE;
  return [
    "X API auth failed (401 Unauthorized).",
    "Use the App Bearer Token (OAuth 2.0 app-only), not API key/secret.",
    "Set X_BEARER_TOKEN without the 'Bearer ' prefix.",
    `Quick test: curl -sS -H "Authorization: Bearer $X_BEARER_TOKEN" "https://api.x.com/2/users/by/username/${encodeURIComponent(
      username
    )}?user.fields=id,username"`
  ].join(" ");
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

  const headers = {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "user-agent": "AngelESuero-XSync/1.0 (+https://portfolio-website-9c9.pages.dev)"
  };

  try {
    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      const body = (await response.text()).slice(0, 240);
      throw new Error(`X API ${response.status}: ${body}`);
    }
    return response.json();
  } catch (error) {
    const fetchMessage = error instanceof Error ? error.message : String(error);
    if (!/fetch failed/i.test(fetchMessage)) {
      throw error;
    }
    return xGetJsonWithCurl(url.toString(), headers);
  }
}

async function curlGetWithStatus(url, headers = []) {
  const marker = "__HTTP_STATUS__:";
  const args = ["-sS", "--max-time", "30"];
  headers.forEach((header) => {
    args.push("-H", header);
  });
  args.push(url, "-w", `\n${marker}%{http_code}`);

  const { stdout } = await execFileAsync("curl", args, {
    maxBuffer: 10 * 1024 * 1024
  });
  const markerIndex = stdout.lastIndexOf(`\n${marker}`);
  if (markerIndex === -1) {
    throw new Error("curl fallback failed: missing HTTP status marker");
  }

  const body = stdout.slice(0, markerIndex);
  const statusRaw = stdout.slice(markerIndex + marker.length + 1).trim();
  const status = Number.parseInt(statusRaw, 10);
  if (!Number.isFinite(status)) {
    throw new Error(`curl fallback failed: invalid HTTP status '${statusRaw}'`);
  }

  return { status, body };
}

async function xGetJsonWithCurl(url, headers) {
  const { status, body } = await curlGetWithStatus(url, [
    `Authorization: ${headers.Authorization}`,
    `content-type: ${headers["content-type"]}`,
    `user-agent: ${headers["user-agent"]}`
  ]);
  if (status < 200 || status >= 300) {
    throw new Error(`X API ${status}: ${body.slice(0, 240)}`);
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error("X API fallback returned non-JSON payload");
  }
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

function parseSyndicationPayload(html) {
  const match = String(html || "").match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/i
  );
  if (!match?.[1]) {
    throw new Error("Syndication payload missing __NEXT_DATA__");
  }

  try {
    return JSON.parse(match[1]);
  } catch {
    throw new Error("Syndication payload JSON parse failed");
  }
}

async function fetchXPostsFromSyndication({ handle, maxItems }) {
  const requestLimit = Math.min(Math.max(maxItems, 5), REQUEST_MAX_RESULTS_CAP);
  const endpoint = new URL(
    `${X_SYNDICATION_BASE}/srv/timeline-profile/screen-name/${encodeURIComponent(handle)}`
  );
  endpoint.searchParams.set("dnt", "true");
  endpoint.searchParams.set("lang", "en");
  endpoint.searchParams.set("limit", String(requestLimit));
  endpoint.searchParams.set("showReplies", "false");

  const { status, body } = await curlGetWithStatus(endpoint.toString(), [
    "user-agent: AngelESuero-XSync/1.0 (+https://portfolio-website-9c9.pages.dev)"
  ]);
  if (status < 200 || status >= 300) {
    throw new Error(`X syndication ${status}: ${body.slice(0, 240)}`);
  }

  const payload = parseSyndicationPayload(body);
  const timeline = payload?.props?.pageProps?.timeline;
  const headerScreenName = String(timeline?.headerProps?.screenName || handle).trim();
  const entries = Array.isArray(timeline?.entries) ? timeline.entries : [];

  const itemMap = new Map();
  for (const entry of entries) {
    const tweet = entry?.content?.tweet;
    if (!tweet || typeof tweet !== "object") continue;
    if (tweet.in_reply_to_status_id_str) continue;
    if (tweet.retweeted_status || /^RT\s@/i.test(String(tweet.full_text || tweet.text || ""))) continue;

    const tweetId = String(tweet.id_str || "").trim();
    const rawText = String(tweet.full_text || tweet.text || "").trim();
    const tweetScreenName = String(tweet?.user?.screen_name || headerScreenName || handle).trim();
    const permalink = String(tweet.permalink || "").trim();
    const publishedAt = toIsoDate(tweet.created_at);
    const summary = trimText(rawText, 420);
    const firstLine = rawText.split(/\r?\n/).find((line) => String(line || "").trim());
    const title = trimText(firstLine || summary || `Post by @${tweetScreenName}`, 160);
    const url = permalink
      ? /^https?:\/\//i.test(permalink)
        ? permalink
        : `https://x.com${permalink.startsWith("/") ? permalink : `/${permalink}`}`
      : `https://x.com/${tweetScreenName}/status/${tweetId}`;

    if (!tweetId || !title || !url) continue;

    itemMap.set(tweetId, {
      id: `x:${tweetId}`,
      title,
      url,
      publishedAt,
      summary
    });
  }

  const items = Array.from(itemMap.values())
    .sort((a, b) => new Date(b.publishedAt || 0).valueOf() - new Date(a.publishedAt || 0).valueOf())
    .slice(0, maxItems);

  return { username: headerScreenName || handle, items };
}

async function main() {
  const handle = normalizeHandle(process.env.X_HANDLE || DEFAULT_HANDLE);
  const maxItems = clampMaxItems(process.env.X_MAX_ITEMS || DEFAULT_MAX_ITEMS);
  const tokenRaw = String(process.env.X_BEARER_TOKEN || "").trim();
  const token = normalizeBearerToken(tokenRaw);

  const existingManifest = await readExistingManifest();
  const hasValidExisting = isValidFeedManifest(existingManifest);
  const errors = [];

  if (/^Bearer\s+/i.test(tokenRaw)) {
    console.log("[info] Normalized X_BEARER_TOKEN by removing a leading 'Bearer ' prefix.");
  }

  let shouldTryApi = false;
  if (!token) {
    console.warn("[warn] X_BEARER_TOKEN is missing; trying public syndication fallback.");
  } else if (looksLikePlaceholderToken(token)) {
    console.warn(
      "[warn] X_BEARER_TOKEN looks like a placeholder value. Paste the real app Bearer Token from X Developer Portal."
    );
    console.warn("[warn] Trying public syndication fallback.");
  } else {
    shouldTryApi = true;
    if (token.length < 40) {
      console.warn(
        "[warn] X_BEARER_TOKEN looks short. Ensure you are using the app Bearer Token, not API key/secret."
      );
    }
  }

  if (shouldTryApi) {
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
      console.log(`[ok] Synced ${items.length} X posts for @${username} via X API`);
      return;
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : String(error);
      const isAuthError = /\bX API 401\b/i.test(rawMessage);
      const message = isAuthError ? `${rawMessage} ${getAuthHelpMessage(handle)}` : rawMessage;
      errors.push(message);
      console.warn(`[warn] X API sync failed; trying public syndication fallback: ${message}`);
    }
  }

  try {
    const { username, items } = await fetchXPostsFromSyndication({ handle, maxItems });
    const manifest = {
      meta: {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        handle: `@${username}`,
        source: "x-syndication",
        fetchedCount: items.length,
        maxItems,
        excludes: ["replies", "retweets"],
        fallback: "public-embed-syndication"
      },
      items
    };

    await writeManifest(manifest);
    console.log(`[ok] Synced ${items.length} X posts for @${username} via syndication fallback`);
    return;
  } catch (error) {
    const fallbackMessage = error instanceof Error ? error.message : String(error);
    const allMessages = errors.concat(fallbackMessage).join(" | ");

    if (hasValidExisting) {
      console.warn(`[warn] X sync failed; keeping last known x-feed.json: ${allMessages}`);
      return;
    }

    await writeManifest(buildEmptyManifest(handle, allMessages));
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
