const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

const entryMediums = new Set(['writing', 'music', 'video', 'image', 'note', 'proposal']);
const entrySources = new Set(['substack', 'youtube', 'untitled', 'local-media', 'private-notes', 'manual', 'linktree']);
const entryStatuses = new Set(['raw', 'withheld', 'in-progress', 'published', 'featured']);

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders
  });
}

function isJsonRequest(request) {
  return request.headers.get('content-type')?.toLowerCase().includes('application/json') ?? false;
}

function normalizeSingleLine(value, max = 400) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function normalizeMultiline(value, max = 20000) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, max);
}

function parseList(value, { lowerCase = false, hyphenateSpaces = false } = {}) {
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

function slugify(value) {
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

function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function encodeContentPath(pathname) {
  return pathname
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function toBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const slice = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...slice);
  }

  return btoa(binary);
}

function detectSourceFromUrl(urlValue) {
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

function buildMdxFile(payload) {
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

  lines.push('---', '');

  if (payload.body) {
    lines.push(payload.body, '');
  }

  return `${lines.join('\n')}`;
}

async function readPayload(request) {
  if (isJsonRequest(request)) {
    const body = await request.json().catch(() => ({}));
    return /** @type {Record<string, unknown>} */ (body);
  }

  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

async function githubRequest(env, pathname, init = {}) {
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

function parseRepo(value) {
  const [owner, repo] = String(value || '').trim().split('/');
  if (!owner || !repo) return null;
  return { owner, repo };
}

export async function onRequestPost({ request, env }) {
  const studioPassword = String(env.STUDIO_PASSWORD || '').trim();
  const githubToken = String(env.GITHUB_TOKEN || '').trim();
  const githubRepo = parseRepo(env.GITHUB_REPO);
  const githubBranch = String(env.GITHUB_BRANCH || 'main').trim() || 'main';

  if (!studioPassword || !githubToken || !githubRepo) {
    return jsonResponse(
      {
        ok: false,
        message: 'Studio authoring is not configured. Set STUDIO_PASSWORD, GITHUB_TOKEN, and GITHUB_REPO in Cloudflare.'
      },
      503
    );
  }

  const raw = await readPayload(request);
  const password = normalizeSingleLine(raw.password, 200);

  if (!password || password !== studioPassword) {
    return jsonResponse({ ok: false, message: 'Invalid studio password.' }, 401);
  }

  const title = normalizeSingleLine(raw.title, 180);
  const date = normalizeSingleLine(raw.date, 20);
  const medium = normalizeSingleLine(raw.medium, 40);
  const externalUrl = normalizeSingleLine(raw.external_url, 2000);
  const sourceInput = normalizeSingleLine(raw.source, 40);
  const source = sourceInput || detectSourceFromUrl(externalUrl);
  const status = normalizeSingleLine(raw.status, 40);
  const summary = normalizeSingleLine(raw.summary, 420);
  const tags = parseList(raw.tags, { lowerCase: true, hyphenateSpaces: true });
  const relatedEntries = parseList(raw.related_entries);
  const audience = normalizeSingleLine(raw.audience, 260);
  const institution = normalizeSingleLine(raw.institution, 260);
  const proposalStatus = normalizeSingleLine(raw.proposal_status, 160);
  const place = normalizeSingleLine(raw.place, 160);
  const ask = normalizeSingleLine(raw.ask, 600);
  const body = normalizeMultiline(raw.body, 30000);

  if (!title || !date || !medium || !status || !summary) {
    return jsonResponse({ ok: false, message: 'Missing required fields.' }, 400);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return jsonResponse({ ok: false, message: 'Date must use YYYY-MM-DD.' }, 400);
  }

  if (!entryMediums.has(medium)) {
    return jsonResponse({ ok: false, message: 'Invalid lane / medium.' }, 400);
  }

  if (!entrySources.has(source)) {
    return jsonResponse({ ok: false, message: 'Invalid source.' }, 400);
  }

  if (!entryStatuses.has(status)) {
    return jsonResponse({ ok: false, message: 'Invalid status.' }, 400);
  }

  if (externalUrl) {
    try {
      new URL(externalUrl);
    } catch {
      return jsonResponse({ ok: false, message: 'External URL must be a valid absolute URL.' }, 400);
    }
  }

  const slug = slugify(title);
  const filePath = `src/content/entries/${medium}/${slug}.mdx`;
  const mdx = buildMdxFile({
    title,
    date,
    medium,
    source,
    status,
    tags,
    summary,
    externalUrl,
    relatedEntries,
    audience,
    institution,
    proposalStatus,
    place,
    ask,
    body
  });

  const encodedRepo = `${encodeURIComponent(githubRepo.owner)}/${encodeURIComponent(githubRepo.repo)}`;
  const encodedFilePath = encodeContentPath(filePath);
  const fileLookupResponse = await githubRequest(
    env,
    `/repos/${encodedRepo}/contents/${encodedFilePath}?ref=${encodeURIComponent(githubBranch)}`
  );

  if (fileLookupResponse.ok) {
    return jsonResponse(
      {
        ok: false,
        message: `An entry already exists at ${filePath}. Change the title or rename the file after commit.`
      },
      409
    );
  }

  if (fileLookupResponse.status !== 404) {
    const errorText = await fileLookupResponse.text();
    return jsonResponse(
      {
        ok: false,
        message: `GitHub could not verify the target file path. ${errorText || 'Try again.'}`
      },
      502
    );
  }

  const createResponse = await githubRequest(env, `/repos/${encodedRepo}/contents/${encodedFilePath}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      message: `Create ${medium} entry: ${title}`,
      branch: githubBranch,
      content: toBase64(mdx)
    })
  });

  const createPayload = await createResponse.json().catch(() => null);

  if (!createResponse.ok) {
    const message =
      createPayload?.message ||
      `GitHub commit failed with status ${createResponse.status}.`;
    return jsonResponse({ ok: false, message }, 502);
  }

  return jsonResponse({
    ok: true,
    message: `Entry committed to ${githubBranch}. It will appear after the Cloudflare rebuild completes.`,
    branch: githubBranch,
    slug,
    filePath,
    commitSha: createPayload?.commit?.sha || '',
    commitUrl: createPayload?.commit?.html_url || '',
    contentUrl: createPayload?.content?.html_url || ''
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      ...jsonHeaders,
      allow: 'POST, OPTIONS'
    }
  });
}
