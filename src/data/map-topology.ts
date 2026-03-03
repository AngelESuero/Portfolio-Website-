export type MapRegionId =
  | 'personal'
  | 'tools'
  | 'music'
  | 'writing'
  | 'video'
  | 'visual'
  | 'newark'
  | 'scraps';

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

export const MAP_WORLD = {
  width: 3200,
  height: 2200
} as const;

export const MAP_REGIONS: MapRegion[] = [
  {
    id: 'personal',
    label: 'Personal',
    x: 520,
    y: 520,
    width: 540,
    height: 420,
    fill: 'rgba(91, 152, 232, 0.14)',
    glow: 'rgba(91, 152, 232, 0.42)',
    summary: 'The internal climate: pace, perspective, and the habits that keep everything else coherent.',
    districts: [
      {
        id: 'personal-pulse',
        label: 'Daily Pulse',
        x: -118,
        y: -72,
        radius: 118,
        description: 'The stabilizers: routines, reflection, and recovery.',
        concepts: [
          {
            id: 'personal-rituals',
            label: 'Rituals',
            x: -42,
            y: -16,
            detail: 'Small repeated actions that keep the whole map legible.',
            links: ['personal-reflection', 'personal-rest']
          },
          {
            id: 'personal-reflection',
            label: 'Reflection',
            x: 38,
            y: -22,
            detail: 'Review, journaling, and the ability to notice drift early.',
            links: ['personal-rituals', 'personal-rest']
          },
          {
            id: 'personal-rest',
            label: 'Rest',
            x: -4,
            y: 42,
            detail: 'Recovery that restores range instead of just pausing motion.',
            links: ['personal-rituals', 'personal-reflection']
          }
        ]
      },
      {
        id: 'personal-orbit',
        label: 'Inner Orbit',
        x: 126,
        y: 72,
        radius: 106,
        description: 'Relationships, perspective, and the reasons to keep moving.',
        concepts: [
          {
            id: 'personal-friends',
            label: 'Friends',
            x: -34,
            y: -16,
            detail: 'Trusted people who add signal, friction, and accountability.',
            links: ['personal-perspective', 'personal-direction']
          },
          {
            id: 'personal-perspective',
            label: 'Perspective',
            x: 34,
            y: -12,
            detail: 'The distance needed to judge the work without collapsing into it.',
            links: ['personal-friends', 'personal-direction']
          },
          {
            id: 'personal-direction',
            label: 'Direction',
            x: 2,
            y: 40,
            detail: 'The current heading that makes the rest of the decisions easier.',
            links: ['personal-friends', 'personal-perspective']
          }
        ]
      }
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    x: 1420,
    y: 430,
    width: 610,
    height: 450,
    fill: 'rgba(86, 206, 177, 0.14)',
    glow: 'rgba(86, 206, 177, 0.4)',
    summary: 'The systems layer: automation, repeatability, and the machinery behind the visible output.',
    districts: [
      {
        id: 'tools-workbench',
        label: 'Workbench',
        x: -144,
        y: -68,
        radius: 124,
        description: 'The reliable core: structure, automation, and core tooling.',
        concepts: [
          {
            id: 'tools-systems',
            label: 'Systems',
            x: -44,
            y: -18,
            detail: 'Reusable structure that prevents each new project from starting at zero.',
            links: ['tools-automation', 'tools-tooling']
          },
          {
            id: 'tools-automation',
            label: 'Automation',
            x: 38,
            y: -22,
            detail: 'The parts that should run themselves so attention can move upstream.',
            links: ['tools-systems', 'tools-tooling']
          },
          {
            id: 'tools-tooling',
            label: 'Tooling',
            x: -4,
            y: 42,
            detail: 'The interfaces and scripts that make the system feel immediate.',
            links: ['tools-systems', 'tools-automation']
          }
        ]
      },
      {
        id: 'tools-prototype-yard',
        label: 'Prototype Yard',
        x: 148,
        y: 78,
        radius: 112,
        description: 'The exploratory edge: trying shapes before they harden into systems.',
        concepts: [
          {
            id: 'tools-prototypes',
            label: 'Prototypes',
            x: -34,
            y: -14,
            detail: 'Fast tests that reveal whether an idea has real geometry.',
            links: ['tools-experiments', 'tools-ops']
          },
          {
            id: 'tools-experiments',
            label: 'Experiments',
            x: 38,
            y: -18,
            detail: 'Temporary structures built to answer one hard question clearly.',
            links: ['tools-prototypes', 'tools-ops']
          },
          {
            id: 'tools-ops',
            label: 'Ops',
            x: 4,
            y: 40,
            detail: 'The handoff from concept to something repeatable and shippable.',
            links: ['tools-prototypes', 'tools-experiments']
          }
        ]
      }
    ]
  },
  {
    id: 'scraps',
    label: 'Scraps',
    x: 980,
    y: 1060,
    width: 520,
    height: 410,
    fill: 'rgba(216, 158, 77, 0.15)',
    glow: 'rgba(216, 158, 77, 0.38)',
    summary: 'Loose capture and unresolved fragments that later feed the finished work.',
    districts: [
      {
        id: 'scraps-capture-field',
        label: 'Capture Field',
        x: -112,
        y: -52,
        radius: 108,
        description: 'Raw material before it knows where it belongs.',
        concepts: [
          {
            id: 'scraps-fragments',
            label: 'Fragments',
            x: -42,
            y: -18,
            detail: 'Loose ideas that would be lost without fast capture.',
            links: ['scraps-clippings', 'scraps-prompts']
          },
          {
            id: 'scraps-clippings',
            label: 'Clippings',
            x: 38,
            y: -20,
            detail: 'Borrowed lines, references, and found textures.',
            links: ['scraps-fragments', 'scraps-prompts']
          },
          {
            id: 'scraps-prompts',
            label: 'Prompts',
            x: -2,
            y: 40,
            detail: 'Triggers that can reopen a thought later without rebuilding it.',
            links: ['scraps-fragments', 'scraps-clippings']
          }
        ]
      },
      {
        id: 'scraps-remix-loop',
        label: 'Remix Loop',
        x: 126,
        y: 78,
        radius: 102,
        description: 'Where leftovers become seeds for a new direction.',
        concepts: [
          {
            id: 'scraps-remix',
            label: 'Remix',
            x: -34,
            y: -16,
            detail: 'Recombining old parts until a new shape appears.',
            links: ['scraps-seeds', 'scraps-reframes']
          },
          {
            id: 'scraps-seeds',
            label: 'Seeds',
            x: 34,
            y: -14,
            detail: 'Small kernels that can later anchor a larger structure.',
            links: ['scraps-remix', 'scraps-reframes']
          },
          {
            id: 'scraps-reframes',
            label: 'Reframes',
            x: 2,
            y: 38,
            detail: 'Changing context so a stalled idea can move again.',
            links: ['scraps-remix', 'scraps-seeds']
          }
        ]
      }
    ]
  },
  {
    id: 'newark',
    label: 'Newark',
    x: 430,
    y: 1490,
    width: 520,
    height: 430,
    fill: 'rgba(201, 121, 77, 0.15)',
    glow: 'rgba(201, 121, 77, 0.38)',
    summary: 'Place memory: neighborhood rhythm, observation, and the grounded physical texture of the work.',
    districts: [
      {
        id: 'newark-street-grid',
        label: 'Street Grid',
        x: -118,
        y: -46,
        radius: 112,
        description: 'Movement, repetition, and the sound of the city as structure.',
        concepts: [
          {
            id: 'newark-rhythm',
            label: 'Rhythm',
            x: -42,
            y: -16,
            detail: 'Street cadence and recurring motion that translate directly into timing.',
            links: ['newark-blocks', 'newark-transit']
          },
          {
            id: 'newark-blocks',
            label: 'Blocks',
            x: 36,
            y: -20,
            detail: 'Spatial memory: the way adjacent places influence each other.',
            links: ['newark-rhythm', 'newark-transit']
          },
          {
            id: 'newark-transit',
            label: 'Transit',
            x: -2,
            y: 42,
            detail: 'Routes, transfer points, and movement as a design constraint.',
            links: ['newark-rhythm', 'newark-blocks']
          }
        ]
      },
      {
        id: 'newark-memory-sites',
        label: 'Memory Sites',
        x: 118,
        y: 82,
        radius: 106,
        description: 'Corners, history, and the observations attached to them.',
        concepts: [
          {
            id: 'newark-corners',
            label: 'Corners',
            x: -34,
            y: -14,
            detail: 'Specific places that keep returning as anchors.',
            links: ['newark-history', 'newark-observation']
          },
          {
            id: 'newark-history',
            label: 'History',
            x: 34,
            y: -16,
            detail: 'Layered memory that keeps the present from feeling generic.',
            links: ['newark-corners', 'newark-observation']
          },
          {
            id: 'newark-observation',
            label: 'Observation',
            x: 4,
            y: 38,
            detail: 'The habit of noticing detail before trying to interpret it.',
            links: ['newark-corners', 'newark-history']
          }
        ]
      }
    ]
  },
  {
    id: 'music',
    label: 'Music',
    x: 1680,
    y: 1320,
    width: 650,
    height: 500,
    fill: 'rgba(233, 119, 96, 0.14)',
    glow: 'rgba(233, 119, 96, 0.38)',
    summary: 'Sound design, arrangement, and the sonic backbone that keeps expanding into other mediums.',
    districts: [
      {
        id: 'music-sound-lab',
        label: 'Sound Lab',
        x: -146,
        y: -68,
        radius: 126,
        description: 'The material layer: samples, texture, and tone.',
        concepts: [
          {
            id: 'music-samples',
            label: 'Samples',
            x: -42,
            y: -16,
            detail: 'Captured sound fragments that can be reassembled into meaning.',
            links: ['music-texture', 'music-tone']
          },
          {
            id: 'music-texture',
            label: 'Texture',
            x: 38,
            y: -20,
            detail: 'Density, grain, and the tactile feel inside the sound.',
            links: ['music-samples', 'music-tone']
          },
          {
            id: 'music-tone',
            label: 'Tone',
            x: -2,
            y: 42,
            detail: 'The emotional temperature that determines what the piece can hold.',
            links: ['music-samples', 'music-texture']
          }
        ]
      },
      {
        id: 'music-arrangement-bay',
        label: 'Arrangement Bay',
        x: 154,
        y: 82,
        radius: 118,
        description: 'Structure, sequencing, and the version that is ready to be lived with.',
        concepts: [
          {
            id: 'music-arrangement',
            label: 'Arrangement',
            x: -36,
            y: -14,
            detail: 'The long-form ordering that decides what arrives and when.',
            links: ['music-sets', 'music-hooks']
          },
          {
            id: 'music-sets',
            label: 'Sets',
            x: 36,
            y: -16,
            detail: 'The practical shape of the music in a lived sequence.',
            links: ['music-arrangement', 'music-hooks']
          },
          {
            id: 'music-hooks',
            label: 'Hooks',
            x: 4,
            y: 40,
            detail: 'The recurring elements that make the piece memorable on contact.',
            links: ['music-arrangement', 'music-sets']
          }
        ]
      }
    ]
  },
  {
    id: 'writing',
    label: 'Writing',
    x: 2380,
    y: 920,
    width: 620,
    height: 480,
    fill: 'rgba(214, 188, 88, 0.14)',
    glow: 'rgba(214, 188, 88, 0.36)',
    summary: 'Notes, essays, and narrative architecture that turns the internal map into language.',
    districts: [
      {
        id: 'writing-note-workshop',
        label: 'Note Workshop',
        x: -138,
        y: -62,
        radius: 122,
        description: 'The drafting zone: notes, essays, and hard structure.',
        concepts: [
          {
            id: 'writing-notes',
            label: 'Notes',
            x: -42,
            y: -18,
            detail: 'Fast writing that preserves shape before polish interferes.',
            links: ['writing-essays', 'writing-structure']
          },
          {
            id: 'writing-essays',
            label: 'Essays',
            x: 38,
            y: -22,
            detail: 'Longer thought that can carry multiple threads at once.',
            links: ['writing-notes', 'writing-structure']
          },
          {
            id: 'writing-structure',
            label: 'Structure',
            x: -4,
            y: 42,
            detail: 'The frame that keeps meaning from collapsing under its own weight.',
            links: ['writing-notes', 'writing-essays']
          }
        ]
      },
      {
        id: 'writing-story-thread',
        label: 'Story Thread',
        x: 148,
        y: 82,
        radius: 114,
        description: 'Voice, sequence, and the narrative pressure that keeps the text moving.',
        concepts: [
          {
            id: 'writing-narrative',
            label: 'Narrative',
            x: -34,
            y: -16,
            detail: 'Movement across time so the reader feels progression, not just content.',
            links: ['writing-voice', 'writing-revision']
          },
          {
            id: 'writing-voice',
            label: 'Voice',
            x: 34,
            y: -14,
            detail: 'The tone that makes the text feel like it came from a specific person.',
            links: ['writing-narrative', 'writing-revision']
          },
          {
            id: 'writing-revision',
            label: 'Revision',
            x: 2,
            y: 38,
            detail: 'The sculpting pass where intent becomes obvious to someone else.',
            links: ['writing-narrative', 'writing-voice']
          }
        ]
      }
    ]
  },
  {
    id: 'visual',
    label: 'Visual',
    x: 2360,
    y: 1560,
    width: 620,
    height: 470,
    fill: 'rgba(86, 191, 215, 0.14)',
    glow: 'rgba(86, 191, 215, 0.38)',
    summary: 'Frames, color, composition, and the symbolic layer of the work.',
    districts: [
      {
        id: 'visual-image-studio',
        label: 'Image Studio',
        x: -140,
        y: -68,
        radius: 122,
        description: 'Visual language at the frame level.',
        concepts: [
          {
            id: 'visual-frames',
            label: 'Frames',
            x: -42,
            y: -16,
            detail: 'Choosing where the boundary sits so the image can speak clearly.',
            links: ['visual-color', 'visual-compositions']
          },
          {
            id: 'visual-color',
            label: 'Color',
            x: 38,
            y: -20,
            detail: 'Temperature, contrast, and the emotional register of the image.',
            links: ['visual-frames', 'visual-compositions']
          },
          {
            id: 'visual-compositions',
            label: 'Compositions',
            x: -4,
            y: 42,
            detail: 'The internal balance that tells the eye where to move next.',
            links: ['visual-frames', 'visual-color']
          }
        ]
      },
      {
        id: 'visual-world-build',
        label: 'World Build',
        x: 152,
        y: 84,
        radius: 116,
        description: 'Layouts, symbols, and the environment around the image.',
        concepts: [
          {
            id: 'visual-symbols',
            label: 'Symbols',
            x: -34,
            y: -16,
            detail: 'Repeated visual objects that carry meaning across works.',
            links: ['visual-layouts', 'visual-mood']
          },
          {
            id: 'visual-layouts',
            label: 'Layouts',
            x: 34,
            y: -14,
            detail: 'Spatial organization that makes complexity readable.',
            links: ['visual-symbols', 'visual-mood']
          },
          {
            id: 'visual-mood',
            label: 'Mood',
            x: 4,
            y: 38,
            detail: 'The atmospheric signal that people feel before they parse detail.',
            links: ['visual-symbols', 'visual-layouts']
          }
        ]
      }
    ]
  },
  {
    id: 'video',
    label: 'Video',
    x: 2860,
    y: 1660,
    width: 500,
    height: 420,
    fill: 'rgba(226, 113, 138, 0.14)',
    glow: 'rgba(226, 113, 138, 0.38)',
    summary: 'Editing, pacing, and the published form where multiple strands converge into one timeline.',
    districts: [
      {
        id: 'video-motion-bench',
        label: 'Motion Bench',
        x: -112,
        y: -56,
        radius: 106,
        description: 'Editing and timing at the frame-to-frame level.',
        concepts: [
          {
            id: 'video-edits',
            label: 'Edits',
            x: -38,
            y: -14,
            detail: 'The cuts that decide how momentum is felt, not just seen.',
            links: ['video-timing', 'video-sequence']
          },
          {
            id: 'video-timing',
            label: 'Timing',
            x: 34,
            y: -18,
            detail: 'The pause length and impact spacing that determine emotional weight.',
            links: ['video-edits', 'video-sequence']
          },
          {
            id: 'video-sequence',
            label: 'Sequence',
            x: 0,
            y: 40,
            detail: 'How individual scenes chain together into a coherent arc.',
            links: ['video-edits', 'video-timing']
          }
        ]
      },
      {
        id: 'video-release-lane',
        label: 'Release Lane',
        x: 106,
        y: 84,
        radius: 100,
        description: 'Storyboarding, release, and the loop back from publication.',
        concepts: [
          {
            id: 'video-storyboards',
            label: 'Storyboards',
            x: -34,
            y: -14,
            detail: 'Previsual structure that keeps the edit from wandering.',
            links: ['video-publishing', 'video-loops']
          },
          {
            id: 'video-publishing',
            label: 'Publishing',
            x: 34,
            y: -16,
            detail: 'The packaging, framing, and release shape that determines reception.',
            links: ['video-storyboards', 'video-loops']
          },
          {
            id: 'video-loops',
            label: 'Loops',
            x: 2,
            y: 38,
            detail: 'Feedback from the finished work that changes the next iteration.',
            links: ['video-storyboards', 'video-publishing']
          }
        ]
      }
    ]
  }
];

export const MAP_ROUTES: MapRoute[] = [
  { source: 'personal', target: 'tools', tone: 'bridge', weight: 0.62 },
  { source: 'personal', target: 'scraps', tone: 'signal', weight: 0.52 },
  { source: 'personal', target: 'newark', tone: 'root', weight: 0.58 },
  { source: 'tools', target: 'music', tone: 'bridge', weight: 0.7 },
  { source: 'tools', target: 'writing', tone: 'bridge', weight: 0.64 },
  { source: 'tools', target: 'visual', tone: 'bridge', weight: 0.6 },
  { source: 'scraps', target: 'music', tone: 'signal', weight: 0.66 },
  { source: 'scraps', target: 'writing', tone: 'signal', weight: 0.68 },
  { source: 'newark', target: 'music', tone: 'root', weight: 0.72 },
  { source: 'newark', target: 'writing', tone: 'root', weight: 0.66 },
  { source: 'music', target: 'visual', tone: 'signal', weight: 0.58 },
  { source: 'music', target: 'video', tone: 'bridge', weight: 0.8 },
  { source: 'writing', target: 'visual', tone: 'signal', weight: 0.56 },
  { source: 'writing', target: 'video', tone: 'bridge', weight: 0.74 },
  { source: 'visual', target: 'video', tone: 'bridge', weight: 0.7 }
];

export const MAP_CONCEPT_BRIDGES: MapConceptBridge[] = [
  { source: 'tools-prototypes', target: 'music-sets', tone: 'bridge' },
  { source: 'tools-automation', target: 'video-publishing', tone: 'bridge' },
  { source: 'tools-tooling', target: 'visual-compositions', tone: 'bridge' },
  { source: 'scraps-fragments', target: 'writing-notes', tone: 'signal' },
  { source: 'scraps-reframes', target: 'visual-symbols', tone: 'signal' },
  { source: 'newark-rhythm', target: 'music-samples', tone: 'root' },
  { source: 'newark-observation', target: 'writing-notes', tone: 'root' },
  { source: 'music-arrangement', target: 'video-edits', tone: 'bridge' },
  { source: 'writing-structure', target: 'video-storyboards', tone: 'bridge' },
  { source: 'visual-frames', target: 'video-storyboards', tone: 'bridge' },
  { source: 'writing-voice', target: 'music-hooks', tone: 'signal' }
];
