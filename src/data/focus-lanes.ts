type EntryMedium = 'writing' | 'music' | 'video' | 'image' | 'note' | 'proposal';
type ProjectType = 'music' | 'video' | 'writing' | 'civic';

export type FocusLaneSlug =
  | 'acting'
  | 'building'
  | 'clothes'
  | 'gaming'
  | 'music'
  | 'photos'
  | 'podcasting'
  | 'political';

export interface FocusLane {
  slug: FocusLaneSlug;
  label: string;
  description: string;
  navColor: 'ochre' | 'blue' | 'red' | 'white' | 'black';
  navTone: string;
  swatch: string;
  highlights: string[];
  stageNote?: string;
  heroImages?: Array<{
    src: string;
    alt: string;
  }>;
  primaryLink: {
    href: string;
    label: string;
  };
  secondaryLink?: {
    href: string;
    label: string;
  };
  projectSlugs?: string[];
  projectTypes?: ProjectType[];
  projectKeywords?: string[];
  entrySlugs?: string[];
  entryMediums?: EntryMedium[];
  entryTags?: string[];
  entryKeywords?: string[];
  postSlugs?: string[];
  postTags?: string[];
  postKeywords?: string[];
}

export const focusLanes: FocusLane[] = [
  {
    slug: 'acting',
    label: 'Acting',
    description: 'Performance, live presence, delivery, and work that leans on voice, character, or stage energy.',
    navColor: 'red',
    navTone: 'presence',
    swatch: '#a64a3b',
    highlights: [
      'Live-performance records and stage-adjacent documentation',
      'Pieces where voice and presence carry as much weight as the medium itself',
      'Work that can grow into fuller character or performance lanes'
    ],
    stageNote: 'This lane is early, but the performance thread is already visible.',
    primaryLink: {
      href: '/theater',
      label: 'Open theater'
    },
    secondaryLink: {
      href: '/work/the-art-of-survival',
      label: 'See The Art of Survival'
    },
    projectSlugs: ['the-art-of-survival'],
    entrySlugs: [
      'video/a-newark-arts-festival-performance-2023',
      'video/swamp-live-performance',
      'video/singer-songwriter-demo-stay-or-fall-january-22nd-2023',
      'video/in-garbs-freestyle',
      'video/rap-freestyle-u-love-december-18th-2022',
      'video/good-enough-freestyle-thumbs-down-pt-1'
    ]
  },
  {
    slug: 'building',
    label: 'Building',
    description: 'Construction, installation, setup logic, and work that has to function in the real world and not only on paper.',
    navColor: 'ochre',
    navTone: 'grounding',
    swatch: '#b97a2d',
    highlights: [
      'Museum and AV installation work',
      'System-building, playback reliability, and setup thinking',
      'Documentation that shows how a build actually holds together'
    ],
    stageNote: 'This lane leans toward installation and systems work right now more than literal construction footage.',
    primaryLink: {
      href: '/work/av-museum-work',
      label: 'Open AV / Museum work'
    },
    secondaryLink: {
      href: '/threads/av-museum-work',
      label: 'Open AV thread'
    },
    projectSlugs: ['av-museum-work'],
    entrySlugs: ['writing/impact-of-musical-instruments-on-museum-visitation'],
  },
  {
    slug: 'clothes',
    label: 'Clothes',
    description: 'Self-presentation, styling, and image-led records where clothing and look help carry the work.',
    navColor: 'white',
    navTone: 'presence',
    swatch: '#ede3d1',
    highlights: [
      'Performance and music-video records where clothing is part of the delivery',
      'Image-making that leans on fit, silhouette, and self-presentation',
      'An early lane for style references rather than a full fashion archive'
    ],
    stageNote: 'This lane is still small and mostly built from performance, styling, and visual self-presentation records.',
    heroImages: [
      {
        src: '/images/site-selects/march-17-tropical-fit.png',
        alt: 'Angel in a patterned button-down and crossbody bag, photographed indoors.'
      },
      {
        src: '/images/site-selects/march-20-portrait.png',
        alt: 'Close portrait of Angel against a softly blurred interior background.'
      },
      {
        src: '/images/site-selects/march-1-car-portrait.png',
        alt: 'Angel seated in a car in a close portrait.'
      }
    ],
    primaryLink: {
      href: '/theater',
      label: 'Open theater'
    },
    secondaryLink: {
      href: '/work/the-art-of-survival',
      label: 'See The Art of Survival'
    },
    projectSlugs: [
      'the-art-of-survival',
      'scraps-after-heartbreaks-musicvideo',
      'scraps-death-of-my-feminine-demos-2022'
    ],
    entrySlugs: [
      'video/in-garbs-freestyle',
      'video/rap-freestyle-u-love-december-18th-2022',
      'video/singer-songwriter-demo-stay-or-fall-january-22nd-2023',
      'video/scraps-after-heartbreaks-musicvideo-short-shot-by-the-lovely-angelainaxx'
    ]
  },
  {
    slug: 'gaming',
    label: 'Gaming',
    description: 'Gameplay sessions, ranked runs, edits, and the longer record built around play, repetition, and skill.',
    navColor: 'blue',
    navTone: 'clarity',
    swatch: '#587a95',
    highlights: [
      'Long-form play sessions and shorts from the YouTube record',
      'Ranked-match, Sparking, Destiny, Sifu, and related game lanes',
      'The archive side of practice, repetition, and improvement'
    ],
    primaryLink: {
      href: '/archive/video',
      label: 'Browse video archive'
    },
    secondaryLink: {
      href: '/work/gaming-clips-vault',
      label: 'Open Gaming/Clips Vault'
    },
    projectSlugs: ['gaming-clips-vault'],
    projectKeywords: ['gaming', 'gameplay', 'clip'],
    entryMediums: ['video'],
    entryTags: ['gaming', 'destiny-2', 'sparking', 'sifu', 'dragon-ball', 'ranked', 'dbsz'],
    entryKeywords: ['gaming', 'gameplay', 'warlock', 'raid', 'rank']
  },
  {
    slug: 'music',
    label: 'Music',
    description: 'Beat tapes, demos, sessions, and songs that make up the sound side of the archive.',
    navColor: 'ochre',
    navTone: 'presence',
    swatch: '#b97a2d',
    highlights: [
      'Archive-native music entries and project-level releases',
      'Music videos, process clips, and resurfaced song fragments',
      'Workshop essays and class writing that explain how the sound work is being approached'
    ],
    stageNote: 'The lane includes the listening record and the workshop writing that shaped it.',
    primaryLink: {
      href: '/archive/music',
      label: 'Browse music archive'
    },
    secondaryLink: {
      href: '/theater',
      label: 'Open theater'
    },
    projectTypes: ['music'],
    projectSlugs: [
      'queries-beat-tape-family-love',
      'scraps-after-heartbreaks-musicvideo',
      'scraps-dark-days-symptoms-no-context-demos-2023-2024',
      'scraps-death-of-my-feminine-demos-2022'
    ],
    projectKeywords: ['music', 'beat', 'demo', 'sound'],
    entryMediums: ['music'],
    entryTags: ['papa'],
    entryKeywords: ['musicvideo', 'demo', 'song', 'sound', 'beat tape', 'papa', 'scraps'],
    postKeywords: ['music', 'sound']
  },
  {
    slug: 'photos',
    label: 'Photos',
    description: 'Still images, visual studies, and project lanes where the image carries as much weight as the sound or the text.',
    navColor: 'white',
    navTone: 'clarity',
    swatch: '#ede3d1',
    highlights: [
      'Image-led archive entries and photographic documentation',
      'Projects where visual framing is central to the work',
      'Portfolio-style stills, visual atmosphere, and reference imagery'
    ],
    stageNote: 'This lane is still image-light, so it also pulls from the most visual project pages.',
    primaryLink: {
      href: '/archive/image',
      label: 'Browse image archive'
    },
    secondaryLink: {
      href: '/work/the-art-of-survival',
      label: 'See visual-heavy work'
    },
    projectSlugs: ['the-art-of-survival', 'newark-night-video-notes', 'scraps-after-heartbreaks-musicvideo'],
    entrySlugs: [
      'video/newark-night-video-notes',
      'video/scraps-after-heartbreaks-musicvideo-short-shot-by-the-lovely-angelainaxx'
    ],
    entryMediums: ['image'],
  },
  {
    slug: 'podcasting',
    label: 'Podcasting',
    description: 'Interview-shaped recordings, spoken reflections, and longer talk lanes that can grow into podcast-form work.',
    navColor: 'blue',
    navTone: 'contemplation',
    swatch: '#587a95',
    highlights: [
      'Interview and conversation-shaped video records',
      'Talk-throughs, breakdowns, and spoken-form entries',
      'Early groundwork for a more intentional podcasting lane'
    ],
    stageNote: 'This lane is spoken-form more than a finished podcast catalog, but the voice-led material is already here.',
    primaryLink: {
      href: '/theater',
      label: 'Open theater'
    },
    secondaryLink: {
      href: '/archive/video/interview-august-1st-2023',
      label: 'Open interview entry'
    },
    entrySlugs: [
      'video/interview-august-1st-2023',
      'video/questions-for-jaszmin',
      'video/vod-talk-destiny-2-with-angel',
      'video/philosophizing-with-angel-destiny2-wop',
      'video/1-breakdown-of-fio',
      'video/discussion-guardians-monsters-forgot-to-save-before-i-posted-destiny2'
    ]
  },
  {
    slug: 'political',
    label: 'Political',
    description: 'Governance, survival, civic pressure, labor, and the writing that tries to name what public life should actually serve.',
    navColor: 'red',
    navTone: 'grounding',
    swatch: '#a64a3b',
    highlights: [
      'Essays and notes on governance, public responsibility, and survival',
      'Political economy, civic tension, and Newark-grounded thinking',
      'Writing that treats politics as lived conditions, not abstraction'
    ],
    primaryLink: {
      href: '/archive/writing',
      label: 'Browse writing archive'
    },
    secondaryLink: {
      href: '/writing/government-aligned-with-life',
      label: 'Read the public post'
    },
    entrySlugs: [
      'writing/government-should-be-aligned-with-life',
      'writing/the-sacrifice-of-power',
      'writing/the-art-of-survival',
      'note/on-reactive-systems',
      'note/life-is-always-on',
      'note/stewardship-not-domination'
    ],
    postSlugs: ['government-aligned-with-life'],
    entryTags: ['governance', 'political-economy', 'civic', 'survival', 'power', 'capitalism'],
  }
];

export const focusLaneBySlug = new Map(focusLanes.map((lane) => [lane.slug, lane] as const));
