import Parser from "rss-parser";
import { createHash } from "node:crypto";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const FEED_URL = process.env.SUBSTACK_RSS_URL || "https://aesu.substack.com/feed";
const OUT_DIR = "src/content/entries/writing";
const LIMIT = Number(process.env.SUBSTACK_IMPORT_LIMIT || "12");
const FORCE = process.argv.includes("--force");

const parser = new Parser({
  customFields: {
    item: [["content:encoded", "contentEncoded"], ["dc:creator", "creator"]]
  }
});

const slugify = (value = "") =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const summarize = (value = "") => {
  const text = value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "Imported from Substack RSS.";
  if (text.length <= 180) return text;
  return `${text.slice(0, 177).trimEnd()}...`;
};

const fileExists = async (target) => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};

const quote = (value) => JSON.stringify(value);

const sourceIdFor = (item) => {
  const key = item.guid || item.id || item.link || item.title || "substack-entry";
  return createHash("sha256").update(String(key)).digest("hex").slice(0, 12);
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const feed = await parser.parseURL(FEED_URL);
  const items = (feed.items || [])
    .filter((item) => item.link && item.title)
    .sort((a, b) => {
      const aDate = new Date(a.isoDate || a.pubDate || 0).valueOf();
      const bDate = new Date(b.isoDate || b.pubDate || 0).valueOf();
      return bDate - aDate;
    })
    .slice(0, LIMIT);

  for (const item of items) {
    const slugBase = slugify(item.title || "") || sourceIdFor(item);
    const filePath = path.join(OUT_DIR, `${slugBase}.mdx`);
    if (!FORCE && await fileExists(filePath)) continue;

    const date = new Date(item.isoDate || item.pubDate || Date.now()).toISOString().slice(0, 10);
    const summary = summarize(item.contentSnippet || item.content || item.contentEncoded || item.title || "");
    const frontmatter = `---\n`
      + `title: ${quote(item.title || "Untitled")}\n`
      + `date: ${date}\n`
      + `medium: writing\n`
      + `source: substack\n`
      + `status: published\n`
      + `tags: ["substack"]\n`
      + `summary: ${quote(summary)}\n`
      + `external_url: ${quote(item.link || "")}\n`
      + `ingest:\n`
      + `  mode: rss\n`
      + `  rss_url: ${quote(FEED_URL)}\n`
      + `  source_id: ${quote(sourceIdFor(item))}\n`
      + `---\n`;

    await writeFile(filePath, `${frontmatter}\n`, "utf8");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
