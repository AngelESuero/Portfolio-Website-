export type NewarkLaneSlug = 'housing' | 'markets' | 'museum';

export interface NewarkLaneNote {
  title: string;
  summary: string;
  body: string;
  points?: string[];
  open?: boolean;
}

export interface NewarkLaneConfig {
  slug: NewarkLaneSlug;
  tabLabel: string;
  lead: string;
  summary: string;
  notes: NewarkLaneNote[];
}

export const newarkLanes: NewarkLaneConfig[] = [
  {
    slug: 'housing',
    tabLabel: 'Housing & Homelessness',
    lead: "Most people losing housing in Newark weren't sleeping outside the week before.",
    summary:
      "They were on someone's couch. The most common reported cause of homelessness here isn't addiction or mental illness - it's being asked to leave a shared residence. 24% said that. Another 21% were evicted. Most had no income when it happened. The 2025 Essex/Newark count found 2,291 unhoused people, roughly 84% from Newark.",
    notes: [
      {
        title: 'The hidden middle of the story',
        summary: 'Couch-surfing and doubled-up living show up before street homelessness does.',
        body:
          'The count reads less like a sudden street-only crisis and more like a housing ladder that broke in the middle. People are moving from family or friends, emergency shelter, or a shared residence into loss, and the break often happens before the outside becomes visible.',
        points: [
          '31.6% were with family or friends before the count',
          '24% were asked to leave a shared residence',
          '21% were evicted or at risk of eviction',
        ],
        open: true,
      },
      {
        title: 'Fragility is already present',
        summary: 'More than half reported no income at the moment they were counted.',
        body:
          'That makes the homelessness count feel less like an isolated event and more like the visible edge of a longer economic decline. The lane should keep treating income loss as part of the displacement story, not a separate sidebar.',
        points: ['51% had zero income', '13% had earned/work income', '10% were on SSI'],
      },
      {
        title: 'What the next pass should test',
        summary: 'The county numbers still need a cleaner Newark-only breakdown.',
        body:
          'I want the next layer to separate Newark from the rest of Essex by age, family status, and disability so the story does not flatten out at the county level.',
        points: ['Age mix', 'Family status', 'Disability', 'Newark vs. East Orange / Irvington / rest of Essex'],
      },
    ],
  },
  {
    slug: 'museum',
    tabLabel: 'Museum / NMOA',
    lead: 'The museum is part of Newark\'s problem field.',
    summary:
      'Funding, staffing, access, and public pull keep hitting each other. This lane folds the museum proposal circuit into the same problems view. It treats the Newark Museum of Art not as a separate island, but as an institution shaped by the same pressure systems: money, labor, public energy, access, and hidden knowledge.',
    notes: [
      {
        title: 'The museum sits inside the same pressure field',
        summary: 'Funding, staffing, access, public pull, and hidden knowledge keep affecting each other.',
        body:
          'The museum is not separate from Newark\'s larger civic problems. It is shaped by them. That is why the proposal circuit belongs in this tab instead of living off to the side as a separate institution story.',
        points: ['Funding pressure', 'Staff support', 'Public access', 'Public pull', 'Hidden knowledge'],
        open: true,
      },
      {
        title: 'The proposal circuit is the working layer',
        summary: 'GH+, Living Cultural Space, and the OpenAI pilot are different ways into the same system.',
        body:
          'Together they show a set of proposals that are not random. Some are about labor, some about atmosphere, some about cataloging, and some about revenue, but they all point back to the same institutional questions.',
        points: ['GH+ / Gallery Host Plus', 'Living Cultural Space', 'Cataloging pilot', 'Income generation strategies'],
      },
      {
        title: 'What the next pass should keep separate',
        summary: 'Public value, internal conditions, and operational reality need their own lanes.',
        body:
          'The next layer should keep asking what staff feel, what visitors feel, and what the museum can actually carry. Those are related, but they should not be flattened into one hopeful sentence.',
        points: ['Staff reality', 'Visitor experience', 'Operational capacity'],
      },
    ],
  },
  {
    slug: 'markets',
    tabLabel: 'Market Shifts',
    lead: 'Newark is attracting real investment. The question is who it is being built for.',
    summary:
      'A $125M film studio broke ground in December 2025. Port cargo hit double-digit growth. Premium residential is filling space that office buildings will not. Capital is moving into the city - but the people showing up in the homelessness count are not in the plans for what is being built. The city is being repositioned around them, not for them.',
    notes: [
      {
        title: 'Capital is moving in, but unevenly',
        summary: 'The clearest growth lanes pair with housing or logistics.',
        body:
          'The city is being repositioned around investment, but the investment is selective. Film, residential reuse, retail tied to density, and broadband are the strongest signs because they all point toward infrastructure that can actually hold people and activity.',
        points: ['Film / TV production', 'Adaptive reuse housing', 'Street-level retail', 'Broadband buildout'],
        open: true,
      },
      {
        title: 'Office decline and reuse are the same signal',
        summary: 'Older office inventory is being repriced as housing or left behind.',
        body:
          'The market is not just slowing in office; it is deciding that some buildings should stop being office at all. That is why adaptive reuse matters more than trying to narrate the old office market back into life.',
        points: ['19.5% office vacancy', '10 Park Place conversion', 'Penn Plaza East residential plan'],
      },
      {
        title: 'Next pass: district map',
        summary: 'The city still needs a block-by-block reading.',
        body:
          'This lane should eventually break down by district so Downtown, the Ironbound, the South Ward, and the airport / port zone stop getting treated as one generalized market.',
        points: ['Downtown', 'Ironbound', 'South Ward', 'Airport / port zone'],
      },
    ],
  },
];

export const newarkLaneBySlug = Object.fromEntries(newarkLanes.map((lane) => [lane.slug, lane])) as Record<
  NewarkLaneSlug,
  NewarkLaneConfig
>;
