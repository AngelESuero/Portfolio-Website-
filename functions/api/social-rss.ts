import socialConfig from '../../src/data/social.json';

interface SocialConfigItem {
  slug: string;
  mode: 'rss' | 'manual';
  rss_url?: string;
}

interface FeedItem {
  title: string;
  url: string;
  date: string;
}

function decodeEntities(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('<![CDATA[', '')
    .replaceAll(']]>', '')
    .trim();
}

function stripHtml(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function pickTag(block: string, tags: string[]): string {
  for (const tag of tags) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = block.match(regex);
    if (match?.[1]) return stripHtml(match[1]);
  }
  return '';
}

function pickAtomLink(block: string): string {
  const hrefMatch = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (hrefMatch?.[1]) return decodeEntities(hrefMatch[1]);
  return pickTag(block, ['link']);
}

function parseRss(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  const rssItemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const atomEntryMatches = xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];

  rssItemMatches.forEach((block) => {
    const title = pickTag(block, ['title']);
    const url = pickTag(block, ['link', 'guid']);
    const date = pickTag(block, ['pubDate', 'dc:date', 'published', 'updated']);
    if (title && url) items.push({ title, url, date });
  });

  atomEntryMatches.forEach((block) => {
    const title = pickTag(block, ['title']);
    const url = pickAtomLink(block);
    const date = pickTag(block, ['published', 'updated', 'pubDate']);
    if (title && url) items.push({ title, url, date });
  });

  const dedupedByUrl = new Map<string, FeedItem>();
  items.forEach((item) => {
    if (!dedupedByUrl.has(item.url)) dedupedByUrl.set(item.url, item);
  });

  return Array.from(dedupedByUrl.values())
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
    .slice(0, 12);
}

export const onRequestGet: PagesFunction = async ({ request }) => {
  const slug = new URL(request.url).searchParams.get('slug')?.trim().toLowerCase() || '';
  const config = (socialConfig as SocialConfigItem[]).find((entry) => entry.slug === slug);

  if (!config) {
    return new Response(JSON.stringify({ ok: false, message: 'Unknown social slug', items: [] }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }

  if (config.mode !== 'rss' || !config.rss_url) {
    return new Response(JSON.stringify({ ok: true, message: 'RSS not configured for this platform', items: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' }
    });
  }

  try {
    const response = await fetch(config.rss_url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; SocialFeedRSS/1.0; +https://angel-suero.pages.dev)'
      }
    });

    if (!response.ok) {
      throw new Error(`RSS source returned ${response.status}`);
    }

    const xml = await response.text();
    const items = parseRss(xml);

    return new Response(JSON.stringify({ ok: true, items }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=900'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'RSS request failed';
    return new Response(JSON.stringify({ ok: false, message, items: [] }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=120'
      }
    });
  }
};
