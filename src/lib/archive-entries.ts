import type { CollectionEntry } from 'astro:content';

export type ArchiveEntry = CollectionEntry<'entries'>;
export type ArchiveMedium = ArchiveEntry['data']['medium'];

export const ARCHIVE_MEDIUMS: ArchiveMedium[] = ['writing', 'music', 'video', 'image', 'note', 'proposal'];

export const ENTRY_MEDIUM_LABELS: Record<ArchiveMedium, string> = {
  writing: 'Writing',
  music: 'Music',
  video: 'Video',
  image: 'Image',
  note: 'Note',
  proposal: 'Proposal'
};

export const ENTRY_SOURCE_LABELS: Record<ArchiveEntry['data']['source'], string> = {
  substack: 'Substack',
  youtube: 'YouTube',
  untitled: 'Untitled',
  'local-media': 'Local media',
  'private-notes': 'Private notes',
  manual: 'Manual',
  linktree: 'Linktree'
};

export const ENTRY_STATUS_LABELS: Record<ArchiveEntry['data']['status'], string> = {
  raw: 'Raw',
  withheld: 'Withheld',
  'in-progress': 'In progress',
  published: 'Published',
  featured: 'Featured'
};

export const normalizeEntryTag = (tag: string) => tag.trim().toLowerCase();

export const sortEntriesByDate = (entries: ArchiveEntry[]) =>
  [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

export const collectEntryTags = (entries: ArchiveEntry[]) =>
  [...new Set(entries.flatMap((entry) => entry.data.tags.map(normalizeEntryTag)))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

export const getEntryHref = (entry: Pick<ArchiveEntry, 'slug'>) => `/archive/${entry.slug}`;
export const getArchiveMediumHref = (medium: ArchiveMedium) => `/archive/${medium}`;
export const filterEntriesByMedium = (entries: ArchiveEntry[], medium: ArchiveMedium) =>
  entries.filter((entry) => entry.data.medium === medium);

export const getEntryDisplayMedium = (medium: ArchiveMedium) => ENTRY_MEDIUM_LABELS[medium];

export const getEntryDisplaySource = (source: ArchiveEntry['data']['source']) => ENTRY_SOURCE_LABELS[source];

export const getEntryDisplayStatus = (status: ArchiveEntry['data']['status']) => ENTRY_STATUS_LABELS[status];

export const shouldShowEntryStatus = (status: ArchiveEntry['data']['status']) => status !== 'published';

const toBodyText = (value: string) =>
  value
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

export const getEntryBodyText = (entry: Pick<ArchiveEntry, 'body'>) => toBodyText(String(entry.body || ''));

export const entryHasBody = (entry: Pick<ArchiveEntry, 'body'>) => getEntryBodyText(entry).length > 0;

export const getEntryFragment = (entry: Pick<ArchiveEntry, 'body'>, maxChars = 180) => {
  const text = getEntryBodyText(entry);
  if (!text) return '';
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trimEnd()}...`;
};

export const isAudioAsset = (src?: string, mimeType?: string) =>
  Boolean((mimeType && /^audio\//i.test(mimeType)) || (src && /\.(aac|flac|m4a|mp3|ogg|wav)$/i.test(src)));

export const isLocalVideoAsset = (src?: string) => Boolean(src && /\.(mov|mp4|m4v|webm|ogg)$/i.test(src));

export const isLocalImageAsset = (src?: string) => Boolean(src && /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(src));
