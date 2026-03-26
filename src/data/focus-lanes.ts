type EntryMedium = 'writing' | 'music' | 'video' | 'image' | 'note' | 'proposal';
type ProjectType = 'music' | 'video' | 'writing' | 'civic';
type DriveLink = {
  label: string;
  href: string;
};

type ReferenceDoc = {
  title: string;
  context: string;
  summary: string;
  sourceType: string;
  tags: string[];
  sourceLinks: DriveLink[];
  previewUrl?: string | null;
  previewLabel?: string;
};

export type FocusLaneSlug =
  | 'acting'
  | 'building'
  | 'clothes'
  | 'gaming'
  | 'music'
  | 'poetry'
  | 'screenplay'
  | 'photos'
  | 'podcasting'
  | 'political'
  | 'references';

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
  referenceDocs?: ReferenceDoc[];
}

const driveFileViewUrl = (fileId: string): string => `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
const driveFilePreviewUrl = (fileId: string): string => `https://drive.google.com/file/d/${fileId}/preview`;

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
    slug: 'poetry',
    label: 'Poetry',
    description: 'Poem cycles, lyric fragments, and survival writing where the line itself carries the work.',
    navColor: 'white',
    navTone: 'contemplation',
    swatch: '#ede3d1',
    highlights: [
      'The Art of Survival project where poetry, music, and visual work overlap',
      'Writing that treats the line as a place to hold feeling before it becomes a scene',
      'A lane for lyric work, survival language, and the work that leans most on voice'
    ],
    stageNote: 'Poetry is anchored by The Art of Survival, where the lyric and the visual run together.',
    primaryLink: {
      href: '/work/the-art-of-survival',
      label: 'Open project'
    },
    secondaryLink: {
      href: '/writing/the-art-of-survival',
      label: 'Read writing record'
    },
    projectSlugs: ['the-art-of-survival'],
    entrySlugs: ['writing/the-art-of-survival'],
    projectKeywords: ['poetry', 'poem', 'lyric', 'survival', 'resistance'],
    entryKeywords: ['poetry', 'poem', 'lyric', 'survival', 'resistance']
  },
  {
    slug: 'screenplay',
    label: 'Screenplay',
    description: 'Scripts, fragments, and production docs built for scenes rather than posts.',
    navColor: 'blue',
    navTone: 'grounding',
    swatch: '#587a95',
    highlights: [
      'Screenplay fragments already filed in the writing archive',
      'Script docs and related project files exposed through Resources',
      'A lane for scene-based writing, drafts, and production-facing pages'
    ],
    stageNote: 'This lane collects screenplay fragments alongside the script shelf that supports them.',
    primaryLink: {
      href: '/resources',
      label: 'Open script shelf'
    },
    secondaryLink: {
      href: '/writing',
      label: 'Open writing tab'
    },
    entrySlugs: [
      'writing/cocoa',
      'writing/end-first-ten-pages-hbo'
    ],
    entryTags: ['screenplay', 'excerpt'],
    entryKeywords: ['screenplay', 'script', 'hbo', 'cocoa', 'scene'],
    referenceDocs: [
      {
        title: 'Cocoa — reference doc',
        context: 'Resources · screenplay shelf',
        summary: 'A PDF reference for the screenplay Cocoa, kept alongside the archive entry so the fragment and its source stay together.',
        sourceType: 'PDF',
        tags: ['screenplay', 'pdf', 'cocoa'],
        sourceLinks: [
          { label: 'Open PDF', href: '/documents/cocoa.pdf' },
          { label: 'Preview PDF', href: '/documents/cocoa.pdf' }
        ],
        previewUrl: '/documents/cocoa.pdf',
        previewLabel: 'Preview PDF'
      },
      {
        title: 'Script End-6',
        context: 'Resources · screenplay shelf',
        summary: 'A script draft preserved as a PDF so the screenwriting lane has a stable source file to point to.',
        sourceType: 'PDF',
        tags: ['screenplay', 'script', 'draft'],
        sourceLinks: [
          { label: 'Open PDF', href: '/documents/script-end-6.pdf' },
          { label: 'Preview PDF', href: '/documents/script-end-6.pdf' }
        ],
        previewUrl: '/documents/script-end-6.pdf',
        previewLabel: 'Preview PDF'
      },
      {
        title: 'Script — Night, Mother Project',
        context: 'Resources · screenplay shelf',
        summary: 'Another screenplay document preserved as a PDF, linked here so the lane has a second script-shaped anchor.',
        sourceType: 'PDF',
        tags: ['screenplay', 'script', 'project'],
        sourceLinks: [
          { label: 'Open PDF', href: '/documents/script-night-mother-project.pdf' },
          { label: 'Preview PDF', href: '/documents/script-night-mother-project.pdf' }
        ],
        previewUrl: '/documents/script-night-mother-project.pdf',
        previewLabel: 'Preview PDF'
      },
      {
        title: 'Sensitive Child — Graphic Novel Script',
        context: 'Resources · screenplay shelf',
        summary: 'A longer script-form document preserved as a DOCX source file for the screenwriting lane.',
        sourceType: 'DOCX',
        tags: ['screenplay', 'script', 'docx'],
        sourceLinks: [
          { label: 'Open DOCX', href: '/documents/sensitive-child-script.docx' }
        ]
      },
      {
        title: 'Sensitive Child — Presentation',
        context: 'Resources · screenplay shelf',
        summary: 'A presentation companion for the script project, kept here as part of the broader screenplay record.',
        sourceType: 'PPTX',
        tags: ['screenplay', 'presentation', 'project'],
        sourceLinks: [
          { label: 'Open PPTX', href: '/documents/sensitive-child-presentation.pptx' }
        ]
      },
      {
        title: 'Stranger Things Bible (Montauk)',
        context: 'Resources · screenplay shelf',
        summary: 'A series bible and world document that helps round out the project-side screenplay shelf.',
        sourceType: 'DOCX',
        tags: ['screenplay', 'bible', 'project'],
        sourceLinks: [
          { label: 'Open DOCX', href: '/documents/stranger-things-bible.docx' }
        ]
      }
    ]
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
  },
  {
    slug: 'references',
    label: 'References',
    description: 'Corpus index, cited source docs, and the papers that sit behind the archive.',
    navColor: 'white',
    navTone: 'contemplation',
    swatch: '#ede3d1',
    highlights: [
      'The corpus index and its works cited list in one place',
      'Drive-linked source docs that anchor the archive’s claims',
      'A source shelf for the essays, drafts, and reference files'
    ],
    stageNote: 'This lane turns the works cited list into a navigable shelf of source material.',
    primaryLink: {
      href: driveFileViewUrl('1QW2kTavKWzvbBS9X_SBXNkJdxbd45swpM7U5GKN4RxY'),
      label: 'Open corpus index'
    },
    secondaryLink: {
      href: '/writing',
      label: 'Open writing tab'
    },
    entrySlugs: [
      'writing/acquiring-american-happiness-in-the-21st-century',
      'writing/archive-pass-after-midnight',
      'writing/following-sound',
      'writing/government-should-be-aligned-with-life',
      'writing/impact-of-musical-instruments-on-museum-visitation',
      'writing/life-in-ib',
      'writing/my-astrology-chart',
      'writing/the-sacrifice-of-power',
      'writing/the-art-of-survival'
    ],
    postSlugs: ['government-aligned-with-life'],
    referenceDocs: [
      {
        title: 'Searching for User\'s Essays',
        context: 'Science Park High School · corpus index',
        summary: 'A corpus map that names the school-era archive, its rules, and the works cited list behind the search.',
        sourceType: 'Index doc',
        tags: ['corpus', 'archive', 'works-cited'],
        sourceLinks: [
          { label: 'Open index', href: driveFileViewUrl('1QW2kTavKWzvbBS9X_SBXNkJdxbd45swpM7U5GKN4RxY') },
          { label: 'Preview index', href: driveFilePreviewUrl('1QW2kTavKWzvbBS9X_SBXNkJdxbd45swpM7U5GKN4RxY') }
        ],
        previewUrl: driveFilePreviewUrl('1QW2kTavKWzvbBS9X_SBXNkJdxbd45swpM7U5GKN4RxY'),
        previewLabel: 'Preview index'
      },
      {
        title: 'IB EE Final',
        context: 'Works cited · reference 1',
        summary: 'The final IB extended essay preserved in Drive as a stable source file.',
        sourceType: 'PDF',
        tags: ['ib', 'essay', 'pdf'],
        sourceLinks: [
          { label: 'Open PDF', href: driveFileViewUrl('1RqtiaLruNY41HHbkc-qW2R_DQGKoPqGa') },
          { label: 'Preview PDF', href: driveFilePreviewUrl('1RqtiaLruNY41HHbkc-qW2R_DQGKoPqGa') }
        ],
        previewUrl: driveFilePreviewUrl('1RqtiaLruNY41HHbkc-qW2R_DQGKoPqGa'),
        previewLabel: 'Preview PDF'
      },
      {
        title: 'ESSAY Codex',
        context: 'Works cited · reference 2',
        summary: 'The writing rules and structural codex that shaped the early school essays.',
        sourceType: 'PDF',
        tags: ['writing', 'school', 'rules'],
        sourceLinks: [
          { label: 'Open PDF', href: driveFileViewUrl('0B7KjkfrHWcbRWm1kSjJhT0tieUE') },
          { label: 'Preview PDF', href: driveFilePreviewUrl('0B7KjkfrHWcbRWm1kSjJhT0tieUE') }
        ],
        previewUrl: driveFilePreviewUrl('0B7KjkfrHWcbRWm1kSjJhT0tieUE'),
        previewLabel: 'Preview PDF'
      },
      {
        title: 'IB EE Final',
        context: 'Works cited · reference 3',
        summary: 'The companion IB essay source kept in Drive alongside the PDF version.',
        sourceType: 'Google Doc',
        tags: ['ib', 'essay', 'doc'],
        sourceLinks: [
          { label: 'Open source doc', href: driveFileViewUrl('136D7WGfbruYxtIRdegr0Pj5PDNhHBCD_xXMl1ZysyS0') },
          { label: 'Preview doc', href: driveFilePreviewUrl('136D7WGfbruYxtIRdegr0Pj5PDNhHBCD_xXMl1ZysyS0') }
        ],
        previewUrl: driveFilePreviewUrl('136D7WGfbruYxtIRdegr0Pj5PDNhHBCD_xXMl1ZysyS0'),
        previewLabel: 'Preview doc'
      },
      {
        title: 'Untitled document',
        context: 'Works cited · reference 4',
        summary: 'An unnamed source preserved in the corpus index as part of the reference trail.',
        sourceType: 'Google Doc',
        tags: ['source', 'doc', 'reference'],
        sourceLinks: [
          { label: 'Open source doc', href: driveFileViewUrl('1-B7NAooJuOr0V5DtI8HSpfoEVLo6AFHPeKvXgaBTDR8') },
          { label: 'Preview doc', href: driveFilePreviewUrl('1-B7NAooJuOr0V5DtI8HSpfoEVLo6AFHPeKvXgaBTDR8') }
        ],
        previewUrl: driveFilePreviewUrl('1-B7NAooJuOr0V5DtI8HSpfoEVLo6AFHPeKvXgaBTDR8'),
        previewLabel: 'Preview doc'
      },
      {
        title: 'Shulman Essay',
        context: 'Works cited · reference 5',
        summary: 'The George Shulman course essay kept as the source version behind the political line.',
        sourceType: 'DOCX',
        tags: ['shulman', 'politics', 'docx'],
        sourceLinks: [
          { label: 'Open DOCX', href: driveFileViewUrl('1l-aJf1Lf2o4f1vE4Q-zs_7x--jg_0vcz') },
          { label: 'Preview DOCX', href: driveFilePreviewUrl('1l-aJf1Lf2o4f1vE4Q-zs_7x--jg_0vcz') }
        ],
        previewUrl: driveFilePreviewUrl('1l-aJf1Lf2o4f1vE4Q-zs_7x--jg_0vcz'),
        previewLabel: 'Preview DOCX'
      },
      {
        title: 'The Bluest Eye Essay',
        context: 'Works cited · reference 6',
        summary: 'A peer essay cited by the corpus index and preserved as part of the reference shelf.',
        sourceType: 'Google Doc',
        tags: ['literature', 'peer', 'reference'],
        sourceLinks: [
          { label: 'Open source doc', href: driveFileViewUrl('1FZqVeVAQl6CfFexh69YW9s5S4_CFykrXW0XSMsNdjC8') },
          { label: 'Preview doc', href: driveFilePreviewUrl('1FZqVeVAQl6CfFexh69YW9s5S4_CFykrXW0XSMsNdjC8') }
        ],
        previewUrl: driveFilePreviewUrl('1FZqVeVAQl6CfFexh69YW9s5S4_CFykrXW0XSMsNdjC8'),
        previewLabel: 'Preview doc'
      },
      {
        title: 'Candide Essay',
        context: 'Works cited · reference 7',
        summary: 'A cited peer essay on Candide that sits in the archive’s reference trail.',
        sourceType: 'Google Doc',
        tags: ['literature', 'peer', 'reference'],
        sourceLinks: [
          { label: 'Open source doc', href: driveFileViewUrl('1SWzUvPnvUDQT3iZfrjOKRbLHx3VKs06ogWDlVWy_POM') },
          { label: 'Preview doc', href: driveFilePreviewUrl('1SWzUvPnvUDQT3iZfrjOKRbLHx3VKs06ogWDlVWy_POM') }
        ],
        previewUrl: driveFilePreviewUrl('1SWzUvPnvUDQT3iZfrjOKRbLHx3VKs06ogWDlVWy_POM'),
        previewLabel: 'Preview doc'
      },
      {
        title: 'Essay For Desert Of The Real',
        context: 'Works cited · reference 8',
        summary: 'The Sontag-adjacent source draft cited in the corpus index as the closest confirmed thread.',
        sourceType: 'DOCX',
        tags: ['desert-of-the-real', 'politics', 'marx'],
        sourceLinks: [
          { label: 'Open DOCX', href: driveFileViewUrl('129D_8DSXKOWwACEDRzygo4ZntY-KNNwE') },
          { label: 'Preview DOCX', href: driveFilePreviewUrl('129D_8DSXKOWwACEDRzygo4ZntY-KNNwE') }
        ],
        previewUrl: driveFilePreviewUrl('129D_8DSXKOWwACEDRzygo4ZntY-KNNwE'),
        previewLabel: 'Preview DOCX'
      }
    ]
  }
];

export const focusLaneBySlug = new Map(focusLanes.map((lane) => [lane.slug, lane] as const));
