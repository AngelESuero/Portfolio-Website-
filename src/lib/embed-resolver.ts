import type { LinkHubProvider } from '../data/linkhub';

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

  if (provider === 'youtube') {
    if (parsed.pathname.startsWith('/embed/')) {
      return { provider, embedUrl: urlValue, embeddable: true, reason: 'ok' };
    }

    const playlistId = parsed.searchParams.get('list');
    if (playlistId) {
      return {
        provider,
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`,
        embeddable: true,
        reason: 'ok'
      };
    }

    const host = parsed.hostname.toLowerCase();
    if (host.includes('youtu.be')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      if (id) {
        return { provider, embedUrl: `https://www.youtube.com/embed/${id}`, embeddable: true, reason: 'ok' };
      }
    }

    const shorts = parsed.pathname.match(/^\/shorts\/([^/]+)/);
    if (shorts?.[1]) {
      return { provider, embedUrl: `https://www.youtube.com/embed/${shorts[1]}`, embeddable: true, reason: 'ok' };
    }

    const videoId = parsed.searchParams.get('v');
    if (videoId) {
      return { provider, embedUrl: `https://www.youtube.com/embed/${videoId}`, embeddable: true, reason: 'ok' };
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

    if (parsed.pathname.startsWith('/embed/')) {
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
  return 300;
};

export const getEmbedFallbackMessage = (resolution: EmbedResolution): string => {
  if (
    resolution.provider === 'untitled' &&
    (resolution.reason === 'unsupported_url_shape' || resolution.reason === 'invite_link')
  ) {
    return 'Preview isn\'t available for this URL format. Open source to view on Untitled.';
  }

  if (resolution.provider === 'instagram' && resolution.reason === 'profile_only') {
    return 'Instagram profile links do not embed here. Use a specific post or reel URL.';
  }

  if (resolution.reason === 'placeholder') {
    return 'Embed unavailable until a real source URL is configured.';
  }

  return 'Embed unavailable for this source.';
};
