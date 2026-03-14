export interface TransitionSignalChecklistItem {
  id: string;
  title: string;
  help?: string;
}

export interface TransitionSignalChecklistLane {
  id: string;
  title: string;
  kind: 'positive' | 'counter';
  description: string;
  items: TransitionSignalChecklistItem[];
}

export const TRANSITION_SIGNAL_SCORE_LABELS: Record<number, string> = {
  0: 'Absent',
  1: 'Weak / early',
  2: 'Meaningful / visible',
  3: 'Strong / active'
};

export const TRANSITION_SIGNAL_BACKBONE = [
  'UBI-style relief may show up before deeper public wealth or ownership rails.',
  'Near-term government action is the weakest lane; score operational movement, not speeches.',
  'Private first movers matter if they fund local demonstrations that actually deliver.',
  'Labor disruption may arrive before institutions adapt, so labor stress is a leading lane.',
  'A viable 2028 political vehicle needs money, megaphone, and movement at the same time.'
] as const;

export const TRANSITION_SIGNAL_LANES: TransitionSignalChecklistLane[] = [
  {
    id: 'philanthropy',
    title: 'Philanthropy',
    kind: 'positive',
    description: 'Watch for private money moving before formal public systems can.',
    items: [
      {
        id: 'philanthropy-named-funders',
        title: 'Named donors or funds back transition cash pilots or relief experiments.'
      },
      {
        id: 'philanthropy-local-demos',
        title: 'Community-scale demonstrations get real operating support, not just attention.'
      },
      {
        id: 'philanthropy-bridge-framing',
        title: 'Funders frame relief as a bridge for disruption before institutions catch up.'
      }
    ]
  },
  {
    id: 'delivery',
    title: 'Delivery',
    kind: 'positive',
    description: 'Announcements matter less than whether money or support actually lands.',
    items: [
      {
        id: 'delivery-live-payments',
        title: 'A program is actively distributing cash, stipends, or equivalent relief.'
      },
      {
        id: 'delivery-rails',
        title: 'Enrollment, verification, and payout rails are visible and workable.'
      },
      {
        id: 'delivery-measurable-footprint',
        title: 'Recipients, geography, duration, or budget are public enough to track.'
      }
    ]
  },
  {
    id: 'labor-stress',
    title: 'Labor Stress',
    kind: 'positive',
    description: 'This lane turns when job pressure rises faster than adaptation capacity.',
    items: [
      {
        id: 'labor-ai-headcount',
        title: 'Employers cite AI while flattening hiring, shrinking teams, or compressing hours.'
      },
      {
        id: 'labor-role-redesign',
        title: 'Task removal or role erosion is visible before workers get formal support.'
      },
      {
        id: 'labor-organized-alarm',
        title: 'Unions, worker groups, or local leaders treat AI displacement as a live issue.'
      }
    ]
  },
  {
    id: 'fast-relief',
    title: 'Fast Relief',
    kind: 'positive',
    description: 'Short-run help matters if disruption shows up before structural reform does.',
    items: [
      {
        id: 'fast-relief-bridge-cash',
        title: 'Emergency cash, wage supplements, or retraining stipends launch quickly.'
      },
      {
        id: 'fast-relief-private-bridge',
        title: 'Employers, platforms, or private coalitions test transition assistance directly.'
      },
      {
        id: 'fast-relief-local-routing',
        title: 'Local operators can route support within weeks rather than legislative cycles.'
      }
    ]
  },
  {
    id: 'government',
    title: 'Government',
    kind: 'positive',
    description: 'Score only concrete public machinery; the near-term government path is weak by default.',
    items: [
      {
        id: 'government-pilot-lines',
        title: 'Cities, states, or agencies move from hearings into pilots, budgets, or procurement.'
      },
      {
        id: 'government-owner',
        title: 'There is a credible public owner for transition relief or workforce response.'
      },
      {
        id: 'government-operational-language',
        title: 'Officials talk in delivery terms: who gets help, how fast, through what mechanism.'
      }
    ]
  },
  {
    id: 'political-vehicle',
    title: 'Political Vehicle',
    kind: 'positive',
    description: 'A 2028 vehicle only counts if money, megaphone, and movement start aligning.',
    items: [
      {
        id: 'political-vehicle-money',
        title: 'A credible coalition has funding, donor energy, or durable backing.'
      },
      {
        id: 'political-vehicle-megaphone',
        title: 'The message has repeat media reach, recognizable validators, or real audience pull.'
      },
      {
        id: 'political-vehicle-movement',
        title: 'Organizers can mobilize lists, local chapters, petitions, or allied constituencies.'
      }
    ]
  },
  {
    id: 'counter-signals',
    title: 'Counter-Signals',
    kind: 'counter',
    description: 'These reduce the net read when transition talk is not turning into durable movement.',
    items: [
      {
        id: 'counter-overstated-shock',
        title: 'The job-shock narrative is outrunning verified disruption on the ground.'
      },
      {
        id: 'counter-stalled-demos',
        title: 'Private pilots stall, stay symbolic, or remain too small to matter.'
      },
      {
        id: 'counter-diffuse-politics',
        title: 'Political attention fragments, cools off, or shifts away before anything operational forms.'
      }
    ]
  }
];
