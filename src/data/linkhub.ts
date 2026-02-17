export type LinkHubProvider = 'spotify' | 'youtube' | 'soundcloud' | 'untitled' | 'substack';

export interface LinkHubItem {
  title: string;
  url: string;
  year?: string;
  tag?: string;
  preferredEmbed?: LinkHubProvider;
}

export interface LinkHubCategory {
  id: 'music' | 'writing' | 'video' | 'resources' | 'legal' | 'social';
  label: string;
  items: LinkHubItem[];
}

export interface LinkHubIconLink {
  title: string;
  url: string;
  icon: string;
}

export const LINK_HUB_ICONS: LinkHubIconLink[] = [
  { title: 'YouTube', url: 'https://www.youtube.com/@a_e.s_4', icon: 'YT' },
  { title: 'X', url: 'https://x.com/AngelESuero', icon: 'X' },
  { title: 'Instagram', url: 'https://instagram.com/a_e.s_', icon: 'IG' },
  { title: 'Substack', url: 'https://aesarchive.substack.com', icon: 'SB' },
  { title: 'Spotify', url: 'https://open.spotify.com/playlist/SPOTIFY_PLAYLIST_ID', icon: 'SP' },
  { title: 'Email', url: '/contact', icon: '@' }
];

export const LINK_HUB_CATEGORIES: LinkHubCategory[] = [
  {
    id: 'music',
    label: 'Music',
    items: [
      {
        title: 'Now Listening',
        url: 'https://open.spotify.com/playlist/SPOTIFY_PLAYLIST_ID',
        year: '2026',
        tag: 'Now Listening',
        preferredEmbed: 'spotify'
      },
      {
        title: 'Untitled Stream',
        url: 'https://untitled.stream/embed/m8IEX655GwMH',
        year: '2026',
        tag: 'Live',
        preferredEmbed: 'untitled'
      },
      {
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
        title: 'Substack Publication',
        url: 'https://aesarchive.substack.com',
        year: '2026',
        tag: 'Newsletter',
        preferredEmbed: 'substack'
      },
      {
        title: 'Writing Archive',
        url: '/writing',
        year: '2026',
        tag: 'On-site'
      },
      {
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
        title: 'YouTube Channel',
        url: 'https://www.youtube.com/@a_e.s_4',
        year: '2026',
        tag: 'Channel',
        preferredEmbed: 'youtube'
      },
      {
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
      { title: 'Press Kit', url: '/press-kit', year: '2026', tag: 'Media' },
      { title: 'Map', url: '/map', year: '2026', tag: 'Locations' },
      { title: 'Linktree', url: 'https://linktr.ee/a_e.s_', year: '2026', tag: 'Hub' }
    ]
  },
  {
    id: 'legal',
    label: 'Legal',
    items: [
      {
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
      { title: 'Instagram', url: 'https://instagram.com/a_e.s_', year: '2026', tag: 'Visual' },
      { title: 'X', url: 'https://x.com/AngelESuero', year: '2026', tag: 'Threads' },
      { title: 'Threads', url: 'https://www.threads.net/@a_e.s_', year: '2026', tag: 'Community' },
      { title: 'TikTok', url: 'https://www.tiktok.com/@a_e.s_4', year: '2026', tag: 'Shorts' }
    ]
  }
];

export const SUBSTACK_FEED_URL = 'https://aesarchive.substack.com/feed';
