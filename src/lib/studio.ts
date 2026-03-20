export const STUDIO_LANES = [
  {
    slug: 'writing',
    label: 'Writing',
    mode: 'text',
    intro: 'A clean editor for essays, linked posts, and longer archive writing.',
    chooserLabel: 'Text-first editor',
    chooserDescription: 'Draft writing with room for body copy, optional source links, and quiet archive metadata.',
    defaultSource: 'manual',
    sourceOptions: ['manual', 'substack', 'linktree', 'private-notes']
  },
  {
    slug: 'note',
    label: 'Note',
    mode: 'text',
    intro: 'Fast, text-first capture for smaller observations, fragments, and archive notes.',
    chooserLabel: 'Quick note frame',
    chooserDescription: 'Keep the surface light: title, body, tags, and any link or related entry you want to pin to it.',
    defaultSource: 'private-notes',
    sourceOptions: ['private-notes', 'manual', 'linktree', 'substack']
  },
  {
    slug: 'proposal',
    label: 'Proposal',
    mode: 'proposal',
    intro: 'A proposal intake sheet that still writes a clean MDX entry into the archive.',
    chooserLabel: 'Proposal intake',
    chooserDescription: 'Capture institution, audience, ask, place, and proposal status without carrying the media fields.',
    defaultSource: 'manual',
    sourceOptions: ['manual', 'private-notes', 'linktree', 'substack']
  },
  {
    slug: 'music',
    label: 'Music',
    mode: 'media',
    intro: 'Upload-first or URL-first authoring for tracks, demos, embeds, and archive notes around them.',
    chooserLabel: 'Upload or URL',
    chooserDescription: 'Choose between a direct R2 upload or an external music URL, then fill the surrounding archive metadata.',
    defaultSource: 'local-media',
    sourceOptions: ['local-media', 'untitled', 'youtube', 'manual', 'linktree']
  },
  {
    slug: 'video',
    label: 'Video',
    mode: 'media',
    intro: 'Media-first authoring for videos, uploads, and external embeds.',
    chooserLabel: 'Upload or URL',
    chooserDescription: 'Start with the asset or external link, then wrap it in the metadata needed for the archive.',
    defaultSource: 'local-media',
    sourceOptions: ['local-media', 'youtube', 'manual', 'linktree']
  },
  {
    slug: 'image',
    label: 'Image',
    mode: 'media',
    intro: 'Upload-first entry creation for stills, posters, scans, and image-based archive objects.',
    chooserLabel: 'Upload or URL',
    chooserDescription: 'Send the file to R2 or point at an external image URL, then commit only the MDX entry to Git.',
    defaultSource: 'local-media',
    sourceOptions: ['local-media', 'manual', 'linktree']
  }
] as const;

export type StudioLane = (typeof STUDIO_LANES)[number]['slug'];
export type StudioLaneDefinition = (typeof STUDIO_LANES)[number];

export const STUDIO_STATUS_OPTIONS = [
  { value: 'in-progress', label: 'In progress' },
  { value: 'published', label: 'Published' },
  { value: 'featured', label: 'Featured' },
  { value: 'raw', label: 'Raw' },
  { value: 'withheld', label: 'Withheld' }
] as const;

export const STUDIO_SOURCE_LABELS: Record<string, string> = {
  manual: 'Manual',
  'private-notes': 'Private notes',
  substack: 'Substack',
  youtube: 'YouTube',
  untitled: 'Untitled',
  linktree: 'Linktree',
  'local-media': 'Local media'
};

export const getStudioLane = (lane: StudioLane) =>
  STUDIO_LANES.find((item) => item.slug === lane) ?? STUDIO_LANES[0];

export const isStudioLane = (value: string): value is StudioLane =>
  STUDIO_LANES.some((lane) => lane.slug === value);

export const isMediaLane = (lane: StudioLane) =>
  lane === 'music' || lane === 'video' || lane === 'image';
