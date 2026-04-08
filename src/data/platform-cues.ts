export type PlatformFamily =
  | 'editorial'
  | 'visual'
  | 'audio'
  | 'video'
  | 'broadcast'
  | 'professional'
  | 'community'
  | 'live';

export type PlatformCueKey =
  | 'substack'
  | 'instagram'
  | 'spotify'
  | 'youtube'
  | 'x'
  | 'tiktok'
  | 'linkedin'
  | 'soundcloud'
  | 'discord'
  | 'twitch';

export interface PlatformCuePalette {
  key: PlatformCueKey;
  label: string;
  family: PlatformFamily;
  vars: Record<string, string>;
}

const cue = (
  key: PlatformCueKey,
  label: string,
  family: PlatformFamily,
  vars: Record<string, string>,
): PlatformCuePalette => ({
  key,
  label,
  family,
  vars,
});

export const PLATFORM_CUES: Record<PlatformCueKey, PlatformCuePalette> = {
  substack: cue('substack', 'Substack', 'editorial', {
    '--tone-accent': '#bc7d35',
    '--tone-accent-bright': '#d8994b',
    '--tone-accent-glow': '#f0c88b',
    '--tone-sky': '#6d5c78',
    '--tone-sky-bright': '#9b88aa',
    '--accent-rgb': '188 125 53',
    '--cursor-rgb': '127 100 80',
    '--topic-warm-alpha': '0.092',
    '--topic-cool-alpha': '0.044',
    '--topic-shadow-alpha': '0.11',
    '--topic-highlight-alpha': '0.028',
    '--topic-depth-alpha': '0.1',
    '--topic-body-lift-alpha': '0.022',
    '--platform-ui-radius': '0.58rem',
    '--platform-card-radius': '0.86rem',
    '--platform-modal-radius': '22px',
    '--platform-chip-radius': '999px',
    '--platform-ui-letter-spacing': '0.03em',
  }),
  instagram: cue('instagram', 'Instagram', 'visual', {
    '--tone-accent': '#ca6e86',
    '--tone-accent-bright': '#e28ca0',
    '--tone-accent-glow': '#f3c5d0',
    '--tone-sky': '#9a6d92',
    '--tone-sky-bright': '#c28bb0',
    '--accent-rgb': '202 110 134',
    '--cursor-rgb': '146 105 138',
    '--topic-warm-alpha': '0.078',
    '--topic-cool-alpha': '0.052',
    '--topic-shadow-alpha': '0.1',
    '--topic-highlight-alpha': '0.034',
    '--topic-depth-alpha': '0.09',
    '--topic-body-lift-alpha': '0.018',
    '--platform-ui-radius': '0.95rem',
    '--platform-card-radius': '1rem',
    '--platform-modal-radius': '26px',
    '--platform-chip-radius': '999px',
    '--platform-ui-letter-spacing': '0.025em',
  }),
  spotify: cue('spotify', 'Spotify', 'audio', {
    '--tone-accent': '#1db954',
    '--tone-accent-bright': '#44d27b',
    '--tone-accent-glow': '#c0f5cf',
    '--tone-sky': '#2a6b4c',
    '--tone-sky-bright': '#5da97f',
    '--accent-rgb': '29 185 84',
    '--cursor-rgb': '43 104 75',
    '--topic-warm-alpha': '0.072',
    '--topic-cool-alpha': '0.058',
    '--topic-shadow-alpha': '0.15',
    '--topic-highlight-alpha': '0.024',
    '--topic-depth-alpha': '0.14',
    '--topic-body-lift-alpha': '0.038',
    '--platform-ui-radius': '999px',
    '--platform-card-radius': '0.98rem',
    '--platform-modal-radius': '24px',
    '--platform-chip-radius': '999px',
    '--platform-ui-letter-spacing': '0.075em',
  }),
  youtube: cue('youtube', 'YouTube', 'video', {
    '--tone-accent': '#ff4f4d',
    '--tone-accent-bright': '#ff766f',
    '--tone-accent-glow': '#ffc2bc',
    '--tone-sky': '#8e4f56',
    '--tone-sky-bright': '#c07b83',
    '--accent-rgb': '255 79 77',
    '--cursor-rgb': '140 73 81',
    '--topic-warm-alpha': '0.098',
    '--topic-cool-alpha': '0.05',
    '--topic-shadow-alpha': '0.16',
    '--topic-highlight-alpha': '0.034',
    '--topic-depth-alpha': '0.16',
    '--topic-body-lift-alpha': '0.03',
    '--platform-ui-radius': '0.5rem',
    '--platform-card-radius': '0.78rem',
    '--platform-modal-radius': '20px',
    '--platform-chip-radius': '0.75rem',
    '--platform-ui-letter-spacing': '0.05em',
  }),
  x: cue('x', 'X', 'broadcast', {
    '--tone-accent': '#e2e7ee',
    '--tone-accent-bright': '#f7f9fb',
    '--tone-accent-glow': '#ffffff',
    '--tone-sky': '#65717d',
    '--tone-sky-bright': '#8d98a3',
    '--accent-rgb': '226 231 238',
    '--cursor-rgb': '103 113 125',
    '--topic-warm-alpha': '0.028',
    '--topic-cool-alpha': '0.05',
    '--topic-shadow-alpha': '0.2',
    '--topic-highlight-alpha': '0.018',
    '--topic-depth-alpha': '0.18',
    '--topic-body-lift-alpha': '0.034',
    '--platform-ui-radius': '0.38rem',
    '--platform-card-radius': '0.7rem',
    '--platform-modal-radius': '18px',
    '--platform-chip-radius': '0.45rem',
    '--platform-ui-letter-spacing': '0.11em',
  }),
  tiktok: cue('tiktok', 'TikTok', 'video', {
    '--tone-accent': '#ff3c84',
    '--tone-accent-bright': '#ff6ea7',
    '--tone-accent-glow': '#ffd2e0',
    '--tone-sky': '#37d3d4',
    '--tone-sky-bright': '#82e7e2',
    '--accent-rgb': '255 60 132',
    '--cursor-rgb': '55 211 212',
    '--topic-warm-alpha': '0.09',
    '--topic-cool-alpha': '0.07',
    '--topic-shadow-alpha': '0.17',
    '--topic-highlight-alpha': '0.03',
    '--topic-depth-alpha': '0.16',
    '--topic-body-lift-alpha': '0.032',
    '--platform-ui-radius': '0.64rem',
    '--platform-card-radius': '0.92rem',
    '--platform-modal-radius': '24px',
    '--platform-chip-radius': '999px',
    '--platform-ui-letter-spacing': '0.065em',
  }),
  linkedin: cue('linkedin', 'LinkedIn', 'professional', {
    '--tone-accent': '#4b83f3',
    '--tone-accent-bright': '#79a8ff',
    '--tone-accent-glow': '#c5d9ff',
    '--tone-sky': '#5d819d',
    '--tone-sky-bright': '#89aac2',
    '--accent-rgb': '75 131 243',
    '--cursor-rgb': '93 129 157',
    '--topic-warm-alpha': '0.056',
    '--topic-cool-alpha': '0.046',
    '--topic-shadow-alpha': '0.09',
    '--topic-highlight-alpha': '0.028',
    '--topic-depth-alpha': '0.08',
    '--topic-body-lift-alpha': '0.02',
    '--platform-ui-radius': '0.6rem',
    '--platform-card-radius': '0.84rem',
    '--platform-modal-radius': '22px',
    '--platform-chip-radius': '999px',
    '--platform-ui-letter-spacing': '0.045em',
  }),
  soundcloud: cue('soundcloud', 'SoundCloud', 'audio', {
    '--tone-accent': '#ff6d2d',
    '--tone-accent-bright': '#ff8d58',
    '--tone-accent-glow': '#ffccaf',
    '--tone-sky': '#b96531',
    '--tone-sky-bright': '#df9460',
    '--accent-rgb': '255 109 45',
    '--cursor-rgb': '185 101 49',
    '--topic-warm-alpha': '0.088',
    '--topic-cool-alpha': '0.058',
    '--topic-shadow-alpha': '0.14',
    '--topic-highlight-alpha': '0.028',
    '--topic-depth-alpha': '0.13',
    '--topic-body-lift-alpha': '0.032',
    '--platform-ui-radius': '999px',
    '--platform-card-radius': '0.92rem',
    '--platform-modal-radius': '24px',
    '--platform-chip-radius': '999px',
    '--platform-ui-letter-spacing': '0.06em',
  }),
  discord: cue('discord', 'Discord', 'community', {
    '--tone-accent': '#8d79ff',
    '--tone-accent-bright': '#a999ff',
    '--tone-accent-glow': '#e0daff',
    '--tone-sky': '#5163bb',
    '--tone-sky-bright': '#7d8fe0',
    '--accent-rgb': '141 121 255',
    '--cursor-rgb': '81 99 187',
    '--topic-warm-alpha': '0.06',
    '--topic-cool-alpha': '0.07',
    '--topic-shadow-alpha': '0.13',
    '--topic-highlight-alpha': '0.03',
    '--topic-depth-alpha': '0.11',
    '--topic-body-lift-alpha': '0.024',
    '--platform-ui-radius': '0.78rem',
    '--platform-card-radius': '0.94rem',
    '--platform-modal-radius': '24px',
    '--platform-chip-radius': '999px',
    '--platform-ui-letter-spacing': '0.05em',
  }),
  twitch: cue('twitch', 'Twitch', 'live', {
    '--tone-accent': '#a971ff',
    '--tone-accent-bright': '#c09dff',
    '--tone-accent-glow': '#eadcff',
    '--tone-sky': '#634fb1',
    '--tone-sky-bright': '#8f7be0',
    '--accent-rgb': '169 113 255',
    '--cursor-rgb': '99 79 177',
    '--topic-warm-alpha': '0.07',
    '--topic-cool-alpha': '0.078',
    '--topic-shadow-alpha': '0.16',
    '--topic-highlight-alpha': '0.03',
    '--topic-depth-alpha': '0.14',
    '--topic-body-lift-alpha': '0.03',
    '--platform-ui-radius': '0.72rem',
    '--platform-card-radius': '0.96rem',
    '--platform-modal-radius': '24px',
    '--platform-chip-radius': '999px',
    '--platform-ui-letter-spacing': '0.06em',
  }),
};

const PLATFORM_ROUTE_RULES: Array<[RegExp, PlatformCueKey]> = [
  [/^\/archive\/writing(?:\/|$)/, 'substack'],
  [/^\/archive\/music(?:\/|$)/, 'spotify'],
  [/^\/archive\/video(?:\/|$)/, 'youtube'],
  [/^\/archive\/image(?:\/|$)/, 'instagram'],
  [/^\/archive\/note(?:\/|$)/, 'substack'],
  [/^\/archive\/proposal(?:\/|$)/, 'linkedin'],
  [/^\/archive(?:\/|$)/, 'instagram'],
  [/^\/writing(?:\/|$)/, 'substack'],
  [/^\/music(?:\/|$)/, 'spotify'],
  [/^\/theater(?:\/|$)/, 'youtube'],
  [/^\/newark(?:\/|$)/, 'instagram'],
  [/^\/focus(?:\/|$)/, 'substack'],
  [/^\/room(?:\/|$)/, 'instagram'],
  [/^\/ai-waves(?:\/|$)/, 'x'],
  [/^\/ai(?:\/|$)/, 'youtube'],
  [/^\/agi-elevator(?:\/|$)/, 'tiktok'],
  [/^\/agi(?:\/|$)/, 'x'],
  [/^\/market-model(?:\/|$)/, 'substack'],
  [/^\/post-labor-economics(?:\/|$)/, 'substack'],
  [/^\/human-suffering(?:\/|$)/, 'substack'],
  [/^\/environmental-weight-of-ai(?:\/|$)/, 'substack'],
  [/^\/meditation-tracker(?:\/|$)/, 'substack'],
  [/^\/story(?:\/|$)/, 'substack'],
  [/^\/studio(?:\/|$)/, 'youtube'],
  [/^\/survival-support(?:\/|$)/, 'youtube'],
  [/^\/genre-tree(?:\/|$)/, 'youtube'],
  [/^\/chess(?:\/|$)/, 'youtube'],
  [/^\/actor-tracker(?:\/|$)/, 'x'],
  [/^\/elsewhere(?:\/|$)/, 'youtube'],
  [/^\/map(?:\/|$)/, 'instagram'],
  [/^\/studio-notes(?:\/|$)/, 'substack'],
  [/^\/resources(?:\/|$)/, 'linkedin'],
  [/^\/about(?:\/|$)/, 'linkedin'],
  [/^\/press-kit(?:\/|$)/, 'linkedin'],
  [/^\/contact(?:\/|$)/, 'linkedin'],
  [/^\/collaborations(?:\/|$)/, 'linkedin'],
  [/^\/rejections(?:\/|$)/, 'linkedin'],
  [/^\/ai-accountability-pledge(?:\/|$)/, 'linkedin'],
  [/^\/link-hub(?:\/|$)/, 'instagram'],
  [/^\/social\/soundcloud(?:\/|$)/, 'soundcloud'],
  [/^\/social\/spotify(?:\/|$)/, 'spotify'],
  [/^\/social\/youtube(?:\/|$)/, 'youtube'],
  [/^\/social\/instagram(?:\/|$)/, 'instagram'],
  [/^\/social\/tiktok(?:\/|$)/, 'tiktok'],
  [/^\/social\/twitch(?:\/|$)/, 'twitch'],
  [/^\/social\/x(?:\/|$)/, 'x'],
  [/^\/social\/substack(?:\/|$)/, 'substack'],
  [/^\/social(?:\/|$)/, 'instagram'],
  [/^\/instagram(?:\/|$)/, 'instagram'],
  [/^\/discord(?:\/|$)/, 'discord'],
];

const normalizePathname = (pathname: string): string => pathname.replace(/\/+$/, '') || '/';

export const resolvePlatformCue = (pathname: string): PlatformCuePalette | null => {
  const normalized = normalizePathname(pathname);
  const match = PLATFORM_ROUTE_RULES.find(([pattern]) => pattern.test(normalized));
  if (!match) return null;
  return PLATFORM_CUES[match[1]];
};

export const buildPlatformStyle = (cue: PlatformCuePalette | null): string | undefined => {
  if (!cue) return undefined;
  const entries = [
    ...Object.entries(cue.vars),
    ['--chamber-accent', cue.vars['--tone-accent']],
    ['--chamber-accent-outline', cue.vars['--tone-accent-bright']],
    ['--chamber-accent-soft', cue.vars['--tone-accent-glow']],
    ['--chamber-accent-glow', cue.vars['--tone-accent-glow']],
  ] as Array<[string, string | undefined]>;

  return entries
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
};
