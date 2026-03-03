import { LINKTREE_TIMELINE_ENTRIES, LINKTREE_TIMELINE_META } from './linktree-timeline.generated';

export { LINKTREE_TIMELINE_META };

export interface LinktreeTimelineEntry {
  title: string;
  aliases?: readonly string[];
  type?: string;
  sourcePosition?: number;
  urls?: readonly string[];
  sourceGroup?: string | null;
  yearLabel?: string | null;
  sortYear?: number | null;
}

interface TimelineLookup {
  title?: string | null;
  urls?: Array<string | null | undefined>;
}

interface ProjectTimelineInput {
  title: string;
  year: number;
  links?:
    | {
        github?: string;
        linktree?: string;
        youtube?: string;
        instagram?: string;
        untitled?: string;
      }
    | null;
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'for',
  'i',
  'in',
  'my',
  'of',
  'on',
  'the',
  'to'
]);

const ENTRIES = LINKTREE_TIMELINE_ENTRIES as unknown as LinktreeTimelineEntry[];

const normalizeWhitespace = (value: string): string => value.trim().replace(/\s+/g, ' ');

const normalizeTitle = (value: string): string =>
  normalizeWhitespace(value)
    .normalize('NFKD')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();

const titleTokens = (value: string): string[] => {
  const tokens = normalizeTitle(value)
    .split(' ')
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token));

  return Array.from(new Set(tokens));
};

const normalizeUrl = (value: string): string => {
  const raw = value.trim();
  if (!raw) return '';

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.replace(/^\/+/, '');
      return videoId ? `youtube:${videoId}` : '';
    }

    if (host === 'youtube.com' || host === 'music.youtube.com') {
      if (parsed.pathname === '/watch') {
        const videoId = parsed.searchParams.get('v');
        return videoId ? `youtube:${videoId}` : `${host}${parsed.pathname}`;
      }

      const playlistId = parsed.searchParams.get('list');
      if (playlistId) return `youtube-playlist:${playlistId}`;
    }

    if (host === 'untitled.stream') {
      const path = parsed.pathname.replace(/\/embed\/?$/, '').replace(/\/+$/, '');
      return `${host}${path}`;
    }

    const path = parsed.pathname.replace(/\/+$/, '');
    const search = parsed.search ? parsed.search : '';
    return `${host}${path}${search}`;
  } catch {
    return normalizeWhitespace(raw).toLowerCase();
  }
};

const entryNames = (entry: LinktreeTimelineEntry): string[] => {
  const names = [entry.title, ...(entry.aliases || [])]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  return Array.from(new Set(names));
};

const scoreTitleMatch = (target: string, candidate: string): number => {
  const targetKey = normalizeTitle(target);
  const candidateKey = normalizeTitle(candidate);
  if (!targetKey || !candidateKey) return 0;
  if (targetKey === candidateKey) return 100;

  const targetSet = new Set(titleTokens(target));
  const candidateSet = new Set(titleTokens(candidate));

  let shared = 0;
  for (const token of targetSet) {
    if (candidateSet.has(token)) shared += 1;
  }

  if (shared >= 3) return shared;
  if (shared >= 2 && /\bvolume\s+\d+\b/i.test(target) && /\bvolume\s+\d+\b/i.test(candidate)) return shared + 2;
  if (targetKey.includes(candidateKey) || candidateKey.includes(targetKey)) return shared + 1;
  return 0;
};

const titleIndex = new Map<string, LinktreeTimelineEntry[]>();
const urlIndex = new Map<string, LinktreeTimelineEntry[]>();

const addIndexedEntry = (index: Map<string, LinktreeTimelineEntry[]>, key: string, entry: LinktreeTimelineEntry) => {
  const existing = index.get(key);
  if (existing) {
    if (!existing.includes(entry)) existing.push(entry);
  } else {
    index.set(key, [entry]);
  }
};

for (const entry of ENTRIES) {
  for (const name of entryNames(entry)) {
    const key = normalizeTitle(name);
    if (!key) continue;
    addIndexedEntry(titleIndex, key, entry);
  }

  for (const url of entry.urls || []) {
    const key = normalizeUrl(url);
    if (!key) continue;
    addIndexedEntry(urlIndex, key, entry);
  }
}

const scoreEntry = (target: string, entry: LinktreeTimelineEntry): number =>
  Math.max(...entryNames(entry).map((name) => scoreTitleMatch(target, name)));

const pickBestByTitle = (
  candidates: LinktreeTimelineEntry[],
  target: string,
  minScore: number
): LinktreeTimelineEntry | null => {
  const scored = candidates
    .map((entry) => ({ entry, score: scoreEntry(target, entry) }))
    .sort((a, b) => b.score - a.score);

  if (!scored[0] || scored[0].score < minScore) return null;
  if (scored[1] && scored[1].score === scored[0].score) return null;
  return scored[0].entry;
};

export function findLinktreeTimelineEntry(lookup: TimelineLookup): LinktreeTimelineEntry | null {
  const title = typeof lookup.title === 'string' ? lookup.title : '';
  const titleKey = title ? normalizeTitle(title) : '';
  const exactTitleMatches = titleKey ? titleIndex.get(titleKey) || [] : [];

  const urlCandidates = new Set<LinktreeTimelineEntry>();
  for (const value of lookup.urls || []) {
    if (typeof value !== 'string') continue;
    const key = normalizeUrl(value);
    if (!key) continue;
    for (const match of urlIndex.get(key) || []) {
      urlCandidates.add(match);
    }
  }

  if (exactTitleMatches.length === 1) return exactTitleMatches[0];

  if (urlCandidates.size > 0) {
    const candidates = Array.from(urlCandidates);
    if (exactTitleMatches.length > 1) {
      const exactSet = new Set(exactTitleMatches);
      const overlapping = candidates.filter((entry) => exactSet.has(entry));
      if (overlapping.length === 1) return overlapping[0];
      if (title) {
        const bestOverlap = pickBestByTitle(overlapping, title, 1);
        if (bestOverlap) return bestOverlap;
      }
    }

    if (candidates.length === 1) return candidates[0];
    if (title) {
      const bestUrlMatch = pickBestByTitle(candidates, title, 1);
      if (bestUrlMatch) return bestUrlMatch;
    }
  }

  if (exactTitleMatches.length > 1 && title) {
    const bestExact = pickBestByTitle(exactTitleMatches, title, 100);
    if (bestExact) return bestExact;
  }

  if (title) {
    const best = pickBestByTitle(ENTRIES, title, 3);
    if (best) return best;
  }

  return null;
}

export function resolveTimelineLabel(lookup: TimelineLookup, fallbackYear: number | string): string {
  const entry = findLinktreeTimelineEntry(lookup);
  return entry?.yearLabel || String(fallbackYear);
}

export function resolveTimelineSortYear(lookup: TimelineLookup, fallbackYear: number): number {
  const entry = findLinktreeTimelineEntry(lookup);
  return entry?.sortYear || fallbackYear;
}

export function resolveProjectTimeline(data: ProjectTimelineInput): { yearLabel: string; sortYear: number } {
  const urls = Object.values(data.links || {}).filter((value): value is string => typeof value === 'string');
  return {
    yearLabel: resolveTimelineLabel({ title: data.title, urls }, data.year),
    sortYear: resolveTimelineSortYear({ title: data.title, urls }, data.year)
  };
}

export function applyLinktreeTimelineToHubItem<T extends { title: string; url: string; embedUrl?: string; year?: string }>(
  item: T
): T {
  const entry = findLinktreeTimelineEntry({ title: item.title, urls: [item.url, item.embedUrl] });
  const yearLabel = entry?.yearLabel;
  if (!yearLabel || yearLabel === item.year) return item;
  return { ...item, year: yearLabel };
}
