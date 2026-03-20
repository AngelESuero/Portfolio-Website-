/**
 * LifeTimeline.tsx
 *
 * A living, interactive map of Angel Suero's milestones.
 *
 * - Personal/narrative entries expand on click to reveal AI-generated prose
 *   (clearly badged "AI-generated placeholder" — fill in with your own words).
 * - Work/project entries link directly to portfolio pages.
 * - Placeholder entries are dimmed with a reserved-spot marker.
 * - A footer link points to the original AI draft (angel.html).
 */

import React, { useState } from 'react';

type Category = 'personal' | 'education' | 'work' | 'project';

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
    placeholder: true,
    placeholderNote: 'Entry reserved',
  },
  {
    id: 'gallatin-pa',
    year: 'Sep 2021',
    title: "NYU Gallatin Professor's Assistant",
    shortDesc: 'Assisted faculty at Gallatin — bridging research and pedagogy while completing the B.A.',
    category: 'work',
    placeholder: true,
    placeholderNote: 'Entry reserved',
  },
  {
    id: 'eae',
    year: '2021',
    title: 'E.A.E. Enterprises — Startup ATM Co.',
    shortDesc: 'Worked with a startup in the ATM space. Early exposure to small-business operations and fintech infrastructure.',
    category: 'work',
    placeholder: true,
    placeholderNote: 'Entry reserved',
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
      "Selected for NYU Gallatin's Americas Scholars program, which took his work further — past the borders of the classroom and into the field. He wrote, he thought, he stayed curious in the way he always had. He graduated.",
    ],
    placeholder: true,
    placeholderNote: 'Entry reserved — expand for draft',
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

// ─────────────────────────────────────────────────────────────────────────────
// Category meta
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<Category, { label: string; color: string; dotColor: string }> = {
  personal:  { label: 'Personal',   color: 'var(--tone-sky-bright, #7fa3bf)',     dotColor: 'var(--tone-sky, #587a95)' },
  education: { label: 'Education',  color: 'var(--tone-accent, #b97a2d)',        dotColor: 'var(--tone-accent, #b97a2d)' },
  work:      { label: 'Work',       color: 'var(--tone-accent-bright, #d1913d)', dotColor: 'var(--tone-accent-bright, #d1913d)' },
  project:   { label: 'Project',    color: 'var(--tone-cosmic-bright, #8b5cf6)', dotColor: 'var(--tone-cosmic-bright, #8b5cf6)' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles (inline — component is self-contained)
// ─────────────────────────────────────────────────────────────────────────────

const css = {
  section: {
    display: 'grid',
    gap: 'clamp(1.4rem, 3vw, 2rem)',
  } as React.CSSProperties,

  header: {
    maxWidth: '54ch',
    display: 'grid',
    gap: '0.45rem',
  } as React.CSSProperties,

  kicker: {
    margin: 0,
    fontSize: '0.72rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
    color: 'var(--tone-accent, #b97a2d)',
  } as React.CSSProperties,

  heading: {
    margin: 0,
    fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
    lineHeight: 1.15,
    color: 'var(--tone-text)',
  } as React.CSSProperties,

  subhead: {
    margin: 0,
    fontSize: '0.9rem',
    color: 'color-mix(in srgb, var(--tone-text) 72%, var(--tone-muted) 28%)',
    lineHeight: 1.55,
  } as React.CSSProperties,

  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    position: 'relative' as const,
    display: 'grid',
    gap: 0,
    // The vertical line is rendered as a pseudo-element via a wrapper div
  } as React.CSSProperties,

  listInner: {
    position: 'relative' as const,
  } as React.CSSProperties,

  vertLine: {
    position: 'absolute' as const,
    top: '0.65rem',
    bottom: 0,
    left: '0.55rem',
    width: '1px',
    background: 'linear-gradient(180deg, color-mix(in srgb, var(--tone-accent-glow, #e7b36d) 55%, transparent), color-mix(in srgb, var(--tone-accent, #b97a2d) 12%, transparent 88%))',
    pointerEvents: 'none' as const,
  } as React.CSSProperties,

  item: {
    display: 'grid',
    gridTemplateColumns: '1.2rem 1fr',
    gap: '0 1rem',
    alignItems: 'start' as const,
    paddingBottom: '0.75rem',
    position: 'relative' as const,
  } as React.CSSProperties,

  nodeCol: {
    display: 'flex',
    alignItems: 'flex-start' as const,
    justifyContent: 'center' as const,
    paddingTop: '0.8rem',
    zIndex: 1,
  } as React.CSSProperties,

  footer: {
    paddingTop: '0.5rem',
    borderTop: '1px solid var(--line2, rgba(237,227,209,0.06))',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.78rem',
    color: 'color-mix(in srgb, var(--tone-muted) 70%, transparent)',
  } as React.CSSProperties,

  footerLink: {
    color: 'var(--tone-accent-glow, #e7b36d)',
    textDecoration: 'underline',
    textDecorationColor: 'color-mix(in srgb, var(--tone-accent-glow, #e7b36d) 35%, transparent)',
    textUnderlineOffset: '3px',
    fontSize: '0.78rem',
  } as React.CSSProperties,
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function CategoryTag({ category }: { category: Category }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '0.65rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        padding: '0.15em 0.6em',
        borderRadius: '999px',
        border: `1px solid color-mix(in srgb, ${meta.color} 35%, transparent)`,
        background: `color-mix(in srgb, ${meta.color} 9%, transparent)`,
        color: meta.color,
        fontWeight: 500,
        lineHeight: 1.6,
        flexShrink: 0,
      }}
    >
      {meta.label}
    </span>
  );
}

function AiBadge() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3em',
        fontSize: '0.65rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'color-mix(in srgb, var(--tone-muted) 75%, transparent)',
        border: '1px solid color-mix(in srgb, var(--tone-muted) 22%, transparent)',
        borderRadius: '3px',
        padding: '0.18em 0.55em',
        marginBottom: '0.75rem',
      }}
    >
      ✦ AI-generated placeholder
    </span>
  );
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const [open, setOpen] = useState(false);
  const meta = CATEGORY_META[entry.category];
  const hasNarrative = !!(entry.aiNarrative && entry.aiNarrative.length > 0);
  const isClickable = hasNarrative || (!!entry.href && !entry.placeholder);
  const isLinked = !!entry.href && !entry.placeholder;

  const [hovered, setHovered] = useState(false);

  // Card element — <a> if linked only, otherwise <div>
  const cardStyle: React.CSSProperties = {
    display: 'grid',
    gap: '0.45rem',
    padding: 'clamp(0.8rem, 2vw, 1rem)',
    border: `1px solid ${hovered && isClickable
      ? `color-mix(in srgb, ${meta.color} 45%, transparent)`
      : 'var(--line2, rgba(237,227,209,0.06))'}`,
    borderRadius: 'calc(var(--radius, 6px) * 1.2)',
    background: hovered && isClickable
      ? `linear-gradient(160deg, color-mix(in srgb, ${meta.color} 7%, transparent), color-mix(in srgb, var(--bg1, #1b1916) 97%, transparent))`
      : 'linear-gradient(160deg, color-mix(in srgb, var(--tone-surface, rgba(255,255,255,0.04)) 80%, transparent), color-mix(in srgb, var(--bg1, #1b1916) 96%, transparent))',
    color: 'inherit',
    textDecoration: 'none',
    cursor: isClickable ? 'pointer' : 'default',
    transition: 'border-color 180ms ease, background 180ms ease, transform 180ms ease, box-shadow 260ms ease',
    transform: hovered && isClickable ? 'translateX(3px)' : 'none',
    boxShadow: hovered && isClickable ? `0 4px 20px color-mix(in srgb, ${meta.color} 10%, transparent)` : 'none',
    opacity: entry.placeholder && !hasNarrative ? 0.52 : 1,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // Accent edge bar on left when hovered
  const edgeBarStyle: React.CSSProperties = {
    position: 'absolute',
    inset: '0.6rem auto 0.6rem 0',
    width: '2px',
    borderRadius: '999px',
    background: hovered && isClickable
      ? `linear-gradient(180deg, ${meta.color}, color-mix(in srgb, ${meta.color} 20%, transparent))`
      : 'transparent',
    transition: 'background 180ms ease',
  };

  const dotStyle: React.CSSProperties = {
    width: '0.65rem',
    height: '0.65rem',
    borderRadius: '50%',
    border: `1.5px ${entry.placeholder && !hasNarrative ? 'dashed' : 'solid'} ${meta.dotColor}`,
    background: hovered && isClickable ? meta.color : 'var(--bg1, #1b1916)',
    opacity: entry.placeholder && !hasNarrative ? 0.5 : 1,
    transition: 'background 180ms ease, box-shadow 180ms ease',
    boxShadow: hovered && isClickable ? `0 0 6px color-mix(in srgb, ${meta.color} 55%, transparent)` : 'none',
    flexShrink: 0,
  };

  function handleCardClick() {
    if (hasNarrative) setOpen(o => !o);
  }

  const CardEl = isLinked && !hasNarrative ? 'a' : 'div';
  const cardProps = isLinked && !hasNarrative
    ? { href: entry.href, ...(entry.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
    : {};

  return (
    <li style={css.item}>
      {/* Node dot */}
      <div style={css.nodeCol}>
        <span style={dotStyle} aria-hidden="true" />
      </div>

      {/* Card */}
      <CardEl
        style={cardStyle}
        onClick={hasNarrative ? handleCardClick : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        tabIndex={isClickable ? 0 : undefined}
        role={hasNarrative ? 'button' : undefined}
        aria-expanded={hasNarrative ? open : undefined}
        {...cardProps as Record<string, unknown>}
      >
        {/* Edge accent bar */}
        <span style={edgeBarStyle} aria-hidden="true" />

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: meta.color,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 500,
          }}>
            {entry.year}
          </span>
          <CategoryTag category={entry.category} />
          {hasNarrative && (
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.7rem',
              color: 'color-mix(in srgb, var(--tone-muted) 65%, transparent)',
              transition: 'transform 250ms ease',
              transform: open ? 'rotate(90deg)' : 'none',
              display: 'inline-block',
            }} aria-hidden="true">›</span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          margin: 0,
          fontSize: 'clamp(0.95rem, 1.8vw, 1.08rem)',
          lineHeight: 1.25,
          color: 'var(--tone-text)',
          fontWeight: 500,
        }}>
          {entry.title}
        </h3>

        {/* Short description */}
        <p style={{
          margin: 0,
          fontSize: '0.88rem',
          lineHeight: 1.6,
          color: 'color-mix(in srgb, var(--tone-text) 82%, var(--tone-muted) 18%)',
        }}>
          {entry.shortDesc}
        </p>

        {/* Expandable narrative panel */}
        {hasNarrative && (
          <div style={{
            overflow: 'hidden',
            maxHeight: open ? '600px' : '0',
            opacity: open ? 1 : 0,
            transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          }}>
            <div style={{
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--line2, rgba(237,227,209,0.06))',
              marginTop: '0.4rem',
            }}>
              <AiBadge />
              {entry.aiNarrative!.map((para, i) => (
                <p key={i} style={{
                  margin: 0,
                  marginBottom: i < entry.aiNarrative!.length - 1 ? '0.85rem' : 0,
                  fontSize: '0.9rem',
                  lineHeight: 1.75,
                  color: 'color-mix(in srgb, var(--tone-text) 78%, var(--tone-muted) 22%)',
                  fontFamily: 'Georgia, serif',
                }}>
                  {para}
                </p>
              ))}
              {isLinked && (
                <a
                  href={entry.href}
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: 'inline-block',
                    marginTop: '1rem',
                    fontSize: '0.78rem',
                    color: meta.color,
                    textDecoration: 'underline',
                    textDecorationColor: `color-mix(in srgb, ${meta.color} 40%, transparent)`,
                    textUnderlineOffset: '3px',
                    letterSpacing: '0.03em',
                  }}
                >
                  {entry.hrefLabel ?? 'View →'}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Non-narrative linked CTA — shows on hover */}
        {isLinked && !hasNarrative && (
          <span style={{
            display: 'inline-block',
            marginTop: '0.15rem',
            fontSize: '0.78rem',
            letterSpacing: '0.04em',
            color: meta.color,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(-4px)',
            transition: 'opacity 180ms ease, transform 180ms ease',
          }}>
            {entry.hrefLabel ?? 'View →'}
          </span>
        )}

        {/* Placeholder note */}
        {entry.placeholder && !hasNarrative && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35em',
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            color: 'color-mix(in srgb, var(--tone-muted) 55%, transparent)',
            textTransform: 'uppercase',
          }}>
            <span aria-hidden="true" style={{ opacity: 0.5 }}>⊙</span>
            {entry.placeholderNote ?? 'Coming soon'}
          </span>
        )}
      </CardEl>
    </li>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function LifeTimeline() {
  return (
    <section style={css.section} aria-labelledby="lt-heading">
      {/* Header */}
      <div style={css.header}>
        <p style={css.kicker}>Life timeline</p>
        <h2 id="lt-heading" style={css.heading}>Formation over time</h2>
        <p style={css.subhead}>
          A living map of milestones — education, work, and creative projects — wired to the portfolio.
          Click narrative entries to expand. Dimmed entries are reserved spots.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={css.vertLine} aria-hidden="true" />
        <ol style={css.list} role="list">
          {ENTRIES.map(entry => (
            <TimelineItem key={entry.id} entry={entry} />
          ))}
        </ol>
      </div>

      {/* Footer — accessible link to the original AI draft */}
      <div style={css.footer}>
        <span aria-hidden="true" style={{ opacity: 0.5 }}>✦</span>
        <span>Narrative prose is AI-generated and reserved for your own words.</span>
        <a
          href="file:///Users/angelsuero/Library/Application%20Support/Claude/local-agent-mode-sessions/cc769079-c6e7-4db4-8b1c-3800c5796c3d/7b871437-f9e5-4684-a0f7-f738a1c373a4/local_67874b6c-da4d-49ff-a4b5-8fa6a9cef1aa/outputs/angel.html"
          target="_blank"
          rel="noopener noreferrer"
          style={css.footerLink}
          aria-label="View original AI-generated timeline draft (opens in new tab)"
        >
          View AI draft →
        </a>
      </div>
    </section>
  );
}
