export type MapRegionId =
  | 'wellbeing'
  | 'growth'
  | 'relationships'
  | 'work'
  | 'creativity'
  | 'activity'
  | 'order'
  | 'resources'
  | 'society';

export type MapRouteTone = 'bridge' | 'signal' | 'root';

export interface MapConcept {
  id: string;
  label: string;
  x: number;
  y: number;
  detail: string;
  links: string[];
}

export interface MapDistrict {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  description: string;
  concepts: MapConcept[];
}

export interface MapRegion {
  id: MapRegionId;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  glow: string;
  summary: string;
  districts: MapDistrict[];
}

export interface MapRoute {
  source: MapRegionId;
  target: MapRegionId;
  tone: MapRouteTone;
  weight?: number;
}

export interface MapConceptBridge {
  source: string;
  target: string;
  tone: MapRouteTone;
}

export const MAP_TIME_RANGE = {
  start: 2015,
  end: 2025
} as const;

export const MAP_WORLD = {
  width: 3200,
  height: 2200
} as const;

export const MAP_REGIONS: MapRegion[] = [
  {
    id: 'wellbeing',
    label: 'Well-Being',
    x: 1600,
    y: 340,
    width: 470,
    height: 270,
    fill: 'rgba(68, 181, 44, 0.16)',
    glow: 'rgba(68, 181, 44, 0.42)',
    summary: 'The inner question of happiness, suffering, consciousness, and sustainable mental life.',
    districts: [
      {
        id: 'wellbeing-inner-life',
        label: 'Inner Life',
        x: -98,
        y: -48,
        radius: 92,
        description: 'Philosophical and psychological attempts to define a livable interior world.',
        concepts: [
          {
            id: 'epicurean-happiness',
            label: 'Epicurean Happiness',
            x: -30,
            y: -12,
            detail: 'Friendship, modesty, and calm are treated as an antidote to productivity-centered unhappiness.',
            links: ['consciousness-studies', 'paradox-of-suffering']
          },
          {
            id: 'consciousness-studies',
            label: 'Consciousness',
            x: 28,
            y: -16,
            detail: 'The archive keeps testing whether subjective awareness can be explained without flattening experience.',
            links: ['epicurean-happiness', 'paradox-of-suffering']
          },
          {
            id: 'paradox-of-suffering',
            label: 'Suffering',
            x: 0,
            y: 30,
            detail: 'Pain becomes both a psychological problem and a route into deeper philosophical inquiry.',
            links: ['epicurean-happiness', 'consciousness-studies']
          }
        ]
      },
      {
        id: 'wellbeing-practices',
        label: 'Practices',
        x: 100,
        y: 52,
        radius: 88,
        description: 'Embodied routines that try to convert theory into durable well-being.',
        concepts: [
          {
            id: 'isha-kriya',
            label: 'Isha Kriya',
            x: -28,
            y: -12,
            detail: 'Meditation is evaluated as a practical intervention for stress, clarity, and sustainability.',
            links: ['awareness-self', 'cognitive-resilience']
          },
          {
            id: 'awareness-self',
            label: 'Awareness and Self',
            x: 28,
            y: -14,
            detail: 'Well-being depends on sustained self-observation rather than pure output or distraction.',
            links: ['isha-kriya', 'cognitive-resilience']
          },
          {
            id: 'cognitive-resilience',
            label: 'Resilience',
            x: 2,
            y: 30,
            detail: 'The archive repeatedly asks what keeps the mind intact under pressure from work and systems.',
            links: ['isha-kriya', 'awareness-self']
          }
        ]
      }
    ]
  },
  {
    id: 'growth',
    label: 'Growth',
    x: 2400,
    y: 520,
    width: 440,
    height: 260,
    fill: 'rgba(237, 176, 33, 0.16)',
    glow: 'rgba(237, 176, 33, 0.42)',
    summary: 'The developmental arc from formal survival, through deconstruction, into applied humanism.',
    districts: [
      {
        id: 'growth-academic',
        label: 'Academic Arc',
        x: -92,
        y: -44,
        radius: 88,
        description: 'The movement from IB formalism into interdisciplinary university-level synthesis.',
        concepts: [
          {
            id: 'ib-rigor',
            label: 'IB Rigor',
            x: -28,
            y: -12,
            detail: 'The early years forged discipline, precision, and extreme performance control.',
            links: ['nyu-expansion', 'intellectual-synthesis']
          },
          {
            id: 'nyu-expansion',
            label: 'NYU Expansion',
            x: 30,
            y: -16,
            detail: 'The archive opens into philosophy, politics, sociology, and artistic experimentation.',
            links: ['ib-rigor', 'intellectual-synthesis']
          },
          {
            id: 'intellectual-synthesis',
            label: 'Synthesis',
            x: 0,
            y: 30,
            detail: 'The later work holds theory, art, and practice together instead of treating them as separate domains.',
            links: ['ib-rigor', 'nyu-expansion']
          }
        ]
      },
      {
        id: 'growth-self-revision',
        label: 'Self Revision',
        x: 96,
        y: 46,
        radius: 84,
        description: 'Growth as the rewriting of the self, not only the accumulation of credentials.',
        concepts: [
          {
            id: 'gvz413',
            label: 'GVZ413',
            x: -28,
            y: -10,
            detail: 'The survival persona built to withstand academic pressure remains a key structural force in the archive.',
            links: ['vulnerability', 'applied-humanism']
          },
          {
            id: 'vulnerability',
            label: 'Vulnerability',
            x: 28,
            y: -14,
            detail: 'Later work recovers the emotional self that earlier systems required suppressing.',
            links: ['gvz413', 'applied-humanism']
          },
          {
            id: 'applied-humanism',
            label: 'Applied Humanism',
            x: 2,
            y: 30,
            detail: 'The most mature layer of the archive joins personal repair with public ethical commitments.',
            links: ['gvz413', 'vulnerability']
          }
        ]
      }
    ]
  },
  {
    id: 'relationships',
    label: 'Relationships',
    x: 2810,
    y: 960,
    width: 480,
    height: 280,
    fill: 'rgba(243, 127, 0, 0.16)',
    glow: 'rgba(243, 127, 0, 0.42)',
    summary: 'Family, friendship, acculturation, and coalition as the relational field of the archive.',
    districts: [
      {
        id: 'relationships-identity',
        label: 'Identity Ties',
        x: -102,
        y: -48,
        radius: 92,
        description: 'Where family, language, and racialized belonging complicate the question of who one is.',
        concepts: [
          {
            id: 'acculturation',
            label: 'Acculturation',
            x: -30,
            y: -12,
            detail: 'Assimilation offers entry into systems while often producing psychic strain and cultural loss.',
            links: ['language-loss', 'identity-dissonance']
          },
          {
            id: 'language-loss',
            label: 'Language Loss',
            x: 30,
            y: -16,
            detail: 'The fading of inherited language becomes a key sign of distance from ancestral identity.',
            links: ['acculturation', 'identity-dissonance']
          },
          {
            id: 'identity-dissonance',
            label: 'Identity Dissonance',
            x: 0,
            y: 30,
            detail: 'Belonging becomes unstable when dominant culture still withholds recognition.',
            links: ['acculturation', 'language-loss']
          }
        ]
      },
      {
        id: 'relationships-community',
        label: 'Community Bonds',
        x: 104,
        y: 52,
        radius: 90,
        description: 'The archive treats friendship and coalition as conditions for survival, not just sentiment.',
        concepts: [
          {
            id: 'friendship',
            label: 'Friendship',
            x: -28,
            y: -12,
            detail: 'Deep relational life becomes essential to the rejection of isolated over-performance.',
            links: ['coalition-building', 'relational-ethics']
          },
          {
            id: 'coalition-building',
            label: 'Coalitions',
            x: 28,
            y: -14,
            detail: 'Political and civic work repeatedly depends on bridges across groups rather than singular leadership.',
            links: ['friendship', 'relational-ethics']
          },
          {
            id: 'relational-ethics',
            label: 'Relational Ethics',
            x: 2,
            y: 30,
            detail: 'The archive increasingly frames ethics as something sustained through mutual obligation.',
            links: ['friendship', 'coalition-building']
          }
        ]
      }
    ]
  },
  {
    id: 'work',
    label: 'Work',
    x: 2790,
    y: 1440,
    width: 430,
    height: 260,
    fill: 'rgba(232, 24, 24, 0.16)',
    glow: 'rgba(232, 24, 24, 0.42)',
    summary: 'Labor, institutions, automation, and the fight to keep human dignity inside systems of production.',
    districts: [
      {
        id: 'work-labor',
        label: 'Labor Systems',
        x: -90,
        y: -44,
        radius: 86,
        description: 'Work as alienation, refusal, and institutional hierarchy.',
        concepts: [
          {
            id: 'sacrifice-of-power',
            label: 'Sacrifice of Power',
            x: -28,
            y: -12,
            detail: 'Capitalist work is described as a continual surrender of agency in exchange for survival.',
            links: ['alienation', 'bartleby']
          },
          {
            id: 'alienation',
            label: 'Alienation',
            x: 28,
            y: -14,
            detail: 'The worker is severed from the self, the product, and the meaning of labor.',
            links: ['sacrifice-of-power', 'bartleby']
          },
          {
            id: 'bartleby',
            label: 'Bartleby',
            x: 2,
            y: 30,
            detail: 'Refusal appears as one of the only visible gestures left inside a totalizing labor structure.',
            links: ['sacrifice-of-power', 'alienation']
          }
        ]
      },
      {
        id: 'work-future-labor',
        label: 'Automation',
        x: 92,
        y: 46,
        radius: 84,
        description: 'The later archive projects labor conflict into the AI and automation horizon.',
        concepts: [
          {
            id: 'job-automation',
            label: 'Job Automation',
            x: -28,
            y: -10,
            detail: 'The question becomes which forms of work disappear and which remain irreducibly human.',
            links: ['ai-displacement', 'museum-labor']
          },
          {
            id: 'ai-displacement',
            label: 'AI Displacement',
            x: 28,
            y: -14,
            detail: 'Automation is treated as a legal, ethical, and social problem rather than a neutral technical upgrade.',
            links: ['job-automation', 'museum-labor']
          },
          {
            id: 'museum-labor',
            label: 'Institutional Labor',
            x: 2,
            y: 30,
            detail: 'Workplace reform appears as a practical extension of the archive’s labor critique.',
            links: ['job-automation', 'ai-displacement']
          }
        ]
      }
    ]
  },
  {
    id: 'creativity',
    label: 'Creativity',
    x: 2240,
    y: 1810,
    width: 470,
    height: 270,
    fill: 'rgba(122, 63, 178, 0.16)',
    glow: 'rgba(122, 63, 178, 0.42)',
    summary: 'Music, essays, scripts, and experimental form as methods of resistance and recovery.',
    districts: [
      {
        id: 'creativity-writing',
        label: 'Literary Forms',
        x: -100,
        y: -48,
        radius: 90,
        description: 'Writing expands beyond school form into journalism, critique, and self-authored argument.',
        concepts: [
          {
            id: 'essay-craft',
            label: 'Essay Craft',
            x: -28,
            y: -12,
            detail: 'The archive never abandons structure; it repurposes it for more human and expansive inquiry.',
            links: ['journalism', 'rhetorical-critique']
          },
          {
            id: 'journalism',
            label: 'Journalism',
            x: 28,
            y: -14,
            detail: 'Profile writing translates personal and economic struggle into public narrative.',
            links: ['essay-craft', 'rhetorical-critique']
          },
          {
            id: 'rhetorical-critique',
            label: 'Rhetoric',
            x: 2,
            y: 30,
            detail: 'Public speech is repeatedly analyzed as a site where social values are reinforced or challenged.',
            links: ['essay-craft', 'journalism']
          }
        ]
      },
      {
        id: 'creativity-sound-story',
        label: 'Sound and Story',
        x: 102,
        y: 52,
        radius: 92,
        description: 'Music and narrative become tools for breaking rigid systems and reclaiming the self.',
        concepts: [
          {
            id: 'beyond-syntax',
            label: 'Beyond Syntax',
            x: -30,
            y: -12,
            detail: 'Experimental sound is used to break the rule-bound logic that once defined the voice.',
            links: ['sensitive-child', 'newark-stories']
          },
          {
            id: 'sensitive-child',
            label: 'Sensitive Child',
            x: 30,
            y: -16,
            detail: 'The archive turns inward through allegory to dramatize the dismemberment and recovery of the self.',
            links: ['beyond-syntax', 'newark-stories']
          },
          {
            id: 'newark-stories',
            label: 'Cocoa and End',
            x: 0,
            y: 30,
            detail: 'Scripts and short films carry urban realism, class fracture, and local trauma into narrative form.',
            links: ['beyond-syntax', 'sensitive-child']
          }
        ]
      }
    ]
  },
  {
    id: 'activity',
    label: 'Activity',
    x: 1450,
    y: 1920,
    width: 470,
    height: 270,
    fill: 'rgba(229, 36, 50, 0.16)',
    glow: 'rgba(229, 36, 50, 0.42)',
    summary: 'Direct action, field logistics, and the practical side of turning theory into civic movement.',
    districts: [
      {
        id: 'activity-fieldwork',
        label: 'Fieldwork',
        x: -100,
        y: -48,
        radius: 92,
        description: 'The archive becomes materially engaged through on-the-ground work in Newark.',
        concepts: [
          {
            id: 'water-distribution',
            label: 'Water Distribution',
            x: -30,
            y: -12,
            detail: 'The writing enters logistical reality through the repeated physical work of getting resources to people.',
            links: ['fellowship-assignments', 'geographic-mapping']
          },
          {
            id: 'fellowship-assignments',
            label: 'Fellowship Reports',
            x: 30,
            y: -16,
            detail: 'The Newark Water Coalition reports are the clearest bridge from theory into sustained practice.',
            links: ['water-distribution', 'geographic-mapping']
          },
          {
            id: 'geographic-mapping',
            label: 'Geographic Mapping',
            x: 0,
            y: 30,
            detail: 'Urban space is analyzed as something lived, navigated, and unevenly distributed.',
            links: ['water-distribution', 'fellowship-assignments']
          }
        ]
      },
      {
        id: 'activity-institutions',
        label: 'Institutional Action',
        x: 102,
        y: 52,
        radius: 88,
        description: 'Activity also means altering institutions rather than only describing them.',
        concepts: [
          {
            id: 'gh-plus',
            label: 'GH+ Proposal',
            x: -28,
            y: -12,
            detail: 'Institutional reform is approached as a design problem with ethical stakes.',
            links: ['community-organization', 'practical-ethics']
          },
          {
            id: 'community-organization',
            label: 'Community Systems',
            x: 28,
            y: -14,
            detail: 'The later archive repeatedly asks how organizations can become more durable and humane.',
            links: ['gh-plus', 'practical-ethics']
          },
          {
            id: 'practical-ethics',
            label: 'Practical Ethics',
            x: 2,
            y: 30,
            detail: 'Moral commitments are increasingly tested through what gets built, not just what gets argued.',
            links: ['gh-plus', 'community-organization']
          }
        ]
      }
    ]
  },
  {
    id: 'order',
    label: 'Order',
    x: 780,
    y: 1680,
    width: 430,
    height: 260,
    fill: 'rgba(24, 98, 183, 0.16)',
    glow: 'rgba(24, 98, 183, 0.42)',
    summary: 'Method, structure, logic, and the systems-thinking discipline that makes the whole archive readable.',
    districts: [
      {
        id: 'order-writing-discipline',
        label: 'Writing Discipline',
        x: -90,
        y: -44,
        radius: 86,
        description: 'The mechanical structures that first taught argument, control, and composure.',
        concepts: [
          {
            id: 'essay-codex',
            label: 'Essay Codex',
            x: -28,
            y: -12,
            detail: 'The foundational writing system that framed thesis, evidence, and proof as an engineered sequence.',
            links: ['divorce-decree', 'raft-method']
          },
          {
            id: 'divorce-decree',
            label: 'Divorce Decree',
            x: 28,
            y: -14,
            detail: 'The ban on first-person writing hardened the archive’s early objective voice.',
            links: ['essay-codex', 'raft-method']
          },
          {
            id: 'raft-method',
            label: 'RAFT',
            x: 2,
            y: 30,
            detail: 'Role, audience, format, and topic remained a durable compositional backbone.',
            links: ['essay-codex', 'divorce-decree']
          }
        ]
      },
      {
        id: 'order-analytic-systems',
        label: 'Analytic Systems',
        x: 92,
        y: 46,
        radius: 84,
        description: 'Order also appears in the archive’s mathematical, philosophical, and epistemic models.',
        concepts: [
          {
            id: 'cartesian-judgment',
            label: 'Cartesian Judgment',
            x: -28,
            y: -10,
            detail: 'The problem of error becomes a model for how the archive thinks about limits and overreach.',
            links: ['knights-tour', 'tok-dialectic']
          },
          {
            id: 'knights-tour',
            label: 'Knight’s Tour',
            x: 28,
            y: -14,
            detail: 'Graph logic and heuristic efficiency show the archive’s comfort with formal problem-solving.',
            links: ['cartesian-judgment', 'tok-dialectic']
          },
          {
            id: 'tok-dialectic',
            label: 'TOK Dialectic',
            x: 2,
            y: 30,
            detail: 'Contrasting perspectives are treated as a structural requirement for healthy knowledge.',
            links: ['cartesian-judgment', 'knights-tour']
          }
        ]
      }
    ]
  },
  {
    id: 'resources',
    label: 'Resources',
    x: 460,
    y: 1100,
    width: 470,
    height: 270,
    fill: 'rgba(17, 151, 143, 0.16)',
    glow: 'rgba(17, 151, 143, 0.42)',
    summary: 'The recurring source bank: philosophers, theorists, and reference systems that power the archive’s arguments.',
    districts: [
      {
        id: 'resources-philosophers',
        label: 'Core Thinkers',
        x: -100,
        y: -48,
        radius: 90,
        description: 'The authors who repeatedly anchor the archive’s philosophical and ethical reasoning.',
        concepts: [
          {
            id: 'descartes',
            label: 'Descartes',
            x: -28,
            y: -12,
            detail: 'Used to think about error, judgment, skepticism, and the boundaries of certainty.',
            links: ['nietzsche', 'epicurus']
          },
          {
            id: 'nietzsche',
            label: 'Nietzsche',
            x: 28,
            y: -14,
            detail: 'A key resource for understanding ressentiment, moral inversion, and civilizational decline.',
            links: ['descartes', 'epicurus']
          },
          {
            id: 'epicurus',
            label: 'Epicurus',
            x: 2,
            y: 30,
            detail: 'Provides the archive’s clearest alternative to consumerist and overworked versions of success.',
            links: ['descartes', 'nietzsche']
          }
        ]
      },
      {
        id: 'resources-critical-theory',
        label: 'Critical Frameworks',
        x: 102,
        y: 52,
        radius: 92,
        description: 'The theoretical tools repeatedly used to read systems, cities, and media.',
        concepts: [
          {
            id: 'marx',
            label: 'Marx',
            x: -30,
            y: -12,
            detail: 'The archive’s primary resource for labor, alienation, and the social anatomy of capitalism.',
            links: ['harvey-zizek', 'baldwin']
          },
          {
            id: 'harvey-zizek',
            label: 'Harvey and Zizek',
            x: 30,
            y: -16,
            detail: 'Urban theory and ideology critique help extend structural analysis into city life and the everyday.',
            links: ['marx', 'baldwin']
          },
          {
            id: 'baldwin',
            label: 'Baldwin',
            x: 0,
            y: 30,
            detail: 'A resource for understanding race as a lived psychological and political structure.',
            links: ['marx', 'harvey-zizek']
          }
        ]
      }
    ]
  },
  {
    id: 'society',
    label: 'Society',
    x: 820,
    y: 560,
    width: 450,
    height: 270,
    fill: 'rgba(22, 131, 205, 0.16)',
    glow: 'rgba(22, 131, 205, 0.42)',
    summary: 'The large public field: media control, race, fascism, cities, capitalism, and the systems people must inhabit.',
    districts: [
      {
        id: 'society-public-systems',
        label: 'Public Systems',
        x: -94,
        y: -46,
        radius: 90,
        description: 'The archive maps society as a set of engineered pressures rather than a neutral background.',
        concepts: [
          {
            id: 'mass-media',
            label: 'Mass Media',
            x: -28,
            y: -12,
            detail: 'Distraction and spectacle are treated as structural tools for managing thought and compliance.',
            links: ['neoliberalism', 'right-to-city']
          },
          {
            id: 'neoliberalism',
            label: 'Neoliberalism',
            x: 28,
            y: -14,
            detail: 'The housing crisis and modern precarity are repeatedly traced back to market-centered governance.',
            links: ['mass-media', 'right-to-city']
          },
          {
            id: 'right-to-city',
            label: 'Right to the City',
            x: 2,
            y: 30,
            detail: 'Urban life is framed as a political contest over who gets to shape space and survive within it.',
            links: ['mass-media', 'neoliberalism']
          }
        ]
      },
      {
        id: 'society-hegemony',
        label: 'Control and Hegemony',
        x: 98,
        y: 50,
        radius: 88,
        description: 'Dystopia, fascism, and race reveal how social power becomes normalized.',
        concepts: [
          {
            id: 'fascist-aesthetics',
            label: 'Fascist Aesthetics',
            x: -28,
            y: -12,
            detail: 'The archive tracks how art, spectacle, and public ritual can be weaponized by states.',
            links: ['orwell-gattaca', 'racial-construction']
          },
          {
            id: 'orwell-gattaca',
            label: 'Dystopian Control',
            x: 28,
            y: -14,
            detail: 'Surveillance and genetic sorting become paired models of socially engineered compliance.',
            links: ['fascist-aesthetics', 'racial-construction']
          },
          {
            id: 'racial-construction',
            label: 'Racial Construction',
            x: 2,
            y: 30,
            detail: 'Race is treated as a fabricated social hierarchy that organizes belonging and exclusion.',
            links: ['fascist-aesthetics', 'orwell-gattaca']
          }
        ]
      }
    ]
  }
];

export const MAP_ROUTES: MapRoute[] = [
  { source: 'society', target: 'wellbeing', tone: 'bridge', weight: 0.58 },
  { source: 'wellbeing', target: 'growth', tone: 'bridge', weight: 0.62 },
  { source: 'growth', target: 'relationships', tone: 'signal', weight: 0.58 },
  { source: 'relationships', target: 'work', tone: 'signal', weight: 0.6 },
  { source: 'work', target: 'creativity', tone: 'bridge', weight: 0.62 },
  { source: 'creativity', target: 'activity', tone: 'bridge', weight: 0.58 },
  { source: 'activity', target: 'order', tone: 'signal', weight: 0.56 },
  { source: 'order', target: 'resources', tone: 'bridge', weight: 0.6 },
  { source: 'resources', target: 'society', tone: 'root', weight: 0.64 }
];

export const MAP_CONCEPT_BRIDGES: MapConceptBridge[] = [
  { source: 'epicurean-happiness', target: 'friendship', tone: 'bridge' },
  { source: 'consciousness-studies', target: 'cognitive-resilience', tone: 'signal' },
  { source: 'gvz413', target: 'divorce-decree', tone: 'bridge' },
  { source: 'applied-humanism', target: 'practical-ethics', tone: 'bridge' },
  { source: 'coalition-building', target: 'community-organization', tone: 'root' },
  { source: 'sacrifice-of-power', target: 'marx', tone: 'bridge' },
  { source: 'job-automation', target: 'cognitive-resilience', tone: 'signal' },
  { source: 'beyond-syntax', target: 'vulnerability', tone: 'signal' },
  { source: 'newark-stories', target: 'water-distribution', tone: 'root' },
  { source: 'essay-codex', target: 'essay-craft', tone: 'bridge' },
  { source: 'cartesian-judgment', target: 'descartes', tone: 'bridge' },
  { source: 'harvey-zizek', target: 'right-to-city', tone: 'root' },
  { source: 'baldwin', target: 'racial-construction', tone: 'signal' },
  { source: 'mass-media', target: 'consciousness-studies', tone: 'signal' }
];

export const MAP_CONCEPT_YEARS: Record<string, number> = {
  'epicurean-happiness': 2019,
  'consciousness-studies': 2025,
  'paradox-of-suffering': 2024,
  'isha-kriya': 2024,
  'awareness-self': 2024,
  'cognitive-resilience': 2025,
  'ib-rigor': 2018,
  'nyu-expansion': 2020,
  'intellectual-synthesis': 2022,
  'gvz413': 2017,
  'vulnerability': 2021,
  'applied-humanism': 2025,
  'acculturation': 2019,
  'language-loss': 2019,
  'identity-dissonance': 2019,
  'friendship': 2019,
  'coalition-building': 2022,
  'relational-ethics': 2024,
  'sacrifice-of-power': 2019,
  'alienation': 2019,
  'bartleby': 2019,
  'job-automation': 2025,
  'ai-displacement': 2025,
  'museum-labor': 2024,
  'essay-craft': 2017,
  'journalism': 2022,
  'rhetorical-critique': 2017,
  'beyond-syntax': 2020,
  'sensitive-child': 2021,
  'newark-stories': 2020,
  'water-distribution': 2022,
  'fellowship-assignments': 2022,
  'geographic-mapping': 2022,
  'gh-plus': 2025,
  'community-organization': 2025,
  'practical-ethics': 2025,
  'essay-codex': 2015,
  'divorce-decree': 2015,
  'raft-method': 2015,
  'cartesian-judgment': 2018,
  'knights-tour': 2018,
  'tok-dialectic': 2019,
  'descartes': 2018,
  'nietzsche': 2018,
  'epicurus': 2019,
  'marx': 2019,
  'harvey-zizek': 2020,
  'baldwin': 2020,
  'mass-media': 2016,
  'neoliberalism': 2019,
  'right-to-city': 2022,
  'fascist-aesthetics': 2018,
  'orwell-gattaca': 2017,
  'racial-construction': 2020
};
