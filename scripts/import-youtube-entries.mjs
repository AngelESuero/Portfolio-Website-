import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const FEED_PATH = 'src/data/youtube.json';
const OUT_DIR = 'src/content/entries/video';
const FORCE = process.argv.includes('--force');
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@a_e.s_4';

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
const escapeMdxText = (value = '') => String(value).replace(/[{}<>]/g, '\\$&');

const humanTime = (value) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC'
  }).format(value);

const titleKind = (title = '', kind = 'video') => {
  const lower = title.toLowerCase();
  if (kind === 'short') return 'short';
  if (kind === 'stream') return 'stream';
  if (lower.includes('road to')) return 'road';
  if (lower.includes('sparking') || lower.includes('bots')) return 'sparking';
  if (lower.includes('papa')) return 'papa';
  if (lower.includes('yo!')) return 'short-note';
  return 'generic';
};

const tagsFor = (item) => {
  const title = item.title || '';
  const lower = title.toLowerCase();
  const tags = ['video', 'youtube'];

  if (item.kind === 'stream') {
    tags.push('stream', 'livestream');
  }

  if (item.kind === 'short') {
    tags.push('short', 'short-form');
  }

  if (lower.includes('road to')) {
    tags.push('gaming', 'ranked');
  }

  if (lower.includes('sparking') || lower.includes('bots')) {
    tags.push('gaming', 'sparking');
  }

  if (lower.includes('papa')) {
    tags.push('papa', 'short-form');
  }

  if (lower.includes('destiny')) {
    tags.push('gaming', 'destiny-2');
  }

  if (lower.includes('sifu')) {
    tags.push('gaming', 'sifu');
  }

  if (lower.includes('dbz') || lower.includes('dragon ball')) {
    tags.push('gaming', 'dragon-ball');
  }

  if (lower.includes('yo!')) {
    tags.push('short-form');
  }

  return [...new Set(tags)];
};

const meaningfulDescription = (value = '') => {
  const description = String(value || '').replace(/\s+/g, ' ').trim();
  if (!description) return '';
  if (description.toLowerCase() === 'with angel!') return '';
  if (description.length < 18) return '';
  return description;
};

const summaryFor = (item) => {
  switch (titleKind(item.title, item.kind)) {
    case 'stream':
      return 'A public livestream replay preserved in the archive as part of the channel record.';
    case 'short':
      return 'A public YouTube short preserved in the archive as part of the channel record.';
    case 'short-note':
      return 'A short YouTube note preserved in the archive as a quick record from the channel.';
    case 'road':
      return 'A ranked-match upload preserved in the archive as part of the Road To run.';
    case 'sparking':
      return 'A channel session from the Sparking lane, kept as a video record.';
    case 'papa':
      return 'A Papa clip filed as a short-form archive record.';
    default:
      return 'A YouTube upload preserved in the archive as part of the living video record.';
  }
};

const bodyFor = (item) => {
  const published = item.publishedAt ? humanTime(new Date(item.publishedAt)) : null;
  const title = escapeMdxText(item.title || 'this upload');
  const description = meaningfulDescription(item.description);
  const recordedTime = published ? `Published ${published} UTC.` : 'The public channel metadata did not expose an exact publish time here.';
  const durationLine = item.duration ? `Runtime: ${item.duration}.` : '';
  const descriptionLine = description ? `Channel note: ${escapeMdxText(description)}` : '';

  switch (titleKind(item.title, item.kind)) {
    case 'stream':
      return [
        `Filed here from the public channel so ${title} stays readable as part of the archive, not only as a livestream replay on YouTube.`,
        '',
        [recordedTime, durationLine, descriptionLine].filter(Boolean).join(' ')
      ].join('\n');
    case 'short':
      return [
        `Filed here from the public channel so ${title} can live inside the archive as a short-form record, not only as a platform post.`,
        '',
        [recordedTime, durationLine, descriptionLine].filter(Boolean).join(' ')
      ].join('\n');
    case 'short-note':
      return [
        `Filed here from the public channel so ${title} stays easy to browse inside the archive.`,
        '',
        [recordedTime, durationLine, descriptionLine].filter(Boolean).join(' ')
      ].join('\n');
    case 'road':
      return [
        `Filed here from the public channel so ${title} can be read as part of the archive, not only as a YouTube upload.`,
        '',
        [recordedTime, 'The repeated title marks this as one stop in a longer ranked-match sequence.', durationLine, descriptionLine]
          .filter(Boolean)
          .join(' ')
      ].join('\n');
    case 'sparking':
      return [
        `Filed here from the public channel so ${title} stays visible inside the archive as a real record.`,
        '',
        [recordedTime, 'It belongs to the Sparking lane and sits beside the rest of the video archive rather than only the channel timeline.', durationLine, descriptionLine]
          .filter(Boolean)
          .join(' ')
      ].join('\n');
    case 'papa':
      return [
        `Filed here from the public channel so ${title} lives alongside the rest of the archive.`,
        '',
        [recordedTime, 'It reads like a short-form record rather than a long project page.', durationLine, descriptionLine]
          .filter(Boolean)
          .join(' ')
      ].join('\n');
    default:
      return [
        `Filed here from the public channel so ${title} remains readable as archive material.`,
        '',
        [recordedTime, durationLine, descriptionLine].filter(Boolean).join(' ')
      ].join('\n');
  }
};

const parseFrontmatterUrl = (content) => {
  const match = content.match(/^external_url:\s*(?:"([^"]+)"|'([^']+)')\s*$/m);
  return match?.[1] || match?.[2] || '';
};

const parseFrontmatterSourceId = (content) => {
  const match = content.match(/^\s*source_id:\s*(?:"([^"]+)"|'([^']+)'|([^\n]+))\s*$/m);
  return match?.[1] || match?.[2] || match?.[3]?.trim() || '';
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
  const sourceIds = new Set();
  const slugs = new Set();

  for (const entry of existingFiles) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
    const filePath = path.join(OUT_DIR, entry.name);
    const content = await readFile(filePath, 'utf8');
    const externalUrl = parseFrontmatterUrl(content);
    const sourceId = parseFrontmatterSourceId(content);
    if (externalUrl) urls.add(externalUrl);
    if (sourceId) sourceIds.add(sourceId);
    slugs.add(entry.name.replace(/\.mdx$/, ''));
  }

  return { urls, sourceIds, slugs };
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
  const { urls: existingUrls, sourceIds: existingSourceIds, slugs: existingSlugs } = await readExistingState();

  for (const item of items) {
    if (!item?.videoId || !item?.url) continue;

    if (!FORCE && (existingUrls.has(item.url) || existingSourceIds.has(item.videoId))) {
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
      `tags: ${JSON.stringify(tagsFor(item))}`,
      `summary: ${quote(summaryFor(item))}`,
      `external_url: ${quote(item.url)}`,
      `thumbnail: ${quote(item.thumbnailUrl || '')}`,
      ...(item.duration ? [`duration: ${quote(item.duration)}`] : []),
      'ingest:',
      '  mode: channel',
      `  catalog_url: ${quote(feed.meta?.surfaces?.[item.surface] || feed.meta?.channelUrl || YOUTUBE_CHANNEL_URL)}`,
      `  surface: ${quote(item.surface || item.kind || 'videos')}`,
      `  source_id: ${quote(item.videoId)}`,
      '---'
    ].join('\n');

    const body = `${bodyFor(item)}\n`;
    await writeFile(filePath, `${frontmatter}\n\n${body}`, 'utf8');
    existingSlugs.add(slug);
    existingUrls.add(item.url);
    existingSourceIds.add(item.videoId);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
