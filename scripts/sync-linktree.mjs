import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const PROFILE_URL = "https://linktr.ee/a_e.s_";
const OUT_PATH = path.resolve("src/data/linktree-timeline.generated.ts");
const REQUEST_TIMEOUT_MS = 20000;
const execFileAsync = promisify(execFile);

function trim(value) {
  return String(value || "").trim();
}

function normalizeSpacing(value) {
  return trim(value).replace(/\s+/g, " ");
}

function parseYearInfo(...values) {
  for (const value of values) {
    const matches = normalizeSpacing(value).match(/\b(?:19|20)\d{2}\b/g) || [];
    if (!matches.length) continue;

    if (matches.length === 1) {
      const year = Number(matches[0]);
      return {
        yearLabel: matches[0],
        sortYear: Number.isFinite(year) ? year : null
      };
    }

    const start = matches[0];
    const end = matches[matches.length - 1];
    const sortYear = Number(end);
    return {
      yearLabel: `${start}-${end}`,
      sortYear: Number.isFinite(sortYear) ? sortYear : null
    };
  }

  return {
    yearLabel: null,
    sortYear: null
  };
}

function addAlias(bucket, value) {
  const normalized = normalizeSpacing(value);
  if (!normalized) return;
  if (!bucket.includes(normalized)) bucket.push(normalized);
}

function buildAliases(link) {
  const aliases = [];
  const title = normalizeSpacing(link?.title);
  const url = trim(link?.url);

  if (url === "https://linktr.ee/a_e.s_playlist") {
    ["Volume 1", "Volume 1 Linktree", "Volume 1 - Spotify", "Volume 1 - SoundCloud", "Volume 1 - YouTube Music"].forEach(
      (value) => addAlias(aliases, value)
    );
  }

  if (url === "https://linktr.ee/a_e.s_volume2") {
    ["Volume 2", "Volume 2 Linktree", "Volume 2 - Spotify", "Volume 2 - SoundCloud", "Volume 2 - YouTube Music"].forEach(
      (value) => addAlias(aliases, value)
    );
  }

  if (url === "https://sdz.sh/FDoCqk") {
    ["Volume 3", "Volume 3 Smart Link", "Volume 3 - Spotify", "Volume 3 - SoundCloud", "Volume 3 - YouTube Music"].forEach(
      (value) => addAlias(aliases, value)
    );
  }

  if (url === "https://sdz.sh/yFOERE") {
    ["Volume 4", "Volume 4 Smart Link", "Volume 4 - Spotify", "Volume 4 - SoundCloud", "Volume 4 - YouTube Music"].forEach(
      (value) => addAlias(aliases, value)
    );
  }

  if (/^Queries \(The Beat Tape\)/i.test(title)) {
    addAlias(aliases, "Queries Beat Tape");
  }

  if (/^Scraps: Dark Days/i.test(title)) {
    addAlias(aliases, "Scraps 2023-2024");
  }

  if (/^A Magazine Publication - The Art of Survival/i.test(title)) {
    addAlias(aliases, "The Art of Survival");
  }

  if (/^'Gram$/i.test(title)) {
    addAlias(aliases, "Instagram");
  }

  if (/^Angel’s Evolving AI Pledge$/i.test(title) || /^Angel's Evolving AI Pledge$/i.test(title)) {
    addAlias(aliases, "Angel's Evolving AI Pledge");
    addAlias(aliases, "AI Pledge");
  }

  if (/^Writing -\s+Vonnegut$/i.test(title)) {
    addAlias(aliases, "Writing - Vonnegut");
  }

  if (/^Writing -\s+Life In IB$/i.test(title)) {
    addAlias(aliases, "Writing - Life In IB");
  }

  return aliases;
}

async function readExistingOutput() {
  try {
    return await readFile(OUT_PATH, "utf8");
  } catch {
    return null;
  }
}

async function fetchHtml() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(PROFILE_URL, {
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "AngelESuero-LinktreeSync/1.0 (+https://portfolio-website-9c9.pages.dev)"
      }
    });

    if (!response.ok) {
      throw new Error(`Linktree request failed: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/fetch failed|aborted/i.test(message)) {
      throw error;
    }
    return fetchHtmlWithCurl();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchHtmlWithCurl() {
  const { stdout } = await execFileAsync("curl", ["-sSL", "--max-time", "30", PROFILE_URL], {
    maxBuffer: 10 * 1024 * 1024
  });
  return stdout;
}

function extractPayload(html) {
  const marker = "</script></body></html>";
  const end = String(html || "").lastIndexOf(marker);
  if (end === -1) {
    throw new Error("Linktree payload parse failed: closing script marker not found");
  }

  const start = html.lastIndexOf(">", end - 1) + 1;
  if (start <= 0 || start >= end) {
    throw new Error("Linktree payload parse failed: script body not found");
  }

  try {
    return JSON.parse(html.slice(start, end));
  } catch {
    throw new Error("Linktree payload parse failed: JSON parse error");
  }
}

function buildEntries(account) {
  const links = Array.isArray(account?.links) ? account.links : [];
  const byId = new Map(
    links.map((link) => [Number(link?.id), link]).filter(([id]) => Number.isFinite(id))
  );

  return links
    .filter((link) => trim(link?.title) && link?.type !== "GROUP" && link?.type !== "SHOP_PREVIEW")
    .map((link) => {
      const parent = byId.get(Number(link?.parent?.id));
      const sourceGroup = parent?.type === "GROUP" ? normalizeSpacing(parent?.title) : null;
      const yearInfo = parseYearInfo(link?.title, sourceGroup);
      const url = trim(link?.url);

      return {
        title: normalizeSpacing(link?.title),
        aliases: buildAliases(link),
        type: trim(link?.type) || null,
        sourcePosition: Number.isFinite(Number(link?.position)) ? Number(link.position) : null,
        urls: url ? [url] : [],
        sourceGroup,
        yearLabel: yearInfo.yearLabel,
        sortYear: yearInfo.sortYear
      };
    });
}

function msToIso(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  const date = new Date(parsed);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
}

async function writeGeneratedFile(data) {
  const body = [
    "// This file is auto-generated by `npm run sync:linktree`.",
    "",
    `export const LINKTREE_TIMELINE_META = ${JSON.stringify(data.meta, null, 2)} as const;`,
    "",
    `export const LINKTREE_TIMELINE_ENTRIES = ${JSON.stringify(data.entries, null, 2)} as const;`,
    ""
  ].join("\n");

  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, body, "utf8");
}

async function main() {
  const existing = await readExistingOutput();

  let html;
  try {
    html = await fetchHtml();
  } catch (error) {
    if (existing) {
      console.warn("[warn] linktree sync failed; keeping last known dataset:", error?.message || error);
      return;
    }
    throw error;
  }

  const payload = extractPayload(html);
  const account = payload?.props?.pageProps?.account;
  const entries = buildEntries(account);

  const out = {
    meta: {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      sourceUrl: PROFILE_URL,
      sourceUpdatedAt: msToIso(account?.updatedAt),
      itemCount: entries.length
    },
    entries
  };

  await writeGeneratedFile(out);
  console.log(`[ok] wrote ${path.relative(process.cwd(), OUT_PATH)} (${entries.length} entries)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
