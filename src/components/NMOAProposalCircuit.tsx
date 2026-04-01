import React, { type ReactNode, useState } from 'react';

type Tone = 'neutral' | 'rose' | 'blue' | 'violet' | 'amber' | 'emerald';
type Tilt = 'none' | 'left' | 'right';

type RootProblem = {
  id: string;
  title: string;
  shortLabel: string;
  tone: Tone;
  summary: string;
  showsUpAs: string[];
  whyItMatters: string;
  connectedLines: string[];
};

type ProposalItem = {
  id: string;
  title: string;
  tone: Tone;
  tilt: Tilt;
  kind: string;
  maturityShort: string;
  summary: string;
  whatItIs: string;
  problemAddressed: string;
  rootProblems: string[];
  museumProblemContext: string;
  whatItCouldBring: string[];
  maturity: string;
  docs: string[];
};

type ProposalSectionData = {
  eyebrow: string;
  title: string;
  items: ProposalItem[];
};

const rootProblems: RootProblem[] = [
  {
    id: 'financial-fragility',
    title: 'Money pressure',
    shortLabel: 'Funding / stability',
    tone: 'amber',
    summary: 'The museum seems to be working under steady financial pressure rather than from a position of real ease or flexibility.',
    showsUpAs: [
      'Budget strain',
      'Need for more revenue',
      'Reliance on grants and donors',
      'Limited flexibility',
      'Pressure on staffing and planning',
    ],
    whyItMatters:
      'When money is tight, almost everything else gets harder. Staffing, maintenance, growth, and experimentation all become more fragile.',
    connectedLines: [
      'Income generation strategies',
      'Grant research resources',
      'Audited financials',
      'Museum Parc context',
    ],
  },
  {
    id: 'staff-strain',
    title: 'Staff support issues',
    shortLabel: 'Work conditions',
    tone: 'rose',
    summary: 'The museum appears to rely heavily on staff commitment while still having uneven support underneath that work.',
    showsUpAs: ['Pay pressure', 'Workload stress', 'Limited advancement', 'Burnout risk', 'Front-line strain'],
    whyItMatters:
      'If the people holding the museum together are stretched too thin, the public experience and the institution\'s long-term health both suffer.',
    connectedLines: [
      'GH+ / Gallery Host Plus',
      'Essential, Livable, and Thrivable Incomes',
      'VEx Tailor Shop',
      'Accessibility research',
    ],
  },
  {
    id: 'expansion-pressure',
    title: 'Change happening too fast',
    shortLabel: 'Growth / disruption',
    tone: 'emerald',
    summary: 'The museum is trying to grow and transform while still dealing with the day-to-day disruption that change creates.',
    showsUpAs: [
      'Construction stress',
      'Parking disruption',
      'Wayfinding issues',
      'Operational friction',
      'Change fatigue',
    ],
    whyItMatters:
      'Growth can be valuable, but when too much changes at once, staff and visitors feel the strain before they feel the benefits.',
    connectedLines: ['The Next Chapter', 'Museum Parc context', 'Living Cultural Space', 'Income generation strategies'],
  },
  {
    id: 'internal-alignment',
    title: 'Weak internal communication',
    shortLabel: 'Clarity / trust',
    tone: 'blue',
    summary:
      'A recurring issue seems to be not just what decisions get made, but how clearly they are explained and understood inside the museum.',
    showsUpAs: [
      'Confusion around decisions',
      'Need for transparency',
      'Too many mixed channels',
      'Policy/process emphasis',
      'Trust friction',
    ],
    whyItMatters:
      'Even good decisions create frustration if people cannot clearly see the reasoning, the process, or what is expected of them.',
    connectedLines: ['Team communication support logic', 'GH+', 'Impact reports', 'The Next Chapter'],
  },
  {
    id: 'public-value-conversion',
    title: 'Strong mission, weaker pull',
    shortLabel: 'Public energy',
    tone: 'violet',
    summary:
      'The museum seems to have real public value, but not always enough social energy, repeat pull, or lasting conversion around that value.',
    showsUpAs: [
      'Need for repeat visitors',
      'Need for stronger atmosphere',
      'Destination challenge',
      'Nightlife opportunity',
      'Support not fully converted',
    ],
    whyItMatters:
      'A museum can be respected and still not feel magnetic enough to keep drawing people back, building momentum, or growing support.',
    connectedLines: ['Living Cultural Space', 'Nightlife venue potential', 'Impact reports', 'Income generation strategies'],
  },
  {
    id: 'knowledge-infrastructure',
    title: 'Too much hidden value',
    shortLabel: 'Collections / knowledge',
    tone: 'neutral',
    summary:
      'The museum likely holds more material, knowledge, and usable value than its current systems make easy to find or activate.',
    showsUpAs: ['Hidden materials', 'Slow cataloging', 'Hard-to-find records', 'Metadata gaps', 'Underused archives'],
    whyItMatters:
      'If important knowledge stays buried, the museum cannot fully use what it already has for staff, research, or the public.',
    connectedLines: [
      'OpenAI x NMOA pilot',
      'AI Accountability Pledge',
      'Grant research',
      'Institutional context files',
    ],
  },
];

const sections: ProposalSectionData[] = [
  {
    eyebrow: 'Plans and pilots',
    title: 'Materials that act directly on the circuit',
    items: [
      {
        id: 'living-cultural-space',
        title: 'Living Cultural Space / Conversation Corner',
        tone: 'blue',
        tilt: 'left',
        kind: 'Direct proposal',
        maturityShort: 'Concrete pilot design',
        summary:
          'A small, low-cost atmosphere pilot meant to make the museum feel more lived in, people-centered, and socially active.',
        whatItIs:
          'A recurring conversation-based museum format built around staff presence, interpretation, media, and a contained public room. Its first recommended version is Conversation Corner, with minimal equipment, short setup time, and a six- to eight-week evaluation window.',
        problemAddressed:
          'The museum can feel socially static or too institution-first, while contemporary audiences often form attachment through people, scenes, clips, and repeatable activity before they deepen into the institution itself.',
        rootProblems: ['Strong mission, weaker pull', 'Change happening too fast'],
        museumProblemContext:
          'This proposal makes more sense when read as a response to a larger institutional need: stronger atmosphere, stronger repeat energy, and a more activated public identity during a period of museum transformation.',
        whatItCouldBring: [
          'Warmer atmosphere',
          'Repeat activation',
          'Low-cost testing',
          'More public conversation',
          'Better return-visit potential',
        ],
        maturity:
          'This is one of the most concretely formed items in the set. It is already written like a pilot design rather than a loose theme or background note.',
        docs: ['Newark_Museum_Living_Cultural_Space_Proposal_v7.pdf', 'Draft proposal: Living Cultural Space / Conversation Corner'],
      },
      {
        id: 'openai-nmoa',
        title: 'OpenAI x NMOA Ethical AI Cataloging Pilot',
        tone: 'violet',
        tilt: 'right',
        kind: 'Direct proposal',
        maturityShort: 'Bounded partnership pilot',
        summary:
          'A short partnership pilot using a limited object set to test AI-assisted metadata enrichment and searchable cataloging support.',
        whatItIs:
          'A 14-day pilot built around a 200-object dataset to test AI-assisted metadata enrichment, searchable descriptions, and interpretive support, with curator review, structured outputs, and an internal demo microsite.',
        problemAddressed:
          'Under-catalogued or under-surfaced materials are harder for staff to search, interpret, and potentially expose to the public.',
        rootProblems: ['Too much hidden value', 'Weak internal communication'],
        museumProblemContext:
          'This is not just a tech idea. It responds to a larger museum problem: the institution likely holds more knowledge and material value than its current cataloging and retrieval systems can surface well.',
        whatItCouldBring: [
          'Faster cataloging support',
          'Better discoverability',
          'Stronger metadata',
          'More searchable records',
          'Bounded AI governance',
        ],
        maturity:
          'This is a bounded pilot, not a museum-wide AI overhaul. Its role is to test a narrow workflow with human review before any broader expansion.',
        docs: [
          'Newarkmuseum Openai Partnership (1).pdf',
          '08_OpenAI_Museum_Cataloging_Pilot_Draft.pdf',
          '11_AI_Accountability_Pledge.pdf',
        ],
      },
      {
        id: 'gh-plus',
        title: 'GH+ / Gallery Host Plus',
        tone: 'rose',
        tilt: 'left',
        kind: 'Direct proposal',
        maturityShort: 'Institutional-renewal proposal',
        summary:
          'A workforce and institutional-renewal proposal built around Gallery Hosts, with support, cross-training, wellness, and longer-term pathways.',
        whatItIs:
          'A workforce and institutional-renewal proposal built around Gallery Hosts, with structured cross-training, mentorship, wellness supports, focus weeks, peer support, wage tiers, and a longer-term fellowship pathway.',
        problemAddressed:
          'Recurring pain points around wage stagnation, soft hour caps, limited benefits, weak advancement paths, lack of formal cross-training, and the physical and mental strain of Gallery Host work.',
        rootProblems: ['Staff support issues', 'Weak internal communication'],
        museumProblemContext:
          'This proposal responds to a core inside problem: the museum depends heavily on front-line staff while still appearing to underbuild the systems that would let those staff be supported, developed, and retained more fully.',
        whatItCouldBring: [
          'Better staff support',
          'Retention',
          'Higher morale',
          'Talent development',
          'Stronger visitor-facing culture',
        ],
        maturity:
          'This reads as a major internal-renewal proposal rather than a tiny pilot. It is broader than a single department fix, even though it starts from Gallery Host conditions.',
        docs: ['GH+ core proposal variants', 'VEx Tailor Shop Proposals.pdf', 'Essential, Livable, and Thrivable Incomes.pdf'],
      },
      {
        id: 'income-generation',
        title: 'Newark Museum income generation strategies',
        tone: 'amber',
        tilt: 'right',
        kind: 'Direct proposal',
        maturityShort: 'Strategic financial memo',
        summary:
          'A broad financial-stability strategy covering memberships, rentals, digital revenue, sponsorships, grants, fundraising, and longer-range growth.',
        whatItIs:
          'A broad financial-stability strategy memo covering ticketing, memberships, shop and e-commerce, donor cultivation, naming rights, planned giving, endowment growth, grants, partnerships, rentals, programs, and digital revenue.',
        problemAddressed:
          'Over-reliance on fragile funding mixes, especially contributions and government support, plus underdeveloped earned-income and digital-revenue lines.',
        rootProblems: ['Money pressure', 'Strong mission, weaker pull'],
        museumProblemContext:
          'This file maps to the museum\'s most basic pressure: the need to become more durable, diversified, and strategically flexible instead of depending too heavily on narrower funding mixes.',
        whatItCouldBring: [
          'Revenue diversity',
          'Stronger membership',
          'More fundraising options',
          'Long-range stability',
          'More flexible institutional capacity',
        ],
        maturity:
          'This is less a single pilot and more a strategic memo or framework. Its role is to strengthen the museum\'s financial base and support other initiatives over time.',
        docs: [
          'Newark Museum income generation strategies.pdf',
          '2024-NMOA-Audited-Financials-PDF.pdf',
          'The Next Chapter - The Newark Museum of Art.pdf',
        ],
      },
    ],
  },
  {
    eyebrow: 'Support and research',
    title: 'Materials that help explain the same pressures',
    items: [
      {
        id: 'essential-livable-thrivable',
        title: 'Essential, Livable, and Thrivable Incomes',
        tone: 'emerald',
        tilt: 'left',
        kind: 'Support framework',
        maturityShort: 'Wage reality model',
        summary:
          'A Newark cost-of-living framework that breaks life into Bare Minimum, Modest Living, and Point of Accession tiers.',
        whatItIs:
          'A Newark cost-of-living framework with category-by-category budgets for housing, food, transportation, utilities, healthcare, and more, meant to distinguish survival from modest stability and fuller accession.',
        problemAddressed:
          'Compensation debates often stay abstract or anchored to legal minimums rather than real life conditions.',
        rootProblems: ['Staff support issues', 'Money pressure'],
        museumProblemContext:
          'This file helps make labor pressure legible. It gives the museum a more grounded way to think about wages and survival rather than defaulting to minimums or vague fairness language.',
        whatItCouldBring: [
          'Wage realism',
          'Better compensation framing',
          'More grounded labor arguments',
          'Clearer tier logic',
        ],
        maturity:
          'This is not a museum operations plan by itself. Its role is to support wage, staffing, and labor proposals with a concrete local standard.',
        docs: ['Essential, Livable, and Thrivable Incomes.pdf'],
      },
      {
        id: 'accessibility-research',
        title: 'Museum accessibility and visitor engagement',
        tone: 'blue',
        tilt: 'right',
        kind: 'Support framework',
        maturityShort: 'Evidence base',
        summary:
          'An accessibility research report centered on tactile objects, multisensory design, accessible communication, and integrated access practice.',
        whatItIs:
          'A research report centered on tactile objects, multisensory design, accessible communications, digital-tactile hybrids, staff awareness, and integrated rather than segregated accessibility practice.',
        problemAddressed:
          'Museums often treat accessibility as a narrow accommodation problem instead of a full visitor-experience and communication-design issue.',
        rootProblems: ['Staff support issues', 'Strong mission, weaker pull'],
        museumProblemContext:
          'This supports the idea that the museum\'s public value is not only about programming. It is also about whether access, communication, and experience design are built deeply enough into the institution.',
        whatItCouldBring: [
          'Better access design',
          'More inclusive visitor experience',
          'Multisensory thinking',
          'Stronger staff awareness',
        ],
        maturity:
          'This reads more like an evidence base or planning resource than a finished internal policy memo. Its role is to strengthen future proposals and design choices.',
        docs: ['Museum accessibility and visitor engagement_.pdf'],
      },
      {
        id: 'nightlife-research',
        title: 'Newark Nightlife Venue Potential',
        tone: 'neutral',
        tilt: 'left',
        kind: 'Exploratory research',
        maturityShort: 'Feasibility framing',
        summary:
          'Exploratory nightlife-market research about whether a large, culturally magnetic venue model could work in downtown Newark.',
        whatItIs:
          'Exploratory nightlife-market research about whether a large, culturally magnetic venue model could work in downtown Newark. It feeds the broader nightlife and cultural-venue line more than it stands as a polished museum proposal.',
        problemAddressed:
          'Downtown Newark may still lack enough culturally magnetic, sustainable, socially alive venue models that bridge nightlife, accessibility, and public culture.',
        rootProblems: ['Strong mission, weaker pull', 'Money pressure'],
        museumProblemContext:
          'This helps frame a larger institutional question: can the museum become more socially magnetic and economically alive without abandoning its public mission?',
        whatItCouldBring: [
          'Market realism',
          'Nightlife context',
          'Downtown positioning insight',
          'Better feasibility framing',
        ],
        maturity:
          'This is not a finished internal museum proposal. Its role is to test whether the broader cultural-venue line has structural potential.',
        docs: ['Newark Nightlife Venue Potential.docx'],
      },
      {
        id: 'ai-accountability',
        title: 'AI Accountability Pledge',
        tone: 'violet',
        tilt: 'right',
        kind: 'Ethics framework',
        maturityShort: 'Governance support',
        summary:
          'An ethics framework centered on transparency, preserved human accountability, and clear privacy and consent boundaries.',
        whatItIs:
          'A reconstructed ethics framework centered on transparency about where AI is used, preserved human accountability, clear privacy, consent, and data boundaries, and possible public-facing reporting or internal review.',
        problemAddressed:
          'Institutional AI language can easily become vague, unaccountable, or trust-eroding.',
        rootProblems: ['Too much hidden value', 'Weak internal communication'],
        museumProblemContext:
          'If the museum expands AI use without clear ethical language, even a useful pilot can start to feel vague or untrustworthy. This file is the trust layer.',
        whatItCouldBring: [
          'Clearer AI governance',
          'Higher trust',
          'Defined accountability',
          'Better adoption boundaries',
        ],
        maturity:
          'This is not a museum implementation plan by itself. Its role is to serve as a governance and trust layer for AI-related proposals.',
        docs: ['11_AI_Accountability_Pledge.pdf'],
      },
      {
        id: 'vex-tailor-shop',
        title: 'VEx Tailor Shop core framework',
        tone: 'rose',
        tilt: 'left',
        kind: 'Internal care concept',
        maturityShort: 'Small practical support system',
        summary:
          'A VEx-only internal care system built around one locker, one sewing area, repair and customization, and a lightweight workflow.',
        whatItIs:
          'A Visitor Experience-only internal care system built around one locker, one sewing area, surplus uniforms, repair and customization, a Discord workflow, and the idea of a quiet internal resource that could later grow into a larger style station.',
        problemAddressed:
          'Staff can end up without accessible, clean, repaired, or presentable clothing, and that becomes both a practical and dignity issue.',
        rootProblems: ['Staff support issues'],
        museumProblemContext:
          'This is a small proposal, but it is solving a real inside problem. It signals that staff care is not only about pay bands and policy but also about daily working conditions and visible institutional support.',
        whatItCouldBring: [
          'Small quality-of-life gains',
          'Better presentability',
          'Lower stress around uniforms',
          'Visible staff care',
        ],
        maturity:
          'This is narrower than the institution-wide proposals. Its role is as a practical, low-cost internal support concept inside Visitor Experience.',
        docs: ['VEx Tailor Shop Proposals.pdf'],
      },
    ],
  },
  {
    eyebrow: 'Institutional context',
    title: 'Materials that show the wider conditions around the circuit',
    items: [
      {
        id: 'grant-research',
        title: 'Newark Museum Grant Research Resources',
        tone: 'amber',
        tilt: 'left',
        kind: 'Funding support memo',
        maturityShort: 'Implementation support',
        summary: 'A grant landscape memo mapping real funding channels across public, foundation, and corporate sources.',
        whatItIs:
          'A grant landscape memo mapping real funding channels across IMLS, NEH, NPS, state, foundation, and corporate sources, with special attention to preservation, capacity building, HVAC, lighting, Ballantine House, and related infrastructure or collections needs.',
        problemAddressed:
          'Even strong proposals stall if there is no funding path.',
        rootProblems: ['Money pressure', 'Too much hidden value'],
        museumProblemContext:
          'This file matters because the museum\'s problem is not just needing ideas. It is needing viable paths to fund those ideas in a realistic institutional environment.',
        whatItCouldBring: [
          'Funding pathways',
          'Grant realism',
          'Implementation support',
          'Stronger proposal viability',
        ],
        maturity: 'This is a support memo, not a proposal. Its role is to connect museum needs and ideas to real funding channels.',
        docs: ['Newark Museum Grant Research Resources.pdf'],
      },
      {
        id: 'audited-financials',
        title: '2021-2024 audited financial statements',
        tone: 'amber',
        tilt: 'right',
        kind: 'Institutional context',
        maturityShort: 'Fiscal grounding',
        summary: 'Evidence files grounding the museum’s real operating and institutional condition.',
        whatItIs:
          'A set of audited financial documents that ground the museum\'s actual operating and institutional condition. They frame NMOA as a community-centered, educational, service-oriented museum while also showing the financial and structural realities any proposal has to pass through.',
        problemAddressed:
          'Proposals can become detached from fiscal reality.',
        rootProblems: ['Money pressure'],
        museumProblemContext:
          'These files keep the entire ecosystem honest. They show that many smaller debates eventually route back through the same larger issue: institutional durability.',
        whatItCouldBring: [
          'Fiscal realism',
          'Better feasibility checks',
          'Stronger internal grounding',
          'Clearer institutional constraints',
        ],
        maturity:
          'These are evidence records, not proposals. Their role is to keep proposal thinking tied to real institutional conditions.',
        docs: ['2024-NMOA-Audited-Financials-PDF.pdf'],
      },
      {
        id: 'impact-reports',
        title: '2021 and 2022 Impact Reports',
        tone: 'blue',
        tilt: 'left',
        kind: 'Institutional context',
        maturityShort: 'Mission and public-value grounding',
        summary:
          'Mission, reach, and public-role documents that show what the museum says it is for and how it frames its impact.',
        whatItIs:
          'Mission, reach, and public-role documents. The 2022 report emphasizes inclusive experiences that spark curiosity and foster community, along with visitor, program, school, and digital reach. The 2021 report shows how the museum sustained education and public connection under hybrid conditions.',
        problemAddressed:
          'Proposals often need institutional language and proof of public value, not just internal intuition.',
        rootProblems: ['Strong mission, weaker pull', 'Weak internal communication'],
        museumProblemContext:
          'These files help proposals speak in the museum\'s own language. They are useful because the institution\'s public mission is not the problem; the problem is how fully that mission is being converted into stable internal and external momentum.',
        whatItCouldBring: [
          'Mission alignment',
          'Public-value language',
          'Impact framing',
          'Stronger proposal positioning',
        ],
        maturity:
          'These are not proposals. Their role is to provide language, evidence, and institutional self-description that proposals can align with.',
        docs: ['NMOA_Impact_Report_2022_FINAL.pdf'],
      },
      {
        id: 'next-chapter',
        title: 'The Next Chapter',
        tone: 'emerald',
        tilt: 'right',
        kind: 'Institutional direction document',
        maturityShort: 'Transformation context',
        summary:
          'A campus-transformation and institutional-direction document for 2025 focused on expansion, accessibility, and a more active museum future.',
        whatItIs:
          'A campus-transformation and institutional-direction document for 2025, focused on expanding the museum\'s public role, Learning and Engagement Art Center renovation, improved accessibility, Museum Parc, and a more evening-facing identity through extended activation.',
        problemAddressed:
          'Without visible institutional permission, proposals for activation, atmosphere, or campus expansion can read like side ideas.',
        rootProblems: ['Change happening too fast', 'Strong mission, weaker pull'],
        museumProblemContext:
          'This document is important because it establishes that several proposals are not random add-ons. They sit inside a larger institutional push toward transformation, access, and public activation.',
        whatItCouldBring: [
          'Transformation context',
          'Permission structure',
          'Long-range alignment',
          'Better strategic fit',
        ],
        maturity:
          'This is a direction-setting context document. Its role is to show that several proposals sit inside a broader institutional transition rather than outside it.',
        docs: ['The Next Chapter - The Newark Museum of Art.pdf'],
      },
    ],
  },
];

function noteToneClasses(tone: Tone = 'neutral') {
  const map: Record<Tone, string> = {
    neutral: 'bg-stone-100 border-stone-200',
    rose: 'bg-rose-100 border-rose-200',
    blue: 'bg-sky-100 border-sky-200',
    violet: 'bg-violet-100 border-violet-200',
    amber: 'bg-amber-100 border-amber-200',
    emerald: 'bg-emerald-100 border-emerald-200',
  };

  return map[tone] || map.neutral;
}

function tiltClass(tilt: Tilt = 'none') {
  const map: Record<Tilt, string> = {
    none: 'rotate-0',
    left: '-rotate-1',
    right: 'rotate-1',
  };

  return map[tilt] || map.none;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="h-4 w-4">
      {open ? (
        <path d="M4.5 11.5 10 6l5.5 5.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      ) : (
        <path d="M8 5.5 12 10l-4 4.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      )}
    </svg>
  );
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full border border-black/10 bg-white/85 px-2.5 py-1 text-[11px] text-neutral-700 shadow-sm">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{children}</div>;
}

function InfoBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <SectionLabel>{label}</SectionLabel>
      <div className="text-sm leading-relaxed text-neutral-700">{children}</div>
    </div>
  );
}

function RootProblemCard({ problem, defaultOpen = false }: { problem: RootProblem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `nmoa-root-${problem.id}`;

  return (
    <div className={`rounded-[1.5rem] border p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all ${noteToneClasses(problem.tone)}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-base font-semibold leading-snug text-neutral-900">{problem.title}</div>
            <MetaPill>{problem.shortLabel}</MetaPill>
          </div>
          <div className="text-sm leading-relaxed text-neutral-700">{problem.summary}</div>
        </div>

        <div className="mt-0.5 shrink-0 rounded-full border border-black/10 bg-white/80 p-1 text-neutral-700">
          <ChevronIcon open={open} />
        </div>
      </button>

      <div id={panelId} hidden={!open} className="mt-4 space-y-4 border-t border-black/10 pt-4">
        <div className="space-y-2">
          <SectionLabel>How it runs through the museum</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {problem.showsUpAs.map((entry) => (
              <MetaPill key={`${problem.id}-${entry}`}>{entry}</MetaPill>
            ))}
          </div>
        </div>

        <InfoBlock label="Why it matters in the circuit">{problem.whyItMatters}</InfoBlock>

        <div className="space-y-2">
          <SectionLabel>What around the museum this touches</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {problem.connectedLines.map((entry) => (
              <MetaPill key={`${problem.id}-${entry}`}>{entry}</MetaPill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RootProblemSection({ problems }: { problems: RootProblem[] }) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">Main pressures in the museum</div>
        <h2 className="text-2xl font-semibold md:text-3xl">The museum as one interlacing circuit</h2>
        <p className="max-w-4xl text-sm leading-relaxed text-neutral-600 md:text-base">
          These problems do not seem to sit separately. They behave more like one museum circuit: money pressure affects staffing,
          staffing affects public atmosphere, atmosphere affects return visits and support, support affects capacity, and capacity
          affects how much knowledge, care, and access the institution can sustain. The materials below are supporting pieces
          around that larger connected picture.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {problems.map((problem) => (
          <RootProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </section>
  );
}

function StickyFoldout({ item, defaultOpen = false }: { item: ProposalItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `nmoa-proposal-${item.id}`;

  return (
    <div
      className={`self-start rounded-[1.6rem] border p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all ${noteToneClasses(
        item.tone
      )} ${tiltClass(item.tilt)}`}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <div className="min-w-0 space-y-2">
          <div className="text-base font-semibold leading-snug text-neutral-900">{item.title}</div>
          <div className="text-sm leading-relaxed text-neutral-700">{item.summary}</div>
        </div>
        <div className="mt-0.5 shrink-0 rounded-full border border-black/10 bg-white/80 p-1 text-neutral-700">
          <ChevronIcon open={open} />
        </div>
      </button>

      <div className="mt-3 flex flex-wrap gap-2">
        <MetaPill>{item.kind}</MetaPill>
        <MetaPill>{item.maturityShort}</MetaPill>
      </div>

      <div id={panelId} hidden={!open} className="mt-4 space-y-4 border-t border-black/10 pt-4">
        <InfoBlock label="What it is">{item.whatItIs}</InfoBlock>
        <InfoBlock label="Problem addressed">{item.problemAddressed}</InfoBlock>

        <div className="space-y-2">
          <SectionLabel>How this connects to the museum circuit</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {item.rootProblems.map((entry) => (
              <MetaPill key={`${item.id}-root-${entry}`}>{entry}</MetaPill>
            ))}
          </div>
        </div>

        <InfoBlock label="Where it sits in the larger picture">{item.museumProblemContext}</InfoBlock>

        <div className="space-y-2">
          <SectionLabel>What it could bring</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {item.whatItCouldBring.map((entry) => (
              <MetaPill key={`${item.id}-${entry}`}>{entry}</MetaPill>
            ))}
          </div>
        </div>

        <InfoBlock label="Maturity / role">{item.maturity}</InfoBlock>

        <div className="space-y-2">
          <SectionLabel>Source documents</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {item.docs.map((entry) => (
              <MetaPill key={`${item.id}-${entry}`}>{entry}</MetaPill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalSectionGroup({ eyebrow, title, items }: ProposalSectionData) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</div>
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
      </div>
      <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <StickyFoldout key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function NMOAProposalCircuit() {
  const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        <MetaPill>{rootProblems.length} interlacing problems</MetaPill>
        <MetaPill>{totalItems} materials tied to them</MetaPill>
        <MetaPill>{sections.length} supporting layers</MetaPill>
        <MetaPill>1 museum circuit</MetaPill>
      </div>

      <RootProblemSection problems={rootProblems} />

      <div className="space-y-10">
        {sections.map((section) => (
          <ProposalSectionGroup key={section.title} eyebrow={section.eyebrow} title={section.title} items={section.items} />
        ))}
      </div>
    </div>
  );
}
