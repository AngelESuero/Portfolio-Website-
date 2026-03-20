export interface MapRegion {
  id: string;
  label: string;
  color: string;
  route: string;
  summary: string;
  relatedCards: string[];
}

const mapRegions: MapRegion[] = [
  {
    id: 'work',
    label: 'Work',
    color: '#d9b56d',
    route: '/work',
    summary: 'Selected projects, systems, and shipped outcomes across music, video, and AV installation.',
    relatedCards: ['work', 'av-museum']
  },
  {
    id: 'sound',
    label: 'Sound',
    color: '#a87fc2',
    route: '/archive/music',
    summary: 'The music archive — beat tapes, sessions, production logs, and sound studies from Newark.',
    relatedCards: ['music-production', 'scraps']
  },
  {
    id: 'writing',
    label: 'Writing',
    color: '#7caec6',
    route: '/writing',
    summary: 'Essays and notes linking fieldwork, practice, and memory.',
    relatedCards: ['writing', 'scraps']
  },
  {
    id: 'agi',
    label: 'AGI Monitor',
    color: '#c57d66',
    route: '/agi',
    summary: 'Four-wave AGI timeline — software disruption, labor stress, physical economy, and scenario territory.',
    relatedCards: []
  },
  {
    id: 'survival',
    label: 'Survival OS',
    color: '#6ba88c',
    route: '/survival-os',
    summary: '8 systems across three tiers: Keep Alive, Stabilize, Live. Built around real Newark conditions.',
    relatedCards: []
  },
  {
    id: 'contact',
    label: 'Contact',
    color: '#9182c7',
    route: '/contact',
    summary: 'Direct outreach and collaboration entry points.',
    relatedCards: []
  }
];

export default mapRegions;
