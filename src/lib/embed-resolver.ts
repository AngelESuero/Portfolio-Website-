import type { LinkHubProvider } from '../data/linkhub';

const YOUTUBE_EMBED_BASE_URL = 'https://www.youtube-nocookie.com/embed';

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

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
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
