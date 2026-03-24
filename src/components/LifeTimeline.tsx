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
    previewImages: ['/images/home-collage/collage-2.jpg', '/photos/download-5.jpg', '/images/home-collage/collage-6.jpg'],
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
    previewImages: ['/photos/download-7.jpg', '/photos/download-1.jpg', '/images/home-collage/collage-4.jpg'],
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
    previewImages: ['/photos/download-2.jpg', '/images/home-collage/collage-3.jpg', '/images/home-collage/collage-1.jpg'],
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
    previewImages: ['/photos/download-3.jpg', '/images/home-collage/collage-5.jpg', '/photos/download.jpg'],
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
    previewImages: ['/images/home-collage/collage-3.jpg', '/photos/download-2.jpg', '/photos/download-7.jpg'],
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
    previewImages: ['/photos/download-5.jpg', '/images/home-collage/collage-6.jpg', '/photos/download-1.jpg'],
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

  return (
    <section className={`life-timeline life-timeline--${variant}`} aria-label="Life timeline">
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

      <style>{`
        .life-timeline {
          --lt-text: ${variant === 'light' ? '#1a1a1a' : 'color-mix(in srgb, var(--tone-text) 94%, white 6%)'};
          --lt-muted: ${variant === 'light' ? '#7a746b' : 'color-mix(in srgb, var(--tone-text) 86%, var(--tone-muted) 14%)'};
          --lt-soft: ${variant === 'light' ? '#8a8278' : 'color-mix(in srgb, var(--tone-text) 74%, var(--tone-muted) 26%)'};
          --lt-line: ${variant === 'light' ? '#d8d4ce' : 'color-mix(in srgb, var(--tone-accent) 12%, var(--line2))'};
          --lt-node: ${variant === 'light' ? '#c8c3bc' : 'color-mix(in srgb, var(--tone-text) 18%, var(--line2) 82%)'};
          --lt-node-active: ${variant === 'light' ? '#1a1a1a' : 'var(--tone-accent-glow)'};
          --lt-panel-border: ${variant === 'light' ? '#ddd6ca' : 'color-mix(in srgb, var(--tone-accent) 12%, var(--line2))'};
          --lt-badge-border: ${variant === 'light' ? '#ddd6ca' : 'color-mix(in srgb, var(--tone-accent) 14%, var(--line2))'};
          --lt-badge-text: ${variant === 'light' ? '#8b8377' : 'color-mix(in srgb, var(--tone-text) 56%, var(--tone-muted) 44%)'};
          --lt-link: ${variant === 'light' ? '#1a1a1a' : 'var(--tone-accent-glow)'};
          width: ${isFullBleed ? '100dvw' : 'auto'};
          max-width: ${isFullBleed ? 'none' : '1080px'};
          margin: 0 ${isFullBleed ? 'calc(50% - 50dvw)' : 'auto'};
          padding: 0 ${isFullBleed ? 'clamp(1rem, 3vw, 2.75rem)' : 'clamp(1rem, 2.4vw, 1.75rem)'};
          color: var(--lt-text);
        }

        .life-timeline__list {
          position: relative;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .life-timeline__list::before {
          content: '';
          position: absolute;
          left: 50%;
          top: calc(-1 * var(--lt-top-extend, 0px));
          bottom: 0;
          width: 1px;
          background: var(--lt-line);
          transform: translateX(-0.5px);
        }

        .life-timeline__entry {
          position: relative;
          padding: clamp(0.24rem, 0.65vw, 0.45rem) 0 clamp(0.42rem, 0.95vw, 0.72rem);
        }

        .life-timeline__entry::before {
          content: '';
          position: absolute;
          left: calc(50% - 6px);
          top: clamp(1.12rem, 1.9vw, 1.32rem);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--lt-node);
          border: 2px solid ${variant === 'light' ? '#f8f6f2' : 'var(--tone-surface)'};
          transition: background 0.2s ease, transform 0.2s ease;
          z-index: 1;
        }

        .life-timeline__entry:hover::before,
        .life-timeline__entry.is-active::before {
          background: var(--lt-node-active);
          transform: scale(1.15);
        }

        .life-timeline__tick {
          display: grid;
          grid-template-columns: minmax(0, 1fr) clamp(2.2rem, 3vw, 3rem) minmax(0, 1fr);
          align-items: start;
          gap: clamp(0.55rem, 1.2vw, 0.9rem);
          width: 100%;
          padding: clamp(0.62rem, 1.15vw, 0.85rem) 0;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          user-select: none;
        }

        .life-timeline__side {
          display: grid;
          gap: 0.18rem;
          min-width: 0;
          min-height: ${isFullBleed ? 'clamp(4.6rem, 6vw, 5.3rem)' : 'auto'};
          padding: ${isFullBleed ? 'clamp(0.55rem, 1vw, 0.8rem) clamp(0.1rem, 0.4vw, 0.18rem)' : '0'};
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }

        .life-timeline__side--title {
          align-content: start;
        }

        .life-timeline__side--summary {
          align-content: start;
          padding-top: clamp(0.15rem, 0.5vw, 0.3rem);
        }

        .life-timeline__peek {
          display: inline-flex;
          gap: 0.35rem;
          margin-top: 0.42rem;
        }

        .life-timeline__peekImage {
          width: 2.5rem;
          height: 2.95rem;
          border-radius: 0.45rem;
          background-size: cover;
          background-position: center;
          border: 1px solid color-mix(in srgb, var(--lt-panel-border) 66%, transparent);
          opacity: 0.78;
          filter: saturate(0.86) brightness(0.9);
          transition: opacity 0.2s ease, filter 0.2s ease, transform 0.2s ease;
        }

        .life-timeline__entry--left .life-timeline__side--title {
          grid-column: 1;
          justify-items: end;
          text-align: right;
          padding-right: clamp(0.4rem, 1vw, 0.75rem);
        }

        .life-timeline__entry--left .life-timeline__side--summary {
          grid-column: 3;
          text-align: left;
          padding-left: clamp(0.3rem, 0.9vw, 0.7rem);
        }

        .life-timeline__entry--right .life-timeline__side--title {
          grid-column: 3;
          text-align: left;
          padding-left: clamp(0.4rem, 1vw, 0.75rem);
        }

        .life-timeline__entry--right .life-timeline__side--summary {
          grid-column: 1;
          justify-items: end;
          text-align: right;
          padding-right: clamp(0.3rem, 0.9vw, 0.7rem);
        }

        .life-timeline__center {
          grid-column: 2;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: clamp(0.62rem, 1vw, 0.82rem);
        }

        .life-timeline__dot {
          width: 0.24rem;
          height: 0.24rem;
          border-radius: 999px;
          background: color-mix(in srgb, var(--lt-node-active) 78%, transparent);
          box-shadow: 0 0 0 5px color-mix(in srgb, var(--lt-node-active) 10%, transparent);
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .life-timeline__year {
          font-size: 0.68rem;
          font-family: 'Helvetica Neue', sans-serif;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--lt-soft);
          transition: color 0.2s ease;
        }

        .life-timeline__label {
          font-size: clamp(1rem, 1.4vw, 1.26rem);
          font-family: Georgia, serif;
          line-height: 1.18;
          color: var(--lt-text);
          transition: color 0.2s ease;
          text-wrap: balance;
        }

        .life-timeline__meta {
          font-size: 0.65rem;
          font-family: 'Helvetica Neue', sans-serif;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--lt-soft);
        }

        .life-timeline__summary {
          max-width: 28rem;
          font-size: clamp(0.84rem, 1.05vw, 0.96rem);
          line-height: 1.58;
          color: ${variant === 'light' ? '#444039' : 'color-mix(in srgb, var(--tone-text) 92%, var(--tone-muted) 8%)'};
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .life-timeline__entry:hover .life-timeline__year,
        .life-timeline__entry.is-active .life-timeline__year,
        .life-timeline__entry:hover .life-timeline__label,
        .life-timeline__entry.is-active .life-timeline__label,
        .life-timeline__entry:hover .life-timeline__peekImage,
        .life-timeline__entry.is-active .life-timeline__peekImage {
          color: var(--lt-text);
        }

        .life-timeline__entry:hover .life-timeline__peekImage,
        .life-timeline__entry.is-active .life-timeline__peekImage {
          opacity: 0.98;
          filter: saturate(0.96) brightness(0.98);
          transform: translateY(-1px);
        }

        .life-timeline__tab {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          width: fit-content;
          margin-top: 0.28rem;
          padding: 0.08rem 0 0.14rem;
          border: 0;
          border-bottom: 1px solid color-mix(in srgb, var(--lt-panel-border) 68%, transparent);
          border-radius: 999px;
          background: transparent;
          color: var(--lt-soft);
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }

        .life-timeline__tabLabel {
          font-size: 0.63rem;
          font-family: 'Helvetica Neue', sans-serif;
          font-weight: 600;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .life-timeline__entry:hover .life-timeline__tab,
        .life-timeline__entry.is-active .life-timeline__tab {
          color: var(--lt-link);
          border-color: color-mix(in srgb, var(--lt-link) 35%, var(--lt-panel-border));
          background: transparent;
        }

        .life-timeline__arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 0.72rem;
          height: 0.72rem;
          opacity: 0.68;
          transition: opacity 0.2s ease, transform 0.25s ease;
        }

        .life-timeline__entry:hover .life-timeline__arrow,
        .life-timeline__entry.is-active .life-timeline__arrow,
        .life-timeline__entry:hover .life-timeline__dot,
        .life-timeline__entry.is-active .life-timeline__dot {
          opacity: 1;
        }

        .life-timeline__entry.is-active .life-timeline__arrow {
          transform: rotate(90deg);
        }

        .life-timeline__entry:hover .life-timeline__dot,
        .life-timeline__entry.is-active .life-timeline__dot {
          transform: scale(1);
        }

        .life-timeline__arrow svg {
          width: 0.5rem;
          height: 0.5rem;
          fill: none;
          stroke: var(--lt-text);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .life-timeline__panel {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition:
            max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.3s ease;
        }

        .life-timeline__entry.is-active .life-timeline__panel {
          max-height: 1600px;
          opacity: 1;
        }

        .life-timeline__panelInner {
          display: grid;
          grid-template-columns: minmax(0, 1fr) clamp(2.2rem, 3vw, 3rem) minmax(0, 1fr);
          gap: clamp(0.85rem, 1.8vw, 1.35rem);
          padding: 0 0 clamp(0.7rem, 1.15vw, 1rem);
        }

        .life-timeline__panelAxis {
          grid-column: 2;
        }

        .life-timeline__panelBody {
          display: grid;
          gap: 0.72rem;
          padding-top: 0.55rem;
          padding-bottom: ${isFullBleed ? 'clamp(0.4rem, 0.9vw, 0.65rem)' : '0'};
          max-width: ${isFullBleed ? 'none' : '27rem'};
          min-height: ${isFullBleed ? '100%' : 'auto'};
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          border-top: 1px solid color-mix(in srgb, var(--lt-panel-border) 72%, transparent);
        }

        .life-timeline__panelBody--left {
          grid-column: 1;
          justify-self: end;
          text-align: right;
          padding-right: ${isFullBleed ? 'clamp(0.55rem, 1.15vw, 0.95rem)' : 'clamp(0.4rem, 1vw, 0.75rem)'};
          padding-left: 0;
        }

        .life-timeline__panelBody--right {
          grid-column: 3;
          padding-left: ${isFullBleed ? 'clamp(0.55rem, 1.15vw, 0.95rem)' : 'clamp(0.4rem, 1vw, 0.75rem)'};
          padding-right: 0;
        }

        .life-timeline__heroBlock {
          display: grid;
          gap: 0.72rem;
        }

        .life-timeline__visuals {
          display: grid;
          grid-template-columns: 0.95fr 1.2fr 0.8fr;
          gap: 0.4rem;
        }

        .life-timeline__visual {
          display: block;
          min-height: clamp(4.2rem, 7vw, 6.1rem);
          border-radius: 0.55rem;
          background-size: cover;
          background-position: center;
          border: 1px solid color-mix(in srgb, var(--lt-panel-border) 70%, transparent);
          opacity: 0.94;
          filter: saturate(0.92) brightness(0.92);
        }

        .life-timeline__visual--2 {
          min-height: clamp(4.8rem, 8vw, 7rem);
        }

        .life-timeline__heroCopy {
          display: grid;
          gap: 0.42rem;
        }

        .life-timeline__heroSummary {
          margin: 0;
          font-size: clamp(0.9rem, 1vw, 1rem);
          line-height: 1.55;
          color: ${variant === 'light' ? '#444' : 'color-mix(in srgb, var(--tone-text) 90%, var(--tone-muted) 10%)'};
        }

        .life-timeline__badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .life-timeline__panelBody--left .life-timeline__badges {
          justify-content: flex-end;
        }

        .life-timeline__badge {
          display: inline-flex;
          align-items: center;
          min-height: 1.4rem;
          padding: 0.12rem 0.48rem;
          border: 1px solid var(--lt-badge-border);
          border-radius: 999px;
          font-size: 0.61rem;
          font-family: 'Helvetica Neue', sans-serif;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: var(--lt-badge-text);
        }

        .life-timeline__badge--ghost {
          opacity: 0.9;
        }

        .life-timeline__block {
          display: grid;
          gap: 0.5rem;
        }

        .life-timeline__sectionLabel {
          margin: 0;
          font-size: 0.64rem;
          font-family: 'Helvetica Neue', sans-serif;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--lt-link);
        }

        .life-timeline__accomplishments {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.42rem;
        }

        .life-timeline__accomplishment {
          margin: 0;
          font-size: clamp(0.86rem, 0.98vw, 0.96rem);
          line-height: 1.6;
          color: ${variant === 'light' ? '#444' : 'color-mix(in srgb, var(--tone-text) 88%, var(--tone-muted) 12%)'};
        }

        .life-timeline__showcases {
          display: grid;
          gap: 0.2rem;
        }

        .life-timeline__showcase {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: baseline;
          gap: 0.5rem;
          padding: 0.35rem 0;
          border: 0;
          border-bottom: 1px solid color-mix(in srgb, var(--lt-panel-border) 58%, transparent);
          border-radius: 0;
          background: transparent;
          text-decoration: none;
          transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
        }

        .life-timeline__showcase:hover {
          transform: translateX(2px);
          border-color: color-mix(in srgb, var(--lt-link) 34%, var(--lt-panel-border));
          background: transparent;
        }

        .life-timeline__showcaseKind {
          font-size: 0.6rem;
          font-family: 'Helvetica Neue', sans-serif;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--lt-soft);
        }

        .life-timeline__showcaseLabel {
          font-size: clamp(0.84rem, 0.98vw, 0.94rem);
          line-height: 1.35;
          color: var(--lt-text);
        }

        .life-timeline__moments {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .life-timeline__moment {
          display: inline-flex;
          align-items: center;
          min-height: 1.4rem;
          padding: 0.16rem 0.48rem;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--lt-badge-border) 92%, transparent);
          color: var(--lt-badge-text);
          font-size: 0.58rem;
          font-family: 'Helvetica Neue', sans-serif;
          letter-spacing: 0.08em;
        }

        .life-timeline__link {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          min-height: 1.65rem;
          padding-bottom: 2px;
          border-bottom: 1px solid var(--lt-panel-border);
          font-size: 0.6rem;
          font-family: 'Helvetica Neue', sans-serif;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--lt-link);
          text-decoration: none;
        }

        .life-timeline__link:hover {
          color: var(--lt-text);
          border-bottom-color: var(--lt-link);
        }

        @media (max-width: 720px) {
          .life-timeline {
            padding-inline: 1rem;
          }

          .life-timeline__list::before {
            left: 0.95rem;
            transform: none;
          }

          .life-timeline__entry::before {
            left: 0.6rem;
            top: 1.12rem;
          }

          .life-timeline__tick,
          .life-timeline__panelInner {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .life-timeline__center,
          .life-timeline__panelAxis {
            display: none;
          }

          .life-timeline__side--title,
          .life-timeline__side--summary,
          .life-timeline__entry--left .life-timeline__side--title,
          .life-timeline__entry--left .life-timeline__side--summary,
          .life-timeline__entry--right .life-timeline__side--title,
          .life-timeline__entry--right .life-timeline__side--summary,
          .life-timeline__panelBody--left,
          .life-timeline__panelBody--right {
            grid-column: 1;
            justify-items: start;
            justify-self: stretch;
            text-align: left;
            max-width: none;
            padding-left: 1.85rem;
            padding-right: 0;
            min-height: auto;
          }

          .life-timeline__arrow {
            margin-top: 0;
          }

          .life-timeline__panelBody--left .life-timeline__badges {
            justify-content: flex-start;
          }

          .life-timeline__visuals {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .life-timeline__peek {
            justify-content: flex-start;
          }
        }
      `}</style>
    </section>
  );
}
