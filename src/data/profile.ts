import { SITE, SOCIAL_URLS } from './site-refs';

const profile = {
  name: SITE.name,
  location: 'Newark, NJ',
  roles: ['Music Producer', 'Visual Storyteller', 'Community Builder'],
  mottos: ['Archive the process', 'Keep it human', 'Build with neighbors'],
  short_bio: 'a_e.s_ is a multidisciplinary creator shaping sound, visuals, and civic narratives from Newark. This is an archive of music, visuals, writing, and community work.',
  long_bio:
    'a_e.s_ is a multidisciplinary creator shaping sound, visuals, and civic narratives from Newark. This is an archive of music, visuals, writing, and community work.',
  social_links: {
    instagram: SOCIAL_URLS.instagram,
    youtube: SOCIAL_URLS.youtube,
    discord: SOCIAL_URLS.discordHub,
    discord_creators: SOCIAL_URLS.discordCreators,
    discord_news: SOCIAL_URLS.discordNews,
    discord_community: SOCIAL_URLS.discordCommunity,
    linktree: SOCIAL_URLS.linktree
  },
  site_url: SITE.baseUrl,
  link_hub_url: SITE.linkHubUrl
} as const;

export default profile;

