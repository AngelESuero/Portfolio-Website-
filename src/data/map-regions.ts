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
    summary: 'Selected projects, systems, and shipped outcomes.',
    relatedCards: ['work', 'av-museum']
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
    id: 'map',
    label: 'Map',
    color: '#8ca96e',
    route: '/map',
    summary: 'The full concept atlas, route graph, and deeper thread structure.',
    relatedCards: ['work', 'writing']
  },
  {
    id: 'ai-accountability',
    label: 'AI Accountability',
    color: '#c57d66',
    route: '/ai-accountability-pledge',
    summary: 'A public accountability lens for AI deployment, infrastructure, and cost.',
    relatedCards: ['ai-accountability']
  },
  {
    id: 'now',
    label: 'Current Focus',
    color: '#c3b395',
    route: '/about#current-focus',
    summary: 'What is active now, where the archive is heading, and what is being refined this season.',
    relatedCards: ['music-production', 'scraps']
  },
  {
    id: 'contact',
    label: 'Contact',
    color: '#9182c7',
    route: '/contact',
    summary: 'Direct outreach and collaboration entry points.',
    relatedCards: ['av-museum', 'ai-accountability']
  }
];

export default mapRegions;
