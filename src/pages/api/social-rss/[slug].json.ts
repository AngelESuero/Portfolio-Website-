import Parser from 'rss-parser';
import type { APIRoute, GetStaticPaths } from 'astro';
import socialConfig from '../../../data/social';

export const prerender = true;

const parser = new Parser();
const rssConfigs = socialConfig.filter(
  (item): item is (typeof socialConfig)[number] & { rss_url: string } =>
    item.mode === 'rss' && typeof item.rss_url === 'string' && item.rss_url.length > 0
);

const buildPayload = async (slug: string) => {
  const config = rssConfigs.find((item) => item.slug === slug);
  if (!config) {
    return {
      status: 404,
      body: {
        slug,
        items: [],
        message: 'Feed not found.'
      }
    };
  }

  try {
    const feed = await parser.parseURL(config.rss_url);
    const items = (feed.items ?? [])
      .map((item) => ({
        title: item.title ?? '',
        url: item.link ?? '',
        date: item.isoDate ?? item.pubDate ?? ''
      }))
      .filter((item) => item.url)
      .slice(0, 8);

    return {
      status: 200,
      body: {
        slug,
        title: config.title,
        items,
        message: items.length ? '' : 'No recent items available.'
      }
    };
  } catch {
    return {
      status: 200,
      body: {
        slug,
        title: config.title,
        items: [],
        message: 'Could not load feed right now.'
      }
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () =>
  rssConfigs.map((item) => ({
    params: { slug: item.slug }
  }));

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug ?? '';
  const payload = await buildPayload(slug);

  return new Response(JSON.stringify(payload.body), {
    status: payload.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=900'
    }
  });
};
