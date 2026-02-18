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

const DEFAULT_SPOTIFY_PLAYLIST_ID = '1aeafuJB347VmKXu4jvaTO';
const spotifyPlaylistValue = String(import.meta.env.PUBLIC_SPOTIFY_PLAYLIST_ID || DEFAULT_SPOTIFY_PLAYLIST_ID).trim();
const spotifyNowListeningUrl = spotifyPlaylistValue.startsWith('https://')
  ? spotifyPlaylistValue
  : `https://open.spotify.com/playlist/${spotifyPlaylistValue}`;
const SUBSTACK_PROFILE_URL = 'https://substack.com/@aesu?r=2ejeld&shareImageVariant=blur&utm_medium=ios&utm_source=profile';
const SUBSTACK_FEED_URL = 'https://aesarchive.substack.com/feed';

export const LINK_HUB_ICONS: LinkHubIconLink[] = [
  { title: 'YouTube', url: 'https://www.youtube.com/@a_e.s_4', icon: 'YT' },
  { title: 'Instagram', url: 'https://www.instagram.com/a_e.s_', icon: 'IG' },
  { title: 'X', url: 'https://x.com/a_e_s_4', icon: 'X' },
  { title: 'TikTok', url: 'https://tiktok.com/@a_e.s', icon: 'TT' },
  { title: 'SoundCloud', url: 'https://soundcloud.com/aesuero', icon: 'SC' },
  { title: 'Threads', url: 'https://www.threads.com/@a_e.s', icon: 'TH' },
  { title: 'Twitch', url: 'https://www.twitch.tv/thatoneyonder', icon: 'TW' },
  { title: 'Substack', url: SUBSTACK_PROFILE_URL, icon: 'SB' },
  { title: 'Linktree', url: 'https://linktr.ee/a_e.s_', icon: 'LT' },
  { title: 'Discord', url: '/discord', icon: 'DC' },
  { title: 'Spotify', url: spotifyNowListeningUrl, icon: 'SP' },
  { title: 'Email', url: '/contact', icon: '@' }
];

export const LINK_HUB_CATEGORIES: LinkHubCategory[] = [
  {
    id: 'music',
    label: 'Music',
    items: [
      {
        id: 'now-listening',
        title: 'Now Listening (Vol 4)',
        url: spotifyNowListeningUrl,
        year: '2026',
        tag: 'Vol 4',
        preferredEmbed: 'spotify'
      },
      {
        id: 'my-first-beat-tape',
        title: 'My First Beat Tape',
        url: 'https://untitled.stream/library/project/W9oQWS6klQAAftkyx28QL',
        year: '2026',
        tag: 'Project',
        preferredEmbed: 'untitled'
      },
      {
        id: 'everyday-soundscape',
        title: 'The Every Day Soundscape',
        url: 'https://untitled.stream/library/track/tbolNlQAX1cXSZr3bLWeh',
        year: '2026',
        tag: 'Track',
        preferredEmbed: 'untitled'
      },
      {
        id: 'queries-beat-tape',
        title: 'Queries Beat Tape',
        url: 'https://untitled.stream/library/project/yJu7cTKC0F3qvrRqs2EzA',
        year: '2026',
        tag: 'Project',
        preferredEmbed: 'untitled'
      },
      {
        id: 'scraps-2023-2024',
        title: 'Scraps 2023-2024',
        url: 'https://untitled.stream/invite/sUL08iLtaVYP3UbF2ehDg',
        year: '2026',
        tag: 'Invite'
      },
      {
        id: 'vol-1-spotify',
        title: 'Volume 1 - Spotify',
        url: 'https://open.spotify.com/playlist/3J99oKrZvILt0zrGa5XUW8',
        year: '2026',
        tag: 'Vol 1',
        preferredEmbed: 'spotify'
      },
      {
        id: 'vol-2-spotify',
        title: 'Volume 2 - Spotify',
        url: 'https://open.spotify.com/playlist/2hhUhKocUVUIVG7aWmjvH9',
        year: '2026',
        tag: 'Vol 2',
        preferredEmbed: 'spotify'
      },
      {
        id: 'vol-3-spotify',
        title: 'Volume 3 - Spotify',
        url: 'https://open.spotify.com/playlist/5ZZLhPOVAzr7QufXPiD5dQ',
        year: '2026',
        tag: 'Vol 3',
        preferredEmbed: 'spotify'
      },
      {
        id: 'vol-4-spotify',
        title: 'Volume 4 - Spotify',
        url: 'https://open.spotify.com/playlist/1aeafuJB347VmKXu4jvaTO',
        year: '2026',
        tag: 'Vol 4',
        preferredEmbed: 'spotify'
      },
      {
        id: 'vol-1-soundcloud',
        title: 'Volume 1 - SoundCloud',
        url: 'https://soundcloud.com/aesuero/sets/volume-1-angel-sueros-top-100',
        year: '2026',
        tag: 'Vol 1',
        preferredEmbed: 'soundcloud'
      },
      {
        id: 'vol-2-soundcloud',
        title: 'Volume 2 - SoundCloud',
        url: 'https://soundcloud.com/aesuero/sets/volume-2-angel-sueros-top-most',
        year: '2026',
        tag: 'Vol 2',
        preferredEmbed: 'soundcloud'
      },
      {
        id: 'vol-3-soundcloud',
        title: 'Volume 3 - SoundCloud',
        url: 'https://soundcloud.com/aesuero/sets/volume-3-angel-sueros-top-50',
        year: '2026',
        tag: 'Vol 3',
        preferredEmbed: 'soundcloud'
      },
      {
        id: 'vol-4-soundcloud',
        title: 'Volume 4 - SoundCloud',
        url: 'https://soundcloud.com/aesuero/sets/volume-4-angel-sueros-top-50',
        year: '2026',
        tag: 'Vol 4',
        preferredEmbed: 'soundcloud'
      },
      {
        id: 'vol-1-youtube-music',
        title: 'Volume 1 - YouTube Music',
        url: 'https://music.youtube.com/playlist?list=PL40ATpghmK-pbMGHG0bN4_71Kj_oCT6pI',
        year: '2026',
        tag: 'Vol 1',
        preferredEmbed: 'youtube'
      },
      {
        id: 'vol-2-youtube-music',
        title: 'Volume 2 - YouTube Music',
        url: 'https://music.youtube.com/playlist?list=PL40ATpghmK-rejOZXry9DjMORNXWCfQ9a',
        year: '2026',
        tag: 'Vol 2',
        preferredEmbed: 'youtube'
      },
      {
        id: 'vol-3-youtube-music',
        title: 'Volume 3 - YouTube Music',
        url: 'https://music.youtube.com/playlist?list=PL40ATpghmK-p2C15L1Ai2jY8EMpPs03a6',
        year: '2026',
        tag: 'Vol 3',
        preferredEmbed: 'youtube'
      },
      {
        id: 'vol-4-youtube-music',
        title: 'Volume 4 - YouTube Music',
        url: 'https://music.youtube.com/playlist?list=PL40ATpghmK-pfmvHYfs6BqSyYciYxK02G',
        year: '2026',
        tag: 'Vol 4',
        preferredEmbed: 'youtube'
      },
      {
        id: 'vol-3-smart-link',
        title: 'Volume 3 Smart Link',
        url: 'https://sdz.sh/FDoCqk',
        year: '2026',
        tag: 'Smart Link'
      },
      {
        id: 'vol-4-smart-link',
        title: 'Volume 4 Smart Link',
        url: 'https://sdz.sh/yFOERE',
        year: '2026',
        tag: 'Smart Link'
      },
      {
        id: 'vol-1-linktree',
        title: 'Volume 1 Linktree',
        url: 'https://linktr.ee/a_e.s_playlist',
        year: '2026',
        tag: 'Linktree'
      },
      {
        id: 'vol-2-linktree',
        title: 'Volume 2 Linktree',
        url: 'https://linktr.ee/a_e.s_volume2',
        year: '2026',
        tag: 'Linktree'
      },
      {
        id: 'soundcloud-profile',
        title: 'SoundCloud Profile',
        url: 'https://soundcloud.com/aesuero',
        year: '2026',
        tag: 'Profile',
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
        title: 'Substack Profile',
        url: SUBSTACK_PROFILE_URL,
        year: '2026',
        tag: 'Profile',
        preferredEmbed: 'substack'
      },
      {
        id: 'substack-feed',
        title: 'Substack Feed',
        url: SUBSTACK_FEED_URL,
        year: '2026',
        tag: 'RSS'
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
      },
      {
        id: 'magazine-publication',
        title: 'A Magazine Publication',
        url: 'https://jstrieb.github.io/link-lock/',
        year: '2026',
        tag: 'Locked'
      }
    ]
  },
  {
    id: 'video',
    label: 'Video',
    items: [
      {
        id: 'everyday-life-video',
        title: 'The Everyday Life Video',
        url: 'https://youtu.be/KWDgWpSDlrM?si=-3TuP0xU0t5egiZA',
        year: '2026',
        tag: 'Feature',
        preferredEmbed: 'youtube'
      },
      {
        id: 'youtube-channel',
        title: 'YouTube Channel',
        url: 'https://www.youtube.com/@a_e.s_4',
        year: '2026',
        tag: 'Channel'
      },
      {
        id: 'upa-yoga-playlist',
        title: 'Upa-Yoga Playlist',
        url: 'https://youtube.com/playlist?list=PL3uDtbb3OvDMd3kUaU7uJgujVpsURetBm&si=0dO65IKEcEfzp9Mv',
        year: '2026',
        tag: 'Wellbeing',
        preferredEmbed: 'youtube'
      },
      {
        id: 'post-labor-econ-playlist',
        title: 'Post-Labor Economics Playlist',
        url: 'https://youtube.com/playlist?list=PLV3Fr1UUO9bFTYDqL9KIjrdlurcoMlLxg&si=_elIo4HIDudOyfs5',
        year: '2026',
        tag: 'Work',
        preferredEmbed: 'youtube'
      },
      {
        id: 'morning-brew-daily',
        title: 'Morning Brew Daily',
        url: 'https://youtube.com/@morningbrewdailyshow?si=cxR3h5lKr2MMs8MP',
        year: '2026',
        tag: 'Society'
      }
    ]
  },
  {
    id: 'resources',
    label: 'Resources',
    items: [
      {
        id: 'practicing-kriya',
        title: 'Practicing Kriya',
        url: 'https://drive.google.com/file/d/1TcERCTJS1opeyJJ3A5SSFHQBvF7LLBc6/view?usp=drivesdk',
        year: '2026',
        tag: 'Wellbeing'
      },
      {
        id: 'resources-for-humans',
        title: 'Resources For Peeps / Humans',
        url: 'https://linktr.ee/resourcesonlyforhumans',
        year: '2026',
        tag: 'Wellbeing'
      },
      {
        id: 'miracle-of-mind-play',
        title: 'Miracle of Mind (Google Play)',
        url: 'https://play.google.com/store/apps/details?id=org.sadhguru.miracleofmind&hl=en_US',
        year: '2026',
        tag: 'Wellbeing'
      },
      {
        id: 'miracle-of-mind-app-store',
        title: 'Miracle of Mind (App Store)',
        url: 'https://apps.apple.com/us/app/miracle-of-mind-sadhguru/id6737795677',
        year: '2026',
        tag: 'Wellbeing'
      },
      {
        id: 'up-first-podcast',
        title: 'Up First (NPR)',
        url: 'https://podcasts.apple.com/us/podcast/up-first-from-npr/id1222114325',
        year: '2026',
        tag: 'Society'
      },
      {
        id: 'ezra-klein-show',
        title: 'The Ezra Klein Show',
        url: 'https://podcasts.apple.com/us/podcast/the-ezra-klein-show/id1548604447',
        year: '2026',
        tag: 'Society'
      },
      {
        id: 'ted-data-talk',
        title: 'TED: Why You Should Get Paid For Your Data',
        url: 'https://www.ted.com/talks/jennifer_zhu_scott_why_you_should_get_paid_for_your_data',
        year: '2026',
        tag: 'Society'
      },
      {
        id: 'mit-living-wage',
        title: 'MIT Living Wage Calculator',
        url: 'https://livingwage.mit.edu/',
        year: '2026',
        tag: 'Work'
      },
      {
        id: 'work-archive',
        title: 'Work Archive',
        url: '/work',
        year: '2026',
        tag: 'On-site'
      },
      {
        id: 'map',
        title: 'Map',
        url: '/map',
        year: '2026',
        tag: 'On-site'
      },
      {
        id: 'survival-os',
        title: 'Survival OS',
        url: '/survival-os',
        year: '2026',
        tag: 'Blueprint'
      }
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
      { id: 'instagram', title: 'Instagram', url: 'https://www.instagram.com/a_e.s_', year: '2026', tag: 'Visual' },
      { id: 'youtube', title: 'YouTube', url: 'https://www.youtube.com/@a_e.s_4', year: '2026', tag: 'Video' },
      { id: 'x', title: 'X', url: 'https://x.com/a_e_s_4', year: '2026', tag: 'Updates' },
      { id: 'tiktok', title: 'TikTok', url: 'https://tiktok.com/@a_e.s', year: '2026', tag: 'Shorts' },
      { id: 'soundcloud', title: 'SoundCloud', url: 'https://soundcloud.com/aesuero', year: '2026', tag: 'Audio' },
      { id: 'threads', title: 'Threads', url: 'https://www.threads.com/@a_e.s', year: '2026', tag: 'Community' },
      { id: 'twitch', title: 'Twitch', url: 'https://www.twitch.tv/thatoneyonder', year: '2026', tag: 'Live' },
      { id: 'substack', title: 'Substack', url: SUBSTACK_PROFILE_URL, year: '2026', tag: 'Writing' },
      { id: 'linktree', title: 'Linktree', url: 'https://linktr.ee/a_e.s_', year: '2026', tag: 'Hub' },
      { id: 'discord', title: 'Discord', url: '/discord', year: '2026', tag: 'Servers' },
      { id: 'contact', title: 'Contact', url: '/contact', year: '2026', tag: 'Email' }
    ]
  }
];
