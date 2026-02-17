import { AGI_HANDLES } from '../../src/data/agi-handles';

export interface AgiItem {
  id: string;
  author_name: string;
  author_handle: string;
  created_at: string;
  text: string;
  url: string;
  metrics?: {
    like_count?: number;
    retweet_count?: number;
    reply_count?: number;
    quote_count?: number;
    bookmark_count?: number;
    impression_count?: number;
  };
  tags?: string[];
}

interface AgiEnv {
  AGI_KV: KVNamespace;
  X_BEARER_TOKEN: string;
}

interface XUserResponse {
  data?: {
    id: string;
    name: string;
    username: string;
  };
}

interface XTweetsResponse {
  data?: Array<{
    id: string;
    text: string;
    created_at?: string;
    public_metrics?: {
      retweet_count?: number;
      reply_count?: number;
      like_count?: number;
      quote_count?: number;
      bookmark_count?: number;
      impression_count?: number;
    };
    entities?: {
      hashtags?: Array<{ tag?: string }>;
    };
  }>;
}

const X_API_BASE = 'https://api.x.com/2';
const AGI_ITEMS_KEY = 'agi:items';
const LAST_ID_PREFIX = 'agi:last_id:';
const USER_CACHE_PREFIX = 'agi:user:';
const MAX_STORED_ITEMS = 1000;
const MAX_ITEMS_PER_REQUEST = 40;

function normalizeHandle(handle: string): string {
  return handle.replace(/^@/, '').trim();
}

function newestFirst(a: AgiItem, b: AgiItem): number {
  return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf();
}

function snowflakeMax(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  try {
    return BigInt(a) > BigInt(b) ? a : b;
  } catch {
    return a.length > b.length ? a : a > b ? a : b;
  }
}

async function xGet<T>(env: AgiEnv, path: string, params: URLSearchParams): Promise<T> {
  if (!env.X_BEARER_TOKEN) {
    throw new Error('Missing X_BEARER_TOKEN secret');
  }

  const url = new URL(`${X_API_BASE}${path}`);
  url.search = params.toString();

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${env.X_BEARER_TOKEN}`,
      'content-type': 'application/json'
    }
  });

  if (!response.ok) {
    const body = (await response.text()).slice(0, 320);
    throw new Error(`X API error ${response.status} for ${path}: ${body}`);
  }

  return response.json<T>();
}

async function getUser(handle: string, env: AgiEnv): Promise<{ id: string; name: string }> {
  const normalized = normalizeHandle(handle);
  const cacheKey = `${USER_CACHE_PREFIX}${normalized.toLowerCase()}`;
  const cached = await env.AGI_KV.get(cacheKey, 'json');

  if (
    cached &&
    typeof cached === 'object' &&
    'id' in cached &&
    'name' in cached &&
    typeof cached.id === 'string' &&
    typeof cached.name === 'string'
  ) {
    return { id: cached.id, name: cached.name };
  }

  const response = await xGet<XUserResponse>(
    env,
    `/users/by/username/${encodeURIComponent(normalized)}`,
    new URLSearchParams({ 'user.fields': 'id,name,username' })
  );

  if (!response.data?.id) {
    throw new Error(`No user id found for @${normalized}`);
  }

  const user = { id: response.data.id, name: response.data.name || normalized };
  await env.AGI_KV.put(cacheKey, JSON.stringify(user));
  return user;
}

async function fetchNewPostsForHandle(
  env: AgiEnv,
  handle: string,
  sinceId: string | null
): Promise<{ items: AgiItem[]; maxId: string | null }> {
  const normalized = normalizeHandle(handle);
  const user = await getUser(normalized, env);

  const params = new URLSearchParams({
    max_results: String(MAX_ITEMS_PER_REQUEST),
    'tweet.fields': 'created_at,public_metrics,entities'
  });

  if (sinceId) params.set('since_id', sinceId);

  const response = await xGet<XTweetsResponse>(env, `/users/${user.id}/tweets`, params);
  const tweets = response.data ?? [];

  let maxId: string | null = sinceId;
  const items: AgiItem[] = tweets.map((tweet) => {
    maxId = snowflakeMax(maxId, tweet.id);
    const tags = (tweet.entities?.hashtags ?? [])
      .map((entry) => entry.tag)
      .filter((tag): tag is string => Boolean(tag))
      .slice(0, 8);

    return {
      id: tweet.id,
      author_name: user.name,
      author_handle: normalized,
      created_at: tweet.created_at ?? new Date().toISOString(),
      text: tweet.text,
      url: `https://x.com/${normalized}/status/${tweet.id}`,
      ...(tweet.public_metrics ? { metrics: tweet.public_metrics } : {}),
      ...(tags.length > 0 ? { tags } : {})
    };
  });

  return { items, maxId };
}

async function readStoredItems(env: AgiEnv): Promise<AgiItem[]> {
  const raw = await env.AGI_KV.get(AGI_ITEMS_KEY, 'json');
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (entry): entry is AgiItem =>
      entry &&
      typeof entry === 'object' &&
      typeof entry.id === 'string' &&
      typeof entry.text === 'string' &&
      typeof entry.author_handle === 'string' &&
      typeof entry.created_at === 'string' &&
      typeof entry.url === 'string' &&
      typeof entry.author_name === 'string'
  );
}

export async function getLatestAgiItems(env: AgiEnv, limit = 200): Promise<AgiItem[]> {
  const items = await readStoredItems(env);
  return items.sort(newestFirst).slice(0, limit);
}

export async function syncAgiTimeline(env: AgiEnv): Promise<{
  ok: boolean;
  total_items: number;
  fetched_new: number;
  errors: string[];
}> {
  const handles = [...new Set(AGI_HANDLES.map((handle) => normalizeHandle(handle)).filter(Boolean))];
  const existing = await readStoredItems(env);
  const byId = new Map(existing.map((item) => [item.id, item]));
  let fetchedNew = 0;
  const errors: string[] = [];

  for (const handle of handles) {
    const lastIdKey = `${LAST_ID_PREFIX}${handle.toLowerCase()}`;
    const sinceId = await env.AGI_KV.get(lastIdKey);

    try {
      const { items, maxId } = await fetchNewPostsForHandle(env, handle, sinceId);
      items.forEach((item) => byId.set(item.id, item));
      fetchedNew += items.length;
      if (maxId) await env.AGI_KV.put(lastIdKey, maxId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`@${handle}: ${message}`);
    }
  }

  const merged = Array.from(byId.values()).sort(newestFirst).slice(0, MAX_STORED_ITEMS);
  await env.AGI_KV.put(AGI_ITEMS_KEY, JSON.stringify(merged));

  return {
    ok: errors.length === 0,
    total_items: merged.length,
    fetched_new: fetchedNew,
    errors
  };
}
