import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const FEED_PATH = 'src/data/youtube.json';
const ENTRIES_ROOT = 'src/content/entries';

const FRONTMATTER_BLOCK = /^---\n([\s\S]*?)\n---/;

const parseField = (frontmatter, field) => {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(?:"([^"]+)"|'([^']+)'|([^\\n]+))\\s*$`, 'm'));
  return match?.[1] || match?.[2] || match?.[3]?.trim() || '';
};

const parseSourceId = (frontmatter) => {
  const match = frontmatter.match(/^\s*source_id:\s*(?:"([^"]+)"|'([^']+)'|([^\n]+))\s*$/m);
  return match?.[1] || match?.[2] || match?.[3]?.trim() || '';
};

const videoIdFromUrl = (value) => {
  const match = value.match(/(?:v=|\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] || '';
};

async function walkFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(target)));
      continue;
    }

    if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      files.push(target);
    }
  }

  return files;
}

function replaceDateLine(content, isoString) {
  return content.replace(/^date:\s*.*$/m, `date: "${isoString}"`);
}

async function main() {
  const feed = JSON.parse(await readFile(FEED_PATH, 'utf8'));
  const items = new Map(
    (Array.isArray(feed.items) ? feed.items : [])
      .filter((item) => item?.videoId)
      .map((item) => [item.videoId, item])
  );

  const files = await walkFiles(ENTRIES_ROOT);
  const summary = {
    scanned: 0,
    updated: 0,
    unchanged: 0,
    unmatched: 0,
    missingPublishedAt: 0
  };
  const unmatched = [];
  const missingPublishedAt = [];

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8');
    const frontmatterMatch = content.match(FRONTMATTER_BLOCK);
    if (!frontmatterMatch) continue;

    const frontmatter = frontmatterMatch[1];
    if (parseField(frontmatter, 'source') !== 'youtube') continue;

    summary.scanned += 1;

    const sourceId = parseSourceId(frontmatter);
    const externalUrl = parseField(frontmatter, 'external_url');
    const videoId = sourceId || videoIdFromUrl(externalUrl);

    if (!videoId || !items.has(videoId)) {
      summary.unmatched += 1;
      unmatched.push({ file: filePath, videoId: videoId || null, externalUrl: externalUrl || null });
      continue;
    }

    const item = items.get(videoId);
    const publishedAt = item?.publishedAt ? new Date(item.publishedAt).toISOString() : '';

    if (!publishedAt) {
      summary.missingPublishedAt += 1;
      missingPublishedAt.push({ file: filePath, videoId, title: item?.title || '' });
      continue;
    }

    const currentDate = parseField(frontmatter, 'date');
    if (currentDate === publishedAt) {
      summary.unchanged += 1;
      continue;
    }

    await writeFile(filePath, replaceDateLine(content, publishedAt), 'utf8');
    summary.updated += 1;
  }

  console.log(JSON.stringify({ summary, unmatched, missingPublishedAt }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
