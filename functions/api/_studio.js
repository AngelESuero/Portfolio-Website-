export const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

export const entryMediums = new Set(['writing', 'music', 'video', 'image', 'note', 'proposal']);
export const mediaMediums = new Set(['music', 'video', 'image']);
export const entrySources = new Set(['substack', 'youtube', 'untitled', 'local-media', 'private-notes', 'manual', 'linktree']);
export const entryStatuses = new Set(['raw', 'withheld', 'in-progress', 'published', 'featured']);
export const assetTypes = new Set(['audio', 'video', 'image']);
export const uploadSources = new Set(['r2', 'external']);

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders
  });
}

export function isJsonRequest(request) {
  return request.headers.get('content-type')?.toLowerCase().includes('application/json') ?? false;
}

export async function readPayload(request) {
  if (isJsonRequest(request)) {
    const body = await request.json().catch(() => ({}));
    return /** @type {Record<string, unknown>} */ (body);
  }

  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export function pickFirst(raw, keys) {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'string' && value.trim()) return value;
    if (typeof value === 'number') return String(value);
  }

  return '';
}

export function normalizeSingleLine(value, max = 400) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function normalizeMultiline(value, max = 20000) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, max);
}

export function parseList(value, { lowerCase = false, hyphenateSpaces = false } = {}) {
  const seen = new Set();
  return String(value ?? '')
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (lowerCase ? item.toLowerCase() : item))
    .map((item) => (hyphenateSpaces ? item.replace(/\s+/g, '-') : item))
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function parsePositiveInteger(value) {
  const normalized = String(value ?? '').trim();
  if (!normalized) return null;
  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function slugify(value) {
  const slug = String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug || 'untitled-entry';
}

export function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

export function encodeContentPath(pathname) {
  return pathname
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export function toBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const slice = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...slice);
  }

  return btoa(binary);
}

export function detectSourceFromUrl(urlValue) {
  if (!urlValue) return 'manual';

  try {
    const url = new URL(urlValue);
    const host = url.hostname.toLowerCase();

    if (host === 'youtu.be' || host.includes('youtube.com')) return 'youtube';
    if (host.includes('substack.com')) return 'substack';
    if (host.includes('untitled.stream')) return 'untitled';
    if (host.includes('linktr.ee') || host.includes('linktree')) return 'linktree';
  } catch {}

  return 'manual';
}

export function deriveSummary(summary, body, title) {
  const cleanSummary = normalizeSingleLine(summary, 420);
  if (cleanSummary) return cleanSummary;

  const cleanBody = normalizeSingleLine(String(body || '').replace(/\s+/g, ' '), 420);
  if (cleanBody) {
    return cleanBody.length > 200 ? `${cleanBody.slice(0, 197).trimEnd()}...` : cleanBody;
  }

  return `${normalizeSingleLine(title, 180)} archive entry`;
}

export function getAssetTypeFromMedium(medium) {
  if (medium === 'music') return 'audio';
  if (medium === 'video') return 'video';
  if (medium === 'image') return 'image';
  return '';
}

export function buildMdxFile(payload) {
  const lines = [
    '---',
    `title: ${yamlString(payload.title)}`,
    `date: ${payload.date}`,
    `medium: ${payload.medium}`,
    `source: ${payload.source}`,
    `status: ${payload.status}`,
    `tags: ${JSON.stringify(payload.tags)}`,
    `summary: ${yamlString(payload.summary)}`
  ];

  if (payload.externalUrl) {
    lines.push(`external_url: ${yamlString(payload.externalUrl)}`);
  }

  if (payload.relatedEntries.length > 0) {
    lines.push('related_entries:');
    payload.relatedEntries.forEach((entry) => {
      lines.push(`  - ${yamlString(entry)}`);
    });
  }

  if (payload.medium === 'proposal') {
    if (payload.audience) lines.push(`audience: ${yamlString(payload.audience)}`);
    if (payload.institution) lines.push(`institution: ${yamlString(payload.institution)}`);
    if (payload.proposalStatus) lines.push(`proposal_status: ${yamlString(payload.proposalStatus)}`);
    if (payload.place) lines.push(`place: ${yamlString(payload.place)}`);
    if (payload.ask) lines.push(`ask: ${yamlString(payload.ask)}`);
  }

  if (payload.assetSrc) {
    lines.push('asset:');
    lines.push(`  src: ${yamlString(payload.assetSrc)}`);
    lines.push(`  alt: ${yamlString(payload.assetAlt || payload.title)}`);
  }

  if (payload.assetType) lines.push(`asset_type: ${yamlString(payload.assetType)}`);
  if (payload.originalFilename) lines.push(`original_filename: ${yamlString(payload.originalFilename)}`);
  if (payload.mimeType) lines.push(`mime_type: ${yamlString(payload.mimeType)}`);
  if (typeof payload.fileSize === 'number') lines.push(`file_size: ${payload.fileSize}`);
  if (payload.uploadSource) lines.push(`upload_source: ${yamlString(payload.uploadSource)}`);

  lines.push('---', '');

  if (payload.body) {
    lines.push(payload.body, '');
  }

  return `${lines.join('\n')}`;
}

export async function githubRequest(env, pathname, init = {}) {
  const token = String(env.GITHUB_TOKEN || '').trim();

  return fetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'studio-entry-writer',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {})
    }
  });
}

export function parseRepo(value) {
  const [owner, repo] = String(value || '').trim().split('/');
  if (!owner || !repo) return null;
  return { owner, repo };
}

export function normalizePublicBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}
