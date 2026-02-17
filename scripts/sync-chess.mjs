import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_PATH = path.resolve("src/data/chess.json");
const USERNAME = String(process.env.CHESSCOM_USERNAME || "Trid3nt").trim() || "Trid3nt";
const STATS_URL = `https://api.chess.com/pub/player/${encodeURIComponent(USERNAME)}/stats`;
const PROFILE_URL = `https://www.chess.com/member/${encodeURIComponent(USERNAME)}`;

const source = {
  name: "Chess.com Published Data API",
  url: "https://api.chess.com/pub/"
};

const toRating = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const seedDataset = (generatedAt) => {
  const date = generatedAt.slice(0, 10);
  return {
    meta: {
      schemaVersion: 1,
      generatedAt,
      player: {
        platform: "chess.com",
        username: USERNAME,
        profileUrl: PROFILE_URL
      },
      sources: [source]
    },
    snapshots: [
      {
        date,
        rapid: null,
        blitz: null,
        bullet: null
      }
    ]
  };
};

async function readExisting() {
  try {
    const raw = await readFile(OUT_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeDataset(data) {
  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function fetchRatings() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(STATS_URL, {
      signal: controller.signal,
      headers: {
        accept: "application/json",
        "user-agent": "AngelESuero-ChessSync/1.0 (+https://github.com/AngelESuero/Portfolio-Website-)"
      }
    });

    if (!response.ok) {
      throw new Error(`Chess.com stats request failed: ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    return {
      rapid: toRating(payload?.chess_rapid?.last?.rating),
      blitz: toRating(payload?.chess_blitz?.last?.rating),
      bullet: toRating(payload?.chess_bullet?.last?.rating)
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const existing = await readExisting();
  const generatedAt = new Date().toISOString();
  const today = generatedAt.slice(0, 10);

  let ratings;
  try {
    ratings = await fetchRatings();
  } catch (error) {
    if (existing) {
      console.warn("[warn] chess sync failed; keeping last known dataset:", error?.message || error);
      return;
    }

    const seed = seedDataset(generatedAt);
    await writeDataset(seed);
    console.warn("[warn] chess sync failed; wrote seed dataset instead.");
    return;
  }

  const base = existing && typeof existing === "object" ? existing : seedDataset(generatedAt);
  const snapshots = Array.isArray(base.snapshots) ? [...base.snapshots] : [];

  if (!snapshots.some((item) => item?.date === today)) {
    snapshots.push({
      date: today,
      rapid: ratings.rapid,
      blitz: ratings.blitz,
      bullet: ratings.bullet
    });
  }

  const out = {
    meta: {
      schemaVersion: 1,
      generatedAt,
      player: {
        platform: "chess.com",
        username: USERNAME,
        profileUrl: PROFILE_URL
      },
      sources: [source]
    },
    snapshots
  };

  await writeDataset(out);
  console.log(`[ok] wrote ${OUT_PATH} (${snapshots.length} snapshots)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
