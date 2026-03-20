import { AwsClient } from 'aws4fetch';
import {
  getAssetTypeFromMedium,
  jsonHeaders,
  jsonResponse,
  mediaMediums,
  normalizePublicBaseUrl,
  normalizeSingleLine,
  parsePositiveInteger,
  pickFirst,
  readPayload,
  slugify
} from './_studio.js';

const allowedFileShapes = {
  music: {
    mimePrefixes: ['audio/'],
    extensions: ['.mp3', '.wav', '.m4a', '.aac', '.flac', '.ogg']
  },
  video: {
    mimePrefixes: ['video/'],
    extensions: ['.mp4', '.mov', '.m4v', '.webm', '.ogg']
  },
  image: {
    mimePrefixes: ['image/'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']
  }
};

function getFileExtension(fileName) {
  const match = /\.([a-z0-9]{1,12})$/i.exec(String(fileName || '').trim());
  return match ? `.${match[1].toLowerCase()}` : '';
}

function isAllowedFileForMedium(medium, fileName, mimeType) {
  const shape = allowedFileShapes[medium];
  if (!shape) return false;

  const extension = getFileExtension(fileName);
  if (mimeType && shape.mimePrefixes.some((prefix) => mimeType.startsWith(prefix))) return true;
  if (extension && shape.extensions.includes(extension)) return true;
  return false;
}

function buildObjectKey({ medium, title, date, fileName }) {
  const extension = getFileExtension(fileName) || '';
  const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10);
  const titleSlug = slugify(title || fileName.replace(/\.[^.]+$/, ''));
  const uniqueSuffix = crypto.randomUUID().slice(0, 8);
  return `studio/${medium}/${safeDate}/${titleSlug}-${uniqueSuffix}${extension}`;
}

export async function onRequestPost({ request, env }) {
  const studioPassword = String(env.STUDIO_PASSWORD || '').trim();
  const accessKeyId = String(env.R2_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = String(env.R2_SECRET_ACCESS_KEY || '').trim();
  const accountId = String(env.R2_ACCOUNT_ID || '').trim();
  const bucket = String(env.R2_BUCKET_NAME || '').trim();
  const publicBaseUrl = normalizePublicBaseUrl(env.R2_PUBLIC_BASE_URL);

  if (!studioPassword || !accessKeyId || !secretAccessKey || !accountId || !bucket || !publicBaseUrl) {
    return jsonResponse(
      {
        ok: false,
        message:
          'Upload support is not configured. Set STUDIO_PASSWORD, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID, R2_BUCKET_NAME, and R2_PUBLIC_BASE_URL in Cloudflare.'
      },
      503
    );
  }

  const raw = await readPayload(request);
  const password = normalizeSingleLine(pickFirst(raw, ['password']), 200);
  const medium = normalizeSingleLine(pickFirst(raw, ['medium', 'lane']), 40);
  const title = normalizeSingleLine(pickFirst(raw, ['title']), 180);
  const date = normalizeSingleLine(pickFirst(raw, ['date']), 20);
  const fileName = normalizeSingleLine(pickFirst(raw, ['fileName', 'file_name']), 260);
  const mimeType = normalizeSingleLine(pickFirst(raw, ['mimeType', 'mime_type']), 120) || 'application/octet-stream';
  const fileSize = parsePositiveInteger(pickFirst(raw, ['fileSize', 'file_size']));

  if (!password || password !== studioPassword) {
    return jsonResponse({ ok: false, message: 'Invalid studio password.' }, 401);
  }

  if (!mediaMediums.has(medium)) {
    return jsonResponse({ ok: false, message: 'Upload support only applies to music, video, and image lanes.' }, 400);
  }

  if (!fileName) {
    return jsonResponse({ ok: false, message: 'Missing file name.' }, 400);
  }

  if (fileSize === null) {
    return jsonResponse({ ok: false, message: 'Missing file size.' }, 400);
  }

  if (!isAllowedFileForMedium(medium, fileName, mimeType)) {
    return jsonResponse({ ok: false, message: `That file type does not match the ${medium} lane.` }, 400);
  }

  const objectKey = buildObjectKey({ medium, title, date, fileName });
  const r2Url = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${objectKey}`;
  const expiresIn = 900;

  const client = new AwsClient({
    service: 's3',
    region: 'auto',
    accessKeyId,
    secretAccessKey
  });

  const signedRequest = await client.sign(
    new Request(`${r2Url}?X-Amz-Expires=${expiresIn}`, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType
      }
    }),
    {
      aws: { signQuery: true }
    }
  );

  return jsonResponse({
    ok: true,
    message: 'Upload URL ready.',
    uploadUrl: signedRequest.url.toString(),
    assetUrl: `${publicBaseUrl}/${objectKey}`,
    assetKey: objectKey,
    assetType: getAssetTypeFromMedium(medium),
    mimeType,
    headers: {
      'Content-Type': mimeType
    },
    expiresIn
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
