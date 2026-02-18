export type MapNodeGroup =
  | 'personal'
  | 'tools'
  | 'music'
  | 'writing'
  | 'video'
  | 'visual'
  | 'newark'
  | 'scraps';

export type MapLinkType = 'creates' | 'supports' | 'feeds_back' | 'grounds';

export interface MapNode {
  id: string;
  label: string;
  group: MapNodeGroup;
  alt?: number;
}

export interface MapLink {
  source: string;
  target: string;
  type: MapLinkType;
  weight?: number;
  directed?: boolean;
}

export const MAP_GROUP_ORDER: MapNodeGroup[] = [
  'personal',
  'tools',
  'scraps',
  'newark',
  'music',
  'writing',
  'visual',
  'video'
];

export const MAP_NODES: MapNode[] = [
  { id: 'personal', label: 'Personal', group: 'personal', alt: 0.18 },
  { id: 'tools', label: 'Tools', group: 'tools', alt: 0.55 },
  { id: 'music', label: 'Music', group: 'music', alt: 0.62 },
  { id: 'writing', label: 'Writing', group: 'writing', alt: 0.67 },
  { id: 'video', label: 'Video', group: 'video', alt: 0.76 },
  { id: 'visual', label: 'Visual', group: 'visual', alt: 0.57 },
  { id: 'newark', label: 'Newark', group: 'newark', alt: 0.44 },
  { id: 'scraps', label: 'Scraps', group: 'scraps', alt: 0.35 }
];

export const MAP_LINKS: MapLink[] = [
  { source: 'tools', target: 'music', type: 'supports', weight: 0.66 },
  { source: 'tools', target: 'visual', type: 'supports', weight: 0.58 },
  { source: 'tools', target: 'writing', type: 'supports', weight: 0.56 },
  { source: 'music', target: 'visual', type: 'supports', weight: 0.54 },
  { source: 'music', target: 'video', type: 'creates', weight: 0.84, directed: true },
  { source: 'writing', target: 'video', type: 'creates', weight: 0.72, directed: true },
  { source: 'visual', target: 'video', type: 'creates', weight: 0.62, directed: true },
  { source: 'scraps', target: 'music', type: 'feeds_back', weight: 0.68 },
  { source: 'scraps', target: 'writing', type: 'feeds_back', weight: 0.74 },
  { source: 'newark', target: 'music', type: 'grounds', weight: 0.7 },
  { source: 'newark', target: 'writing', type: 'grounds', weight: 0.72 },
  { source: 'personal', target: 'tools', type: 'supports', weight: 0.5 },
  { source: 'personal', target: 'newark', type: 'supports', weight: 0.52 },
  { source: 'personal', target: 'scraps', type: 'supports', weight: 0.48 }
];
