export type LinkHubProvider = 'spotify' | 'youtube' | 'soundcloud' | 'untitled' | 'substack' | 'instagram';
export type LinkHubCategoryId = 'music' | 'writing' | 'video' | 'resources' | 'legal' | 'social';

export interface LinkHubItem {
  id: string;
  title: string;
  url: string;
  year?: string;
  tag?: string;
  preferredEmbed?: LinkHubProvider;
}

export interface LinkHubCategory {
  id: LinkHubCategoryId;
  label: string;
  items: LinkHubItem[];
}

export interface LinkHubIconLink {
  title: string;
  url: string;
  icon: string;
}

const spotifyPlaylistId = String(import.meta.env.PUBLIC_SPOTIFY_PLAYLIST_ID || '').trim();
const linkHubFallbackUrl = 'https://linktr.ee/a_e.s_';
const spotifyNowListeningUrl = spotifyPlaylistId
  ? `https://open.spotify.com/playlist/${spotifyPlaylistId}`
  : linkHubFallbackUrl;

export const LINK_HUB_ICONS: LinkHubIconLink[] = [
  { title: 'YouTube', url: 'https://www.youtube.com/@a_e.s_4', icon: 'YT' },
  { title: 'Instagram', url: 'https://instagram.com/a_e.s_', icon: 'IG' },
  { title: 'Discord', url: '/discord', icon: 'DC' },
  { title: 'Substack', url: 'https://aesarchive.substack.com', icon: 'SB' },
  { title: 'Spotify', url: spotifyNowListeningUrl, icon: 'SP' },
  { title: 'Untitled', url: 'https://untitled.stream/m8IEX655GwMH', icon: 'UN' },
  { title: 'Email', url: '/contact', icon: '@' }
];

export const LINK_HUB_CATEGORIES: LinkHubCategory[] = [
  {
    id: 'music',
    label: 'Music',
    items: [
      {
        id: 'now-listening',
        title: 'Now Listening',
        url: spotifyNowListeningUrl,
        year: '2026',
        tag: spotifyPlaylistId ? 'Playlist' : 'Link hub',
        preferredEmbed: spotifyPlaylistId ? 'spotify' : undefined
      },
      {
        id: 'untitled-stream',
        title: 'Untitled Stream',
        url: 'https://untitled.stream/m8IEX655GwMH',
        year: '2026',
        tag: 'Live',
        preferredEmbed: 'untitled'
      },
      {
        id: 'soundcloud',
        title: 'SoundCloud',
        url: 'https://soundcloud.com/a_e-s_',
        year: '2026',
        tag: 'Archive',
        preferredEmbed: 'soundcloud'
      }
    ]
  },
  {
    id: 'writing',
    label: 'Writing',
    items: [
      {
        id: 'substack',
        title: 'Substack Publication',
        url: 'https://aesarchive.substack.com',
        year: '2026',
        tag: 'Newsletter',
        preferredEmbed: 'substack'
      },
      {
        id: 'writing-archive',
        title: 'Writing Archive',
        url: '/writing',
        year: '2026',
        tag: 'On-site'
      },
      {
        id: 'rss-feed',
        title: 'RSS Feed',
        url: '/rss.xml',
        year: '2026',
        tag: 'Feed'
      }
    ]
  },
  {
    id: 'video',
    label: 'Video',
    items: [
      {
        id: 'youtube',
        title: 'YouTube Channel',
        url: 'https://www.youtube.com/@a_e.s_4',
        year: '2026',
        tag: 'Channel',
        preferredEmbed: 'youtube'
      },
      {
        id: 'work-archive',
        title: 'Work Archive',
        url: '/work',
        year: '2026',
        tag: 'Projects'
      }
    ]
  },
  {
    id: 'resources',
    label: 'Resources',
    items: [
      { id: 'linktree', title: 'Linktree', url: 'https://linktr.ee/a_e.s_', year: '2026', tag: 'Hub' },
      { id: 'press-kit', title: 'Press Kit', url: '/press-kit', year: '2026', tag: 'Media' },
      { id: 'map', title: 'Map', url: '/map', year: '2026', tag: 'Locations' }
    ]
  },
  {
    id: 'legal',
    label: 'Legal',
    items: [
      {
        id: 'ai-accountability',
        title: 'AI Accountability Pledge',
        url: '/ai-accountability-pledge',
        year: '2026',
        tag: 'Policy'
      }
    ]
  },
  {
    id: 'social',
    label: 'Social',
    items: [
      { id: 'instagram', title: 'Instagram', url: 'https://instagram.com/a_e.s_', year: '2026', tag: 'Visual' },
      { id: 'discord', title: 'Discord', url: '/discord', year: '2026', tag: 'Servers' },
      { id: 'x', title: 'X', url: 'https://x.com/AngelESuero', year: '2026', tag: 'Threads' },
      { id: 'github', title: 'GitHub', url: 'https://github.com/AngelESuero', year: '2026', tag: 'Code' },
      { id: 'contact', title: 'Contact', url: '/contact', year: '2026', tag: 'Email' }
    ]
  }
];
