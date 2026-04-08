type IonSlot = 'slotA' | 'slotB' | 'A' | 'B';

type IonConfig = {
  start?: string;
  end?: string;
  label?: string;
  color?: string;
};

type IonTemplate = (config?: IonConfig) => string;

type IonMapEntry = {
  slotA: string;
  slotB: string;
  configA?: IonConfig;
  configB?: IonConfig;
};

const repeat = (count: number, render: (index: number) => string) =>
  Array.from({ length: count }, (_, index) => render(index)).join('');

const templates: Record<string, IonTemplate> = {
  ph: (config = {}) => `
    <div class="ion-anim ion-anim-ph">
      <div class="ph-drops">
        <div class="ph-drop"></div>
        <div class="ph-drop"></div>
        <div class="ph-drop"></div>
      </div>
      <div class="ph-bar">
        <div class="ph-pointer" style="--ph-pos: ${config.start || '10%'}; --ph-hover: ${config.end || '90%'};"></div>
      </div>
      <span class="ph-label">${config.label || 'pH'}</span>
    </div>
  `,
  bubble: () => `
    <div class="ion-anim ion-anim-bubble">
      ${repeat(3, () => '<div class="bubble-rise"></div>')}
    </div>
  `,
  flame: (config = {}) => `
    <div class="ion-anim ion-anim-flame">
      <div class="flame-shape ${config.color || 'flame-orange'}"></div>
    </div>
  `,
  dissolve: () => `
    <div class="ion-anim ion-anim-dissolve">
      <div class="dissolve-cube"></div>
      ${repeat(8, () => '<div class="dissolve-particle"></div>')}
      ${repeat(2, () => '<div class="dissolve-ripple"></div>')}
    </div>
  `,
  orb: (config = {}) => `
    <div class="ion-anim ion-anim-orb">
      <div class="color-orb ${config.color || 'orb-blue'}"></div>
      ${repeat(3, () => '<div class="orb-wave"></div>')}
      ${repeat(3, () => '<div class="orb-bubble"></div>')}
    </div>
  `,
  pulse: (config = {}) => `
    <div class="ion-anim ion-anim-pulse">
      <div class="pulse-center ${config.color || 'pulse-red'}"></div>
      <div class="pulse-ring ${config.color || 'pulse-red'}"></div>
      <div class="pulse-ring ${config.color || 'pulse-red'}"></div>
      <div class="pulse-ring ${config.color || 'pulse-red'}"></div>
      ${repeat(4, () => `<div class="pulse-particle ${config.color || 'pulse-red'}"></div>`)}
      <div class="pulse-wave ${config.color || 'pulse-red'}"></div>
      <div class="pulse-wave ${config.color || 'pulse-red'}"></div>
    </div>
  `,
  battery: () => `
    <div class="ion-anim ion-anim-battery">
      <div class="battery-body">
        <div class="battery-fill"></div>
      </div>
    </div>
  `,
  crystal: () => `
    <div class="ion-anim ion-anim-crystal">
      ${repeat(4, () => '<div class="crystal-arm"></div>')}
      ${repeat(4, () => '<div class="crystal-arm-diag"></div>')}
      ${repeat(4, () => '<div class="crystal-sparkle"></div>')}
      <div class="crystal-core"></div>
    </div>
  `,
  electron: () => `
    <div class="ion-anim ion-anim-electron">
      <div class="electron-wire">
        <div class="electron-dot"></div>
        <div class="electron-dot"></div>
        <div class="electron-dot"></div>
      </div>
    </div>
  `,
  precipitate: (config = {}) => `
    <div class="ion-anim ion-anim-precipitate">
      <div class="ppt-cloud ${config.color || 'ppt-white'}"></div>
      ${repeat(5, () => `<div class="ppt-fall ${config.color || 'ppt-white'}"></div>`)}
      <div class="ppt-sediment ${config.color || 'ppt-white'}"></div>
    </div>
  `,
  plant: () => `
    <div class="ion-anim ion-anim-plant">
      <div class="plant-stem">
        <div class="plant-leaf"></div>
        <div class="plant-leaf"></div>
      </div>
    </div>
  `,
  bone: () => `
    <div class="ion-anim ion-anim-bone">
      ${repeat(5, () => '<div class="bone-particle"></div>')}
      <div class="bone-ring"></div>
      <div class="bone-ring"></div>
      <div class="bone-glow"></div>
      <div class="bone-shape"></div>
    </div>
  `,
  shield: () => `
    <div class="ion-anim ion-anim-shield">
      <div class="shield-ring"></div>
      <div class="shield-ring"></div>
      <div class="shield-ring"></div>
      ${repeat(4, () => '<div class="shield-spark"></div>')}
      <div class="shield-icon"></div>
    </div>
  `,
  water: () => `
    <div class="ion-anim ion-anim-water">
      <div class="water-drop"></div>
      <div class="water-ripple"></div>
      <div class="water-ripple"></div>
    </div>
  `,
  magnet: () => `
    <div class="ion-anim ion-anim-magnet">
      <div class="magnet-particle"></div>
      <div class="magnet-particle"></div>
      <div class="magnet-particle"></div>
      <div class="magnet-u"></div>
    </div>
  `,
  tooth: () => `
    <div class="ion-anim ion-anim-tooth">
      <div class="tooth-sparkle"></div>
      <div class="tooth-sparkle"></div>
      <div class="tooth-sparkle"></div>
      <div class="tooth-shield"></div>
      <div class="fluoride-particle"></div>
      <div class="fluoride-particle"></div>
      <div class="fluoride-particle"></div>
      <div class="fluoride-particle"></div>
      <div class="tooth-shape"></div>
    </div>
  `,
  sun: () => `
    <div class="ion-anim ion-anim-sun">
      <div class="sun-core">
        ${repeat(8, () => '<div class="sun-ray"></div>')}
      </div>
    </div>
  `,
  pill: () => `
    <div class="ion-anim ion-anim-pill">
      <div class="pill-shape">
        <div class="pill-half"></div>
        <div class="pill-half"></div>
      </div>
    </div>
  `,
  lightning: () => `
    <div class="ion-anim ion-anim-lightning">
      <div class="lightning-branch"></div>
      <div class="lightning-branch"></div>
      <div class="lightning-branch"></div>
      <div class="lightning-energy"></div>
      <div class="lightning-energy"></div>
      <div class="lightning-energy"></div>
      <div class="lightning-spark"></div>
      <div class="lightning-spark"></div>
      <div class="lightning-spark"></div>
      <div class="lightning-spark"></div>
      <div class="lightning-bolt"></div>
    </div>
  `,
  dna: () => `
    <div class="ion-anim ion-anim-dna">
      <div class="dna-strand">
        <div class="dna-node"></div>
        <div class="dna-node"></div>
        <div class="dna-node"></div>
        <div class="dna-node"></div>
        <div class="dna-node-r"></div>
        <div class="dna-node-r"></div>
        <div class="dna-node-r"></div>
        <div class="dna-node-r"></div>
        <div class="dna-link"></div>
        <div class="dna-link"></div>
        <div class="dna-link"></div>
        <div class="dna-link"></div>
      </div>
    </div>
  `,
  gas: (config = {}) => `
    <div class="ion-anim ion-anim-gas">
      <div class="gas-cloud ${config.color || 'gas-gray'}"></div>
      <div class="gas-cloud ${config.color || 'gas-gray'}"></div>
      <div class="gas-cloud ${config.color || 'gas-gray'}"></div>
    </div>
  `,
  bleach: () => `
    <div class="ion-anim ion-anim-bleach">
      <div class="bleach-paper"></div>
      <div class="bleach-wave"></div>
    </div>
  `,
};

const ionMap: Record<string, IonMapEntry> = {
  h_plus: {
    slotA: 'ph',
    slotB: 'bubble',
    configA: { start: '10%', end: '10%', label: 'Acidic' },
  },
  li_plus: {
    slotA: 'flame',
    slotB: 'battery',
    configA: { color: 'flame-red' },
  },
  na_plus: {
    slotA: 'flame',
    slotB: 'dissolve',
    configA: { color: 'flame-orange' },
  },
  k_plus: {
    slotA: 'flame',
    slotB: 'plant',
    configA: { color: 'flame-violet' },
  },
  ag_plus: {
    slotA: 'precipitate',
    slotB: 'sun',
    configA: { color: 'ppt-white' },
  },
  mg_2plus: {
    slotA: 'precipitate',
    slotB: 'plant',
    configA: { color: 'ppt-white' },
  },
  ca_2plus: {
    slotA: 'flame',
    slotB: 'bone',
    configA: { color: 'flame-orange' },
  },
  ba_2plus: {
    slotA: 'flame',
    slotB: 'shield',
    configA: { color: 'flame-green' },
  },
  zn_2plus: {
    slotA: 'precipitate',
    slotB: 'shield',
    configA: { color: 'ppt-white' },
  },
  cu_plus: {
    slotA: 'water',
    slotB: 'lightning',
  },
  cu_2plus: {
    slotA: 'orb',
    slotB: 'flame',
    configA: { color: 'orb-blue' },
    configB: { color: 'flame-green' },
  },
  fe_2plus: {
    slotA: 'dna',
    slotB: 'precipitate',
    configB: { color: 'ppt-green' },
  },
  fe_3plus: {
    slotA: 'orb',
    slotB: 'precipitate',
    configA: { color: 'orb-yellow' },
    configB: { color: 'ppt-brown' },
  },
  al_3plus: {
    slotA: 'shield',
    slotB: 'precipitate',
    configB: { color: 'ppt-white' },
  },
  pb_2plus: {
    slotA: 'precipitate',
    slotB: 'battery',
    configA: { color: 'ppt-yellow' },
  },
  nh4_plus: {
    slotA: 'gas',
    slotB: 'plant',
    configA: { color: 'gas-clear' },
  },
  h3o_plus: {
    slotA: 'ph',
    slotB: 'water',
    configA: { start: '10%', end: '10%', label: 'Acidic' },
  },
  oh_minus: {
    slotA: 'ph',
    slotB: 'water',
    configA: { start: '90%', end: '90%', label: 'Basic' },
  },
  cl_minus: {
    slotA: 'precipitate',
    slotB: 'bleach',
    configA: { color: 'ppt-white' },
  },
  br_minus: {
    slotA: 'precipitate',
    slotB: 'shield',
    configA: { color: 'ppt-cream' },
  },
  i_minus: {
    slotA: 'precipitate',
    slotB: 'pill',
    configA: { color: 'ppt-yellow' },
  },
  f_minus: {
    slotA: 'precipitate',
    slotB: 'tooth',
    configA: { color: 'ppt-white' },
  },
  n_3minus: {
    slotA: 'gas',
    slotB: 'sun',
    configA: { color: 'gas-clear' },
  },
  p_3minus: {
    slotA: 'pulse',
    slotB: 'electron',
    configA: { color: 'pulse-red' },
  },
  o_2minus: {
    slotA: 'ph',
    slotB: 'flame',
    configA: { start: '90%', end: '90%', label: 'Basic' },
    configB: { color: 'flame-blue' },
  },
  s_2minus: {
    slotA: 'precipitate',
    slotB: 'gas',
    configA: { color: 'ppt-black' },
    configB: { color: 'gas-yellow' },
  },
  no3_minus: {
    slotA: 'dissolve',
    slotB: 'lightning',
  },
  no2_minus: {
    slotA: 'pill',
    slotB: 'electron',
  },
  so4_2minus: {
    slotA: 'precipitate',
    slotB: 'battery',
    configA: { color: 'ppt-white' },
  },
  so3_2minus: {
    slotA: 'bleach',
    slotB: 'gas',
    configB: { color: 'gas-yellow' },
  },
  co3_2minus: {
    slotA: 'bubble',
    slotB: 'precipitate',
    configB: { color: 'ppt-white' },
  },
  hco3_minus: {
    slotA: 'ph',
    slotB: 'bubble',
    configA: { start: '50%', end: '50%', label: 'Buffer' },
  },
  po4_3minus: {
    slotA: 'precipitate',
    slotB: 'dna',
    configA: { color: 'ppt-yellow' },
  },
  ch3coo_minus: {
    slotA: 'ph',
    slotB: 'crystal',
    configA: { start: '30%', end: '30%', label: 'Weak Acid' },
  },
  mno4_minus: {
    slotA: 'orb',
    slotB: 'bleach',
    configA: { color: 'orb-purple' },
  },
  cro4_2minus: {
    slotA: 'orb',
    slotB: 'ph',
    configA: { color: 'orb-yellow' },
    configB: { start: '50%', end: '50%', label: 'pH Shift' },
  },
  cr2o7_2minus: {
    slotA: 'flame',
    slotB: 'orb',
    configA: { color: 'flame-orange' },
    configB: { color: 'orb-green' },
  },
  sio3_2minus: {
    slotA: 'crystal',
    slotB: 'dissolve',
  },
  clo_minus: {
    slotA: 'bleach',
    slotB: 'shield',
  },
  cn_minus: {
    slotA: 'pulse',
    slotB: 'dissolve',
    configA: { color: 'pulse-red' },
  },
  scn_minus: {
    slotA: 'orb',
    slotB: 'precipitate',
    configA: { color: 'orb-red' },
    configB: { color: 'ppt-brown' },
  },
  c2o4_2minus: {
    slotA: 'plant',
    slotB: 'crystal',
  },
  hso4_minus: {
    slotA: 'ph',
    slotB: 'dissolve',
    configA: { start: '20%', end: '20%', label: 'Acidic' },
  },
  h2po4_minus: {
    slotA: 'plant',
    slotB: 'dissolve',
  },
  hpo4_2minus: {
    slotA: 'bone',
    slotB: 'ph',
    configB: { start: '60%', end: '60%', label: 'Buffer' },
  },
  s2o3_2minus: {
    slotA: 'sun',
    slotB: 'crystal',
  },
  clo3_minus: {
    slotA: 'lightning',
    slotB: 'plant',
  },
  clo4_minus: {
    slotA: 'lightning',
    slotB: 'crystal',
  },
  bro3_minus: {
    slotA: 'pulse',
    slotB: 'sun',
    configA: { color: 'pulse-orange' },
  },
  io3_minus: {
    slotA: 'orb',
    slotB: 'tooth',
    configA: { color: 'orb-purple' },
  },
};

export const ION_GROUP_PRESETS = {
  'Core sections': 'h_plus',
  'Research & AI': 'fe_3plus',
  'Tools & trackers': 'cu_2plus',
  'Identity': 'h3o_plus',
} as const;

const badgeLabels: Record<string, string> = {
  h_plus: 'H+',
  li_plus: 'Li+',
  na_plus: 'Na+',
  k_plus: 'K+',
  ag_plus: 'Ag+',
  mg_2plus: 'Mg2+',
  ca_2plus: 'Ca2+',
  ba_2plus: 'Ba2+',
  zn_2plus: 'Zn2+',
  cu_plus: 'Cu+',
  cu_2plus: 'Cu2+',
  fe_2plus: 'Fe2+',
  fe_3plus: 'Fe3+',
  al_3plus: 'Al3+',
  pb_2plus: 'Pb2+',
  nh4_plus: 'NH4+',
  h3o_plus: 'H3O+',
  oh_minus: 'OH-',
  cl_minus: 'Cl-',
  br_minus: 'Br-',
  i_minus: 'I-',
  f_minus: 'F-',
  n_3minus: 'N3-',
  p_3minus: 'P3-',
  o_2minus: 'O2-',
  s_2minus: 'S2-',
  no3_minus: 'NO3-',
  no2_minus: 'NO2-',
  so4_2minus: 'SO4 2-',
  so3_2minus: 'SO3 2-',
  co3_2minus: 'CO3 2-',
  hco3_minus: 'HCO3-',
  po4_3minus: 'PO4 3-',
  ch3coo_minus: 'CH3COO-',
  mno4_minus: 'MnO4-',
  cro4_2minus: 'CrO4 2-',
  cr2o7_2minus: 'Cr2O7 2-',
  sio3_2minus: 'SiO3 2-',
  clo_minus: 'ClO-',
  cn_minus: 'CN-',
  scn_minus: 'SCN-',
  c2o4_2minus: 'C2O4 2-',
  hso4_minus: 'HSO4-',
  h2po4_minus: 'H2PO4-',
  hpo4_2minus: 'HPO4 2-',
  s2o3_2minus: 'S2O3 2-',
  clo3_minus: 'ClO3-',
  clo4_minus: 'ClO4-',
  bro3_minus: 'BrO3-',
  io3_minus: 'IO3-',
};

export const getIonPresetForGroup = (group: string) =>
  ION_GROUP_PRESETS[group as keyof typeof ION_GROUP_PRESETS] ?? 'h_plus';

export const getIonBadgeLabel = (ionId: string) =>
  badgeLabels[ionId] ?? ionId.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export const getIonAnimation = (ionId: string, slot: IonSlot) => {
  const mapping = ionMap[ionId];
  if (!mapping) {
    return slot === 'slotA' || slot === 'A'
      ? templates.orb({ color: 'orb-clear' })
      : templates.water({});
  }

  const isSlotA = slot === 'slotA' || slot === 'A';
  const animType = isSlotA ? mapping.slotA : mapping.slotB;
  const config = isSlotA ? mapping.configA || {} : mapping.configB || {};
  const template = templates[animType];

  if (template) return template(config);

  return templates.orb({ color: 'orb-clear' });
};

export const renderIonPreview = (target: HTMLElement, ionId: string) => {
  if (!target) return;

  const slots = Array.from(target.querySelectorAll<HTMLElement>('[data-ion-slot]'));
  if (!slots.length) {
    target.innerHTML = `
      <div class="ion-anim-stage__slot" data-ion-slot="slotA"></div>
      <div class="ion-anim-stage__slot" data-ion-slot="slotB"></div>
    `;
  }

  Array.from(target.querySelectorAll<HTMLElement>('[data-ion-slot]')).forEach((slotElement) => {
    const slot = slotElement.dataset.ionSlot === 'slotB' ? 'slotB' : 'slotA';
    slotElement.innerHTML = getIonAnimation(ionId, slot);
  });
};

export const injectAnimation = (target: HTMLElement, ionId: string, slot: IonSlot = 'slotA') => {
  if (!target) return;

  const slotHost = target.matches?.('[data-ion-slot]') ? target : target.querySelector<HTMLElement>('[data-ion-slot]');
  if (slotHost) {
    slotHost.innerHTML = getIonAnimation(ionId, slot);
    return;
  }

  target.innerHTML = getIonAnimation(ionId, slot);
};

const IonAnimations = {
  ...templates,
  ionMap,
  getAnimation: getIonAnimation,
  renderIonPreview,
  injectAnimation,
  getBadgeLabel: getIonBadgeLabel,
  getPresetForGroup: getIonPresetForGroup,
};

export default IonAnimations;
