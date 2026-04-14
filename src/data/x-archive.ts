export interface XArchiveEntry {
  id: string;
  publishedAt: string;
  url: string;
  text: string;
}

export interface XArchiveFeedItem {
  title: string;
  url: string;
  publishedAt: string;
  summary: string;
}

export const xArchiveMeta = {
  handle: '@a_e_s_4',
  generatedAt: '2026-04-14T12:25:22-04:00',
  estimatedSizeMb: 2277,
  sourceLabel: 'X archive export'
} as const;

const collapseWhitespace = (value: string): string => String(value || '').replace(/\s+/g, ' ').trim();

const trimText = (value: string, limit: number): string => {
  const normalized = collapseWhitespace(value);
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
};

const getHeadline = (value: string): string => {
  const firstLine = String(value || '')
    .split(/\r?\n/)
    .find((line) => line.trim())
    ?.trim();
  return trimText(firstLine || value, 140);
};

export const xArchiveEntries: XArchiveEntry[] = [
  {
    id: '2044077901578985567',
    publishedAt: '2026-04-14T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2044077901578985567',
    text: `I’m starting to careless for music that’s just like… un inclusive, we literally have kid laroi and Justin Bieber streaming their music making process why are you dropping snippets like we don’t know the whole process already 🙄. Boringggg`
  },
  {
    id: '2043897576080982109',
    publishedAt: '2026-04-13T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043897576080982109',
    text: `Just think ideas need to go as big as they can. And then just be compressed as much as it can.`
  },
  {
    id: '2043824327720571117',
    publishedAt: '2026-04-13T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043824327720571117',
    text: `wait, @TheRealAdamG, could you combine the whoop device and its functionality with an ai device? I would wear that. And just make it super cheap after getting subsidized by the government once agi is achieved? I think that has a proven track record of being desired.`
  },
  {
    id: '2043782693746327653',
    publishedAt: '2026-04-13T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043782693746327653',
    text: `If someone tweets a meme saying more as a comment under a news post about a guy getting his house shot up, how is that not a violation of terms. That seems a little too much for like healthy alignment for me.\n\nLike wanting someone to get more attacked…? Is not a violation.`
  },
  {
    id: '2043771160093925797',
    publishedAt: '2026-04-13T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043771160093925797',
    text: `Biggest limitation in ai models right now is design creation and integration of function into said design. Happy to know that we are agentically at a point where agents can reach sorta most things now, just not reliably.`
  },
  {
    id: '2043763185212084543',
    publishedAt: '2026-04-13T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043763185212084543',
    text: `@nikitabier if there was a setting to improve the grammar of everyone's tweets (including myself), I would very much appreciate that. I think speed reading is impacting my mind bleh.`
  },
  {
    id: '2043747545789222955',
    publishedAt: '2026-04-13T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043747545789222955',
    text: `@uuuntitleddd\n\nHey guys,  \nI had a feature request / thought.\n\nWould it be possible to make shared untitled links feel more like the audio is actually living in the message itself, and not just being shown as a limited preview card?`
  },
  {
    id: '2043554922713509951',
    publishedAt: '2026-04-13T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043554922713509951',
    text: `No offense to Bieber as I am a fan of his vulnerability, but at a certain point, it’s kinda like, please show us how you move through your experiences. Maybe it’s just me seeking truth compulsively, but for a multi-millionaire to express his sorrow beautifully and then-`
  },
  {
    id: '2043443417338740776',
    publishedAt: '2026-04-12T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043443417338740776',
    text: `Basic functions of apps including readability and shareability. Sharing anything out of meta products just sucks outside. Pinterest should include shareable gifs!`
  },
  {
    id: '2043063401224474728',
    publishedAt: '2026-04-11T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043063401224474728',
    text: `Sorry for saying this but I don’t believe critical thinking skills is a good enough reason to blockade ai development. At a certain point, in accordance to life once they are provided the tools and resources, it’s an individuals responsibility to manage themselves and  health.`
  },
  {
    id: '2043049888993116656',
    publishedAt: '2026-04-11T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2043049888993116656',
    text: `So many half truths so people can make their opinions seem like fact here.`
  },
  {
    id: '2042831904601145750',
    publishedAt: '2026-04-11T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2042831904601145750',
    text: `Wooo! @SabrinaAnnLynn`
  },
  {
    id: '2042579311870320656',
    publishedAt: '2026-04-10T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2042579311870320656',
    text: `Rap won’t save you. Just inspire you. I think I used to think cultural moments were all that were really important.\n\nConsider @miraclemindapp`
  },
  {
    id: '2042567008349258215',
    publishedAt: '2026-04-10T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2042567008349258215',
    text: `IMO, aside from loved ones and what not, culture and entertainment were the only things that made being born in this era worth it. Hoping the future is doper than this.`
  },
  {
    id: '2042122164413821142',
    publishedAt: '2026-04-09T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2042122164413821142',
    text: `I still think people need to be governed, until they achieve a state of human beingness allowed by a certain amount of free time and living in life oriented spaces. Like @ishafoundation. People want the freedom to be individual, and once they free themselves- https://t.co/AFkp3TExNU`
  },
  {
    id: '2042038573222842807',
    publishedAt: '2026-04-08T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2042038573222842807',
    text: `The biggest issues with our political system is that we people have finite attention and can only offer what is asked, governing things requires citizens governed to have more intelligence and those with power with more awareness near infinite amounts of it well. I hope ai helps. https://t.co/oARhBTaNzT`
  },
  {
    id: '2042000677837152339',
    publishedAt: '2026-04-08T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2042000677837152339',
    text: `Great test. More multimodal assessments please!!! https://t.co/qktHCoh9Ru`
  },
  {
    id: '2041378379652342088',
    publishedAt: '2026-04-07T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2041378379652342088',
    text: `Happy Birthday to the Goat. https://t.co/3dBDRCOEGV`
  },
  {
    id: '2041180852487340171',
    publishedAt: '2026-04-06T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2041180852487340171',
    text: `@googlephotos hey guys, I’m wondering how robust your api and non Google Photos app ui is. I would think it would be wonderful if apps always had access to my Google Photos for profile photos and sharing other images easily.`
  },
  {
    id: '2040938291222978731',
    publishedAt: '2026-04-05T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2040938291222978731',
    text: `I have such dark music. Sigh.`
  },
  {
    id: '2040117127911215532',
    publishedAt: '2026-04-03T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2040117127911215532',
    text: `@OpenAI hey I think allowing the models to send emails will be great.`
  },
  {
    id: '2039886300950519831',
    publishedAt: '2026-04-02T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2039886300950519831',
    text: `@openai I think you guys should sponsor an animated tv show or a what if? series with disney for marketing purposes and also allowing artists to give life to the questions you face internally everyday. I think that was one of the ultimate directions with sora.`
  },
  {
    id: '2039446889657966745',
    publishedAt: '2026-04-01T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2039446889657966745',
    text: `Can I get an age filter on social media apps. I don’t know sometimes and it’s annoying.`
  },
  {
    id: '2039181184668758035',
    publishedAt: '2026-03-31T12:00:00-04:00',
    url: 'https://x.com/a_e_s_4/status/2039181184668758035',
    text: `Why can’t there just like, be massive like, grace periods on everything if ai like does do stuff.`
  }
];

export const xArchiveFeedItems: XArchiveFeedItem[] = xArchiveEntries.map((entry) => ({
  title: getHeadline(entry.text),
  url: entry.url,
  publishedAt: entry.publishedAt,
  summary: trimText(entry.text, 280)
}));
