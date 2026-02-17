import type { APIRoute } from 'astro';
import Parser from 'rss-parser';

export const prerender = true;

const FEEDS = {
  substack: 'https://aesarchive.substack.com/feed'
} as const;

type FeedSlug = keyof typeof FEEDS;

interface FeedItem {
  title: string;
  url: string;
  date?: string;
}

const parser = new Parser();

const toIsoOrNull = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString();
};

const json = (body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=900'
    }
  });

export const GET: APIRoute = async ({ url }) => {
  const slugParam = url.searchParams.get('slug') || 'substack';
  const slug = (slugParam in FEEDS ? slugParam : 'substack') as FeedSlug;
  const feedUrl = FEEDS[slug];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const xml = await fetch(feedUrl, { signal: controller.signal }).then((response) => {
      if (!response.ok) {
        throw new Error(`Feed request failed with ${response.status}`);
      }
      return response.text();
    });

    const feed = await parser.parseString(xml);
    const items: FeedItem[] = (feed.items || []).slice(0, 8).map((item) => ({
      title: item.title || 'Untitled post',
      url: item.link || feedUrl,
      date: toIsoOrNull(item.isoDate || item.pubDate || undefined)
    }));

    return json({
      slug,
      items,
      message: items.length ? `Showing ${items.length} latest item${items.length === 1 ? '' : 's'}.` : 'No recent items available.'
    });
  } catch {
    return json({
      slug,
      items: [],
      message: 'Could not load feed right now.'
    });
  } finally {
    clearTimeout(timeout);
  }
};
