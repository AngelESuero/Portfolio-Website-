/**
 * LifeTimeline.tsx
 *
 * A living, interactive map of Angel Suero's milestones.
 *
 * - Entries expand individually instead of hiding behind bundle categories.
 * - Narrative entries reveal the fuller draft prose already stored in the data.
 * - Work/project entries link directly into the portfolio.
 */

import React, { useState } from 'react';
import './LifeTimeline.css';

type Category = 'personal' | 'education' | 'work' | 'project';
type LifeStage = 'youth' | 'preteen' | 'teen' | 'college' | 'postGrad' | 'current';
type ShowcaseKind = 'writing' | 'music' | 'photos' | 'video' | 'work' | 'ideas' | 'community';

interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  shortDesc: string;
  category: Category;
  href?: string;
  hrefLabel?: string;
  external?: boolean;
  placeholder?: boolean;
  placeholderNote?: string;
  /** AI-written narrative — shown in expandable panel, always badged */
  aiNarrative?: string[];
}

interface ShowcaseLink {
  label: string;
  href: string;
  kind: ShowcaseKind;
}

interface StageShowcase {
  id: LifeStage;
  title: string;
  ageRange: string;
  yearRange: string;
  summary: string;
  accomplishments: string[];
  featuredEntryIds: string[];
  showcases: ShowcaseLink[];
  previewImages: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const ENTRIES: TimelineEntry[] = [
  // ── Personal / Early Life ────────────────────────────────────────────────
  {
    id: 'born',
    year: '~2000',
    title: 'Born, New Jersey',
    shortDesc: 'Newark native from day one. The city shapes everything — the sound, the urgency, the archive instinct.',
    category: 'personal',
    aiNarrative: [
      "He arrived in the first year of a new century, in a small corner of New Jersey, to a woman who drove a royal blue Honda CRV and loved him in a language that didn't always have words. His mother is the first fact of his life. Everything after is a response to her.",
    ],
  },
  {
    id: 'kitchen',
    year: '2000–09',
    title: 'Merengue in the kitchen',
    shortDesc: 'Early years shaped by family, music, and a particular kind of warmth.',
    category: 'personal',
    aiNarrative: [
      "The early years were merengue in the kitchen. They were his grandmother's hands and his mother's laughter and the particular warmth of a home that was small but never felt that way. He was a daydreamer from the start — the kind of child who stopped mid-sentence to wonder how the moon dreams, or whether the sun has a flavor.",
      "He filed these questions away like precious things, because nobody around him seemed to think they were worth asking. He had not yet learned that nobody around him was right.",
    ],
  },
  {
    id: 'car',
    year: '2010',
    title: 'The walk away from the car',
    shortDesc: 'A defining moment at ten — the promise that set everything in motion.',
    category: 'personal',
    aiNarrative: [
      "When he was ten, he stepped out of his mother's blue Honda CRV and didn't look back. He had just been told he would repeat the fifth grade, and he could not bear to see her face — not because she was disappointed in him (she wasn't; she was furious at the school), but because he didn't know that yet.",
      "He assumed the worst and walked forward into it anyway. That walk became a promise: he would not disappoint her. He would not disappoint anyone who believed in him. He kept moving.",
    ],
  },
  {
    id: 'gvz',
    year: '2011',
    title: 'GVZ413',
    shortDesc: 'IB program. Alter ego. Armor built from candidate numbers and GPAs.',
    category: 'personal',
    aiNarrative: [
      "He found his way into the IB program and assigned himself a code: GVZ413. Part identification number, part alter ego, part armor. Built from his candidate number and his GPA — the most legible proof he had that he belonged.",
      "GVZ413 was the part of him that knew how to survive a system not designed for him. Angel was the part that kept the system from taking everything. They needed each other. That is the most honest thing he has ever said about himself.",
    ],
  },

  // ── Education / High School ───────────────────────────────────────────────
  {
    id: 'highschool',
    year: '2015–18',
    title: 'The blue-tied, yellow-shirted years',
    shortDesc: 'High school: chess, class rep, school paper, NJIT Upward Bound. Music in the bedroom — not as a hobby, as a necessity.',
    category: 'education',
    aiNarrative: [
      "High school in a blue-tied yellow-shirted uniform. Chess player, Class Representative, school newspaper writer. He attended NJIT Upward Bound and stayed Saturdays when other people didn't. He made music in his bedroom — not as a hobby, as a necessity.",
      "He listened to a best friend reveal his homosexuality and felt the weight and the honor of being trusted with something that fragile. He fell into politics the way you fall into a vocation: not because it was practical, but because the world seemed to require it of him.",
    ],
  },

  // ── London ────────────────────────────────────────────────────────────────
  {
    id: 'london',
    year: 'Summer 2018',
    title: 'London — School of Ethics & Global Leadership',
    shortDesc: 'Ten strangers. A bowl of curry. The first time he understood his perspective was the thing he had to give.',
    category: 'personal',
    aiNarrative: [
      "He sat at dinner his first night with a bowl of curry steaming in front of him and ten strangers who had flown in from Shanghai, Seattle, Istanbul, Houston. He felt like an outsider, which was familiar. He felt like he had nothing to offer, which was wrong.",
      "He broke the silence and told them about his small corner of New Jersey. Hands went up before he was finished. Three weeks later he asked Kori Schake — former senior official in American politics — what it means to be human inside power. She said she loved the question.",
      "On the last night he screened a music video and led his first real discussion on the American racial divide. They all listened. He flew home understanding that his perspective was not a burden. It was the thing he had to give.",
    ],
  },

  // ── Education: College ────────────────────────────────────────────────────
  {
    id: 'associates',
    year: '2017–2019',
    title: "Associate's Degree",
    shortDesc: 'Community college foundation — built the academic footing that led to Gallatin.',
    category: 'education',
    placeholder: true,
    placeholderNote: 'Entry reserved',
  },
  {
    id: 'gallatin',
    year: '2019',
    title: 'Enrolled — NYU Gallatin',
    shortDesc: 'Gallatin School of Individualized Study. Designed a self-directed concentration around survival, art, and community memory.',
    category: 'education',
    href: '/work/the-art-of-survival',
    hrefLabel: 'Senior thesis →',
    aiNarrative: [
      "Gallatin is a school without a major — you build your own concentration, name it, defend it. For someone who had always been building himself from available materials, this felt less like an academic choice and more like recognition.",
      "He designed his studies around the intersections he had always lived: culture and power, identity and form, the politics of who gets to be seen and who doesn't. People called him \"that Latin music kid who carries a grandfather-esque wisdom.\" He did not argue with this.",
    ],
  },

  // ── Work ─────────────────────────────────────────────────────────────────
  {
    id: 'njit-pa',
    year: '~2020',
    title: "NJIT Professor's Assistant",
    shortDesc: 'Supported NJIT faculty. Early experience translating complex material for students.',
    category: 'work',
    aiNarrative: [
      "Before Gallatin fully took hold, he was already working inside classrooms in a different way — sitting alongside a professor at NJIT, helping students parse concepts that didn't yield easily. He learned then that the gap between understanding and explaining is where the real work lives.",
      "He has been bridging that gap ever since.",
    ],
  },
  {
    id: 'gallatin-pa',
    year: 'Sep 2021',
    title: "NYU Gallatin Professor's Assistant",
    shortDesc: 'Assisted faculty at Gallatin — bridging research and pedagogy while completing the B.A.',
    category: 'work',
    aiNarrative: [
      "In September 2021, while still working toward his own degree, he took on the role of Professor's Assistant at Gallatin — which meant reading the same questions from both sides of the table simultaneously.",
      "There is something particular about helping other students think through interdisciplinary work when you are yourself figuring out interdisciplinary work. The doubling made him sharper. It also made him more patient.",
    ],
  },
  {
    id: 'eae',
    year: '2021',
    title: 'E.A.E. Enterprises — Startup ATM Co.',
    shortDesc: 'Worked with a startup in the ATM space. Early exposure to small-business operations and fintech infrastructure.',
    category: 'work',
    aiNarrative: [
      "E.A.E. Enterprises was a small ATM startup, and his time there was less about the machines than about watching how a small business actually runs — the logistics, the friction, the gap between a good idea and a solvent operation.",
      "He learned things there that no classroom assigned. How cash flow thinks differently from capital. How infrastructure is invisible until it fails. He kept those lessons.",
    ],
  },
  {
    id: 'nmoa',
    year: '2021–Present',
    title: 'Newark Museum of Art — Gallery Host',
    shortDesc: 'Gallery floors, AV setups, and site-specific projection and playback for exhibitions.',
    category: 'work',
    href: '/work/av-museum-work',
    hrefLabel: 'AV & museum work →',
  },

  // ── Projects / Creative ───────────────────────────────────────────────────
  {
    id: 'queries',
    year: '2020',
    title: 'Queries (The Beat Tape): Family… Love?',
    shortDesc: 'A beat tape framing family and love as open questions — produced and sequenced during early college.',
    category: 'project',
    href: '/work/queries-beat-tape-family-love',
    hrefLabel: 'Listen →',
  },
  {
    id: 'survival-study',
    year: '2019–2021',
    title: 'Study: History of Survival',
    shortDesc: 'Examined how oppressed populations survive across centuries — and how art emerges from constraint. The intellectual spine of everything since.',
    category: 'project',
    href: '/work/the-art-of-survival',
    hrefLabel: 'See the thesis →',
  },
  {
    id: 'community-media',
    year: '2021–Present',
    title: 'Newark Community Media Projects',
    shortDesc: '50+ hours of field documentation, audio/visual essays, and listening sessions building a local organizing archive.',
    category: 'work',
    href: '/collaborations',
    hrefLabel: 'Collaborations →',
  },
  {
    id: 'water',
    year: '2022',
    title: 'Newark Water Coalition',
    shortDesc: "100+ households documented, 15+ community meetings, co-authored reports. Structural failures aren't abstract — they're in my backyard.",
    category: 'personal',
    href: '/collaborations',
    hrefLabel: 'Collaborations →',
  },
  {
    id: 'scraps-feminine',
    year: '2022',
    title: 'SCRAPS: Death of My Feminine (Demos)',
    shortDesc: 'Early SCRAPS demos — rap freestyles and rough voice memos from 2022. The beginning of the SCRAPS series.',
    category: 'project',
    href: '/work/scraps-death-of-my-feminine-demos-2022',
    hrefLabel: 'View →',
  },
  {
    id: 'art-of-survival',
    year: '2022–23',
    title: 'The Art of Survival',
    shortDesc: 'Biographical digital art and music made while living alone in Newark during junior and senior year. No prior digital-art skill — just started.',
    category: 'project',
    href: '/work/the-art-of-survival',
    hrefLabel: 'View project →',
  },
  {
    id: 'americas',
    year: '2022–23',
    title: 'Americas Scholars — NYU Gallatin',
    shortDesc: "Selected for Gallatin's Americas Scholars program. Work moved past the classroom and into the field.",
    category: 'education',
    aiNarrative: [
      "Selected for NYU Gallatin's Americas Scholars program in his junior and senior years. The program takes seriously the idea that the Americas are not one story but many — overlapping, contested, and alive. For someone who had been building a concentration around survival and civic memory, this felt like the institutional confirmation that the questions were real.",
      "He wrote, he thought, he stayed curious in the way he always had. He graduated.",
    ],
  },
  {
    id: 'scraps-heartbreaks',
    year: '2023',
    title: 'SCRAPS After Heartbreaks (Music Video)',
    shortDesc: 'A rap music video built from demos exploring heartbreak and isolation. Shot Feb–May 2023.',
    category: 'project',
    href: '/work/scraps-after-heartbreaks-musicvideo',
    hrefLabel: 'Watch →',
  },
  {
    id: 'newark-night',
    year: '2023',
    title: 'Newark Night Video Notes',
    shortDesc: 'Night-time visual diary cuts from Newark — street footage, ambient sound, color passes. A documentary of the city after dark.',
    category: 'project',
    href: '/work/newark-night-video-notes',
    hrefLabel: 'Watch →',
  },
  {
    id: 'graduated',
    year: '2023',
    title: 'B.A. — NYU Gallatin (Graduated)',
    shortDesc: 'Individualized concentration in survival, archive practice, and civic art. Graduated with a body of work, not just a degree.',
    category: 'education',
    href: '/work/the-art-of-survival',
    hrefLabel: 'Senior thesis →',
  },
  {
    id: 'genre-tree',
    year: '2023',
    title: 'Genre Hybrid Tree',
    shortDesc: 'An interactive map of genre DNA — tracing how musical forms hybridize, collapse, and re-emerge over time.',
    category: 'project',
    href: '/genre-tree',
    hrefLabel: 'Explore tree →',
  },
  {
    id: 'writing-archive',
    year: '2023–Present',
    title: 'Writing — Essays & Field Notes',
    shortDesc: 'Essays on power, community, and survival — including "The Sacrifice of Power" and "Following Sound" (field-work on sound in communities).',
    category: 'project',
    href: '/archive/writing',
    hrefLabel: 'Read writing →',
  },
  {
    id: 'scraps-dark',
    year: '2023–24',
    title: 'SCRAPS: Dark Days, Symptoms & No Context Demos',
    shortDesc: 'Unpolished rap demos and dark-day notes from 2023–2024. Mental health pieces, guilt cuts, and rough voice memos.',
    category: 'project',
    href: '/work/scraps-dark-days-symptoms-no-context-demos-2023-2024',
    hrefLabel: 'View →',
  },
  {
    id: 'market-model',
    year: '2024',
    title: 'Market Model',
    shortDesc: 'A structural diagram of how creative markets and economies of attention actually work.',
    category: 'project',
    href: '/market-model',
    hrefLabel: 'See model →',
  },
  {
    id: 'agi',
    year: '2024',
    title: 'AGI Signals Timeline',
    shortDesc: 'A curated, wave-based read of the AGI transition — organized by signal type, not hype cycle.',
    category: 'project',
    href: '/agi',
    hrefLabel: 'Read signals →',
  },
  {
    id: 'survival-os',
    year: '2024',
    title: 'Survival OS',
    shortDesc: 'A survival-first blueprint mapping what keeps a human alive, and what AI could automate to protect survivability.',
    category: 'project',
    href: '/survival-os',
    hrefLabel: 'Open OS →',
  },
  {
    id: 'post-labor',
    year: '2024–25',
    title: 'Post-Labor Economics',
    shortDesc: 'A systems model of automation → labor displacement → demand crisis → new economic agency. UBI, co-ops, income-mix shifts.',
    category: 'project',
    href: '/post-labor-economics',
    hrefLabel: 'See model →',
  },
  {
    id: 'archive',
    year: '2025',
    title: 'Archive — Music, Video, Writing',
    shortDesc: 'A living archive of music production, video work, and writing. Not a portfolio shell — an open record of process.',
    category: 'project',
    href: '/archive',
    hrefLabel: 'Enter archive →',
  },
  {
    id: 'life-map',
    year: '2025',
    title: 'Organizational Atlas',
    shortDesc: 'A systems view of a life — what must hold first, what opens once it does, and what moves outward. Platform → Emergence → Offering.',
    category: 'project',
    href: '/map',
    hrefLabel: 'Open map →',
  },
  {
    id: 'ai-work',
    year: '2025',
    title: 'AI & Prompt Engineering Practice',
    shortDesc: 'Building with Claude, researching AI accountability, developing prompt frameworks that keep human judgment in the loop.',
    category: 'project',
    href: '/ai',
    hrefLabel: 'AI work →',
  },
  {
    id: 'rejections',
    year: '2023–2026',
    title: '40 Rejections — On Record',
    shortDesc: 'Sony Music, Disney, NYT, Anthropic, OpenAI, NPR, PlayStation, Adobe, and 32 others. All documented. All real.',
    category: 'work',
    href: '/rejections',
    hrefLabel: 'See the record →',
  },
  {
    id: 'now',
    year: '2026',
    title: 'Now',
    shortDesc: "Still his mother's son. Still the kid who walked away from the car with a promise clenched in his chest. Still moving.",
    category: 'personal',
    href: '/now',
    hrefLabel: 'See now page →',
    aiNarrative: [
      "He is still his mother's son. Still the child who walked away from the car with a promise clenched in his chest. Still the one who asks questions other people think are impractical, because he has learned that those are often the only questions worth asking.",
      "He is working in media and creative work, looking for the place where all of it converges. He has not stopped moving since 2010 and he does not intend to start now.",
    ],
  },
];

const SHOWCASE_KIND_LABELS: Record<ShowcaseKind, string> = {
  writing: 'Writing',
  music: 'Music',
  photos: 'Photos',
  video: 'Video',
  work: 'Work',
  ideas: 'Ideas',
  community: 'Community',
};

const ENTRY_LOOKUP = new Map(ENTRIES.map((entry) => [entry.id, entry] as const));

const STAGE_SHOWCASES: StageShowcase[] = [
  {
    id: 'youth',
    title: 'Youth',
    ageRange: 'Ages 0–9',
    yearRange: '2000–2009',
    summary: 'Family, Newark, and sound build the emotional base before anything looks like a career.',
    accomplishments: [
      'Formed an early archive instinct through family memory, city atmosphere, and observation.',
      'Absorbed music as environment first: merengue in the kitchen before music became practice.',
      'Built the habit of noticing, questioning, and holding onto moments.'
    ],
    previewImages: ['/images/timeline-preview/collage-2.jpg', '/images/timeline-preview/download-5.jpg', '/images/timeline-preview/collage-6.jpg'],
    featuredEntryIds: ['born', 'kitchen'],
    showcases: [
      { label: 'About', href: '/about', kind: 'writing' },
      { label: 'Photo archive', href: '/instagram', kind: 'photos' },
      { label: 'Archive', href: '/archive', kind: 'ideas' }
    ]
  },
  {
    id: 'preteen',
    title: 'Preteen',
    ageRange: 'Ages 10–12',
    yearRange: '2010–2012',
    summary: 'Discipline and self-invention start after the school rupture and turn into forward motion.',
    accomplishments: [
      'Turned the fifth-grade setback into a private promise to keep moving.',
      'Built GVZ413 as an academic alter ego and a survival mechanism.',
      'Learned to treat school, identity, and effort as things you can construct.'
    ],
    previewImages: ['/images/timeline-preview/download-7.jpg', '/images/timeline-preview/download-1.jpg', '/images/timeline-preview/collage-4.jpg'],
    featuredEntryIds: ['car', 'gvz'],
    showcases: [
      { label: 'About', href: '/about', kind: 'writing' },
      { label: 'Story', href: '/story', kind: 'ideas' },
      { label: 'Photo archive', href: '/instagram', kind: 'photos' }
    ]
  },
  {
    id: 'teen',
    title: 'Teen',
    ageRange: 'Ages 13–19',
    yearRange: '2013–2019',
    summary: 'Voice forms through school, politics, ethics, friendship, and bedroom music.',
    accomplishments: [
      'Built visible leadership through chess, class representation, the school paper, and Upward Bound.',
      'Learned in London that perspective itself could be a contribution, not a burden.',
      'Moved from private instinct toward public voice in music, writing, and conversation.'
    ],
    previewImages: ['/images/timeline-preview/download-2.jpg', '/images/timeline-preview/collage-3.jpg', '/images/timeline-preview/collage-1.jpg'],
    featuredEntryIds: ['highschool', 'london', 'gallatin'],
    showcases: [
      { label: 'Life in IB', href: '/archive/writing/life-in-ib', kind: 'writing' },
      { label: 'My First Beat Tape', href: '/archive/music/my-first-beat-tape', kind: 'music' },
      { label: 'Photo archive', href: '/instagram', kind: 'photos' }
    ]
  },
  {
    id: 'college',
    title: 'College',
    ageRange: 'Ages 19–23',
    yearRange: '2019–2023',
    summary: 'NYU Gallatin B.A. — a self-designed concentration in survival, archive, and civic art. Work and studies run simultaneously.',
    accomplishments: [
      'Enrolled at NYU Gallatin School of Individualized Study and built a self-directed concentration around survival, civic art, and community memory.',
      'Held concurrent Professor\'s Assistant roles at both NYU Gallatin (Sep 2021) and NJIT while completing the degree.',
      'Started at the Newark Museum of Art as a Gallery Host — running AV systems, projection setups, and exhibition playback.',
      'Produced Queries (The Beat Tape) and launched The Art of Survival — biographical digital art made with zero prior skills.',
      'Co-authored community reports via the Newark Water Coalition; documented 100+ households and 15+ meetings.'
    ],
    previewImages: ['/images/timeline-preview/download-3.jpg', '/images/timeline-preview/collage-5.jpg', '/images/timeline-preview/download.jpg'],
    featuredEntryIds: ['gallatin', 'gallatin-pa', 'njit-pa', 'eae', 'nmoa', 'queries', 'art-of-survival'],
    showcases: [
      { label: 'The Art of Survival', href: '/work/the-art-of-survival', kind: 'work' },
      { label: 'Queries Beat Tape', href: '/work/queries-beat-tape-family-love', kind: 'music' },
      { label: 'AV & Museum Work', href: '/work/av-museum-work', kind: 'work' },
      { label: 'Writing archive', href: '/archive/writing', kind: 'writing' },
      { label: 'Collaborations', href: '/collaborations', kind: 'community' }
    ]
  },
  {
    id: 'postGrad',
    title: 'Post-Grad',
    ageRange: 'Ages 23–24',
    yearRange: '2023–2024',
    summary: 'Graduated Gallatin. SCRAPS projects, Newark Night footage, essays, and the beginning of a documented rejection record.',
    accomplishments: [
      'Earned B.A. from NYU Gallatin with an individualized concentration in survival, archive practice, and civic art.',
      'Released SCRAPS After Heartbreaks music video (Feb–May 2023) and SCRAPS Dark Days, Symptoms & No Context Demos.',
      'Shot Newark Night Video Notes — a street-level visual diary of the city after dark.',
      'Built a writing archive spanning essays on power, community, and survival.',
      'Began systematically documenting 40 direct employer rejections as a factual labor-market record.'
    ],
    previewImages: ['/images/timeline-preview/collage-3.jpg', '/images/timeline-preview/download-2.jpg', '/images/timeline-preview/download-7.jpg'],
    featuredEntryIds: ['graduated', 'americas', 'scraps-heartbreaks', 'newark-night', 'writing-archive', 'scraps-dark', 'rejections'],
    showcases: [
      { label: 'SCRAPS After Heartbreaks', href: '/work/scraps-after-heartbreaks-musicvideo', kind: 'video' },
      { label: 'Newark Night Video Notes', href: '/work/newark-night-video-notes', kind: 'video' },
      { label: 'SCRAPS Dark Days', href: '/work/scraps-dark-days-symptoms-no-context-demos-2023-2024', kind: 'music' },
      { label: 'Writing archive', href: '/archive/writing', kind: 'writing' },
      { label: 'Rejection record', href: '/rejections', kind: 'work' }
    ]
  },
  {
    id: 'current',
    title: 'Current',
    ageRange: 'Ages 24+',
    yearRange: '2024–Now',
    summary: 'Systems thinking and archive practice converge. Market Model, AGI research, Survival OS, and building with AI.',
    accomplishments: [
      'Built the Market Model — a structural diagram of how creative economies and attention markets actually work.',
      'Published the AGI Signals Timeline: a wave-based read of the AGI transition organized by signal type, not hype.',
      'Developed Survival OS — a blueprint mapping what keeps a human alive and what AI could safely automate.',
      'Assembled a living public archive of music, video, and writing as an open record of process.',
      'Active AI and prompt engineering practice: building with Claude, researching accountability, keeping human judgment central.'
    ],
    previewImages: ['/images/timeline-preview/download-5.jpg', '/images/timeline-preview/collage-6.jpg', '/images/timeline-preview/download-1.jpg'],
    featuredEntryIds: ['market-model', 'agi', 'survival-os', 'post-labor', 'archive', 'ai-work', 'now'],
    showcases: [
      { label: 'Market Model', href: '/market-model', kind: 'ideas' },
      { label: 'AGI Signals', href: '/agi', kind: 'ideas' },
      { label: 'Survival OS', href: '/survival-os', kind: 'ideas' },
      { label: 'Post-Labor Economics', href: '/post-labor-economics', kind: 'ideas' },
      { label: 'Music archive', href: '/archive/music', kind: 'music' },
      { label: 'Now', href: '/now', kind: 'writing' }
    ]
  }
];

type LifeTimelineProps = {
  variant?: 'dark' | 'light';
  layout?: 'contained' | 'fullBleed';
};

export default function LifeTimeline({ variant = 'dark', layout = 'contained' }: LifeTimelineProps) {
  const [activeEntryId, setActiveEntryId] = useState<string | null>('youth');
  const isFullBleed = layout === 'fullBleed';
  const timelineStyle = {
    '--lt-text': variant === 'light' ? '#1a1a1a' : 'color-mix(in srgb, var(--tone-text) 94%, white 6%)',
    '--lt-muted': variant === 'light' ? '#7a746b' : 'color-mix(in srgb, var(--tone-text) 86%, var(--tone-muted) 14%)',
    '--lt-soft': variant === 'light' ? '#8a8278' : 'color-mix(in srgb, var(--tone-text) 74%, var(--tone-muted) 26%)',
    '--lt-line': variant === 'light' ? '#d8d4ce' : 'color-mix(in srgb, var(--tone-accent) 12%, var(--line2))',
    '--lt-node': variant === 'light' ? '#c8c3bc' : 'color-mix(in srgb, var(--tone-text) 18%, var(--line2) 82%)',
    '--lt-node-active': variant === 'light' ? '#1a1a1a' : 'var(--tone-accent-glow)',
    '--lt-panel-border': variant === 'light' ? '#ddd6ca' : 'color-mix(in srgb, var(--tone-accent) 12%, var(--line2))',
    '--lt-badge-border': variant === 'light' ? '#ddd6ca' : 'color-mix(in srgb, var(--tone-accent) 14%, var(--line2))',
    '--lt-badge-text': variant === 'light' ? '#8b8377' : 'color-mix(in srgb, var(--tone-text) 56%, var(--tone-muted) 44%)',
    '--lt-link': variant === 'light' ? '#1a1a1a' : 'var(--tone-accent-glow)',
    '--lt-entry-ring': variant === 'light' ? '#f8f6f2' : 'var(--tone-surface)',
    '--lt-summary-text': variant === 'light' ? '#444039' : 'color-mix(in srgb, var(--tone-text) 92%, var(--tone-muted) 8%)',
    '--lt-hero-text': variant === 'light' ? '#444' : 'color-mix(in srgb, var(--tone-text) 90%, var(--tone-muted) 10%)',
    '--lt-accomplishment-text': variant === 'light' ? '#444' : 'color-mix(in srgb, var(--tone-text) 88%, var(--tone-muted) 12%)',
    '--lt-width': isFullBleed ? '100dvw' : 'auto',
    '--lt-max-width': isFullBleed ? 'none' : '1080px',
    '--lt-margin': isFullBleed ? '0 calc(50% - 50dvw)' : '0 auto',
    '--lt-padding': isFullBleed ? '0 clamp(1rem, 3vw, 2.75rem)' : '0 clamp(1rem, 2.4vw, 1.75rem)',
    '--lt-side-min-height': isFullBleed ? 'clamp(4.6rem, 6vw, 5.3rem)' : 'auto',
    '--lt-side-padding': isFullBleed ? 'clamp(0.55rem, 1vw, 0.8rem) clamp(0.1rem, 0.4vw, 0.18rem)' : '0',
    '--lt-panel-body-padding-bottom': isFullBleed ? 'clamp(0.4rem, 0.9vw, 0.65rem)' : '0',
    '--lt-panel-max-width': isFullBleed ? 'none' : '27rem',
    '--lt-panel-min-height': isFullBleed ? '100%' : 'auto',
    '--lt-panel-side-padding': isFullBleed
      ? 'clamp(0.55rem, 1.15vw, 0.95rem)'
      : 'clamp(0.4rem, 1vw, 0.75rem)',
  } as React.CSSProperties;

  return (
    <section className={`life-timeline life-timeline--${variant}`} aria-label="Life timeline" style={timelineStyle}>
      <ol className="life-timeline__list" role="list">
        {STAGE_SHOWCASES.map((stage, index) => {
          const open = activeEntryId === stage.id;
          const titleSide = index % 2 === 0 ? 'left' : 'right';
          const detailSide = titleSide === 'left' ? 'right' : 'left';
          const featuredMoments = stage.featuredEntryIds
            .map((entryId) => ENTRY_LOOKUP.get(entryId))
            .filter((entry): entry is TimelineEntry => Boolean(entry))
            .map((entry) => entry.title);

          return (
            <li
              key={stage.id}
              className={`life-timeline__entry life-timeline__entry--${titleSide}${open ? ' is-active' : ''}`}
            >
              <button
                type="button"
                className="life-timeline__tick"
                onClick={() => setActiveEntryId((current) => (current === stage.id ? null : stage.id))}
                aria-expanded={open}
                aria-controls={`life-timeline-panel-${stage.id}`}
              >
                <span className="life-timeline__side life-timeline__side--title">
                  <span className="life-timeline__year">{stage.ageRange}</span>
                  <span className="life-timeline__label">{stage.title}</span>
                  <span className="life-timeline__meta">{stage.yearRange}</span>
                  <span className="life-timeline__peek" aria-hidden="true">
                    {stage.previewImages.slice(0, 2).map((src) => (
                      <span
                        key={`${stage.id}-${src}-peek`}
                        className="life-timeline__peekImage"
                        style={{ backgroundImage: `url('${src}')` }}
                      />
                    ))}
                  </span>
                </span>
                <span className="life-timeline__center" aria-hidden="true">
                  <span className="life-timeline__dot"></span>
                </span>
                <span className="life-timeline__side life-timeline__side--summary">
                  <span className="life-timeline__summary">{stage.summary}</span>
                  <span className={`life-timeline__tab${open ? ' is-open' : ''}`} aria-hidden="true">
                    <span className="life-timeline__tabLabel">{open ? 'Hide showcase' : 'Open showcase'}</span>
                    <span className="life-timeline__arrow">
                      <svg viewBox="0 0 8 8">
                        <polyline points="2,1 6,4 2,7" />
                      </svg>
                    </span>
                  </span>
                </span>
              </button>

              <div
                id={`life-timeline-panel-${stage.id}`}
                className="life-timeline__panel"
                aria-hidden={!open}
              >
                <div className="life-timeline__panelInner">
                  <div className="life-timeline__panelAxis" aria-hidden="true"></div>
                  <div className={`life-timeline__panelBody life-timeline__panelBody--${detailSide}`}>
                    <div className="life-timeline__heroBlock">
                      <div className="life-timeline__visuals" aria-hidden="true">
                        {stage.previewImages.map((src, imageIndex) => (
                          <span
                            key={`${stage.id}-${src}`}
                            className={`life-timeline__visual life-timeline__visual--${imageIndex + 1}`}
                            style={{ backgroundImage: `url('${src}')` }}
                          />
                        ))}
                      </div>

                      <div className="life-timeline__heroCopy">
                        <p className="life-timeline__sectionLabel">Era frame</p>
                        <p className="life-timeline__heroSummary">{stage.summary}</p>
                        <div className="life-timeline__badges">
                          <span className="life-timeline__badge life-timeline__badge--ghost">{stage.ageRange}</span>
                          <span className="life-timeline__badge life-timeline__badge--ghost">{stage.yearRange}</span>
                          <span className="life-timeline__badge">{stage.showcases.length} branches</span>
                        </div>
                      </div>
                    </div>

                    <div className="life-timeline__block">
                      <p className="life-timeline__sectionLabel">Accomplishments</p>
                      <ul className="life-timeline__accomplishments">
                        {stage.accomplishments.map((item) => (
                          <li key={item} className="life-timeline__accomplishment">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="life-timeline__block">
                      <p className="life-timeline__sectionLabel">Showcases</p>
                      <div className="life-timeline__showcases">
                        {stage.showcases.map((item) => (
                          <a key={item.href} href={item.href} className="life-timeline__showcase">
                            <span className="life-timeline__showcaseKind">{SHOWCASE_KIND_LABELS[item.kind]}</span>
                            <span className="life-timeline__showcaseLabel">{item.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="life-timeline__block">
                      <p className="life-timeline__sectionLabel">Featured moments</p>
                      <div className="life-timeline__moments">
                        {featuredMoments.map((moment) => (
                          <span key={moment} className="life-timeline__moment">{moment}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
