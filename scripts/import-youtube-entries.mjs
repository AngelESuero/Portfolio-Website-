import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const FEED_PATH = 'src/data/youtube.json';
const OUT_DIR = 'src/content/entries/video';
const FORCE = process.argv.includes('--force');
const YOUTUBE_FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCQeJiBS72gxrZXw5GmqtocA';

const slugify = (value = '') =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const quote = (value) => JSON.stringify(value);

const humanTime = (value) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC'
  }).format(value);

const titleKind = (title = '') => {
  const lower = title.toLowerCase();
  if (lower.includes('road to')) return 'road';
  if (lower.includes('sparking') || lower.includes('bots')) return 'sparking';
  if (lower.includes('papa')) return 'papa';
  if (lower.includes('yo!')) return 'short';
  return 'generic';
};

const tagsFor = (title = '') => {
  const lower = title.toLowerCase();
  const tags = ['video', 'youtube'];

  if (lower.includes('road to')) {
    tags.push('gaming', 'ranked');
  }

  if (lower.includes('sparking') || lower.includes('bots')) {
    tags.push('gaming', 'sparking');
  }

  if (lower.includes('papa')) {
    tags.push('papa', 'short-form');
  }

  if (lower.includes('yo!')) {
    tags.push('short-form');
  }

  return [...new Set(tags)];
};

const summaryFor = (item) => {
  switch (titleKind(item.title)) {
    case 'road':
      return 'A ranked-match upload preserved in the archive as part of the Road To run.';
    case 'sparking':
      return 'A channel session from the Sparking lane, kept as a video record.';
    case 'papa':
      return 'A Papa clip filed as a short-form archive record.';
    case 'short':
      return 'A short YouTube note preserved as a quick archive record.';
    default:
      return 'A YouTube upload preserved in the archive as part of the living video record.';
  }
};

const bodyFor = (item) => {
  const published = item.publishedAt ? humanTime(new Date(item.publishedAt)) : 'an unknown time';
  const title = item.title || 'this upload';

  switch (titleKind(item.title)) {
    case 'road':
      return [
        `Filed here from the channel feed so ${title} can be read as part of the archive, not only as a YouTube upload.`,
        '',
        `Published ${published} UTC. The repeated title marks this as one stop in a longer ranked-match sequence.`
      ].join('\n');
    case 'sparking':
      return [
        `Filed here from the channel feed so ${title} stays visible inside the archive as a real record.`,
        '',
        `Published ${published} UTC. It belongs to the Sparking lane and sits beside the rest of the video archive rather than only the channel timeline.`
      ].join('\n');
    case 'papa':
      return [
        `Filed here from the channel feed so ${title} lives alongside the rest of the archive.`,
        '',
        `Published ${published} UTC. It reads like a short-form record rather than a long project page.`
      ].join('\n');
    case 'short':
      return [
        `Filed here from the channel feed so ${title} stays easy to browse inside the archive.`,
        '',
        `Published ${published} UTC. The clip works as a quick channel marker, not a full release.`
      ].join('\n');
    default:
      return [
        `Filed here from the channel feed so ${title} remains readable as archive material.`,
        '',
        `Published ${published} UTC.`
      ].join('\n');
  }
};

const parseFrontmatterUrl = (content) => {
  const match = content.match(/^external_url:\s*(?:"([^"]+)"|'([^']+)')\s*$/m);
  return match?.[1] || match?.[2] || '';
};

const fileExists = async (target) => {
  try {
    await readFile(target, 'utf8');
    return true;
  } catch {
    return false;
  }
};

async function readExistingState() {
  const existingFiles = await readdir(OUT_DIR, { withFileTypes: true });
  const urls = new Set();
  const slugs = new Set();

  for (const entry of existingFiles) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
    const filePath = path.join(OUT_DIR, entry.name);
    const content = await readFile(filePath, 'utf8');
    const externalUrl = parseFrontmatterUrl(content);
    if (externalUrl) urls.add(externalUrl);
    slugs.add(entry.name.replace(/\.mdx$/, ''));
  }

  return { urls, slugs };
}

function uniqueSlug(item, existingSlugs) {
  const base = slugify(item.title) || item.videoId?.toLowerCase() || 'youtube-video';
  if (!existingSlugs.has(base)) return base;

  const id = item.videoId?.toLowerCase() || 'video';
  const candidates = [base, `${base}-${id}`];
  const datePart = item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : '';
  if (datePart) {
    candidates.push(`${base}-${datePart}-${id}`);
  }

  for (const candidate of candidates) {
    if (!existingSlugs.has(candidate)) return candidate;
  }

  return `${base}-${id}-${Math.random().toString(36).slice(2, 8)}`;
}

async function main() {
  const feed = JSON.parse(await readFile(FEED_PATH, 'utf8'));
  const items = Array.isArray(feed.items) ? feed.items : [];
  const { urls: existingUrls, slugs: existingSlugs } = await readExistingState();

  for (const item of items) {
    if (!item?.videoId || !item?.url) continue;

    if (!FORCE && existingUrls.has(item.url)) {
      continue;
    }

    const slug = uniqueSlug(item, existingSlugs);
    const filePath = path.join(OUT_DIR, `${slug}.mdx`);
    if (!FORCE && (await fileExists(filePath))) {
      continue;
    }

    const date = item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    const frontmatter = [
      '---',
      `title: ${quote(item.title || 'Untitled')}`,
      `date: ${date}`,
      'medium: video',
      'source: youtube',
      'status: published',
      `tags: ${JSON.stringify(tagsFor(item.title || ''))}`,
      `summary: ${quote(summaryFor(item))}`,
      `external_url: ${quote(item.url)}`,
      `thumbnail: ${quote(item.thumbnailUrl || '')}`,
      'ingest:',
      '  mode: rss',
      `  rss_url: ${quote(feed.meta?.feedUrl || YOUTUBE_FEED_URL)}`,
      `  source_id: ${quote(item.videoId)}`,
      '---'
    ].join('\n');

    const body = `${bodyFor(item)}\n`;
    await writeFile(filePath, `${frontmatter}\n\n${body}`, 'utf8');
    existingSlugs.add(slug);
    existingUrls.add(item.url);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
