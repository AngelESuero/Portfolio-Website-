import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const CHANNEL_URL = 'https://www.youtube.com/@a_e.s_4';
const CHANNEL_ID = 'UCQeJiBS72gxrZXw5GmqtocA';
const OUT_PATH = 'src/data/youtube.json';
const MAX_BUFFER = 1024 * 1024 * 128;

const SURFACES = [
  { key: 'videos', kind: 'video', url: `${CHANNEL_URL}/videos` },
  { key: 'streams', kind: 'stream', url: `${CHANNEL_URL}/streams` },
  { key: 'shorts', kind: 'short', url: `${CHANNEL_URL}/shorts` }
];

const PRINT_FORMAT =
  '{"id":%(id)j,"url":%(webpage_url)j,"title":%(title)j,"upload_date":%(upload_date)j,"timestamp":%(timestamp)j,"duration":%(duration)j,"duration_string":%(duration_string)j,"live_status":%(live_status)j,"thumbnail":%(thumbnail)j,"description":%(description)j,"view_count":%(view_count)j}';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function titleNeedsFallback(value) {
  const title = String(value || '').trim();
  return !title || title === '-';
}

function thumbFromId(videoId) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}

function pickLargestThumbnail(thumbnails = []) {
  const sorted = [...thumbnails].sort((a, b) => {
    const aArea = Number(a?.width || 0) * Number(a?.height || 0);
    const bArea = Number(b?.width || 0) * Number(b?.height || 0);
    return bArea - aArea;
  });

  return sorted[0]?.url || null;
}

function toIsoFromUploadDate(uploadDate) {
  const raw = String(uploadDate || '').trim();
  if (!/^\d{8}$/.test(raw)) return null;
  const year = Number(raw.slice(0, 4));
  const month = Number(raw.slice(4, 6)) - 1;
  const day = Number(raw.slice(6, 8));
  return new Date(Date.UTC(year, month, day)).toISOString();
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;

  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function fallbackTitle(kind, publishedAt, videoId) {
  const kindLabel = kind === 'short' ? 'Short' : kind === 'stream' ? 'Stream' : 'Video';
  const dateLabel = publishedAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(new Date(publishedAt))
    : videoId;

  return `Untitled ${kindLabel} · ${dateLabel}`;
}

function normalizeTitle(title, kind, publishedAt, videoId) {
  return titleNeedsFallback(title) ? fallbackTitle(kind, publishedAt, videoId) : String(title).trim();
}

function normalizeDescription(description) {
  return String(description || '').replace(/\r\n/g, '\n').trim();
}

function seriesTags(title = '', kind = 'video') {
  const lower = title.toLowerCase();
  const tags = [];

  if (kind === 'short') tags.push('Shorts');
  if (kind === 'stream') tags.push('Streams');
  if (kind === 'video') tags.push('Uploads');
  if (lower.includes('road to')) tags.push('Road To');
  if (lower.includes('sparking')) tags.push('Sparking');
  if (lower.includes('papa')) tags.push('Papa');
  if (lower.includes('destiny')) tags.push('Destiny');
  if (lower.includes('sifu')) tags.push('Sifu');

  return [...new Set(tags)];
}

function parseJsonLines(stdout) {
  return String(stdout || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('{') && line.endsWith('}'))
    .map((line) => JSON.parse(line));
}

function normalizeUrl(surfaceKey, inventoryUrl, metadataUrl, videoId) {
  if (surfaceKey === 'shorts') {
    if (inventoryUrl?.includes('/shorts/')) return inventoryUrl;
    return videoId ? `https://www.youtube.com/shorts/${videoId}` : metadataUrl || inventoryUrl || '';
  }

  return metadataUrl || inventoryUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '');
}

async function runYtDlp(args) {
  try {
    const { stdout } = await execFileAsync(
      'uvx',
      ['--from', 'yt-dlp', 'yt-dlp', ...args],
      {
        maxBuffer: MAX_BUFFER
      }
    );

    return stdout;
  } catch (error) {
    if (args.includes('--ignore-errors') && typeof error?.stdout === 'string' && error.stdout.trim()) {
      return error.stdout;
    }

    throw error;
  }
}

async function readExisting() {
  try {
    const raw = await readFile(OUT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function existingIndex(existing) {
  return new Map(
    (existing?.items || [])
      .filter((item) => item?.videoId)
      .map((item) => [item.videoId, item])
  );
}

async function fetchSurfaceInventory(surface) {
  const stdout = await runYtDlp(['--ignore-errors', '--no-warnings', '--flat-playlist', '-J', surface.url]);
  const parsed = JSON.parse(stdout);
  return Array.isArray(parsed.entries) ? parsed.entries : [];
}

async function fetchSurfaceMetadata(surface) {
  const stdout = await runYtDlp([
    '--ignore-errors',
    '--no-warnings',
    '--skip-download',
    '--print',
    PRINT_FORMAT,
    surface.url
  ]);

  return new Map(parseJsonLines(stdout).map((item) => [item.id, item]));
}

function normalizeSurfaceItem(surface, inventoryItem, metadataItem, existingItem) {
  const videoId = inventoryItem?.id || metadataItem?.id || existingItem?.videoId || '';
  const publishedAt =
    (metadataItem?.timestamp ? new Date(metadataItem.timestamp * 1000).toISOString() : null) ||
    toIsoFromUploadDate(metadataItem?.upload_date) ||
    existingItem?.publishedAt ||
    null;

  const title = normalizeTitle(
    metadataItem?.title || inventoryItem?.title || existingItem?.title,
    surface.kind,
    publishedAt,
    videoId
  );

  const duration =
    metadataItem?.duration_string ||
    formatDuration(metadataItem?.duration) ||
    formatDuration(inventoryItem?.duration) ||
    existingItem?.duration ||
    null;

  return {
    id: sha256(`yt|${videoId}`),
    title,
    url: normalizeUrl(surface.key, inventoryItem?.url, metadataItem?.url, videoId),
    videoId,
    publishedAt,
    series: seriesTags(title, surface.kind),
    thumbnailUrl:
      metadataItem?.thumbnail ||
      pickLargestThumbnail(inventoryItem?.thumbnails) ||
      existingItem?.thumbnailUrl ||
      thumbFromId(videoId),
    kind: surface.kind,
    surface: surface.key,
    surfaces: [surface.key],
    description: normalizeDescription(metadataItem?.description || inventoryItem?.description || existingItem?.description),
    duration,
    liveStatus: metadataItem?.live_status || inventoryItem?.live_status || existingItem?.liveStatus || null,
    viewCount:
      typeof metadataItem?.view_count === 'number'
        ? metadataItem.view_count
        : typeof inventoryItem?.view_count === 'number'
          ? inventoryItem.view_count
          : existingItem?.viewCount ?? null
  };
}

function mergeCatalogItem(itemsByVideoId, nextItem) {
  if (!nextItem.videoId || !nextItem.url) return;

  const existing = itemsByVideoId.get(nextItem.videoId);
  if (!existing) {
    itemsByVideoId.set(nextItem.videoId, nextItem);
    return;
  }

  existing.surfaces = [...new Set([...(existing.surfaces || [existing.surface]), nextItem.surface])];
  existing.surface = existing.surface || nextItem.surface;
  existing.kind = existing.kind || nextItem.kind;
  existing.publishedAt = existing.publishedAt || nextItem.publishedAt;
  existing.duration = existing.duration || nextItem.duration;
  existing.description = existing.description || nextItem.description;
  existing.thumbnailUrl = existing.thumbnailUrl || nextItem.thumbnailUrl;
  existing.liveStatus = existing.liveStatus || nextItem.liveStatus;
  existing.viewCount = existing.viewCount ?? nextItem.viewCount ?? null;
}

async function main() {
  const existing = await readExisting();
  const existingByVideoId = existingIndex(existing);
  const itemsByVideoId = new Map();
  const counts = {};

  for (const surface of SURFACES) {
    const inventory = await fetchSurfaceInventory(surface);
    const metadataById = await fetchSurfaceMetadata(surface);
    counts[surface.key] = inventory.length;

    for (const inventoryItem of inventory) {
      const videoId = inventoryItem?.id;
      const metadataItem = metadataById.get(videoId);
      const existingItem = existingByVideoId.get(videoId);
      const normalized = normalizeSurfaceItem(surface, inventoryItem, metadataItem, existingItem);
      mergeCatalogItem(itemsByVideoId, normalized);
    }
  }

  const items = [...itemsByVideoId.values()]
    .filter((item) => item.videoId && item.url)
    .sort((a, b) => {
      const left = a.publishedAt || '';
      const right = b.publishedAt || '';
      return right.localeCompare(left) || a.title.localeCompare(b.title);
    });

  const out = {
    meta: {
      schemaVersion: 2,
      generatedAt: new Date().toISOString(),
      channelUrl: CHANNEL_URL,
      channelId: CHANNEL_ID,
      source: 'youtube-public-channel',
      surfaces: Object.fromEntries(SURFACES.map((surface) => [surface.key, surface.url])),
      counts,
      totalItems: items.length
    },
    items
  };

  await writeFile(OUT_PATH, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
