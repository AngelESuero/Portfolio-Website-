export interface AgiWebSource {
  name: string;
  url: string;
  rss_url?: string;
  tags?: string[];
}

export const AGI_WEB_SOURCES: AgiWebSource[] = [
  {
    name: 'AI Digest Timeline',
    url: 'https://www.theidigest.org/timeline',
    rss_url: 'https://www.theidigest.org/feed',
    tags: ['timeline', 'curation']
  },
  {
    name: 'LifeArchitect AGI',
    url: 'https://lifearchitect.ai/agi/',
    rss_url: 'https://lifearchitect.ai/feed/',
    tags: ['analysis', 'agi']
  },
  {
    name: 'GoodHeartLabs AGI',
    url: 'https://agi.goodheartlabs.com/',
    rss_url: 'https://agi.goodheartlabs.com/feed.xml',
    tags: ['forecasting', 'agi']
  }
];
