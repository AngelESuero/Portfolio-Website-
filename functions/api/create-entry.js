import {
  assetTypes,
  buildMdxFile,
  deriveSummary,
  detectSourceFromUrl,
  encodeContentPath,
  entryMediums,
  entrySources,
  entryStatuses,
  getAssetTypeFromMedium,
  githubRequest,
  jsonHeaders,
  jsonResponse,
  mediaMediums,
  normalizeMultiline,
  normalizeSingleLine,
  parseList,
  parsePositiveInteger,
  parseRepo,
  pickFirst,
  readPayload,
  slugify,
  toBase64,
  uploadSources
} from './_studio.js';

function isAbsoluteHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
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
  const password = normalizeSingleLine(pickFirst(raw, ['password']), 200);

  if (!password || password !== studioPassword) {
    return jsonResponse({ ok: false, message: 'Invalid studio password.' }, 401);
  }

  const title = normalizeSingleLine(pickFirst(raw, ['title']), 180);
  const date = normalizeSingleLine(pickFirst(raw, ['date']), 20);
  const medium = normalizeSingleLine(pickFirst(raw, ['medium', 'lane']), 40);
  const externalUrl = normalizeSingleLine(pickFirst(raw, ['external_url', 'externalUrl']), 2000);
  const sourceInput = normalizeSingleLine(pickFirst(raw, ['source']), 40);
  const status = normalizeSingleLine(pickFirst(raw, ['status']), 40);
  const body = normalizeMultiline(pickFirst(raw, ['body']), 30000);
  const summary = deriveSummary(pickFirst(raw, ['summary']), body, title);
  const tags = parseList(pickFirst(raw, ['tags']), { lowerCase: true, hyphenateSpaces: true });
  const relatedEntries = parseList(pickFirst(raw, ['related_entries', 'relatedEntries']));
  const audience = normalizeSingleLine(pickFirst(raw, ['audience']), 260);
  const institution = normalizeSingleLine(pickFirst(raw, ['institution']), 260);
  const proposalStatus = normalizeSingleLine(pickFirst(raw, ['proposal_status', 'proposalStatus']), 160);
  const place = normalizeSingleLine(pickFirst(raw, ['place']), 160);
  const ask = normalizeSingleLine(pickFirst(raw, ['ask']), 600);
  const assetSrc = normalizeSingleLine(pickFirst(raw, ['asset_src', 'assetSrc']), 2000);
  const assetTypeInput = normalizeSingleLine(pickFirst(raw, ['asset_type', 'assetType']), 40);
  const originalFilename = normalizeSingleLine(pickFirst(raw, ['original_filename', 'originalFilename']), 260);
  const mimeType = normalizeSingleLine(pickFirst(raw, ['mime_type', 'mimeType']), 120);
  const fileSize = parsePositiveInteger(pickFirst(raw, ['file_size', 'fileSize']));
  const uploadSourceInput = normalizeSingleLine(pickFirst(raw, ['upload_source', 'uploadSource']), 40);

  if (!title || !date || !medium || !status) {
    return jsonResponse({ ok: false, message: 'Missing required fields.' }, 400);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return jsonResponse({ ok: false, message: 'Date must use YYYY-MM-DD.' }, 400);
  }

  if (!entryMediums.has(medium)) {
    return jsonResponse({ ok: false, message: 'Invalid lane / medium.' }, 400);
  }

  const inferredSource = externalUrl ? detectSourceFromUrl(externalUrl) : medium === 'note' ? 'private-notes' : mediaMediums.has(medium) ? 'local-media' : 'manual';
  const source = sourceInput || inferredSource;

  if (!entrySources.has(source)) {
    return jsonResponse({ ok: false, message: 'Invalid source.' }, 400);
  }

  if (!entryStatuses.has(status)) {
    return jsonResponse({ ok: false, message: 'Invalid status.' }, 400);
  }

  if (externalUrl && !isAbsoluteHttpUrl(externalUrl)) {
    return jsonResponse({ ok: false, message: 'External URL must be a valid absolute URL.' }, 400);
  }

  if (assetSrc && !(assetSrc.startsWith('/') || isAbsoluteHttpUrl(assetSrc))) {
    return jsonResponse({ ok: false, message: 'Uploaded asset URLs must be absolute or root-relative paths.' }, 400);
  }

  const isMediaEntry = mediaMediums.has(medium);

  if (isMediaEntry) {
    if (!assetSrc && !externalUrl) {
      return jsonResponse({ ok: false, message: 'Media entries require either an uploaded asset or an external URL.' }, 400);
    }

    if (assetSrc && externalUrl) {
      return jsonResponse({ ok: false, message: 'Choose either an uploaded asset or an external URL, not both.' }, 400);
    }
  }

  const assetType = assetTypeInput || (isMediaEntry ? getAssetTypeFromMedium(medium) : '');

  if (assetType && !assetTypes.has(assetType)) {
    return jsonResponse({ ok: false, message: 'Invalid asset type.' }, 400);
  }

  const uploadSource = uploadSourceInput || (assetSrc ? 'r2' : externalUrl && isMediaEntry ? 'external' : '');

  if (uploadSource && !uploadSources.has(uploadSource)) {
    return jsonResponse({ ok: false, message: 'Invalid upload source.' }, 400);
  }

  if (isMediaEntry && assetSrc && uploadSource !== 'r2') {
    return jsonResponse({ ok: false, message: 'Uploaded media entries must use the R2 upload path.' }, 400);
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
    body,
    assetSrc,
    assetAlt: title,
    assetType,
    originalFilename,
    mimeType,
    fileSize,
    uploadSource
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
    const message = createPayload?.message || `GitHub commit failed with status ${createResponse.status}.`;
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
