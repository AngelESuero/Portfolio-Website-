import { AGI_HANDLES } from '../../src/data/agi-handles';
import { AGI_MANUAL_QUOTES } from '../../src/data/agi-manual-quotes';
import { AGI_WEB_SOURCES } from '../../src/data/agi-web-sources';

export interface AgiTimelineItem {
  id: string;
  source_name: string;
  title: string;
  date: string;
  summary: string;
  url: string;
  tags: string[];
  author_handle?: string;
  tweet_url?: string;
}

export interface AgiSyncResult {
  ok: boolean;
  pipeline: 'web' | 'x' | 'all';
  total_items: number;
  fetched_new: number;
  errors: string[];
}

interface AgiEnv {
  AGI_KV: KVNamespace;
  X_BEARER_TOKEN?: string;
  AGI_X_ENABLED?: string;
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
    entities?: {
      hashtags?: Array<{ tag?: string }>;
    };
  }>;
}

interface ParsedCandidate {
  title: string;
  summary: string;
  url: string;
  date?: string | null;
  tags?: string[];
}

const X_API_BASE = 'https://api.x.com/2';
const WEB_ITEMS_KEY = 'agi:web:items';
const X_ITEMS_KEY = 'agi:x:items';
const X_LAST_ID_PREFIX = 'agi:x:last_id:';
const X_USER_CACHE_PREFIX = 'agi:x:user:';
const MAX_STORED_ITEMS = 500;
const MAX_API_ITEMS = 200;
const MAX_ITEMS_PER_SOURCE = 220;
const MAX_ITEMS_PER_REQUEST = 40;
const FETCH_TIMEOUT_MS = 12000;

function newestFirst(a: AgiTimelineItem, b: AgiTimelineItem): number {
  return new Date(b.date).valueOf() - new Date(a.date).valueOf();
}

function trimText(value: string, limit: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  return clean.length <= limit ? clean : `${clean.slice(0, limit - 1)}…`;
}

function decodeHtml(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function stripHtml(value: string): string {
  return decodeHtml(value.replace(/<[^>]+>/g, ' '));
}

function toIsoDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return null;
  return parsed.toISOString();
}

function extractDateFromText(text: string): string | null {
  const directIso = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (directIso) return toIsoDate(directIso[1]);

  const monthDate = text.match(
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+20\d{2}\b/i
  );
  if (monthDate) return toIsoDate(monthDate[0]);

  const slashDate = text.match(/\b\d{1,2}\/\d{1,2}\/20\d{2}\b/);
  if (slashDate) return toIsoDate(slashDate[0]);

  return null;
}

function normalizeHandle(handle: string): string {
  return handle.replace(/^@/, '').trim();
}

function parseBoolean(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

export function isXModuleEnabled(env: Pick<AgiEnv, 'AGI_X_ENABLED'>): boolean {
  return parseBoolean(env.AGI_X_ENABLED);
}

function simpleHash(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
  }
  return `h${(hash >>> 0).toString(16)}`;
}

function canonicalizeUrl(rawUrl: string, baseUrl: string): string | null {
  try {
    const url = new URL(rawUrl, baseUrl);
    if (!/^https?:$/.test(url.protocol)) return null;
    url.hash = '';
    url.searchParams.forEach((_value, key) => {
      if (key.toLowerCase().startsWith('utm_')) url.searchParams.delete(key);
    });
    return url.toString();
  } catch {
    return null;
  }
}

function inferTags(...texts: string[]): string[] {
  const corpus = texts.join(' ').toLowerCase();
  const tagRules: Array<[string, RegExp]> = [
    ['agi', /\bagi\b/],
    ['llm', /\bllm|large language model/],
    ['agents', /\bagent/],
    ['alignment', /\balignment|safety/],
    ['benchmark', /\bbenchmark|eval/],
    ['policy', /\bpolicy|regulation|governance/],
    ['open-source', /\bopen[- ]source/],
    ['research', /\bresearch|paper/],
    ['models', /\bmodel|weights/],
    ['robotics', /\brobot/]
  ];

  return tagRules.filter(([, pattern]) => pattern.test(corpus)).map(([tag]) => tag);
}

function dedupeAndSort(items: AgiTimelineItem[], maxItems = MAX_STORED_ITEMS): AgiTimelineItem[] {
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const sorted = items.filter(Boolean).sort(newestFirst);
  const deduped: AgiTimelineItem[] = [];

  for (const item of sorted) {
    if (!item.id || !item.url) continue;
    if (seenIds.has(item.id) || seenUrls.has(item.url)) continue;
    seenIds.add(item.id);
    seenUrls.add(item.url);
    deduped.push(item);
    if (deduped.length >= maxItems) break;
  }

  return deduped;
}

function getManualQuoteItems(fallbackDate = new Date().toISOString()): AgiTimelineItem[] {
  return AGI_MANUAL_QUOTES.map((quote) => ({
    id: quote.id,
    source_name: quote.source_name,
    title: trimText(quote.title, 180),
    date: toIsoDate(quote.date) ?? fallbackDate,
    summary: trimText(quote.summary, 360),
    url: quote.url,
    tags: quote.tags,
    author_handle: quote.author_handle,
    tweet_url: quote.url
  }));
}

function buildTimelineItem(
  sourceName: string,
  candidate: ParsedCandidate,
  fallbackDate: string
): AgiTimelineItem | null {
  const date = toIsoDate(candidate.date) ?? fallbackDate;
  const url = candidate.url.trim();
  const title = trimText(candidate.title || 'Untitled', 180);
  const summary = trimText(candidate.summary || candidate.title || 'No summary available.', 360);
  if (!url || !title) return null;

  return {
    id: simpleHash(`${sourceName}|${url}`),
    source_name: sourceName,
    title,
    date,
    summary,
    url,
    tags: Array.from(new Set([...(candidate.tags ?? []), ...inferTags(title, summary, url)])).slice(0, 10)
  };
}

function extractJsonLdCandidates(html: string, sourceUrl: string): ParsedCandidate[] {
  const matches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const candidates: ParsedCandidate[] = [];

  const walk = (node: unknown): void => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node !== 'object') return;

    const record = node as Record<string, unknown>;
    const rawUrl =
      (typeof record.url === 'string' && record.url) ||
      (typeof record['@id'] === 'string' && record['@id']) ||
      (typeof record.mainEntityOfPage === 'string' && record.mainEntityOfPage) ||
      null;
    const title =
      (typeof record.headline === 'string' && record.headline) ||
      (typeof record.name === 'string' && record.name) ||
      (typeof record.title === 'string' && record.title) ||
      '';
    const summary =
      (typeof record.description === 'string' && record.description) ||
      (typeof record.abstract === 'string' && record.abstract) ||
      '';
    const date =
      (typeof record.datePublished === 'string' && record.datePublished) ||
      (typeof record.dateCreated === 'string' && record.dateCreated) ||
      (typeof record.dateModified === 'string' && record.dateModified) ||
      null;

    if (rawUrl && (title || summary)) {
      const canonical = canonicalizeUrl(rawUrl, sourceUrl);
      if (canonical) {
        candidates.push({
          title: stripHtml(title),
          summary: stripHtml(summary),
          url: canonical,
          date
        });
      }
    }

    Object.values(record).forEach(walk);
  };

  for (const match of matches) {
    const payload = (match[1] || '').trim();
    if (!payload) continue;
    try {
      walk(JSON.parse(payload));
    } catch {
      // Skip malformed JSON-LD block.
    }
  }

  return candidates;
}

function extractAnchorCandidates(html: string, sourceUrl: string): ParsedCandidate[] {
  const candidates: ParsedCandidate[] = [];
  const pattern = /<a\b[^>]*href=(?:"([^"]+)"|'([^']+)')[^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null && candidates.length < MAX_ITEMS_PER_SOURCE) {
    const href = match[1] || match[2] || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
      continue;
    }

    const url = canonicalizeUrl(href, sourceUrl);
    if (!url) continue;

    const title = trimText(stripHtml(match[3] || ''), 180);
    if (title.length < 12) continue;

    const index = match.index ?? 0;
    const context = html.slice(Math.max(0, index - 220), index + match[0].length + 320);
    const contextText = trimText(stripHtml(context), 420);
    const summary = contextText.length > title.length ? contextText : title;
    const date = extractDateFromText(contextText);

    candidates.push({ title, summary, url, date });
  }

  return candidates;
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function pickTag(block: string, tags: string[]): string {
  for (const tag of tags) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = block.match(regex);
    if (match?.[1]) return trimText(stripHtml(match[1]), 360);
  }
  return '';
}

function pickAtomLink(block: string): string {
  const hrefMatch = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (hrefMatch?.[1]) return decodeHtml(hrefMatch[1]);
  return pickTag(block, ['link']);
}

function parseRssCandidates(xml: string, baseUrl: string): ParsedCandidate[] {
  const candidates: ParsedCandidate[] = [];
  const rssItems = xml.match(/<item[\\s\\S]*?<\\/item>/gi) ?? [];
  const atomEntries = xml.match(/<entry[\\s\\S]*?<\\/entry>/gi) ?? [];

  rssItems.forEach((block) => {
    const title = pickTag(block, ['title']);
    const summary = pickTag(block, ['description', 'content:encoded', 'summary']) || title;
    const rawUrl = pickTag(block, ['link', 'guid']);
    const date = pickTag(block, ['pubDate', 'dc:date', 'published', 'updated']);
    const url = canonicalizeUrl(rawUrl, baseUrl);
    if (title && summary && url) {
      candidates.push({ title, summary, url, date });
    }
  });

  atomEntries.forEach((block) => {
    const title = pickTag(block, ['title']);
    const summary = pickTag(block, ['summary', 'content']) || title;
    const rawUrl = pickAtomLink(block);
    const date = pickTag(block, ['published', 'updated', 'pubDate']);
    const url = canonicalizeUrl(rawUrl, baseUrl);
    if (title && summary && url) {
      candidates.push({ title, summary, url, date });
    }
  });

  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    if (seen.has(candidate.url)) return false;
    seen.add(candidate.url);
    return true;
  });
}

async function fetchSourceCandidates(sourceName: string, sourceUrl: string): Promise<ParsedCandidate[]> {
  const response = await fetchWithTimeout(sourceUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; AGI Timeline Worker/1.0; +https://angel-suero.pages.dev)',
      accept: 'text/html,application/xhtml+xml'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  return [...extractJsonLdCandidates(html, sourceUrl), ...extractAnchorCandidates(html, sourceUrl)];
}

async function fetchRssCandidates(sourceUrl: string): Promise<ParsedCandidate[]> {
  const response = await fetchWithTimeout(sourceUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; AGI Timeline Worker/1.0; +https://angel-suero.pages.dev)',
      accept: 'application/rss+xml,application/atom+xml,text/xml,application/xml'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const xml = await response.text();
  return parseRssCandidates(xml, sourceUrl);
}

async function readItemsFromKv(env: AgiEnv, key: string): Promise<AgiTimelineItem[]> {
  const raw = await env.AGI_KV.get(key, 'json');
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (entry): entry is AgiTimelineItem =>
      entry &&
      typeof entry === 'object' &&
      typeof entry.id === 'string' &&
      typeof entry.source_name === 'string' &&
      typeof entry.title === 'string' &&
      typeof entry.date === 'string' &&
      typeof entry.summary === 'string' &&
      typeof entry.url === 'string' &&
      Array.isArray(entry.tags)
  );
}

export async function getLatestAgiItems(env: AgiEnv, limit = MAX_API_ITEMS): Promise<AgiTimelineItem[]> {
  const items = await readItemsFromKv(env, WEB_ITEMS_KEY);
  return dedupeAndSort([...items, ...getManualQuoteItems()], MAX_STORED_ITEMS).slice(0, limit);
}

export async function getLatestAgiXItems(env: AgiEnv, limit = MAX_API_ITEMS): Promise<AgiTimelineItem[]> {
  const items = await readItemsFromKv(env, X_ITEMS_KEY);
  return items.sort(newestFirst).slice(0, limit);
}

export async function syncAgiWebTimeline(env: AgiEnv): Promise<AgiSyncResult> {
  const nowIso = new Date().toISOString();
  const existing = await readItemsFromKv(env, WEB_ITEMS_KEY);
  const incoming: AgiTimelineItem[] = [];
  const errors: string[] = [];

  for (const source of AGI_WEB_SOURCES) {
    const sourceCandidates: ParsedCandidate[] = [];

    if (source.rss_url) {
      try {
        sourceCandidates.push(...(await fetchRssCandidates(source.rss_url)));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`${source.name} RSS: ${message}`);
      }
    }

    try {
      sourceCandidates.push(...(await fetchSourceCandidates(source.name, source.url)));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${source.name} HTML: ${message}`);
    }

    if (sourceCandidates.length > 0) {
      const normalized = sourceCandidates
        .map((candidate) =>
          buildTimelineItem(source.name, { ...candidate, tags: [...(candidate.tags ?? []), ...(source.tags ?? [])] }, nowIso)
        )
        .filter((item): item is AgiTimelineItem => Boolean(item))
        .slice(0, MAX_ITEMS_PER_SOURCE);
      incoming.push(...normalized);
    }
  }

  incoming.push(...getManualQuoteItems(nowIso));

  const merged = dedupeAndSort([...incoming, ...existing], MAX_STORED_ITEMS);
  await env.AGI_KV.put(WEB_ITEMS_KEY, JSON.stringify(merged));

  return {
    ok: errors.length === 0,
    pipeline: 'web',
    total_items: merged.length,
    fetched_new: incoming.length,
    errors
  };
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
    const body = (await response.text()).slice(0, 240);
    throw new Error(`X API ${response.status}: ${body}`);
  }

  return response.json<T>();
}

async function getXUser(handle: string, env: AgiEnv): Promise<{ id: string; username: string }> {
  const normalized = normalizeHandle(handle);
  const cacheKey = `${X_USER_CACHE_PREFIX}${normalized.toLowerCase()}`;
  const cached = await env.AGI_KV.get(cacheKey, 'json');

  if (
    cached &&
    typeof cached === 'object' &&
    'id' in cached &&
    'username' in cached &&
    typeof cached.id === 'string' &&
    typeof cached.username === 'string'
  ) {
    return { id: cached.id, username: cached.username };
  }

  const response = await xGet<XUserResponse>(
    env,
    `/users/by/username/${encodeURIComponent(normalized)}`,
    new URLSearchParams({ 'user.fields': 'id,username' })
  );
  if (!response.data?.id || !response.data.username) {
    throw new Error(`User lookup failed for @${normalized}`);
  }

  const user = { id: response.data.id, username: response.data.username };
  await env.AGI_KV.put(cacheKey, JSON.stringify(user));
  return user;
}

async function fetchXItemsForHandle(
  env: AgiEnv,
  handle: string,
  sinceId: string | null
): Promise<{ items: AgiTimelineItem[]; maxId: string | null }> {
  const user = await getXUser(handle, env);
  const params = new URLSearchParams({
    max_results: String(MAX_ITEMS_PER_REQUEST),
    'tweet.fields': 'created_at,entities'
  });
  if (sinceId) params.set('since_id', sinceId);

  const response = await xGet<XTweetsResponse>(env, `/users/${user.id}/tweets`, params);
  const tweets = response.data ?? [];
  let maxId: string | null = sinceId;

  const items = tweets.map((tweet) => {
    maxId = snowflakeMax(maxId, tweet.id);
    const tweetUrl = `https://x.com/${user.username}/status/${tweet.id}`;
    const text = trimText(tweet.text || '', 400);
    const title = trimText(text.split('\n')[0] || text, 160);
    const tags = (tweet.entities?.hashtags ?? [])
      .map((entry) => entry.tag)
      .filter((tag): tag is string => Boolean(tag))
      .slice(0, 8);

    return {
      id: `x:${tweet.id}`,
      source_name: 'X',
      title: title || `Post by @${user.username}`,
      date: toIsoDate(tweet.created_at) ?? new Date().toISOString(),
      summary: text || 'No summary available.',
      url: tweetUrl,
      tags: tags.length > 0 ? tags : inferTags(text),
      author_handle: user.username,
      tweet_url: tweetUrl
    };
  });

  return { items, maxId };
}

export async function syncAgiXTimeline(env: AgiEnv): Promise<AgiSyncResult> {
  if (!isXModuleEnabled(env)) {
    return { ok: true, pipeline: 'x', total_items: 0, fetched_new: 0, errors: [] };
  }
  if (!env.X_BEARER_TOKEN) {
    return {
      ok: false,
      pipeline: 'x',
      total_items: 0,
      fetched_new: 0,
      errors: ['AGI_X_ENABLED is true but X_BEARER_TOKEN is missing']
    };
  }

  const handles = [...new Set(AGI_HANDLES.map((handle) => normalizeHandle(handle)).filter(Boolean))];
  const existing = await readItemsFromKv(env, X_ITEMS_KEY);
  const incoming: AgiTimelineItem[] = [];
  const errors: string[] = [];

  for (const handle of handles) {
    const lastIdKey = `${X_LAST_ID_PREFIX}${handle.toLowerCase()}`;
    const sinceId = await env.AGI_KV.get(lastIdKey);

    try {
      const { items, maxId } = await fetchXItemsForHandle(env, handle, sinceId);
      incoming.push(...items);
      if (maxId) await env.AGI_KV.put(lastIdKey, maxId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`@${handle}: ${message}`);
    }
  }

  const merged = dedupeAndSort([...incoming, ...existing], MAX_STORED_ITEMS);
  await env.AGI_KV.put(X_ITEMS_KEY, JSON.stringify(merged));

  return {
    ok: errors.length === 0,
    pipeline: 'x',
    total_items: merged.length,
    fetched_new: incoming.length,
    errors
  };
}

export async function syncAllAgiPipelines(env: AgiEnv): Promise<AgiSyncResult> {
  const web = await syncAgiWebTimeline(env);
  const x = await syncAgiXTimeline(env);
  return {
    ok: web.ok && x.ok,
    pipeline: 'all',
    total_items: web.total_items + x.total_items,
    fetched_new: web.fetched_new + x.fetched_new,
    errors: [...web.errors, ...x.errors]
  };
}
