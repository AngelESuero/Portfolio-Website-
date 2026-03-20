import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const IG_ROOT = path.join(ROOT, 'public', 'ig');
const OUTPUT = path.join(ROOT, 'src', 'data', 'ig.json');

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg', '.mp4', '.mov', '.webm']);
const VIDEO = new Set(['.mp4', '.mov', '.webm']);
const TYPE_VALUES = new Set(['photo', 'reel', 'carousel', 'video']);

function inferType(ext, slug) {
  if (VIDEO.has(ext)) {
    if (slug.includes('reel')) return 'reel';
    return 'video';
  }
  if (slug.includes('carousel')) return 'carousel';
  return 'photo';
}

function sortNewestFirst(a, b) {
  return String(b.date).localeCompare(String(a.date));
}

async function main() {
  const yearDirs = await readdir(IG_ROOT, { withFileTypes: true }).catch(() => []);
  const entries = [];

  for (const yearDir of yearDirs) {
    if (!yearDir.isDirectory()) continue;
    const year = yearDir.name;
    const absoluteYearPath = path.join(IG_ROOT, year);
    const files = await readdir(absoluteYearPath, { withFileTypes: true }).catch(() => []);

    for (const file of files) {
      if (!file.isFile()) continue;
      const ext = path.extname(file.name).toLowerCase();
      if (!SUPPORTED.has(ext)) continue;

      const match = file.name.match(/^(\d{4}-\d{2}-\d{2})_(.+)\.[^./]+$/);
      if (!match) continue;

      const [, date, rawSlug] = match;
      const slug = rawSlug.trim();
      const type = inferType(ext, slug.toLowerCase());
      if (!TYPE_VALUES.has(type)) continue;

      entries.push({
        id: `${date}_${slug}`,
        date,
        year: Number(date.slice(0, 4)),
        type,
        series: '',
        tags: [],
        src: `/ig/${year}/${file.name}`,
        caption: '',
        ig_url: ''
      });
    }
  }

  const manifest = entries.sort(sortNewestFirst);
  await writeFile(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${manifest.length} items to ${path.relative(ROOT, OUTPUT)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
