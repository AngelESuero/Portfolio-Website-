'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type District = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

type NodeItem = {
  id: string;
  name: string;
  year: number;
  district: string;
  lat: number;
  lon: number;
  desc: string;
  links: string[];
  related: string[];
};

type Region = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  color: string;
  districts: District[];
  nodes: NodeItem[];
};

type RouteRule = {
  test: (path: string) => boolean;
  region: string | null;
  note: string;
};

type ProjectedPoint = {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  visible: boolean;
};

type IndexedNode = NodeItem & {
  regionId: string;
  regionName: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const REGIONS: Region[] = [
  {
    id: 'wellbeing',
    name: 'Well-Being',
    lat: 34,
    lon: -18,
    color: 'rgba(208, 223, 255, 0.24)',
    districts: [
      { id: 'inner-life', name: 'Inner Life', lat: 42, lon: -26 },
      { id: 'practices', name: 'Practices', lat: 24, lon: -6 }
    ],
    nodes: [
      {
        id: 'isha',
        name: 'Isha Kriya',
        year: 2024,
        district: 'Practices',
        lat: 18,
        lon: 2,
        desc: 'Meditation and practice tied to inner stability.',
        links: ['/writing', '/pdfs/Practicing-Kriya.pdf'],
        related: ['consciousness', 'suffering', 'astro']
      },
      {
        id: 'suffering',
        name: 'Suffering',
        year: 2024,
        district: 'Inner Life',
        lat: 44,
        lon: -34,
        desc: 'A recurring inner-life question across essays and notes.',
        links: ['/writing', '/map'],
        related: ['isha', 'mass-media']
      },
      {
        id: 'consciousness',
        name: 'Consciousness',
        year: 2025,
        district: 'Inner Life',
        lat: 36,
        lon: -12,
        desc: 'An interpretive node linking interior life to wider frameworks.',
        links: ['/writing', '/pdfs/My-Astrology-Chart.pdf'],
        related: ['isha', 'astro', 'essay-codex']
      }
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    lat: 28,
    lon: 28,
    color: 'rgba(203, 241, 214, 0.20)',
    districts: [
      { id: 'academic-arc', name: 'Academic Arc', lat: 38, lon: 18 },
      { id: 'self-revision', name: 'Self Revision', lat: 18, lon: 38 }
    ],
    nodes: [
      {
        id: 'nyu',
        name: 'NYU Expansion',
        year: 2020,
        district: 'Academic Arc',
        lat: 40,
        lon: 10,
        desc: 'A phase of intellectual expansion and reframing.',
        links: ['/writing', '/pdfs/Retrieving-User-Essay-Titles.pdf'],
        related: ['essay-codex', 'job-auto']
      },
      {
        id: 'applied-humanism',
        name: 'Applied Humanism',
        year: 2025,
        district: 'Self Revision',
        lat: 16,
        lon: 48,
        desc: 'A growth node connecting reflection to practical civic movement.',
        links: ['/about', '/work'],
        related: ['ghproposal', 'friendship']
      }
    ]
  },
  {
    id: 'relationships',
    name: 'Relationships',
    lat: 6,
    lon: 70,
    color: 'rgba(245, 214, 222, 0.20)',
    districts: [
      { id: 'identity-ties', name: 'Identity Ties', lat: 14, lon: 58 },
      { id: 'community-bonds', name: 'Community Bonds', lat: -4, lon: 82 }
    ],
    nodes: [
      {
        id: 'friendship',
        name: 'Friendship',
        year: 2019,
        district: 'Identity Ties',
        lat: 18,
        lon: 52,
        desc: 'Relational threads across identity, language, and belonging.',
        links: ['/writing', '/about'],
        related: ['applied-humanism', 'ghproposal']
      }
    ]
  },
  {
    id: 'work',
    name: 'Work',
    lat: -14,
    lon: 58,
    color: 'rgba(255, 224, 189, 0.24)',
    districts: [
      { id: 'labor-systems', name: 'Labor Systems', lat: -4, lon: 44 },
      { id: 'automation', name: 'Automation', lat: -26, lon: 72 }
    ],
    nodes: [
      {
        id: 'job-auto',
        name: 'Job Automation',
        year: 2025,
        district: 'Automation',
        lat: -30,
        lon: 78,
        desc: 'Work, labor, and automation pressures across the archive.',
        links: ['/agi', '/work'],
        related: ['ai-displacement', 'nyu', 'mass-media']
      },
      {
        id: 'sacrifice',
        name: 'Sacrifice of Power',
        year: 2019,
        district: 'Labor Systems',
        lat: -6,
        lon: 40,
        desc: 'Essay node tied to labor, systems, and human dignity.',
        links: ['/writing', '/pdfs/Searching-for-Users-Essays.pdf'],
        related: ['marx', 'mass-media']
      }
    ]
  },
  {
    id: 'creativity',
    name: 'Creativity',
    lat: -34,
    lon: 16,
    color: 'rgba(221, 211, 255, 0.24)',
    districts: [
      { id: 'literary-forms', name: 'Literary Forms', lat: -24, lon: 6 },
      { id: 'sound-story', name: 'Sound and Story', lat: -44, lon: 26 }
    ],
    nodes: [
      {
        id: 'beat-tape',
        name: 'My First Beat Tape',
        year: 2019,
        district: 'Sound and Story',
        lat: -48,
        lon: 28,
        desc: 'Music archive anchor connected to sound and authorship.',
        links: [
          '/work',
          'https://untitled.stream/library/project/W9oQWS6klQAAftkyx28QL'
        ],
        related: ['essay-codex', 'mass-media']
      }
    ]
  },
  {
    id: 'activity',
    name: 'Activity',
    lat: -28,
    lon: -32,
    color: 'rgba(201, 233, 241, 0.20)',
    districts: [
      { id: 'fieldwork', name: 'Fieldwork', lat: -18, lon: -42 },
      {
        id: 'institutional-action',
        name: 'Institutional Action',
        lat: -38,
        lon: -18
      }
    ],
    nodes: [
      {
        id: 'ghproposal',
        name: 'GH+ Proposal',
        year: 2025,
        district: 'Institutional Action',
        lat: -42,
        lon: -14,
        desc: 'Institutional and practical action node.',
        links: ['/work', '/survival-support'],
        related: ['friendship', 'applied-humanism', 'ai-displacement']
      }
    ]
  },
  {
    id: 'order',
    name: 'Order',
    lat: -8,
    lon: -86,
    color: 'rgba(225, 225, 225, 0.18)',
    districts: [
      { id: 'writing-discipline', name: 'Writing Discipline', lat: 2, lon: -98 },
      { id: 'analytic-systems', name: 'Analytic Systems', lat: -18, lon: -74 }
    ],
    nodes: [
      {
        id: 'essay-codex',
        name: 'Essay Codex',
        year: 2015,
        district: 'Writing Discipline',
        lat: 6,
        lon: -104,
        desc: 'Early structure and method node.',
        links: ['/writing', '/map'],
        related: ['nyu', 'beat-tape', 'consciousness']
      }
    ]
  },
  {
    id: 'resources',
    name: 'Resources',
    lat: 24,
    lon: -118,
    color: 'rgba(245, 232, 196, 0.20)',
    districts: [
      { id: 'core-thinkers', name: 'Core Thinkers', lat: 34, lon: -132 },
      {
        id: 'critical-frameworks',
        name: 'Critical Frameworks',
        lat: 12,
        lon: -104
      }
    ],
    nodes: [
      {
        id: 'marx',
        name: 'Marx',
        year: 2019,
        district: 'Core Thinkers',
        lat: 38,
        lon: -136,
        desc: 'Reference system feeding labor and systems critique.',
        links: ['/writing', '/pdfs/Searching-for-Users-Essays.pdf'],
        related: ['sacrifice', 'mass-media']
      },
      {
        id: 'astro',
        name: 'Astrology Chart',
        year: 2026,
        district: 'Critical Frameworks',
        lat: 14,
        lon: -102,
        desc: 'Lens layer for interpreting recurring themes and tensions.',
        links: ['/pdfs/My-Astrology-Chart.pdf', '/map'],
        related: ['consciousness', 'isha']
      }
    ]
  },
  {
    id: 'society',
    name: 'Society',
    lat: 10,
    lon: -162,
    color: 'rgba(255, 205, 205, 0.20)',
    districts: [
      { id: 'public-systems', name: 'Public Systems', lat: 18, lon: -150 },
      {
        id: 'control-hegemony',
        name: 'Control and Hegemony',
        lat: -2,
        lon: -176
      }
    ],
    nodes: [
      {
        id: 'mass-media',
        name: 'Mass Media',
        year: 2016,
        district: 'Control and Hegemony',
        lat: -4,
        lon: -176,
        desc: 'A systems node tied to control, culture, and public narrative.',
        links: ['/writing', '/pdfs/Searching-for-Users-Essays.pdf'],
        related: ['sacrifice', 'job-auto', 'marx', 'beat-tape']
      },
      {
        id: 'ai-displacement',
        name: 'AI Displacement',
        year: 2025,
        district: 'Public Systems',
        lat: 16,
        lon: -148,
        desc: 'A public systems node connecting AGI, labor, and adaptation.',
        links: ['/agi', '/survival-os'],
        related: ['job-auto', 'ghproposal']
      }
    ]
  }
];

const ROUTE_CONTEXT: RouteRule[] = [
  {
    test: (path) => path.startsWith('/work'),
    region: 'work',
    note: 'Work page context brings labor, automation, and public adaptation closer to the surface.'
  },
  {
    test: (path) => path.startsWith('/writing'),
    region: 'order',
    note: 'Writing context emphasizes structure, method, and the nodes that hold the archive together.'
  },
  {
    test: (path) => path.startsWith('/agi'),
    region: 'society',
    note: 'AGI context foregrounds public systems, labor disruption, and society-scale signals.'
  },
  {
    test: (path) => path.startsWith('/survival-os') || path.startsWith('/survival-support'),
    region: 'activity',
    note: 'Survival context foregrounds practical action, coordination, and real-world response paths.'
  },
  {
    test: (path) => path.startsWith('/about'),
    region: 'growth',
    note: 'About context pulls growth, revision, and authorial formation into focus.'
  },
  {
    test: (path) => path.startsWith('/map'),
    region: null,
    note: 'Atlas context starts in overview so the whole system can be read before one lane takes over.'
  }
];

function isIndexedNode(node: IndexedNode | undefined): node is IndexedNode {
  return Boolean(node);
}

function getLinkLabel(href: string) {
  if (href.startsWith('/pdfs')) return 'Open PDF';
  if (href.startsWith('http')) return 'Open external';
  return 'Open page';
}

function routeContextFromPath(pathname: string) {
  return (
    ROUTE_CONTEXT.find((rule) => rule.test(pathname)) || {
      region: null,
      note: 'The orb starts in overview and waits for you to choose a lane.'
    }
  );
}

function curvePath(
  a: { x: number; y: number },
  b: { x: number; y: number },
  bend = 0.18
) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return reduced;
}

function MobileAtlasFallback({
  focusedRegion,
  selectedDistrict,
  selectedNode,
  nodeIndex,
  onFocusRegion,
  onSelectDistrict,
  onSelectNode,
  onBackToOverview,
  onClearNode
}: {
  focusedRegion: string | null;
  selectedDistrict: District | null;
  selectedNode: IndexedNode | null;
  nodeIndex: Record<string, IndexedNode>;
  onFocusRegion: (regionId: string) => void;
  onSelectDistrict: (district: District) => void;
  onSelectNode: (nodeId: string) => void;
  onBackToOverview: () => void;
  onClearNode: () => void;
}) {
  const activeRegion = REGIONS.find((region) => region.id === focusedRegion) || null;
  const visibleNodes = activeRegion
    ? selectedDistrict
      ? activeRegion.nodes.filter((node) => node.district === selectedDistrict.name)
      : activeRegion.nodes
    : [];

  const relatedNodes = selectedNode
    ? selectedNode.related.map((id) => nodeIndex[id]).filter(isIndexedNode)
    : [];

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col gap-4 px-4 py-4 lg:hidden">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
          Mobile fallback
        </div>
        <div className="mt-2 text-sm text-white/68">
          Temporary small-screen version. The immersive orb is desktop and tablet
          only for now.
        </div>
      </div>

      {!activeRegion && (
        <div className="space-y-3">
          {REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => onFocusRegion(region.id)}
              className="w-full rounded-2xl border border-white/10 px-4 py-4 text-left text-white shadow-sm transition-colors hover:bg-white/[0.04]"
              style={{ background: region.color }}
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Region
              </div>
              <div className="mt-1 text-base font-medium">{region.name}</div>
              <div className="mt-2 text-sm text-white/65">
                {region.districts.length} districts / {region.nodes.length} nodes
              </div>
            </button>
          ))}
        </div>
      )}

      {activeRegion && !selectedNode && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                  Active region
                </div>
                <div className="mt-1 text-xl font-medium">{activeRegion.name}</div>
              </div>
              <button
                type="button"
                onClick={onBackToOverview}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
              >
                Overview
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
              Districts
            </div>
            <div className="mt-3 space-y-2">
              {activeRegion.districts.map((district) => {
                const count = activeRegion.nodes.filter(
                  (node) => node.district === district.name
                ).length;
                const active = selectedDistrict?.id === district.id;

                return (
                  <button
                    key={district.id}
                    type="button"
                    onClick={() => onSelectDistrict(district)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? 'border-white/20 bg-white/[0.07]'
                        : 'border-white/10 bg-black/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="text-sm font-medium text-white/88">
                      {district.name}
                    </div>
                    <div className="mt-1 text-xs text-white/45">
                      {count} node{count === 1 ? '' : 's'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
              Nodes
            </div>
            <div className="mt-3 space-y-2">
              {visibleNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => onSelectNode(node.id)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <div className="text-sm font-medium text-white/88">{node.name}</div>
                  <div className="mt-1 text-xs text-white/45">
                    {node.year} / {node.district}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedNode && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                  Selected node
                </div>
                <div className="mt-1 text-xl font-medium">{selectedNode.name}</div>
              </div>
              <button
                type="button"
                onClick={onClearNode}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
              >
                Back
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/72">
                {selectedNode.year}
              </span>
              <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/72">
                {selectedNode.regionName}
              </span>
              <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/72">
                {selectedNode.district}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/68">{selectedNode.desc}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
              Links
            </div>
            <div className="mt-3 space-y-2">
              {selectedNode.links.map((href, index) => (
                <a
                  key={`${href}-${index}`}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="block rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/88 transition-colors hover:bg-white/[0.04]"
                >
                  {getLinkLabel(href)}
                  <span className="mt-1 block break-all text-xs text-white/42">
                    {href}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
              Related nodes
            </div>
            <div className="mt-3 space-y-2">
              {relatedNodes.length === 0 ? (
                <div className="text-sm text-white/52">No linked bridges yet.</div>
              ) : (
                relatedNodes.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => onSelectNode(node.id)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="text-sm font-medium text-white/88">{node.name}</div>
                    <div className="mt-1 text-xs text-white/45">{node.regionName}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrbMindMapPrototype() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [focusedRegion, setFocusedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<IndexedNode | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState({ pitch: -12, yaw: 18 });
  const [currentPath, setCurrentPath] = useState('/map');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDistricts, setShowDistricts] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  const [showBridges, setShowBridges] = useState(true);

  const dragRef = useRef({
    pointerId: -1,
    x: 0,
    y: 0,
    startPitch: -12,
    startYaw: 18,
    moved: 0
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '/map';
      setCurrentPath(path);

      const context = routeContextFromPath(path);
      if (context.region) {
        setFocusedRegion(context.region);
        setZoom(1.08);
      }
    }
  }, []);

  useEffect(() => {
    if (reducedMotion || dragging || focusedRegion || selectedNode || searchOpen) {
      return undefined;
    }

    let frame = 0;
    const tick = () => {
      setRotation((current) => ({ ...current, yaw: current.yaw + 0.18 }));
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reducedMotion, dragging, focusedRegion, selectedNode, searchOpen]);

  const routeContext = routeContextFromPath(currentPath);
  const activeRegion = REGIONS.find((region) => region.id === focusedRegion) || null;

  const nodeIndex = useMemo(() => {
    const map: Record<string, IndexedNode> = {};
    REGIONS.forEach((region) => {
      region.nodes.forEach((node) => {
        map[node.id] = { ...node, regionId: region.id, regionName: region.name };
      });
    });
    return map;
  }, []);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [] as Array<{
        type: 'region' | 'node';
        id: string;
        label: string;
        sublabel: string;
      }>;
    }

    const results: Array<{
      type: 'region' | 'node';
      id: string;
      label: string;
      sublabel: string;
      score: number;
    }> = [];

    REGIONS.forEach((region) => {
      const regionHit = `${region.name} ${region.id}`.toLowerCase();
      if (regionHit.includes(query)) {
        results.push({
          type: 'region',
          id: region.id,
          label: region.name,
          sublabel: 'Region',
          score: region.name.toLowerCase() === query ? 100 : 70
        });
      }

      region.nodes.forEach((node) => {
        const haystack =
          `${node.name} ${node.desc} ${node.district} ${region.name} ${node.year}`.toLowerCase();

        if (haystack.includes(query)) {
          const exact = node.name.toLowerCase() === query;
          const starts = node.name.toLowerCase().startsWith(query);

          results.push({
            type: 'node',
            id: node.id,
            label: node.name,
            sublabel: `${region.name} / ${node.district} / ${node.year}`,
            score: exact ? 120 : starts ? 95 : 80
          });
        }
      });
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ score: _score, ...rest }) => rest);
  }, [searchQuery]);

  const projectPoint = (lat: number, lon: number, radius: number): ProjectedPoint => {
    const latRad = (lat * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;

    const x = radius * Math.cos(latRad) * Math.sin(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.cos(lonRad);

    const yaw = (rotation.yaw * Math.PI) / 180;
    const pitch = (rotation.pitch * Math.PI) / 180;

    const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
    const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const y1 = y;

    const y2 = y1 * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = y1 * Math.sin(pitch) + z1 * Math.cos(pitch);
    const x2 = x1;

    const distance = 620;
    const perspective = distance / (distance - z2);

    return {
      x: x2 * perspective,
      y: y2 * perspective,
      z: z2,
      scale: perspective,
      opacity: clamp(0.2 + (z2 + radius) / (radius * 2), 0.15, 1),
      visible: z2 > -radius * 0.92
    };
  };

  const shapeToShell = (
    point: ProjectedPoint,
    zoomLevel: number
  ): ProjectedPoint => {
    const distanceFromCenter = Math.hypot(point.x, point.y);
    const minimumCoreRadius = 112 * zoomLevel;
    const pushOut =
      distanceFromCenter < minimumCoreRadius
        ? minimumCoreRadius / Math.max(distanceFromCenter, 1)
        : 1;

    return {
      ...point,
      x: point.x * pushOut,
      y: point.y * pushOut
    };
  };

  const orbScale = 470 * zoom;
  const sphereRadius = 182 * zoom;
  const frameSize = orbScale + 96;

  const projectedRegions = useMemo(() => {
    return REGIONS.map((region) => ({
      region,
      point: shapeToShell(projectPoint(region.lat, region.lon, sphereRadius), zoom)
    })).sort((a, b) => a.point.z - b.point.z);
  }, [rotation, zoom]);

  const centerCandidate = useMemo(() => {
    if (selectedNode) return null;

    const nearest = projectedRegions
      .filter(({ point }) => point.visible)
      .map((entry) => ({
        ...entry,
        distance: Math.hypot(entry.point.x, entry.point.y)
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    return nearest && nearest.distance < 96 ? nearest.region.id : null;
  }, [projectedRegions, selectedNode]);

  const projectedDistricts = useMemo(() => {
    if (!activeRegion || !showDistricts) {
      return [] as Array<{ district: District; point: ProjectedPoint }>;
    }

    return activeRegion.districts
      .map((district) => ({
        district,
        point: shapeToShell(projectPoint(district.lat, district.lon, sphereRadius), zoom)
      }))
      .sort((a, b) => a.point.z - b.point.z);
  }, [activeRegion, rotation, zoom, showDistricts]);

  const projectedNodes = useMemo(() => {
    if (!activeRegion || !showNodes) {
      return [] as Array<{ node: NodeItem; point: ProjectedPoint }>;
    }

    const filtered = selectedDistrict
      ? activeRegion.nodes.filter((node) => node.district === selectedDistrict.name)
      : activeRegion.nodes;

    return filtered
      .map((node) => ({
        node,
        point: shapeToShell(projectPoint(node.lat, node.lon, sphereRadius), zoom)
      }))
      .sort((a, b) => a.point.z - b.point.z);
  }, [activeRegion, rotation, zoom, showNodes, selectedDistrict]);

  const relatedNodes = selectedNode
    ? selectedNode.related.map((id) => nodeIndex[id]).filter(isIndexedNode)
    : [];

  const activeConnections = useMemo(() => {
    if (!selectedNode || !showBridges) {
      return [] as Array<{
        from: ProjectedPoint;
        to: ProjectedPoint;
        node: IndexedNode;
      }>;
    }

    const from = shapeToShell(
      projectPoint(selectedNode.lat, selectedNode.lon, sphereRadius),
      zoom
    );

    return selectedNode.related
      .map((id) => nodeIndex[id])
      .filter(isIndexedNode)
      .map((node) => ({
        node,
        from,
        to: shapeToShell(projectPoint(node.lat, node.lon, sphereRadius), zoom)
      }))
      .filter((edge) => edge.from.visible && edge.to.visible);
  }, [selectedNode, nodeIndex, rotation, zoom, showBridges]);

  const districtNodes =
    selectedDistrict && activeRegion
      ? activeRegion.nodes.filter((node) => node.district === selectedDistrict.name)
      : [];

  const goToOverview = () => {
    setFocusedRegion(null);
    setSelectedDistrict(null);
    setSelectedNode(null);
    setHoveredNode(null);
    setHoveredRegion(null);
    setZoom(1);
  };

  const goBack = () => {
    if (selectedNode) {
      setSelectedNode(null);
      return;
    }

    if (selectedDistrict) {
      setSelectedDistrict(null);
      return;
    }

    goToOverview();
  };

  const canGoBack = Boolean(selectedNode || selectedDistrict || focusedRegion);

  const focusRegion = (regionId: string) => {
    const region = REGIONS.find((entry) => entry.id === regionId);
    if (!region) return;

    setFocusedRegion(regionId);
    setSelectedDistrict(null);
    setSelectedNode(null);
    setZoom((value) => Math.max(value, 1.08));
    setRotation({
      pitch: clamp(region.lat * 0.16, -14, 14),
      yaw: 90 - region.lon
    });
  };

  const focusNode = (nodeId: string) => {
    const node = nodeIndex[nodeId];
    if (!node) return;

    const region = REGIONS.find((entry) => entry.id === node.regionId);
    const district = region?.districts.find((candidate) => candidate.name === node.district) || null;

    focusRegion(node.regionId);
    setSelectedDistrict(district);
    setSelectedNode(node);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const resetView = () => {
    const context = routeContextFromPath(currentPath);

    setFocusedRegion(context.region || null);
    setSelectedNode(null);
    setSelectedDistrict(null);
    setHoveredNode(null);
    setHoveredRegion(null);
    setZoom(context.region ? 1.08 : 1);
    setRotation({ pitch: -12, yaw: 18 });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target && ['INPUT', 'TEXTAREA'].includes(target.tagName);

      if (typing) {
        if (event.key === 'Escape') setSearchOpen(false);
        return;
      }

      if (event.key === '/') {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === 'Escape') {
        if (canGoBack) goBack();
        else setSearchOpen(false);
      }

      if (event.key === 'Enter' && centerCandidate && !selectedNode) {
        focusRegion(centerCandidate);
      }

      if (event.key === '+' || event.key === '=') {
        setZoom((value) => clamp(value + 0.12, 0.82, 2.1));
      }

      if (event.key === '-') {
        setZoom((value) => clamp(value - 0.12, 0.82, 2.1));
      }

      if (event.key.toLowerCase() === 'r') {
        resetView();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [centerCandidate, selectedNode, canGoBack, currentPath]);

  const stopShellDrag = (event: React.PointerEvent | React.MouseEvent) => {
    event.stopPropagation();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startPitch: rotation.pitch,
      startYaw: rotation.yaw,
      moved: 0
    };
    containerRef.current?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || dragRef.current.pointerId !== event.pointerId) return;

    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;

    dragRef.current.moved = Math.max(dragRef.current.moved, Math.hypot(dx, dy));

    setRotation({
      pitch: clamp(dragRef.current.startPitch - dy * 0.12, -45, 45),
      yaw: dragRef.current.startYaw + dx * 0.16
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId === event.pointerId) {
      containerRef.current?.releasePointerCapture?.(event.pointerId);
      setDragging(false);
      dragRef.current.pointerId = -1;
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    setZoom((value) => clamp(value + delta, 0.82, 2.1));
  };

  const handleShellClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (dragRef.current.moved > 6) return;
    if (canGoBack) goBack();
  };

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-[#090d11] text-[#edf0f4]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <style>{`
        @keyframes interfacePulse {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
      `}</style>

      <div className="relative flex min-h-screen flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(65,84,103,0.24),transparent_30%),radial-gradient(circle_at_50%_75%,rgba(13,18,24,0.92),rgba(6,10,14,1))]" />

        {searchOpen && (
          <div
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <div
              className="absolute left-1/2 top-16 w-[min(640px,92vw)] -translate-x-1/2 rounded-3xl border border-white/10 bg-[#0b1117]/95 p-4 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                    Search atlas
                  </div>
                  <div className="mt-1 text-sm text-white/65">
                    Find regions and nodes instantly.
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                  onClick={() => setSearchOpen(false)}
                >
                  Close
                </button>
              </div>

              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search regions, nodes, years, districts..."
                className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              />

              <div className="mt-3 max-h-[52vh] space-y-2 overflow-auto">
                {!searchQuery.trim() ? (
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/55">
                    Try "AI", "Kriya", "Work", "2019", or "Mass Media".
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/55">
                    No matches yet.
                  </div>
                ) : (
                  searchResults.map((result) => (
                    <button
                      type="button"
                      key={`${result.type}-${result.id}`}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/[0.06]"
                      onClick={() => {
                        if (result.type === 'region') {
                          focusRegion(result.id);
                          setSearchOpen(false);
                          setSearchQuery('');
                        } else {
                          focusNode(result.id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-white/90">
                            {result.label}
                          </div>
                          <div className="mt-1 text-xs text-white/45">
                            {result.sublabel}
                          </div>
                        </div>
                        <div className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
                          {result.type}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-sm">
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-white/45">
              Archive navigator
            </div>
            <div className="text-xl font-medium tracking-wide">
              Organizational Atlas - Working Orb
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 hover:bg-white/10"
              onClick={() => setSearchOpen(true)}
            >
              Search <span className="ml-1 text-white/35">/</span>
            </button>

            <button
              type="button"
              className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 hover:bg-white/10"
              onClick={() => resetView()}
            >
              Reset <span className="ml-1 text-white/35">R</span>
            </button>

            <button
              type="button"
              className={`rounded-full px-3 py-1.5 ${
                canGoBack
                  ? 'border border-white/12 bg-white/5 hover:bg-white/10'
                  : 'cursor-default border border-white/8 bg-white/[0.02] text-white/30'
              }`}
              onClick={() => canGoBack && goBack()}
            >
              Back <span className="ml-1 text-white/35">Esc</span>
            </button>
          </div>
        </header>

        <MobileAtlasFallback
          focusedRegion={focusedRegion}
          selectedDistrict={selectedDistrict}
          selectedNode={selectedNode}
          nodeIndex={nodeIndex}
          onFocusRegion={focusRegion}
          onSelectDistrict={(district) => {
            setSelectedNode(null);
            setSelectedDistrict(district);
          }}
          onSelectNode={focusNode}
          onBackToOverview={goToOverview}
          onClearNode={() => setSelectedNode(null)}
        />

        <div className="relative z-10 hidden flex-1 grid-cols-[1fr_360px] lg:grid">
          <div className="relative flex items-center justify-center px-6 py-8">
            <div className="absolute left-6 top-6 text-sm tracking-wide text-white/45">
              Drag / Wheel Zoom / Click to Focus / Enter on Center
            </div>

            <div className="absolute bottom-6 left-6 max-w-sm rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-sm text-white/60 backdrop-blur-md shadow-xl">
              <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-white/36">
                Route feed
              </div>
              {hoveredRegion && !focusedRegion
                ? `Hovering ${REGIONS.find((region) => region.id === hoveredRegion)?.name}. Click it or bring it near center.`
                : routeContext.note}
            </div>

            <div className="absolute right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2">
              <button
                type="button"
                className="h-10 w-10 rounded-full border border-white/12 bg-black/40 text-lg backdrop-blur"
                onPointerDown={stopShellDrag}
                onClick={() => setZoom((value) => clamp(value + 0.15, 0.82, 2.1))}
              >
                +
              </button>
              <button
                type="button"
                className="h-10 w-10 rounded-full border border-white/12 bg-black/40 text-lg backdrop-blur"
                onPointerDown={stopShellDrag}
                onClick={() => setZoom((value) => clamp(value - 0.15, 0.82, 2.1))}
              >
                -
              </button>
            </div>

            <div
              ref={containerRef}
              className="relative select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
              onClick={handleShellClick}
              style={{
                width: frameSize,
                height: frameSize,
                cursor: dragging ? 'grabbing' : 'grab',
                touchAction: 'none',
                userSelect: 'none'
              }}
            >
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.56),0_0_70px_rgba(118,154,197,0.1)]"
                style={{
                  width: orbScale,
                  height: orbScale,
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(6,9,13,0) 0 24%, rgba(34,48,61,0.06) 34%, rgba(24,34,43,0.4) 52%, rgba(13,19,25,0.92) 76%, rgba(8,12,16,1) 100%)'
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(5,8,12,0)_0_18%,rgba(255,255,255,0.04)_28%,transparent_34%),radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.08),transparent_16%),radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.58),transparent_42%)]" />
                <div className="absolute inset-[5%] rounded-full border border-white/6" />
                <div className="absolute inset-[15%] rounded-full border border-white/5" />
                <div className="absolute inset-[26%] rounded-full border border-white/4" />
                <div className="absolute inset-[21%] rounded-full border border-white/6 bg-[#090d11] shadow-[0_0_56px_rgba(0,0,0,0.46)]" />
                <div className="absolute inset-0 rounded-full shadow-[inset_-38px_-48px_96px_rgba(0,0,0,0.56),inset_18px_18px_52px_rgba(255,255,255,0.03)]" />
              </div>

              <svg className="pointer-events-none absolute inset-0 z-10 overflow-visible">
                {activeConnections.map((edge) => (
                  <path
                    key={`${selectedNode?.id}-${edge.node.id}`}
                    d={curvePath(edge.from, edge.to, 0.14)}
                    fill="none"
                    stroke="rgba(230,240,255,0.34)"
                    strokeWidth="1.5"
                    transform={`translate(${frameSize / 2}, ${frameSize / 2})`}
                  />
                ))}
              </svg>

              <div className="pointer-events-none absolute inset-0 z-40">
                <div className="absolute left-1/2 top-[calc(50%+46px)] -translate-x-1/2">
                  <button
                    type="button"
                    className="pointer-events-auto rounded-full border border-white/10 bg-black/28 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm hover:bg-white/10"
                    onPointerDown={stopShellDrag}
                    onClick={() => centerCandidate && focusRegion(centerCandidate)}
                  >
                    {centerCandidate
                      ? `Focus ${REGIONS.find((region) => region.id === centerCandidate)?.name}`
                      : 'Center reticle'}
                  </button>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative h-16 w-16">
                    <div
                      className="absolute inset-0 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(190,220,255,0.05),transparent_64%)]"
                      style={
                        reducedMotion
                          ? undefined
                          : { animation: 'interfacePulse 3.6s ease-in-out infinite' }
                      }
                    />
                    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/18 to-transparent" />
                    <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                    <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 shadow-[0_0_18px_rgba(210,230,255,0.08)]" />
                  </div>
                </div>
              </div>

              {projectedRegions.map(({ region, point }) => {
                if (!point.visible) return null;

                const isFocused = focusedRegion === region.id;
                const isHovered = hoveredRegion === region.id;
                const inReticle = centerCandidate === region.id && !focusedRegion;
                const faded = focusedRegion && !isFocused;
                const loom = isFocused ? 1.14 : inReticle ? 1.06 : isHovered ? 1.03 : 1;
                const width = (isFocused ? 118 : 104) * point.scale * loom;
                const height = (isFocused ? 54 : 46) * point.scale * loom;

                return (
                  <button
                    type="button"
                    key={region.id}
                    onPointerDown={stopShellDrag}
                    onClick={() => focusRegion(region.id)}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    className="absolute z-20 rounded-full border text-left transition-all duration-300"
                    style={{
                      left: `calc(50% + ${point.x}px - ${width / 2}px)`,
                      top: `calc(50% + ${point.y}px - ${height / 2}px)`,
                      width,
                      height,
                      borderColor: isFocused
                        ? 'rgba(255,255,255,0.3)'
                        : 'rgba(255,255,255,0.1)',
                      background: region.color,
                      backdropFilter: 'blur(10px)',
                      opacity: faded ? 0.16 : point.opacity,
                      boxShadow:
                        isFocused || inReticle || isHovered
                          ? '0 0 16px rgba(210,230,255,0.10)'
                          : 'none'
                    }}
                  >
                    <div className="px-4 py-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                        Region
                      </div>
                      <div className="text-sm font-medium leading-tight">
                        {region.name}
                      </div>
                    </div>
                  </button>
                );
              })}

              {projectedDistricts.map(({ district, point }) => {
                if (!point.visible) return null;

                const districtHovered = hoveredNode === district.id;

                return (
                  <button
                    type="button"
                    key={district.id}
                    onPointerDown={stopShellDrag}
                    onClick={() => {
                      setSelectedNode(null);
                      setSelectedDistrict(district);
                    }}
                    onMouseEnter={() => setHoveredNode(district.id)}
                    onMouseLeave={() =>
                      setHoveredNode((current) => (current === district.id ? null : current))
                    }
                    className="absolute z-30 rounded-full border border-white/14 bg-black/36 px-4 py-2 text-sm text-white/88 shadow-[0_0_18px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300"
                    style={{
                      left: `calc(50% + ${point.x}px - ${56 * point.scale}px)`,
                      top: `calc(50% + ${point.y}px - ${18 * point.scale}px)`,
                      opacity: point.opacity,
                      transform: `scale(${point.scale * (districtHovered ? 1.04 : 0.98)})`
                    }}
                  >
                    {district.name}
                  </button>
                );
              })}

              {projectedNodes.map(({ node, point }) => {
                if (!point.visible) return null;

                const selected = selectedNode?.id === node.id;
                const hovered = hoveredNode === node.id;
                const shouldShowLabel = selected || hovered || point.scale > 1.02;
                const nodeScale = point.scale * (selected ? 1.18 : hovered ? 1.06 : 1);

                return (
                  <button
                    type="button"
                    key={node.id}
                    onPointerDown={stopShellDrag}
                    onClick={() => {
                      const indexed = nodeIndex[node.id];
                      const district =
                        activeRegion?.districts.find((entry) => entry.name === node.district) ||
                        null;
                      setSelectedDistrict(district);
                      setSelectedNode(indexed);
                    }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() =>
                      setHoveredNode((current) => (current === node.id ? null : current))
                    }
                    className="absolute z-40 text-left transition-transform duration-300"
                    style={{
                      left: `calc(50% + ${point.x}px - 8px)`,
                      top: `calc(50% + ${point.y}px - 8px)`,
                      opacity: point.opacity,
                      transform: `scale(${nodeScale})`
                    }}
                  >
                    {selected && (
                      <div
                        className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                        style={
                          reducedMotion
                            ? undefined
                            : { animation: 'interfacePulse 1.8s ease-in-out infinite' }
                        }
                      />
                    )}

                    <div
                      className={`h-4 w-4 rounded-full border ${
                        selected
                          ? 'border-white/70 bg-white'
                          : hovered
                            ? 'border-white/40 bg-white/90'
                            : 'border-white/25 bg-white/75'
                      } shadow-[0_0_18px_rgba(226,239,255,0.34)]`}
                    />

                    {shouldShowLabel && (
                      <div
                        className="mt-2 whitespace-nowrap text-xs"
                        style={{ opacity: selected ? 1 : hovered ? 0.88 : 0.7 }}
                      >
                        <span className="rounded-full border border-white/10 bg-black/42 px-2 py-1 backdrop-blur-sm">
                          {node.name}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="relative flex flex-col gap-5 border-l border-white/8 bg-black/18 p-6 backdrop-blur-xl">
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-white/38">
                Focus feed
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-white/34">
                <button
                  type="button"
                  onClick={goToOverview}
                  className="rounded-full border border-white/10 px-2 py-1 hover:bg-white/5"
                >
                  Overview
                </button>

                {activeRegion && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistrict(null);
                      setSelectedNode(null);
                    }}
                    className="rounded-full border border-white/10 px-2 py-1 hover:bg-white/5"
                  >
                    {activeRegion.name}
                  </button>
                )}

                {selectedDistrict && (
                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    className="rounded-full border border-white/10 px-2 py-1 hover:bg-white/5"
                  >
                    {selectedDistrict.name}
                  </button>
                )}

                {selectedNode && (
                  <span className="rounded-full border border-white/10 px-2 py-1">
                    {selectedNode.name}
                  </span>
                )}
              </div>

              <div className="mt-1 text-2xl font-medium">
                {selectedNode
                  ? selectedNode.name
                  : selectedDistrict
                    ? selectedDistrict.name
                    : activeRegion
                      ? activeRegion.name
                      : hoveredRegion
                        ? REGIONS.find((region) => region.id === hoveredRegion)?.name
                        : 'Whole Atlas'}
              </div>

              <p className="mt-3 text-sm leading-6 text-white/62">
                {selectedNode
                  ? selectedNode.desc
                  : selectedDistrict
                    ? `District view is active inside ${activeRegion?.name}. Nodes are filtered so the lane becomes readable.`
                    : activeRegion
                      ? 'This lane is active. Districts and nearby nodes are stable on the inner shell while the space stays responsive around them.'
                      : hoveredRegion
                        ? 'This region is available for focus. Click it directly or use the center reticle when it drifts near the middle.'
                        : 'You are inside the core, looking outward while the archive wraps around you in layers.'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                Controls
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/66">
                <span className="rounded-full border border-white/12 px-2.5 py-1">
                  / Search
                </span>
                <span className="rounded-full border border-white/12 px-2.5 py-1">
                  R Reset
                </span>
                <span className="rounded-full border border-white/12 px-2.5 py-1">
                  Esc Back
                </span>
                <span className="rounded-full border border-white/12 px-2.5 py-1">
                  Wheel Zoom
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-white/72">
                <label className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <span>Districts</span>
                  <input
                    type="checkbox"
                    checked={showDistricts}
                    onChange={() => setShowDistricts((value) => !value)}
                  />
                </label>

                <label className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <span>Nodes</span>
                  <input
                    type="checkbox"
                    checked={showNodes}
                    onChange={() => setShowNodes((value) => !value)}
                  />
                </label>

                <label className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <span>Bridges</span>
                  <input
                    type="checkbox"
                    checked={showBridges}
                    onChange={() => setShowBridges((value) => !value)}
                  />
                </label>
              </div>
            </div>

            {selectedNode ? (
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/72">
                    {selectedNode.year}
                  </span>
                  <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/72">
                    {selectedNode.regionName}
                  </span>
                  <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/72">
                    {selectedNode.district}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                    Open route
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {selectedNode.links.map((href, index) => (
                      <a
                        key={`${href}-${index}`}
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noreferrer' : undefined}
                        className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/88 transition-colors hover:bg-white/10"
                      >
                        {getLinkLabel(href)}
                        <span className="mt-1 block break-all text-xs text-white/42">
                          {href}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                    Bridge targets
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {relatedNodes.length === 0 ? (
                      <div className="text-sm text-white/52">No linked bridges yet.</div>
                    ) : (
                      relatedNodes.map((node) => (
                        <button
                          type="button"
                          key={node.id}
                          onPointerDown={stopShellDrag}
                          onClick={() => focusNode(node.id)}
                          className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-left text-sm text-white/88 transition-colors hover:bg-white/10"
                        >
                          {node.name}
                          <span className="mt-1 block text-xs text-white/42">
                            {node.regionName}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : selectedDistrict ? (
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/72">
                    {activeRegion?.name}
                  </span>
                  <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/72">
                    {selectedDistrict.name}
                  </span>
                  <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/72">
                    {districtNodes.length} node{districtNodes.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                    District nodes
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {districtNodes.map((node) => (
                      <button
                        type="button"
                        key={node.id}
                        onPointerDown={stopShellDrag}
                        onClick={() => focusNode(node.id)}
                        className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-left text-sm text-white/88 transition-colors hover:bg-white/10"
                      >
                        {node.name}
                        <span className="mt-1 block text-xs text-white/42">
                          {node.year}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeRegion ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                  Activated districts
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  {activeRegion.districts.map((district) => {
                    const count = activeRegion.nodes.filter(
                      (node) => node.district === district.name
                    ).length;

                    return (
                      <button
                        type="button"
                        key={district.id}
                        onPointerDown={stopShellDrag}
                        onClick={() => {
                          setSelectedNode(null);
                          setSelectedDistrict(district);
                        }}
                        className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-left text-sm text-white/88 transition-colors hover:bg-white/10"
                      >
                        {district.name}
                        <span className="mt-1 block text-xs text-white/42">
                          {count} node{count === 1 ? '' : 's'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                    Far view
                  </div>
                  <div className="mt-2 text-sm text-white/68">
                    Major regions only. The sphere stays legible and quiet.
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                    Activated view
                  </div>
                  <div className="mt-2 text-sm text-white/68">
                    Focused regions come forward modestly while districts surface in
                    place.
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                    Grabbed view
                  </div>
                  <div className="mt-2 text-sm text-white/68">
                    Topics stay semi-static on the inner shell while the surrounding
                    space moves under your drag.
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto text-xs leading-6 text-white/34">
              Stabilized port: drag, zoom, region focus, district filtering, node
              selection, search, bridge lines, and temporary mobile fallback.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
