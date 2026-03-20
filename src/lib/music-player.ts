import type { CollectionEntry } from 'astro:content';
import {
  getMusicManifestItemByEntryRef,
  getMusicSequenceNeighbors,
  musicManifest,
  type MusicEntryRef,
  type MusicManifestItem,
  type MusicPlaybackMode
} from '../data/music-manifest';
import {
  getEntryDisplaySource,
  getEntryDisplayStatus,
  getEntryHref,
  isAudioAsset
} from './archive-entries';
import {
  getEmbedAspectRatio,
  getEmbedFallbackMessage,
  getEmbedViewMode,
  getLinkCtaLabel,
  getProviderBadgeLabel,
  providerFromUrl,
  resolveEmbed,
  type EmbedViewMode
} from './embed-resolver';

export interface ResolvedMusicPlayerItem {
  id: string;
  entryRef: MusicEntryRef;
  entryHref: string;
  title: string;
  summary: string;
  sourceLabel: string;
  statusLabel: string;
  kind: MusicManifestItem['kind'];
  kindLabel: string;
  recordCompleteness: MusicManifestItem['record_completeness'];
  recordCompletenessLabel: string;
  requestedPlaybackMode: MusicPlaybackMode;
  effectivePlaybackMode: MusicPlaybackMode;
  externalUrl: string;
  sourceLinkLabel: string;
  providerLabel: string;
  assetSrc: string;
  assetMimeType: string;
  embedUrl: string;
  embedAspectRatio: string | null;
  embedViewMode: EmbedViewMode;
  playbackNote: string;
  previousId: string | null;
  nextId: string | null;
  sequenceGroup: string | null;
  sequenceOrder: number | null;
  sequenceSize: number | null;
}

const KIND_LABELS: Record<MusicManifestItem['kind'], string> = {
  body: 'Body',
  track: 'Track',
  demo: 'Demo',
  scrap: 'Scrap',
  record: 'Record'
};

const RECORD_COMPLETENESS_LABELS: Record<MusicManifestItem['record_completeness'], string> = {
  full: 'Full record',
  placeholder: 'Placeholder record'
};

const hasStableInlineEmbed = (externalUrl: string, provider: ReturnType<typeof providerFromUrl>) => {
  if (!externalUrl) return false;
  if (provider !== 'untitled') return true;

  try {
    const parsed = new URL(externalUrl);
    return parsed.pathname.startsWith('/embed/');
  } catch {
    return false;
  }
};

const getPlaybackNote = (
  item: MusicManifestItem,
  effectivePlaybackMode: MusicPlaybackMode,
  fallbackMessage: string,
  hasExternalUrl: boolean
) => {
  if (item.playback_mode === 'embed' && effectivePlaybackMode === 'outbound' && fallbackMessage) {
    return fallbackMessage;
  }

  if (item.playback_mode === 'embed' && effectivePlaybackMode === 'unavailable') {
    return 'Inline playback is not available right now, and no clean source handoff is attached yet.';
  }

  if (effectivePlaybackMode === 'native') {
    return 'Play this record inline from its attached audio asset.';
  }

  if (effectivePlaybackMode === 'embed') {
    return 'Play this record inline through its source embed.';
  }

  if (effectivePlaybackMode === 'outbound') {
    return hasExternalUrl
      ? 'This record is represented here, but playback continues on the original source.'
      : 'A source handoff is expected here, but no external URL is attached yet.';
  }

  if (item.record_completeness === 'placeholder') {
    return 'This record stays visible in the shelf even though no playable source is attached yet.';
  }

  return 'This record is currently viewable in the archive but not playable from the shelf.';
};

export const getMusicEntryRef = (entry: Pick<CollectionEntry<'entries'>, 'slug' | 'data'>): MusicEntryRef | null =>
  entry.data.medium === 'music' ? (entry.slug as MusicEntryRef) : null;

export const resolveMusicManifestItems = (entries: CollectionEntry<'entries'>[]): ResolvedMusicPlayerItem[] => {
  const musicEntries = entries.filter((entry) => entry.data.medium === 'music');
  const entryByRef = new Map<MusicEntryRef, CollectionEntry<'entries'>>(
    musicEntries
      .map((entry) => {
        const ref = getMusicEntryRef(entry);
        return ref ? ([ref, entry] as const) : null;
      })
      .filter(Boolean) as Array<readonly [MusicEntryRef, CollectionEntry<'entries'>]>
  );

  const sequenceSizes = musicManifest.reduce((sizes, item) => {
    if (!item.sequence_group) return sizes;
    sizes.set(item.sequence_group, (sizes.get(item.sequence_group) || 0) + 1);
    return sizes;
  }, new Map<string, number>());

  return musicManifest.map((item) => {
    const entry = entryByRef.get(item.entry_ref);
    if (!entry) {
      throw new Error(`[music-player] Manifest entry_ref "${item.entry_ref}" could not be resolved.`);
    }

    const externalUrl = typeof entry.data.external_url === 'string' ? entry.data.external_url.trim() : '';
    const assetSrc = typeof entry.data.asset?.src === 'string' ? entry.data.asset.src.trim() : '';
    const assetMimeType = typeof entry.data.mime_type === 'string' ? entry.data.mime_type.trim() : '';
    const provider = externalUrl ? providerFromUrl(externalUrl) : null;
    const resolution = externalUrl ? resolveEmbed(externalUrl, provider) : null;
    const hasNativeAudio = Boolean(assetSrc && isAudioAsset(assetSrc, assetMimeType));

    let effectivePlaybackMode: MusicPlaybackMode = item.playback_mode;
    let fallbackMessage = '';

    if (item.playback_mode === 'native') {
      effectivePlaybackMode = hasNativeAudio ? 'native' : 'unavailable';
      if (!hasNativeAudio) {
        fallbackMessage = 'Native playback was requested for this record, but no playable audio asset is attached yet.';
      }
    }

    if (item.playback_mode === 'embed') {
      // Only stable direct embed URLs should render inline for archive music playback.
      // Untitled library/project pages may resolve to an embed-shaped URL but still refuse framing,
      // so those records should degrade to a calm outbound handoff instead of pretending inline playback works.
      if (resolution?.embeddable && resolution.embedUrl && hasStableInlineEmbed(externalUrl, provider)) {
        effectivePlaybackMode = 'embed';
      } else if (provider === 'untitled' && externalUrl) {
        effectivePlaybackMode = 'outbound';
        fallbackMessage =
          'This Untitled record stays on the shelf, but its library page opens more reliably at the source right now.';
      } else if (externalUrl) {
        effectivePlaybackMode = 'outbound';
        fallbackMessage = resolution ? getEmbedFallbackMessage(resolution) : 'Inline playback is unavailable; open the source instead.';
      } else {
        effectivePlaybackMode = 'unavailable';
        fallbackMessage = 'Inline playback was requested for this record, but no source URL is attached yet.';
      }
    }

    if (item.playback_mode === 'outbound') {
      effectivePlaybackMode = externalUrl ? 'outbound' : 'unavailable';
      if (!externalUrl) {
        fallbackMessage = 'This record is marked as outbound-only, but no source URL is attached yet.';
      }
    }

    if (item.playback_mode === 'unavailable') {
      effectivePlaybackMode = 'unavailable';
    }

    const neighbors = getMusicSequenceNeighbors(item.id);

    return {
      id: item.id,
      entryRef: item.entry_ref,
      entryHref: getEntryHref(entry),
      title: entry.data.title,
      summary: entry.data.summary,
      sourceLabel: getEntryDisplaySource(entry.data.source),
      statusLabel: getEntryDisplayStatus(entry.data.status),
      kind: item.kind,
      kindLabel: KIND_LABELS[item.kind],
      recordCompleteness: item.record_completeness,
      recordCompletenessLabel: RECORD_COMPLETENESS_LABELS[item.record_completeness],
      requestedPlaybackMode: item.playback_mode,
      effectivePlaybackMode,
      externalUrl,
      sourceLinkLabel: externalUrl ? getLinkCtaLabel(externalUrl, provider) : 'Open source',
      providerLabel: externalUrl ? getProviderBadgeLabel(provider, externalUrl) : getEntryDisplaySource(entry.data.source),
      assetSrc,
      assetMimeType,
      embedUrl: resolution?.embedUrl ?? '',
      embedAspectRatio: getEmbedAspectRatio(provider, externalUrl || undefined),
      embedViewMode: getEmbedViewMode(provider, externalUrl || undefined),
      playbackNote: getPlaybackNote(item, effectivePlaybackMode, fallbackMessage, Boolean(externalUrl)),
      previousId: neighbors.previous?.id ?? null,
      nextId: neighbors.next?.id ?? null,
      sequenceGroup: item.sequence_group ?? null,
      sequenceOrder: item.sequence_order ?? null,
      sequenceSize: item.sequence_group ? sequenceSizes.get(item.sequence_group) ?? null : null
    };
  });
};

export const getResolvedMusicManifestItemByEntryRef = (
  entries: CollectionEntry<'entries'>[],
  entryRef: MusicEntryRef
) => {
  const manifestItem = getMusicManifestItemByEntryRef(entryRef);
  if (!manifestItem) return null;
  return resolveMusicManifestItems(entries).find((item) => item.id === manifestItem.id) ?? null;
};
