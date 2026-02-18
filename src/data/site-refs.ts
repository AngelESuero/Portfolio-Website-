export const SITE = {
  name: 'Angel Suero',
  baseUrl: 'https://portfolio-website-9c9.pages.dev',
  linkHubUrl: 'https://linktr.ee/a_e.s_'
} as const;

export const SOCIAL_URLS = {
  instagram: 'https://www.instagram.com/a_e.s_',
  youtube: 'https://www.youtube.com/@a_e.s_4',
  x: 'https://x.com/a_e_s_4',
  tiktok: 'https://tiktok.com/@a_e.s',
  soundcloud: 'https://soundcloud.com/aesuero',
  threads: 'https://www.threads.com/@a_e.s',
  twitch: 'https://www.twitch.tv/thatoneyonder',
  substackProfile: 'https://substack.com/@aesu?r=2ejeld&shareImageVariant=blur&utm_medium=ios&utm_source=profile',
  substackPublication: 'https://aesarchive.substack.com',
  substackFeed: 'https://aesarchive.substack.com/feed',
  linktree: 'https://linktr.ee/a_e.s_',
  discordHub: '/discord',
  discordCreators: 'https://discord.gg/bB6uFZSH',
  discordNews: 'https://discord.gg/sN5qnk4R',
  discordCommunity: '/community-corner'
} as const;

export const MUSIC_URLS = {
  spotifyVol1: 'https://open.spotify.com/playlist/3J99oKrZvILt0zrGa5XUW8',
  spotifyVol2: 'https://open.spotify.com/playlist/2hhUhKocUVUIVG7aWmjvH9',
  spotifyVol3: 'https://open.spotify.com/playlist/5ZZLhPOVAzr7QufXPiD5dQ',
  spotifyVol4: 'https://open.spotify.com/playlist/1aeafuJB347VmKXu4jvaTO',
  untitledMyFirstBeatTape: 'https://untitled.stream/library/project/W9oQWS6klQAAftkyx28QL',
  untitledEveryDaySoundscape: 'https://untitled.stream/library/track/tbolNlQAX1cXSZr3bLWeh',
  untitledQueriesBeatTape: 'https://untitled.stream/library/project/yJu7cTKC0F3qvrRqs2EzA',
  untitledScrapsInvite: 'https://untitled.stream/invite/sUL08iLtaVYP3UbF2ehDg'
} as const;

export const VIDEO_URLS = {
  everydayLifeVideo: 'https://youtu.be/KWDgWpSDlrM?si=-3TuP0xU0t5egiZA'
} as const;

export const RESOURCE_URLS = {
  mitLivingWage: 'https://livingwage.mit.edu/'
} as const;

export const DEFAULT_SPOTIFY_PLAYLIST_ID = '1aeafuJB347VmKXu4jvaTO';

export const getSpotifyPlaylistUrl = (value: string): string =>
  value.startsWith('https://') ? value : `https://open.spotify.com/playlist/${value}`;

