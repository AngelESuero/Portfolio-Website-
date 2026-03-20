import { z } from 'astro:content';

export type MusicEntryRef = `music/${string}`;
export type MusicManifestKind = 'body' | 'track' | 'demo' | 'scrap' | 'record';
export type MusicRecordCompleteness = 'full' | 'placeholder';
export type MusicPlaybackMode = 'native' | 'embed' | 'outbound' | 'unavailable';

export interface MusicManifestItem {
  id: string;
  entry_ref: MusicEntryRef;
  kind: MusicManifestKind;
  record_completeness: MusicRecordCompleteness;
  playback_mode: MusicPlaybackMode;
  sequence_group?: string;
  sequence_order?: number;
  // Reserved for Phase 2 / work wiring. Leave unset in Phase 0/1 unless a real item needs it.
  work_refs?: string[];
}

export const MUSIC_PLAYER_V1_RULES = {
  missingEntryRef: 'fail-build',
  embedDegradation: 'fallback-to-outbound-with-message',
  workRefs: 'reserved-for-phase-2',
  sequenceNeighbors: 'sequence-group-only'
} as const;

const musicManifestItemSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Manifest ids must be lowercase kebab-case.'),
  entry_ref: z.string().regex(/^music\/[a-z0-9]+(?:-[a-z0-9]+)*$/, 'entry_ref must target a music archive slug.'),
  kind: z.enum(['body', 'track', 'demo', 'scrap', 'record']),
  record_completeness: z.enum(['full', 'placeholder']),
  playback_mode: z.enum(['native', 'embed', 'outbound', 'unavailable']),
  sequence_group: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'sequence_group must be lowercase kebab-case.')
    .optional(),
  sequence_order: z.number().int().positive().optional(),
  work_refs: z.array(z.string().min(1)).optional()
});

const authoredMusicManifest = [
  {
    id: 'my-first-beat-tape',
    entry_ref: 'music/my-first-beat-tape',
    kind: 'body',
    record_completeness: 'full',
    playback_mode: 'embed'
  },
  {
    id: 'queries-the-beat-tape-family-love',
    entry_ref: 'music/queries-the-beat-tape-family-love',
    kind: 'body',
    record_completeness: 'full',
    playback_mode: 'embed'
  },
  {
    id: 'the-every-day-soundscape',
    entry_ref: 'music/the-every-day-soundscape',
    kind: 'track',
    record_completeness: 'full',
    playback_mode: 'embed'
  },
  {
    id: 'scraps-after-heartbreaks',
    entry_ref: 'music/scraps-after-heartbreaks',
    kind: 'demo',
    record_completeness: 'full',
    playback_mode: 'native'
  },
  {
    id: 'scraps-the-death-of-my-feminine-demos-2022',
    entry_ref: 'music/scraps-the-death-of-my-feminine-demos-2022',
    kind: 'body',
    record_completeness: 'placeholder',
    playback_mode: 'unavailable',
    sequence_group: 'scraps-run',
    sequence_order: 1
  },
  {
    id: 'scraps-dark-days-symptoms-no-context-demos-tapes-2023-2024',
    entry_ref: 'music/scraps-dark-days-symptoms-no-context-demos-tapes-2023-2024',
    kind: 'body',
    record_completeness: 'placeholder',
    playback_mode: 'unavailable',
    sequence_group: 'scraps-run',
    sequence_order: 2
  }
] satisfies MusicManifestItem[];

const musicEntryModules = import.meta.glob('../content/entries/music/*.mdx');
const realMusicEntryRefs = new Set<MusicEntryRef>(
  Object.keys(musicEntryModules).map((path) => {
    const slug = path.split('/').pop()?.replace(/\.mdx$/, '');
    return `music/${slug}` as MusicEntryRef;
  })
);

const toSortedDistinctNumbers = (values: number[]) => [...new Set(values)].sort((a, b) => a - b);

const validateMusicManifest = (input: MusicManifestItem[]) => {
  const parsed = input.map((item, index) => {
    try {
      return musicManifestItemSchema.parse(item) as MusicManifestItem;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`[music-manifest] Invalid item at index ${index}: ${error.message}`);
      }

      throw error;
    }
  });

  const seenIds = new Set<string>();
  const seenEntryRefs = new Set<MusicEntryRef>();

  for (const item of parsed) {
    if (seenIds.has(item.id)) {
      throw new Error(`[music-manifest] Duplicate manifest id "${item.id}".`);
    }

    if (seenEntryRefs.has(item.entry_ref)) {
      throw new Error(`[music-manifest] Duplicate entry_ref "${item.entry_ref}".`);
    }

    if (!realMusicEntryRefs.has(item.entry_ref)) {
      throw new Error(
        `[music-manifest] entry_ref "${item.entry_ref}" does not resolve to a real archive music entry.`
      );
    }

    const hasSequenceGroup = typeof item.sequence_group === 'string';
    const hasSequenceOrder = typeof item.sequence_order === 'number';
    if (hasSequenceGroup !== hasSequenceOrder) {
      throw new Error(
        `[music-manifest] "${item.id}" must define both sequence_group and sequence_order together.`
      );
    }

    seenIds.add(item.id);
    seenEntryRefs.add(item.entry_ref);
  }

  const groupedItems = new Map<string, MusicManifestItem[]>();
  for (const item of parsed) {
    if (!item.sequence_group) continue;
    const bucket = groupedItems.get(item.sequence_group) ?? [];
    bucket.push(item);
    groupedItems.set(item.sequence_group, bucket);
  }

  for (const [group, items] of groupedItems.entries()) {
    if (items.length < 2) {
      throw new Error(`[music-manifest] sequence_group "${group}" must contain at least two items.`);
    }

    const orders = items.map((item) => item.sequence_order as number);
    const distinctOrders = toSortedDistinctNumbers(orders);
    if (distinctOrders.length !== orders.length) {
      throw new Error(`[music-manifest] sequence_group "${group}" has duplicate sequence_order values.`);
    }

    const expectedOrders = Array.from({ length: distinctOrders.length }, (_, index) => index + 1);
    const isContiguous = distinctOrders.every((order, index) => order === expectedOrders[index]);
    if (!isContiguous) {
      throw new Error(
        `[music-manifest] sequence_group "${group}" must use contiguous sequence_order values starting at 1.`
      );
    }
  }

  return Object.freeze(parsed.map((item) => Object.freeze({ ...item })));
};

export const musicManifest = validateMusicManifest(authoredMusicManifest);

export const musicManifestById = new Map(musicManifest.map((item) => [item.id, item] as const));
export const musicManifestByEntryRef = new Map(musicManifest.map((item) => [item.entry_ref, item] as const));

export const getMusicManifestItem = (id: string) => musicManifestById.get(id) ?? null;
export const getMusicManifestItemByEntryRef = (entryRef: MusicEntryRef) => musicManifestByEntryRef.get(entryRef) ?? null;

export const getMusicSequenceNeighbors = (itemOrId: string | Pick<MusicManifestItem, 'id' | 'sequence_group'>) => {
  const itemId = typeof itemOrId === 'string' ? itemOrId : itemOrId.id;
  const item = musicManifestById.get(itemId) ?? null;
  if (!item?.sequence_group) {
    return { previous: null, next: null };
  }

  const groupItems = musicManifest
    .filter((candidate) => candidate.sequence_group === item.sequence_group)
    .sort((a, b) => (a.sequence_order as number) - (b.sequence_order as number));
  const currentIndex = groupItems.findIndex((candidate) => candidate.id === item.id);

  return {
    previous: currentIndex > 0 ? groupItems[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < groupItems.length - 1 ? groupItems[currentIndex + 1] : null
  };
};
