export interface AgiManualQuote {
  id: string;
  source_name: string;
  author_handle: string;
  date: string;
  title: string;
  summary: string;
  url: string;
  tags: string[];
}

export const AGI_MANUAL_QUOTES: AgiManualQuote[] = [
  {
    id: 'x-karpathy-llm-os-2023-11-17',
    source_name: 'Notable Quotes',
    author_handle: 'karpathy',
    date: '2023-11-17T00:00:00.000Z',
    title: 'The LLM OS framing',
    summary: 'Curated citation about LLMs acting as an operating layer for intelligence workflows.',
    url: 'https://x.com/karpathy/status/1725666301210656979',
    tags: ['llm', 'systems', 'research']
  },
  {
    id: 'x-sama-agi-safety-2024-03-01',
    source_name: 'Notable Quotes',
    author_handle: 'sama',
    date: '2024-03-01T00:00:00.000Z',
    title: 'AGI deployment and safety sequencing',
    summary: 'Curated citation on balancing deployment velocity with safety and evaluation constraints.',
    url: 'https://x.com/sama/status/1763572059377617316',
    tags: ['agi', 'safety', 'policy']
  },
  {
    id: 'x-demis-research-tempo-2024-07-10',
    source_name: 'Notable Quotes',
    author_handle: 'DemisHassabis',
    date: '2024-07-10T00:00:00.000Z',
    title: 'Research tempo and capability frontiers',
    summary: 'Curated citation on rapid capability progress and the need for stronger evaluations.',
    url: 'https://x.com/DemisHassabis/status/1811087646072498598',
    tags: ['agi', 'capabilities', 'evaluation']
  }
];
