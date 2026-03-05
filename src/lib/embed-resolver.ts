import type { LinkHubProvider } from '../data/linkhub';
import { SITE } from '../data/site-refs';

const YOUTUBE_EMBED_BASE_URL = 'https://www.youtube-nocookie.com/embed';
const SITE_ORIGIN = (() => {
  try {
    return new URL(SITE.baseUrl).origin;
  } catch {
    return '';
  }
})();

export type EmbedViewMode = 'landscape' | 'portrait' | 'stack';

export type EmbedViewMode = 'landscape' | 'portrait' | 'stack';

export type EmbedResolutionReason =
  | 'ok'
  | 'unsupported_url_shape'
  | 'invite_link'
  | 'profile_only'
  | 'placeholder'
  | 'unknown';

export type EmbedResolution = {
  provider: LinkHubProvider | null;
  embedUrl: string | null;
  embeddable: boolean;
  reason: EmbedResolutionReason;
};

export interface InternalRouteInfo {
  pathname: string;
  ctaLabel: string;
  description: string;
}

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const normalizePathname = (pathname: string): string => {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
};

const parseInternalPathname = (urlValue: string): string | null => {
  if (typeof urlValue !== 'string') return null;
  const trimmed = urlValue.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    const parsedRelative = parseUrl(`${SITE.baseUrl}${trimmed}`);
    return parsedRelative ? normalizePathname(parsedRelative.pathname) : normalizePathname(trimmed.split('?')[0] || '/');
  }

  const parsed = parseUrl(trimmed);
  if (!parsed) return null;
  if (SITE_ORIGIN && parsed.origin === SITE_ORIGIN) {
    return normalizePathname(parsed.pathname);
  }

  return null;
};

const INTERNAL_ROUTE_COPY: Array<{ match: (pathname: string) => boolean; ctaLabel: string; description: string }> = [
  {
    match: (pathname) => pathname === '/',
    ctaLabel: 'Open Home',
    description: 'Return to the archive landing page and start from the curated entry points.'
  },
  {
    match: (pathname) => pathname.startsWith('/work'),
    ctaLabel: 'Open Work Archive',
    description: 'Project outcomes, process notes, and timeline-indexed work.'
  },
  {
    match: (pathname) => pathname.startsWith('/writing'),
    ctaLabel: 'Open Writing',
    description: 'Long-form writing, dispatches, and archive notes.'
  },
  {
    match: (pathname) => pathname.startsWith('/map'),
    ctaLabel: 'Open Map',
    description: 'Concept atlas and relationship clusters.'
  },
  {
    match: (pathname) => pathname.startsWith('/now'),
    ctaLabel: 'Open Now',
    description: 'Current focus, active projects, and near-term direction.'
  },
  {
    match: (pathname) => pathname.startsWith('/social') || pathname.startsWith('/room'),
    ctaLabel: 'Open Social',
    description: 'Jump into social rooms, feeds, and platform handoff routes.'
  },
  {
    match: (pathname) => pathname.startsWith('/contact'),
    ctaLabel: 'Open Contact',
    description: 'Open direct contact options and outreach paths.'
  },
  {
    match: (pathname) => pathname.startsWith('/agi'),
    ctaLabel: 'Open AGI',
    description: 'Review AGI timeline signals, analysis views, and source tracking.'
  },
  {
    match: (pathname) => pathname.startsWith('/survival-os'),
    ctaLabel: 'Open Survival OS',
    description: 'Open the survival framework and AI transition guidance.'
  },
  {
    match: (pathname) => pathname === '/rss.xml',
    ctaLabel: 'Open feed',
    description: 'Open the RSS feed endpoint for subscriptions and integrations.'
  }
];

const getInternalRouteCopy = (pathname: string): InternalRouteInfo => {
  const match = INTERNAL_ROUTE_COPY.find((entry) => entry.match(pathname));
  if (!match) {
    return {
      pathname,
      ctaLabel: 'Open page',
      description: 'Open this internal page in the archive.'
    };
  }

  return {
    pathname,
    ctaLabel: match.ctaLabel,
    description: match.description
  };
};

const isLinktreeHost = (urlValue: string): boolean => {
  const parsed = parseUrl(urlValue);
  return Boolean(parsed?.hostname.toLowerCase().includes('linktr.ee'));
};

export const resolveInternalRoute = (urlValue: string): InternalRouteInfo | null => {
  const pathname = parseInternalPathname(urlValue);
  if (!pathname) return null;
  return getInternalRouteCopy(pathname);
};

export const isInternalUrl = (urlValue: string): boolean => Boolean(resolveInternalRoute(urlValue));

export const getLinkCtaLabel = (urlValue: string, provider: LinkHubProvider | null): string => {
  const internalRoute = resolveInternalRoute(urlValue);
  if (internalRoute) return internalRoute.ctaLabel;
  if (isLinktreeHost(urlValue)) return 'Open Linktree';
  if (provider === 'threads') return 'Open on Threads';
  if (provider === 'tiktok') return 'Open on TikTok';
  if (provider === 'x') return 'Open on X';
  if (provider === 'youtube') return 'Watch on YouTube';
  if (provider === 'spotify') return 'Listen on Spotify';
  if (provider === 'soundcloud') return 'Listen on SoundCloud';
  if (provider === 'instagram') return 'Open Instagram Profile';
  if (provider === 'substack') return 'Read on Substack';
  if (provider === 'untitled') return 'Listen on Untitled';
  if (provider === 'google_drive') return 'Open file';
  return 'Open link';
};

export const providerFromUrl = (urlValue: string): LinkHubProvider | null => {
  const parsed = parseUrl(urlValue);
  if (!parsed) return null;

  const host = parsed.hostname.toLowerCase();
  if (host.includes('instagram.com')) return 'instagram';
  if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
  if (host.includes('spotify.com')) return 'spotify';
  if (host.includes('soundcloud.com') || host.includes('snd.sc')) return 'soundcloud';
  if (host.includes('untitled.stream')) return 'untitled';
  if (host.includes('substack.com')) return 'substack';
  if (host.includes('drive.google.com')) return 'google_drive';
  if (host.includes('threads.net')) return 'threads';
  if (host.includes('tiktok.com')) return 'tiktok';
  if (host === 'x.com' || host === 'www.x.com' || host.includes('twitter.com')) return 'x';

  return null;
};

const extractGoogleDriveFileId = (parsed: URL): string | null => {
  const fromPath = parsed.pathname.match(/^\/file\/d\/([^/]+)/);
  if (fromPath?.[1]) return fromPath[1];

  const fromQuery = parsed.searchParams.get('id');
  if (fromQuery) return fromQuery;

  return null;
};

export const resolveEmbed = (urlValue: string, preferredProvider?: LinkHubProvider | null): EmbedResolution => {
  const provider = preferredProvider ?? providerFromUrl(urlValue);
  if (!provider) {
    return { provider: null, embedUrl: null, embeddable: false, reason: 'unknown' };
  }

  const parsed = parseUrl(urlValue);
  if (!parsed) {
    return { provider, embedUrl: null, embeddable: false, reason: 'unknown' };
  }

  if (provider === 'spotify' && /SPOTIFY_PLAYLIST_ID/i.test(urlValue)) {
    return { provider, embedUrl: null, embeddable: false, reason: 'placeholder' };
  }

  if (provider === 'google_drive') {
    const fileId = extractGoogleDriveFileId(parsed);
    if (!fileId) {
      return { provider, embedUrl: null, embeddable: false, reason: 'unsupported_url_shape' };
    }

    return {
      provider,
      embedUrl: `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`,
      embeddable: true,
      reason: 'ok'
    };
  }

  if (provider === 'youtube') {
    if (parsed.pathname.startsWith('/embed/')) {
      const embedPath = parsed.pathname.replace(/^\/embed/, '');
      const embedQuery = parsed.search || '';
      return {
        provider,
        embedUrl: `${YOUTUBE_EMBED_BASE_URL}${embedPath}${embedQuery}`,
        embeddable: true,
        reason: 'ok'
      };
    }

    const playlistId = parsed.searchParams.get('list');
    if (playlistId) {
      return {
        provider,
        embedUrl: `${YOUTUBE_EMBED_BASE_URL}/videoseries?list=${encodeURIComponent(playlistId)}`,
        embeddable: true,
        reason: 'ok'
      };
    }

    const host = parsed.hostname.toLowerCase();
    if (host.includes('youtu.be')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      if (id) {
        return { provider, embedUrl: `${YOUTUBE_EMBED_BASE_URL}/${id}`, embeddable: true, reason: 'ok' };
      }
    }

    const shorts = parsed.pathname.match(/^\/shorts\/([^/]+)/);
    if (shorts?.[1]) {
      return { provider, embedUrl: `${YOUTUBE_EMBED_BASE_URL}/${shorts[1]}`, embeddable: true, reason: 'ok' };
    }

    const videoId = parsed.searchParams.get('v');
    if (videoId) {
      return { provider, embedUrl: `${YOUTUBE_EMBED_BASE_URL}/${videoId}`, embeddable: true, reason: 'ok' };
    }

    return { provider, embedUrl: null, embeddable: false, reason: 'unsupported_url_shape' };
  }

  if (provider === 'spotify') {
    if (parsed.pathname.startsWith('/embed/')) {
      return { provider, embedUrl: urlValue, embeddable: true, reason: 'ok' };
    }

    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length >= 2) {
      const [kind, id] = segments;
      if (kind && id) {
        return {
          provider,
          embedUrl: `https://open.spotify.com/embed/${kind}/${id}`,
          embeddable: true,
          reason: 'ok'
        };
      }
    }

    return { provider, embedUrl: null, embeddable: false, reason: 'unsupported_url_shape' };
  }

  if (provider === 'soundcloud') {
    const host = parsed.hostname.toLowerCase();
    if (host.includes('w.soundcloud.com')) {
      return { provider, embedUrl: urlValue, embeddable: true, reason: 'ok' };
    }

    return {
      provider,
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(urlValue)}`,
      embeddable: true,
      reason: 'ok'
    };
  }

  if (provider === 'instagram') {
    const match = parsed.pathname.match(/^\/(p|reel|tv)\/([^/]+)/);
    if (match?.[1] && match?.[2]) {
      return {
        provider,
        embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/embed`,
        embeddable: true,
        reason: 'ok'
      };
    }

    return { provider, embedUrl: null, embeddable: false, reason: 'profile_only' };
  }

  if (provider === 'untitled') {
    if (parsed.pathname.includes('/invite/')) {
      return { provider, embedUrl: null, embeddable: false, reason: 'invite_link' };
    }

    if (parsed.pathname.startsWith('/embed/') || parsed.pathname.endsWith('/embed')) {
      return { provider, embedUrl: urlValue, embeddable: true, reason: 'ok' };
    }

    return { provider, embedUrl: null, embeddable: false, reason: 'unsupported_url_shape' };
  }

  return { provider, embedUrl: null, embeddable: false, reason: 'unsupported_url_shape' };
};

export const getEmbedHeight = (provider: LinkHubProvider | null): number => {
  if (provider === 'spotify') return 152;
  if (provider === 'soundcloud') return 180;
  if (provider === 'untitled') return 344;
  if (provider === 'instagram') return 420;
  if (provider === 'google_drive') return 400;
  return 300;
};

const getYouTubeViewMode = (urlValue?: string): EmbedViewMode => {
  const parsed = typeof urlValue === 'string' ? parseUrl(urlValue) : null;
  if (!parsed) return 'landscape';

  const hasPlaylist = Boolean(parsed.searchParams.get('list'));
  if (hasPlaylist && (parsed.pathname === '/playlist' || parsed.pathname === '/embed/videoseries')) {
    return 'stack';
  }

  if (hasPlaylist && parsed.pathname === '/watch') {
    return 'stack';
  }

  if (/^\/shorts\/[^/]+/.test(parsed.pathname)) {
    return 'portrait';
  }

  return 'landscape';
};

export const getEmbedViewMode = (provider: LinkHubProvider | null, urlValue?: string): EmbedViewMode => {
  if (provider === 'youtube') return getYouTubeViewMode(urlValue);
  if (provider === 'instagram') return 'portrait';
  return 'landscape';
};

export const getEmbedAspectRatio = (provider: LinkHubProvider | null, urlValue?: string): string | null => {
  if (provider === 'youtube') {
    const viewMode = getYouTubeViewMode(urlValue);
    if (viewMode === 'portrait') return '9 / 16';
    if (viewMode === 'stack') return '10 / 11';
    return '16 / 9';
  }
  if (provider === 'instagram') return '4 / 5';
  return null;
};

export const getProviderBadgeLabel = (provider: LinkHubProvider | null, urlValue?: string): string => {
  if (provider === 'youtube') return 'YouTube';
  if (provider === 'spotify') return 'Spotify';
  if (provider === 'soundcloud') return 'SoundCloud';
  if (provider === 'instagram') return 'Instagram';
  if (provider === 'threads') return 'Threads';
  if (provider === 'tiktok') return 'TikTok';
  if (provider === 'substack') return 'Substack';
  if (provider === 'untitled') return 'Untitled';
  if (provider === 'google_drive') return 'Google Drive';
  if (provider === 'x') return 'X';
  if (urlValue && isLinktreeHost(urlValue)) return 'Linktree';
  return 'Link';
};

const AUTHORED_FALLBACK_DEFAULTS: Partial<Record<LinkHubProvider, string>> = {
  instagram: 'Visual field notes and daily fragments from the path.',
  threads: 'Short signals and daily transmissions from the archive.',
  tiktok: 'Short-form movement, sound, and visual experiments.',
  substack: 'Longer writing and extended signals from the path.',
  untitled: 'Raw session - part of the living archive.',
  spotify: 'Raw session - part of the living archive.',
  youtube: 'Raw session - part of the living archive.'
};

export const getAuthoredFallbackExcerpt = (
  provider: LinkHubProvider | null,
  options?: { itemExcerpt?: string; urlValue?: string }
): string => {
  const itemExcerpt = String(options?.itemExcerpt || '').trim();
  if (itemExcerpt) return itemExcerpt;

  if (options?.urlValue && isLinktreeHost(options.urlValue)) {
    return 'Support routing and archive chronology across the wider network.';
  }

  if (provider && AUTHORED_FALLBACK_DEFAULTS[provider]) {
    return AUTHORED_FALLBACK_DEFAULTS[provider] || 'Open this archive signal in its original source.';
  }

  return 'Open this archive signal in its original source.';
};

export const getEmbedFallbackMessage = (resolution: EmbedResolution): string => {
  if (
    resolution.provider === 'untitled' &&
    (resolution.reason === 'unsupported_url_shape' || resolution.reason === 'invite_link')
  ) {
    return "Untitled links need a dedicated /embed URL for inline playback. Open the original link to view this piece.";
  }

  if (resolution.provider === 'instagram' && resolution.reason === 'profile_only') {
    return "Profiles can't be embedded here. Open the Instagram profile or use a specific post/reel URL.";
  }

  if (resolution.provider === 'google_drive' && resolution.reason === 'unsupported_url_shape') {
    return "This Drive URL format can't be embedded here. Open the file link directly.";
  }

  if (resolution.reason === 'placeholder') {
    return 'Embed preview is unavailable until a real source URL is configured.';
  }

  return "This source can't be embedded inline. Open the original link.";
};
