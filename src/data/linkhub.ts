import {
  DEFAULT_SPOTIFY_PLAYLIST_ID,
  MUSIC_URLS,
  RESOURCE_URLS,
  SOCIAL_URLS,
  VIDEO_URLS,
  getSpotifyPlaylistUrl
} from './site-refs';

export type LinkHubProvider = 'spotify' | 'youtube' | 'soundcloud' | 'untitled' | 'substack' | 'instagram' | 'google_drive';
export type LinkHubCategoryId = 'music' | 'writing' | 'video' | 'resources' | 'legal' | 'social';
export type AccentColorKey = 'yellow' | 'blue' | 'orange' | 'red' | 'violet' | 'indigo';

export interface LinkHubItem {
  id: string;
  title: string;
  url: string;
  embedUrl?: string;
  year?: string;
  tag?: string;
  preferredEmbed?: LinkHubProvider;
}

export interface LinkHubCategory {
  id: LinkHubCategoryId;
  label: string;
  color: AccentColorKey;
  items: LinkHubItem[];
}

export interface LinkHubIconLink {
  title: string;
  url: string;
  icon: string;
}

const spotifyPlaylistValue = String(import.meta.env.PUBLIC_SPOTIFY_PLAYLIST_ID || DEFAULT_SPOTIFY_PLAYLIST_ID).trim();
const spotifyNowListeningUrl = getSpotifyPlaylistUrl(spotifyPlaylistValue);
const SUBSTACK_PROFILE_URL = SOCIAL_URLS.substackProfile;
const SUBSTACK_FEED_URL = SOCIAL_URLS.substackFeed;
const YOUTUBE_CHANNEL_ID = 'UCQeJiBS72gxrZXw5GmqtocA';
const YOUTUBE_UPLOADS_PLAYLIST_URL = `https://www.youtube.com/playlist?list=UU${YOUTUBE_CHANNEL_ID.slice(2)}`;

export const LINK_HUB_ICONS: LinkHubIconLink[] = [
  { title: 'YouTube', url: SOCIAL_URLS.youtube, icon: 'YT' },
  { title: 'Instagram', url: SOCIAL_URLS.instagram, icon: 'IG' },
  { title: 'X', url: SOCIAL_URLS.x, icon: 'X' },
  { title: 'TikTok', url: SOCIAL_URLS.tiktok, icon: 'TT' },
  { title: 'SoundCloud', url: SOCIAL_URLS.soundcloud, icon: 'SC' },
  { title: 'Threads', url: SOCIAL_URLS.threads, icon: 'TH' },
  { title: 'Twitch', url: SOCIAL_URLS.twitch, icon: 'TW' },
  { title: 'Substack', url: SUBSTACK_PROFILE_URL, icon: 'SB' },
  { title: 'Linktree', url: SOCIAL_URLS.linktree, icon: 'LT' },
  { title: 'Discord', url: SOCIAL_URLS.discordHub, icon: 'DC' },
  { title: 'Spotify', url: spotifyNowListeningUrl, icon: 'SP' },
  { title: 'Email', url: '/contact', icon: '@' }
];

export const LINK_HUB_CATEGORIES: LinkHubCategory[] = [
  {
    id: 'music',
    label: 'Music',
    color: 'yellow',
    items: [
      {
        id: 'now-listening',
        title: 'Now Listening (Vol 4)',
        url: MUSIC_URLS.spotifyVol4,
        year: '2026',
        tag: 'Vol 4',
        preferredEmbed: 'spotify'
      },
      {
        id: 'my-first-beat-tape',
        title: 'My First Beat Tape',
        url: MUSIC_URLS.untitledMyFirstBeatTape,
        year: '2026',
        tag: 'Project',
        preferredEmbed: 'untitled'
      },
      {
        id: 'everyday-soundscape',
        title: 'The Every Day Soundscape',
        url: 'https://www.youtube.com/watch?v=KWDgWpSDlrM&t=16s',
        year: '2026',
        tag: 'Track',
        preferredEmbed: 'youtube'
      },
      {
        id: 'queries-beat-tape',
        title: 'Queries Beat Tape',
        url: MUSIC_URLS.untitledQueriesBeatTape,
        year: '2026',
        tag: 'Project',
        preferredEmbed: 'untitled'
      },
      {
        id: 'scraps-2023-2024',
        title: 'Scraps 2023-2024',
        url: MUSIC_URLS.untitledScrapsInvite,
        year: '2026',
        tag: 'Invite'
      },
      {
        id: 'vol-1-spotify',
        title: 'Volume 1 - Spotify',
        url: MUSIC_URLS.spotifyVol1,
        year: '2026',
        tag: 'Vol 1',
        preferredEmbed: 'spotify'
      },
      {
        id: 'vol-2-spotify',
        title: 'Volume 2 - Spotify',
        url: MUSIC_URLS.spotifyVol2,
        year: '2026',
        tag: 'Vol 2',
        preferredEmbed: 'spotify'
      },
      {
        id: 'vol-3-spotify',
        title: 'Volume 3 - Spotify',
        url: MUSIC_URLS.spotifyVol3,
        year: '2026',
        tag: 'Vol 3',
        preferredEmbed: 'spotify'
      },
      {
        id: 'vol-4-spotify',
        title: 'Volume 4 - Spotify',
        url: MUSIC_URLS.spotifyVol4,
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
        url: SOCIAL_URLS.soundcloud,
        year: '2026',
        tag: 'Profile',
        preferredEmbed: 'soundcloud'
      }
    ]
  },
  {
    id: 'writing',
    label: 'Writing',
    color: 'red',
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
    color: 'blue',
    items: [
      {
        id: 'everyday-life-video',
        title: 'The Everyday Life Video',
        url: VIDEO_URLS.everydayLifeVideo,
        year: '2026',
        tag: 'Feature',
        preferredEmbed: 'youtube'
      },
      {
        id: 'youtube-channel',
        title: 'YouTube Uploads',
        url: YOUTUBE_UPLOADS_PLAYLIST_URL,
        year: '2026',
        tag: 'Uploads',
        preferredEmbed: 'youtube'
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
    color: 'orange',
    items: [
      {
        id: 'practicing-kriya',
        title: 'Practicing Kriya',
        url: 'https://drive.google.com/file/d/1TcERCTJS1opeyJJ3A5SSFHQBvF7LLBc6/view?usp=drivesdk',
        year: '2024',
        tag: 'Wellbeing',
        preferredEmbed: 'google_drive'
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
        url: RESOURCE_URLS.mitLivingWage,
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
    color: 'indigo',
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
    color: 'violet',
    items: [
      { id: 'instagram', title: 'Instagram', url: SOCIAL_URLS.instagram, year: '2026', tag: 'Visual' },
      { id: 'youtube', title: 'YouTube', url: SOCIAL_URLS.youtube, year: '2026', tag: 'Video' },
      { id: 'x', title: 'X', url: SOCIAL_URLS.x, year: '2026', tag: 'Updates' },
      { id: 'tiktok', title: 'TikTok', url: SOCIAL_URLS.tiktok, year: '2026', tag: 'Shorts' },
      { id: 'soundcloud', title: 'SoundCloud', url: SOCIAL_URLS.soundcloud, year: '2026', tag: 'Audio' },
      { id: 'threads', title: 'Threads', url: SOCIAL_URLS.threads, year: '2026', tag: 'Community' },
      { id: 'twitch', title: 'Twitch', url: SOCIAL_URLS.twitch, year: '2026', tag: 'Live' },
      { id: 'substack', title: 'Substack', url: SUBSTACK_PROFILE_URL, year: '2026', tag: 'Writing' },
      { id: 'linktree', title: 'Linktree', url: SOCIAL_URLS.linktree, year: '2026', tag: 'Hub' },
      { id: 'discord', title: 'Discord', url: SOCIAL_URLS.discordHub, year: '2026', tag: 'Servers' },
      { id: 'contact', title: 'Contact', url: '/contact', year: '2026', tag: 'Email' }
    ]
  }
];
