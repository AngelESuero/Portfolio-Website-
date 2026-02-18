import { MUSIC_URLS, SOCIAL_URLS, VIDEO_URLS } from './site-refs';

export interface SocialConfigItem {
  slug: string;
  title: string;
  description?: string;
  primary_url: string;
  mode: 'rss' | 'manual';
  rss_url?: string;
  local_preview?: 'instagram';
  featured?: Array<{ label: string; url: string }>;
  embeds?: Array<{ label?: string; url: string }>;
}

const socialConfig: SocialConfigItem[] = [
  {
    slug: 'instagram',
    title: 'Instagram',
    description: 'Local-first archive page with curated posts from Google Photos exports.',
    primary_url: SOCIAL_URLS.instagram,
    mode: 'manual',
    local_preview: 'instagram',
    featured: [
      { label: 'Profile', url: SOCIAL_URLS.instagram },
      { label: 'Open local archive', url: '/instagram' }
    ]
  },
  {
    slug: 'youtube',
    title: 'YouTube',
    description: 'Videos, visual essays, and process uploads.',
    primary_url: SOCIAL_URLS.youtube,
    mode: 'manual',
    featured: [
      { label: 'Channel home', url: SOCIAL_URLS.youtube },
      { label: 'The Everyday Life Video', url: VIDEO_URLS.everydayLifeVideo }
    ],
    embeds: [{ label: 'The Everyday Life Video', url: VIDEO_URLS.everydayLifeVideo }]
  },
  {
    slug: 'soundcloud',
    title: 'SoundCloud',
    description: 'Audio sketches, references, and publish-ready cuts.',
    primary_url: SOCIAL_URLS.soundcloud,
    mode: 'manual',
    featured: [
      { label: 'Profile', url: SOCIAL_URLS.soundcloud },
      { label: 'Volume 4 set', url: 'https://soundcloud.com/aesuero/sets/volume-4-angel-sueros-top-50' }
    ]
  },
  {
    slug: 'substack',
    title: 'Substack',
    description: 'Long-form writing, dispatches, and behind-the-scenes notes.',
    primary_url: SOCIAL_URLS.substackProfile,
    mode: 'rss',
    rss_url: SOCIAL_URLS.substackFeed,
    featured: [
      { label: 'Profile', url: SOCIAL_URLS.substackProfile },
      { label: 'Publication feed', url: SOCIAL_URLS.substackPublication }
    ]
  },
  {
    slug: 'spotify',
    title: 'Spotify',
    description: 'Now Listening playlist and release-adjacent references.',
    primary_url: MUSIC_URLS.spotifyVol4,
    mode: 'manual',
    featured: [
      { label: 'Now Listening (Vol 4)', url: MUSIC_URLS.spotifyVol4 },
      { label: 'Volume 3', url: MUSIC_URLS.spotifyVol3 }
    ],
    embeds: [{ label: 'Now Listening (Vol 4)', url: MUSIC_URLS.spotifyVol4 }]
  },
  {
    slug: 'untitled',
    title: 'Untitled',
    description: 'Direct stream player for live and in-progress music sets.',
    primary_url: MUSIC_URLS.untitledMyFirstBeatTape,
    mode: 'manual',
    featured: [
      { label: 'My First Beat Tape', url: MUSIC_URLS.untitledMyFirstBeatTape },
      { label: 'The Every Day Soundscape', url: MUSIC_URLS.untitledEveryDaySoundscape },
      { label: 'Queries Beat Tape', url: MUSIC_URLS.untitledQueriesBeatTape }
    ],
    embeds: [{ label: 'My First Beat Tape', url: MUSIC_URLS.untitledMyFirstBeatTape }]
  },
  {
    slug: 'discord',
    title: 'Discord',
    description: 'Three hubs: creators, news, and a local-only community living room.',
    primary_url: SOCIAL_URLS.discordHub,
    mode: 'manual',
    featured: [
      { label: 'Creators Corner', url: SOCIAL_URLS.discordCreators },
      { label: 'News Corner', url: SOCIAL_URLS.discordNews },
      { label: 'Community Corner (local-only)', url: SOCIAL_URLS.discordCommunity }
    ]
  },
  {
    slug: 'x',
    title: 'X',
    description: 'Short-form commentary and research notes.',
    primary_url: SOCIAL_URLS.x,
    mode: 'manual',
    featured: [{ label: 'Profile', url: SOCIAL_URLS.x }]
  },
  {
    slug: 'threads',
    title: 'Threads',
    description: 'Community updates and visual snippets.',
    primary_url: SOCIAL_URLS.threads,
    mode: 'manual',
    featured: [{ label: 'Profile', url: SOCIAL_URLS.threads }]
  },
  {
    slug: 'tiktok',
    title: 'TikTok',
    description: 'Short clips and experiments adapted for vertical viewing.',
    primary_url: SOCIAL_URLS.tiktok,
    mode: 'manual',
    featured: [{ label: 'Profile', url: SOCIAL_URLS.tiktok }]
  },
  {
    slug: 'twitch',
    title: 'Twitch',
    description: 'Live sessions, breakdowns, and in-progress streams.',
    primary_url: SOCIAL_URLS.twitch,
    mode: 'manual',
    featured: [{ label: 'Channel', url: SOCIAL_URLS.twitch }]
  }
];

export default socialConfig;

