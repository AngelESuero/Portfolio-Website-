export type SurvivalTier = 'Keep Alive' | 'Stabilize' | 'Live';

export type SurvivalSystemId =
  | 'air'
  | 'water'
  | 'thermoregulation'
  | 'sleep'
  | 'food'
  | 'sanitation'
  | 'safety'
  | 'acute-care';

export interface SurvivalSystem {
  id: SurvivalSystemId;
  tier: SurvivalTier;
  title: string;
  whyItMatters: string;
  minimums: string[];
  dependencies: string[];
  whatAiCouldAutomate: string[];
  safeguards: string[];
}

export const SURVIVAL_OS = {
  version: 'v4',
  updated: '2026-02-17',
  framing: {
    keepAlive: 'The smallest set of conditions required for a human to remain alive.',
    stabilize:
      'Systems that reduce avoidable failure (illness/injury/exposure) and keep the body functional day-to-day.',
    live: 'Systems that expand beyond survival into a livable human life.'
  },
  systems: [
    {
      id: 'air',
      tier: 'Keep Alive',
      title: 'Air (Oxygen + breathable atmosphere)',
      whyItMatters: 'Minutes matter: without adequate oxygen, survival collapses fast.',
      minimums: ['Breathable air', 'Low smoke/particulates', 'Ventilation (indoors)'],
      dependencies: ['Shelter integrity', 'Indoor air circulation', 'Environmental safety'],
      whatAiCouldAutomate: [
        'Air-quality monitoring + alerts (PM2.5/CO2)',
        'Ventilation control recommendations (windows/fans/filters)',
        'Wildfire/smoke advisories routed into daily planning'
      ],
      safeguards: ['Never present as medical certainty', 'Fail-safe defaults (alert > action)', 'User control + visibility into sensor sources']
    },
    {
      id: 'water',
      tier: 'Keep Alive',
      title: 'Water (Hydration + clean supply)',
      whyItMatters: 'Clean water is a hard dependency for life and infection control.',
      minimums: ['Potable water access', 'Basic storage', 'Contamination awareness'],
      dependencies: ['Supply chain/logistics', 'Treatment/filtration', 'Storage containers'],
      whatAiCouldAutomate: ['Inventory tracking (how much water you actually have)', 'Refill scheduling and reminders', 'Filter replacement cadence + sourcing options'],
      safeguards: ['No dangerous suggestions (e.g., unsafe purification claims)', 'Confirm constraints (budget, access, storage)']
    },
    {
      id: 'thermoregulation',
      tier: 'Keep Alive',
      title: 'Thermoregulation (Core temperature)',
      whyItMatters: 'Exposure kills: heat/cold stress can become fatal quickly.',
      minimums: ['Weather awareness', 'Safe indoor temperature range', 'Appropriate clothing'],
      dependencies: ['Shelter', 'Energy/heat/cooling', 'Emergency backup plan'],
      whatAiCouldAutomate: ['Weather-triggered plans (heat wave / cold snap)', 'Indoor comfort logging (manual or sensor-driven)', 'Packing checklists tied to forecast + commute'],
      safeguards: ['Always show uncertainty', 'Prefer conservative recommendations']
    },
    {
      id: 'sleep',
      tier: 'Keep Alive',
      title: 'Sleep (Recovery + nervous system stability)',
      whyItMatters: 'Severe sleep deprivation increases accident risk and physiological instability.',
      minimums: ['Protected sleep window', 'Low-interruption environment', 'Basic routine'],
      dependencies: ['Safety', 'Noise/light control', 'Schedule stability'],
      whatAiCouldAutomate: ['Schedule protection (conflict detection)', 'Wind-down automation (lights, reminders, do-not-disturb)', 'Trend visibility (sleep debt signals)'],
      safeguards: ['No shaming language', 'User chooses goals and thresholds']
    },
    {
      id: 'food',
      tier: 'Stabilize',
      title: 'Food (Calories + essential nutrients)',
      whyItMatters: 'Sustained survival requires energy and nutrient sufficiency.',
      minimums: ['Reliable calories', 'Protein + micronutrient coverage', 'Safe storage'],
      dependencies: ['Income/resources', 'Supply chain access', 'Cooking/storage'],
      whatAiCouldAutomate: ['Meal planning from what you already have', 'Budget-aware grocery lists', 'Expiration tracking + waste reduction'],
      safeguards: ['Avoid medical diet claims', 'Respect preferences and constraints']
    },
    {
      id: 'sanitation',
      tier: 'Stabilize',
      title: 'Sanitation (Waste + hygiene)',
      whyItMatters: 'Infection prevention is a survivability multiplier.',
      minimums: ['Hand hygiene', 'Clean surfaces', 'Waste removal'],
      dependencies: ['Water', 'Supplies (soap, bags)', 'Routine consistency'],
      whatAiCouldAutomate: ['Restock triggers (soap, disinfectant, trash bags)', 'Routine checklists (lightweight, non-obsessive)'],
      safeguards: ['Avoid compulsive framing', 'Keep it minimal and humane']
    },
    {
      id: 'safety',
      tier: 'Stabilize',
      title: 'Safety (Violence + accidents + situational risk)',
      whyItMatters: 'Risk management prevents avoidable injury/death.',
      minimums: ['Basic awareness', 'Emergency contacts', 'Safer routes/options'],
      dependencies: ['Information', 'Community', 'Environment'],
      whatAiCouldAutomate: ['Route + time-of-day safety planning', 'Emergency contact shortcuts', 'Incident awareness feeds (user-selected sources)'],
      safeguards: ['No paranoia loops', 'User chooses sources + sensitivity']
    },
    {
      id: 'acute-care',
      tier: 'Stabilize',
      title: 'Acute Care (Emergency response readiness)',
      whyItMatters: 'When things go wrong, response time matters.',
      minimums: ['First-aid basics', 'Know where to go', 'Insurance/ID readiness'],
      dependencies: ['Resources', 'Information', 'Local services'],
      whatAiCouldAutomate: [
        'Keep a ready-to-go emergency card (ID, allergies, contacts)',
        'Nearest urgent care / ER quick access (manual entry)',
        'Medication + appointment reminders (if relevant)'
      ],
      safeguards: ['Not medical advice', 'Encourage professional help when appropriate']
    }
  ] satisfies SurvivalSystem[]
} as const;
