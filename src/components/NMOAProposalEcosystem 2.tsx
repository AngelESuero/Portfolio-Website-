import { useState, type ReactNode } from 'react';

function noteToneClasses(tone = 'neutral') {
  const map = {
    neutral: 'bg-stone-100 border-stone-200',
    rose: 'bg-rose-100 border-rose-200',
    blue: 'bg-sky-100 border-sky-200',
    violet: 'bg-violet-100 border-violet-200',
    amber: 'bg-amber-100 border-amber-200',
    emerald: 'bg-emerald-100 border-emerald-200',
  };
  return map[tone as keyof typeof map] || map.neutral;
}

function tiltClass(tilt = 'none') {
  const map = {
    none: 'rotate-0',
    left: '-rotate-1',
    right: 'rotate-1',
  };
  return map[tilt as keyof typeof map] || map.none;
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <path d="M7.5 5 12.5 10 7.5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

type ProposalItem = {
  id: string;
  title: string;
  tone: 'neutral' | 'rose' | 'blue' | 'violet' | 'amber' | 'emerald';
  tilt: 'none' | 'left' | 'right';
  kind: string;
  maturityShort: string;
  summary: string;
  whatItIs: string;
  problemAddressed: string;
  whatItCouldBring: string[];
  maturity: string;
  docs: string[];
};

type ProposalSection = {
  eyebrow: string;
  title: string;
  items: ProposalItem[];
};

function StickyFoldout({ item, defaultOpen = false }: { item: ProposalItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `proposal-foldout-${item.id}`;

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
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div className="min-w-0 space-y-2">
          <div className="text-base font-semibold leading-snug text-neutral-900">{item.title}</div>
          <div className="text-sm leading-relaxed text-neutral-700">{item.summary}</div>
        </div>
        <div className="mt-0.5 shrink-0 rounded-full border border-black/10 bg-white/80 p-1 text-neutral-700">
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </div>
      </button>

      <div className="mt-3 flex flex-wrap gap-2">
        <MetaPill>{item.kind}</MetaPill>
        <MetaPill>{item.maturityShort}</MetaPill>
      </div>

      {open ? (
        <div id={panelId} className="mt-4 space-y-4 border-t border-black/10 pt-4">
          <InfoBlock label="What it is">{item.whatItIs}</InfoBlock>
          <InfoBlock label="Problem addressed">{item.problemAddressed}</InfoBlock>
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
      ) : null}
    </div>
  );
}

function ProposalSection({ eyebrow, title, items }: ProposalSection) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</div>
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
      </div>
      <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <StickyFoldout key={item.id} item={item} defaultOpen={index === 0} />
        ))}
      </div>
    </section>
  );
}

const proposalSections: ProposalSection[] = [
  {
    eyebrow: 'Direct proposals / active pilot documents',
    title: 'Proposal lines that are already framed as plans or pilots',
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
          'The museum can feel socially static or too institution-first, while contemporary audiences often form attachment through people, scenes, clips, and repeatable activity before they deepen into the institution itself. The proposal is trying to address weak social atmosphere, limited repeatable low-friction activation, and the lack of a testable format for converting public attention into return visits.',
        whatItCouldBring: ['Warmer atmosphere', 'Repeat activation', 'Low-cost testing', 'More public conversation', 'Better return-visit potential'],
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
          'Under-catalogued or under-surfaced materials are harder for staff to search, interpret, and potentially expose to the public. The proposal is trying to address hidden institutional knowledge, slow cataloging workflows, and weak discoverability, while also modeling a more transparent and ethically bounded AI use case.',
        whatItCouldBring: ['Faster cataloging support', 'Better discoverability', 'Stronger metadata', 'More searchable records', 'Bounded AI governance'],
        maturity:
          'This is a bounded pilot, not a museum-wide AI overhaul. Its role is to test a narrow workflow with human review before any broader expansion.',
        docs: ['Newarkmuseum Openai Partnership (1).pdf', '08_OpenAI_Museum_Cataloging_Pilot_Draft.pdf', '11_AI_Accountability_Pledge.pdf'],
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
          'A workforce and institutional-renewal proposal built around Gallery Hosts, with structured cross-training, mentorship, wellness supports, focus weeks, peer support, wage tiers, and a longer-term fellowship pathway. It is explicitly framed as the first seed in a wider growth-from-within model for the museum.',
        problemAddressed:
          'Recurring pain points around wage stagnation, soft hour caps, limited benefits, weak advancement paths, lack of formal cross-training, and the physical and mental strain of Gallery Host work. It is also trying to address a larger museum problem: front-line staff being treated mainly as coverage rather than as a talent pipeline, cultural asset, or long-term institutional base.',
        whatItCouldBring: ['Better staff support', 'Retention', 'Higher morale', 'Talent development', 'Stronger visitor-facing culture'],
        maturity:
          'This reads as a major internal-renewal proposal rather than a tiny pilot. It is broader than a single department fix, even though it starts from Gallery Host conditions.',
        docs: ['GH+ core proposal variants', 'Vex Tailor Shop Proposals.pdf', 'Essential, Livable, and Thrivable Incomes.pdf'],
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
          'A broad financial-stability strategy memo covering ticketing, memberships, shop and e-commerce, donor cultivation, naming rights, planned giving, endowment growth, grants, partnerships, rentals, programs, and digital revenue. It also includes a SWOT view of the museum’s current revenue structure.',
        problemAddressed:
          'Over-reliance on fragile funding mixes, especially contributions and government support, plus underdeveloped earned-income and digital-revenue lines. The document is trying to address financial vulnerability, insufficient diversification, and the lack of a stronger hybrid revenue model.',
        whatItCouldBring: ['Revenue diversity', 'Stronger membership', 'More fundraising options', 'Long-range stability', 'More flexible institutional capacity'],
        maturity:
          'This is less a single pilot and more a strategic memo or framework. Its role is to strengthen the museum’s financial base and support other initiatives over time.',
        docs: ['Newark Museum income generation strategies.pdf', '2024-NMOA-Audited-Financials-PDF.pdf', 'The Next Chapter - The Newark Museum of Art.pdf'],
      },
    ],
  },
  {
    eyebrow: 'Proposal-adjacent research / support documents',
    title: 'Support files that clarify problems, constraints, or enabling conditions',
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
          'Compensation debates often stay abstract or anchored to legal minimums rather than real life conditions. This file is trying to address the lack of a grounded wage reality model by showing the difference between survival, modest stability, and real accession in Newark.',
        whatItCouldBring: ['Wage realism', 'Better compensation framing', 'More grounded labor arguments', 'Clearer tier logic'],
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
          'Museums often treat accessibility as a narrow accommodation problem instead of a full visitor-experience and communication-design issue. This file is trying to address exclusion, weak multisensory access, and approaches that isolate disabled visitors rather than integrating accessibility into the main experience.',
        whatItCouldBring: ['Better access design', 'More inclusive visitor experience', 'Multisensory thinking', 'Stronger staff awareness'],
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
          'Downtown Newark may still lack enough culturally magnetic, sustainable, socially alive venue models that bridge nightlife, accessibility, and public culture. In the museum ecosystem, this file appears to be addressing whether a stronger nightlife-adjacent cultural role is structurally possible, rather than arguing for one finalized museum pilot yet.',
        whatItCouldBring: ['Market realism', 'Nightlife context', 'Downtown positioning insight', 'Better feasibility framing'],
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
          'Institutional AI language can easily become vague, unaccountable, or trust-eroding. This file is trying to address governance ambiguity by making AI use legible, bounded, and reviewable before broader adoption.',
        whatItCouldBring: ['Clearer AI governance', 'Higher trust', 'Defined accountability', 'Better adoption boundaries'],
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
          'Staff can end up without accessible, clean, repaired, or presentable clothing, and that becomes both a practical and dignity issue. The framework is trying to address emergency clothing gaps, low-level uniform instability, and the absence of a small internal care structure that signals that the team looks out for each other.',
        whatItCouldBring: ['Small quality-of-life gains', 'Better presentability', 'Lower stress around uniforms', 'Visible staff care'],
        maturity:
          'This is narrower than the institution-wide proposals. Its role is as a practical, low-cost internal support concept inside Visitor Experience.',
        docs: ['Vex Tailor Shop Proposals.pdf'],
      },
    ],
  },
  {
    eyebrow: 'Institutional context / support documents',
    title: 'Context files that ground proposals in money, mission, impact, and direction',
    items: [
      {
        id: 'grant-research',
        title: 'Newark Museum Grant Research Resources',
        tone: 'amber',
        tilt: 'left',
        kind: 'Funding support memo',
        maturityShort: 'Implementation support',
        summary:
          'A grant landscape memo mapping real funding channels across public, foundation, and corporate sources.',
        whatItIs:
          'A grant landscape memo mapping real funding channels across IMLS, NEH, NPS, state, foundation, and corporate sources, with special attention to preservation, capacity building, HVAC, lighting, Ballantine House, and related infrastructure or collections needs.',
        problemAddressed:
          'Even strong proposals stall if there is no funding path. This file is trying to address the gap between institutional need and funding strategy by matching concrete museum needs to realistic grant programs and grant logic.',
        whatItCouldBring: ['Funding pathways', 'Grant realism', 'Implementation support', 'Stronger proposal viability'],
        maturity:
          'This is a support memo, not a proposal. Its role is to connect museum needs and ideas to real funding channels.',
        docs: ['Newark Museum Grant Research Resources.pdf'],
      },
      {
        id: 'audited-financials',
        title: '2021–2024 audited financial statements',
        tone: 'amber',
        tilt: 'right',
        kind: 'Institutional context',
        maturityShort: 'Fiscal grounding',
        summary: 'Evidence files grounding the museum’s real operating and institutional condition.',
        whatItIs:
          'A set of audited financial documents that ground the museum’s actual operating and institutional condition. They frame NMOA as a community-centered, educational, service-oriented museum while also showing the financial and structural realities any proposal has to pass through.',
        problemAddressed:
          'Proposals can become detached from fiscal reality. These files address the need for realism by anchoring proposal thinking in actual revenue, expense, asset, campus, and mission conditions rather than aspiration alone.',
        whatItCouldBring: ['Fiscal realism', 'Better feasibility checks', 'Stronger internal grounding', 'Clearer institutional constraints'],
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
          'Proposals often need institutional language and proof of public value, not just internal intuition. These reports address the need for rhetorical and strategic alignment by showing what the museum already says it is for, who it serves, and how it measures public impact.',
        whatItCouldBring: ['Mission alignment', 'Public-value language', 'Impact framing', 'Stronger proposal positioning'],
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
          'A campus-transformation and institutional-direction document for 2025, focused on expanding the museum’s public role, Learning and Engagement Art Center renovation, improved accessibility, Museum Parc, and a more evening-facing identity through extended activation.',
        problemAddressed:
          'Without visible institutional permission, proposals for activation, atmosphere, or campus expansion can read like side ideas. This document addresses that by establishing that the museum is already in a transformation phase centered on public role, accessibility, and a more active campus future.',
        whatItCouldBring: ['Transformation context', 'Permission structure', 'Long-range alignment', 'Better strategic fit'],
        maturity:
          'This is a direction-setting context document. Its role is to show that several proposals sit inside a broader institutional transition rather than outside it.',
        docs: ['The Next Chapter - The Newark Museum of Art.pdf'],
      },
    ],
  },
];

const totalItems = proposalSections.reduce((sum, section) => sum + section.items.length, 0);

export default function NMOAProposalEcosystem() {
  return (
    <div className="min-h-screen bg-[#f6f1e8] p-5 text-neutral-900 md:p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-3 py-1 text-sm shadow-sm">
            Newark Museum of Art - Proposal Reference
          </div>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">
              Proposal notes rebuilt around what each document is doing
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-neutral-600 md:text-lg">
              Each card now follows the same structure: what it is, problem addressed, what it could bring, and maturity or role in the larger ecosystem.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MetaPill>{totalItems} total items</MetaPill>
            <MetaPill>{proposalSections.length} sections</MetaPill>
            <MetaPill>Card-ready structure</MetaPill>
          </div>
        </header>

        <div className="space-y-10">
          {proposalSections.map((section) => (
            <ProposalSection
              key={section.title}
              eyebrow={section.eyebrow}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
