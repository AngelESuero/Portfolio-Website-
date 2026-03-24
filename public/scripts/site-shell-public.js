(() => {
  const root = document.documentElement;
  const body = document.body;

  if (!(body instanceof HTMLBodyElement)) return;

  const HANDOFF_KEY = 'siteAccentHandoff';
  const TONE_HANDOFF_KEY = 'siteToneHandoff';
  const HANDOFF_MAX_AGE_MS = 2200;
  const DEFAULT_COLOR_KEY = 'blue';
  const DEFAULT_TONE_KEY = 'balance';
  const THEME_DAY_START_HOUR = 6;
  const THEME_NIGHT_START_HOUR = 18;
  const ATMOSPHERIC_BLUE = '#587a95';
  const READABLE_BLUE_DARK = '#7fa3bf';
  const READABLE_BLUE_LIGHT = '#4b6a82';
  const palette = {
    ochre: '#b97a2d',
    blue: ATMOSPHERIC_BLUE,
    red: '#a64a3b',
    white: '#ede3d1',
    black: '#171715'
  };
  const LEGACY_COLOR_ALIASES = {
    yellow: 'ochre',
    orange: 'ochre',
    violet: 'blue',
    indigo: 'blue'
  };
  const toneProfiles = {
    balance: { warm: 0.068, cool: 0.046, shadow: 0.25, highlight: 0.024, depth: 0.22, bodyLift: 0.048 },
    clarity: { warm: 0.062, cool: 0.052, shadow: 0.22, highlight: 0.028, depth: 0.2, bodyLift: 0.052 },
    devotion: { warm: 0.08, cool: 0.048, shadow: 0.27, highlight: 0.02, depth: 0.25, bodyLift: 0.044 },
    contemplation: { warm: 0.054, cool: 0.042, shadow: 0.31, highlight: 0.018, depth: 0.28, bodyLift: 0.034 },
    discernment: { warm: 0.052, cool: 0.046, shadow: 0.3, highlight: 0.019, depth: 0.26, bodyLift: 0.038 },
    vitality: { warm: 0.088, cool: 0.056, shadow: 0.24, highlight: 0.026, depth: 0.21, bodyLift: 0.052 },
    grounding: { warm: 0.075, cool: 0.038, shadow: 0.34, highlight: 0.016, depth: 0.3, bodyLift: 0.03 },
    compassion: { warm: 0.074, cool: 0.054, shadow: 0.22, highlight: 0.029, depth: 0.2, bodyLift: 0.054 },
    harmony: { warm: 0.07, cool: 0.05, shadow: 0.24, highlight: 0.027, depth: 0.22, bodyLift: 0.05 },
    seva: { warm: 0.072, cool: 0.042, shadow: 0.27, highlight: 0.022, depth: 0.24, bodyLift: 0.044 },
    intensity: { warm: 0.08, cool: 0.04, shadow: 0.29, highlight: 0.02, depth: 0.25, bodyLift: 0.04 },
    presence: { warm: 0.064, cool: 0.044, shadow: 0.24, highlight: 0.026, depth: 0.22, bodyLift: 0.048 }
  };
  const circadianStops = [
    {
      hour: 0,
      phase: 'night',
      hueShift: -16,
      saturation: 0.74,
      lightness: -0.09,
      warmMix: 0.18,
      coolMix: 0.05,
      warmScale: 0.9,
      coolScale: 0.48,
      shadowDelta: 0.06,
      highlightDelta: -0.003,
      depthDelta: 0.055,
      bodyLiftDelta: -0.008
    },
    {
      hour: 5.5,
      phase: 'predawn',
      hueShift: -10,
      saturation: 0.86,
      lightness: -0.04,
      warmMix: 0.19,
      coolMix: 0.08,
      warmScale: 1.02,
      coolScale: 0.7,
      shadowDelta: 0.025,
      highlightDelta: -0.001,
      depthDelta: 0.02,
      bodyLiftDelta: -0.004
    },
    {
      hour: 8,
      phase: 'morning',
      hueShift: -2,
      saturation: 0.95,
      lightness: 0,
      warmMix: 0.14,
      coolMix: 0.14,
      warmScale: 1,
      coolScale: 0.96,
      shadowDelta: 0,
      highlightDelta: 0.001,
      depthDelta: 0,
      bodyLiftDelta: 0.001
    },
    {
      hour: 12.5,
      phase: 'day',
      hueShift: 10,
      saturation: 1.08,
      lightness: 0.04,
      warmMix: 0.07,
      coolMix: 0.25,
      warmScale: 0.86,
      coolScale: 1.22,
      shadowDelta: -0.04,
      highlightDelta: 0.003,
      depthDelta: -0.038,
      bodyLiftDelta: 0.005
    },
    {
      hour: 17.5,
      phase: 'golden-hour',
      hueShift: -6,
      saturation: 0.98,
      lightness: 0.01,
      warmMix: 0.2,
      coolMix: 0.11,
      warmScale: 1.1,
      coolScale: 0.84,
      shadowDelta: -0.01,
      highlightDelta: 0.001,
      depthDelta: -0.006,
      bodyLiftDelta: 0.002
    },
    {
      hour: 19.5,
      phase: 'dusk',
      hueShift: -12,
      saturation: 0.9,
      lightness: -0.02,
      warmMix: 0.24,
      coolMix: 0.08,
      warmScale: 1.15,
      coolScale: 0.74,
      shadowDelta: 0.02,
      highlightDelta: -0.0005,
      depthDelta: 0.015,
      bodyLiftDelta: -0.002
    },
    {
      hour: 22,
      phase: 'late-night',
      hueShift: -16,
      saturation: 0.8,
      lightness: -0.07,
      warmMix: 0.18,
      coolMix: 0.06,
      warmScale: 0.95,
      coolScale: 0.52,
      shadowDelta: 0.05,
      highlightDelta: -0.0025,
      depthDelta: 0.04,
      bodyLiftDelta: -0.006
    },
    {
      hour: 24,
      phase: 'night',
      hueShift: -16,
      saturation: 0.74,
      lightness: -0.09,
      warmMix: 0.18,
      coolMix: 0.05,
      warmScale: 0.9,
      coolScale: 0.48,
      shadowDelta: 0.06,
      highlightDelta: -0.003,
      depthDelta: 0.055,
      bodyLiftDelta: -0.008
    }
  ];

  const sessionStorageRef = (() => {
    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  })();

  const safeGet = (storage, key) => {
    try {
      return typeof storage?.getItem === 'function' ? storage.getItem(key) : null;
    } catch {
      return null;
    }
  };

  const safeSet = (storage, key, value) => {
    try {
      storage?.setItem?.(key, value);
    } catch {}
  };

  const safeRemove = (storage, key) => {
    try {
      storage?.removeItem?.(key);
    } catch {}
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
  const lerp = (from, to, t) => from + (to - from) * t;
  const hasOwn = (key) => Object.prototype.hasOwnProperty.call(palette, key);
  const hasTone = (key) => Object.prototype.hasOwnProperty.call(toneProfiles, key);
  const prefersReducedMotion = () =>
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const normalizeColorKey = (value) => {
    const raw = String(value || '').trim().toLowerCase();
    const key = hasOwn(raw) ? raw : LEGACY_COLOR_ALIASES[raw] || raw;
    return hasOwn(key) ? key : DEFAULT_COLOR_KEY;
  };

  const normalizeToneKey = (value) => {
    const key = String(value || '').trim().toLowerCase();
    return hasTone(key) ? key : DEFAULT_TONE_KEY;
  };

  const isHexColor = (value) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(value || '').trim());

  const normalizeHex = (value) => {
    const hex = String(value || '').trim();
    if (!isHexColor(hex)) return palette[DEFAULT_COLOR_KEY];
    if (hex.length === 4) {
      return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toLowerCase();
    }
    return hex.toLowerCase();
  };

  const _hexToRgbCache = new Map();
  const hexToRgb = (hex) => {
    const normalized = normalizeHex(hex);
    if (_hexToRgbCache.has(normalized)) return _hexToRgbCache.get(normalized);
    const n = parseInt(normalized.slice(1), 16);
    const result = { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    _hexToRgbCache.set(normalized, result);
    return result;
  };

  const rgbToHex = (rgb) => {
    const to = (value) => Math.max(0, Math.min(255, Math.round(Number(value) || 0))).toString(16).padStart(2, '0');
    return `#${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}`;
  };

  const rgbToTuple = (rgb) => {
    const to = (value) => Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
    return `${to(rgb.r)} ${to(rgb.g)} ${to(rgb.b)}`;
  };

  const rgbToHsl = (rgb) => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;

    if (d === 0) {
      return { h: 0, s: 0, l };
    }

    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }

    return { h: h * 60, s, l };
  };

  const hslToRgb = (hsl) => {
    const h = ((Number(hsl.h) % 360) + 360) % 360;
    const s = Math.max(0, Math.min(1, Number(hsl.s) || 0));
    const l = Math.max(0, Math.min(1, Number(hsl.l) || 0));

    if (s === 0) {
      const value = Math.round(l * 255);
      return { r: value, g: value, b: value };
    }

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;

    if (hp >= 0 && hp < 1) {
      r1 = c;
      g1 = x;
    } else if (hp < 2) {
      r1 = x;
      g1 = c;
    } else if (hp < 3) {
      g1 = c;
      b1 = x;
    } else if (hp < 4) {
      g1 = x;
      b1 = c;
    } else if (hp < 5) {
      r1 = x;
      b1 = c;
    } else {
      r1 = c;
      b1 = x;
    }

    const m = l - c / 2;
    return {
      r: (r1 + m) * 255,
      g: (g1 + m) * 255,
      b: (b1 + m) * 255
    };
  };

  const mixHex = (from, to, ratio) => {
    const t = Math.max(0, Math.min(1, Number(ratio) || 0));
    const a = hexToRgb(from);
    const b = hexToRgb(to);
    return rgbToHex({
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t
    });
  };

  const interpolateHslShortest = (fromHex, toHex, ratio) => {
    const t = Math.max(0, Math.min(1, Number(ratio) || 0));
    const from = rgbToHsl(hexToRgb(fromHex));
    const to = rgbToHsl(hexToRgb(toHex));
    const deltaHue = ((to.h - from.h + 540) % 360) - 180;
    const hue = (from.h + deltaHue * t + 360) % 360;
    const sat = from.s + (to.s - from.s) * t;
    const light = from.l + (to.l - from.l) * t;
    return rgbToHex(hslToRgb({ h: hue, s: sat, l: light }));
  };

  const deriveCompanion = (hex) => {
    const hsl = rgbToHsl(hexToRgb(hex));
    const shifted = rgbToHex(
      hslToRgb({
        h: (hsl.h + 92) % 360,
        s: clamp(hsl.s * 0.42, 0.12, 0.34),
        l: clamp(hsl.l * 0.9 + 0.02, 0.32, 0.58)
      })
    );
    return mixHex(shifted, '#7b705c', 0.24);
  };

  const toHexFromInput = (input) => {
    const raw = String(input || '').trim();
    if (isHexColor(raw)) return normalizeHex(raw);
    return palette[normalizeColorKey(raw)];
  };

  const getCircadianProfile = (date = new Date()) => {
    const decimalHour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    const fallback = circadianStops[0];

    for (let i = 0; i < circadianStops.length - 1; i += 1) {
      const from = circadianStops[i];
      const to = circadianStops[i + 1];

      if (decimalHour < from.hour || decimalHour > to.hour) continue;

      const span = Math.max(0.0001, to.hour - from.hour);
      const t = clamp((decimalHour - from.hour) / span, 0, 1);
      return {
        phase: t < 0.5 ? from.phase : to.phase,
        hueShift: lerp(from.hueShift, to.hueShift, t),
        saturation: lerp(from.saturation, to.saturation, t),
        lightness: lerp(from.lightness, to.lightness, t),
        warmMix: lerp(from.warmMix, to.warmMix, t),
        coolMix: lerp(from.coolMix, to.coolMix, t),
        warmScale: lerp(from.warmScale, to.warmScale, t),
        coolScale: lerp(from.coolScale, to.coolScale, t),
        shadowDelta: lerp(from.shadowDelta, to.shadowDelta, t),
        highlightDelta: lerp(from.highlightDelta, to.highlightDelta, t),
        depthDelta: lerp(from.depthDelta, to.depthDelta, t),
        bodyLiftDelta: lerp(from.bodyLiftDelta, to.bodyLiftDelta, t)
      };
    }

    return fallback;
  };

  const applyCircadianTone = (hex, profile, weights = {}) => {
    const source = rgbToHsl(hexToRgb(hex));
    const hueWeight = clamp(weights.hueWeight ?? 1, 0, 1.25);
    const saturationWeight = clamp(weights.saturationWeight ?? 1, 0, 1.25);
    const lightnessWeight = clamp(weights.lightnessWeight ?? 1, 0, 1.25);
    const warmWeight = clamp(weights.warmWeight ?? 1, 0, 1.25);
    const coolWeight = clamp(weights.coolWeight ?? 1, 0, 1.25);
    const shifted = rgbToHex(
      hslToRgb({
        h: source.h + profile.hueShift * hueWeight,
        s: clamp(source.s * (1 + (profile.saturation - 1) * saturationWeight), 0.06, 0.72),
        l: clamp(source.l + profile.lightness * lightnessWeight, 0.12, 0.82)
      })
    );
    const warmed = mixHex(shifted, '#9f7d5b', clamp(profile.warmMix * warmWeight, 0, 0.28));
    return mixHex(warmed, '#6d827f', clamp(profile.coolMix * coolWeight, 0, 0.22));
  };

  const setDynamicCssVar = (name, value) => {
    root.style.setProperty(name, value);
    body.style.setProperty(name, value);
  };

  const getClockTheme = (date = new Date()) => {
    const decimalHour = date.getHours() + date.getMinutes() / 60;
    return decimalHour >= THEME_DAY_START_HOUR && decimalHour < THEME_NIGHT_START_HOUR ? 'light' : 'dark';
  };

  const applyTheme = (nextTheme = getClockTheme()) => {
    const theme = nextTheme === 'light' ? 'light' : 'dark';
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.style.colorScheme = theme;
    root.dataset.themeMode = theme;
    root.dataset.themeSource = 'clock';
    root.dataset.themePeriod = theme === 'light' ? 'day' : 'night';
    return theme;
  };

  let currentBase = palette[DEFAULT_COLOR_KEY];
  let currentTone = DEFAULT_TONE_KEY;
  let currentCircadian = getCircadianProfile();
  let accentFrame = null;
  let themeClockTimer = null;
  let isNavigating = false;

  const derivePalette = (baseHex) => {
    const circadian = getCircadianProfile();
    const accent = applyCircadianTone(baseHex, circadian);
    const companion = deriveCompanion(accent);
    const sky = applyCircadianTone(ATMOSPHERIC_BLUE, circadian, {
      hueWeight: 0.18,
      saturationWeight: 0.52,
      lightnessWeight: 0.42,
      warmWeight: 0.52,
      coolWeight: 0.44
    });
    const readableSky =
      root.classList.contains('light') || root.dataset.themeMode === 'light' ? READABLE_BLUE_LIGHT : READABLE_BLUE_DARK;

    return {
      accent,
      cursor: companion,
      toneAccent: accent,
      toneAccentBright: mixHex(accent, '#ffffff', 0.1),
      toneAccentGlow: mixHex(accent, '#ffffff', 0.16),
      toneSky: mixHex(sky, '#ffffff', 0.12),
      toneSkyBright: readableSky,
      circadian
    };
  };

  const applyAccent = (baseHex) => {
    currentBase = normalizeHex(baseHex);
    const next = derivePalette(currentBase);
    currentCircadian = next.circadian;
    root.dataset.circadianPhase = currentCircadian.phase;
    body.dataset.circadianPhase = currentCircadian.phase;
    setDynamicCssVar('--accent', next.accent);
    setDynamicCssVar('--cursor', next.cursor);
    setDynamicCssVar('--tone-accent', next.toneAccent);
    setDynamicCssVar('--tone-accent-bright', next.toneAccentBright);
    setDynamicCssVar('--tone-accent-glow', next.toneAccentGlow);
    setDynamicCssVar('--tone-sky', next.toneSky);
    setDynamicCssVar('--tone-sky-bright', next.toneSkyBright);
    setDynamicCssVar('--accent-1', next.toneAccent);
    setDynamicCssVar('--accent-2', next.toneSky);
    setDynamicCssVar('--accent2', next.toneSky);
    setDynamicCssVar('--accent-rgb', rgbToTuple(hexToRgb(next.accent)));
    setDynamicCssVar('--cursor-rgb', rgbToTuple(hexToRgb(next.cursor)));
    setDynamicCssVar(
      '--street-warm',
      `rgb(${rgbToTuple(hexToRgb(next.toneAccent))} / ${clamp(0.078 * currentCircadian.warmScale, 0.024, 0.12)})`
    );
    setDynamicCssVar(
      '--street-cool',
      `rgb(${rgbToTuple(hexToRgb(next.toneSky))} / ${clamp(0.078 * currentCircadian.coolScale, 0.022, 0.12)})`
    );
  };

  const applyTopicTone = (toneInput) => {
    const key = normalizeToneKey(toneInput);
    const profile = toneProfiles[key];
    const circadian = currentCircadian || getCircadianProfile();
    currentTone = key;
    root.dataset.topicTone = key;
    body.dataset.topicTone = key;
    setDynamicCssVar('--topic-warm-alpha', String(clamp(profile.warm * circadian.warmScale, 0.02, 0.12)));
    setDynamicCssVar('--topic-cool-alpha', String(clamp(profile.cool * circadian.coolScale, 0.02, 0.12)));
    setDynamicCssVar('--topic-shadow-alpha', String(clamp(profile.shadow + circadian.shadowDelta, 0.24, 0.48)));
    setDynamicCssVar(
      '--topic-highlight-alpha',
      String(clamp(profile.highlight + circadian.highlightDelta, 0.006, 0.032))
    );
    setDynamicCssVar('--topic-depth-alpha', String(clamp(profile.depth + circadian.depthDelta, 0.2, 0.45)));
    setDynamicCssVar(
      '--topic-body-lift-alpha',
      String(clamp(profile.bodyLift + circadian.bodyLiftDelta, 0.012, 0.054))
    );
  };

  const refreshThemeSensitiveState = () => {
    applyAccent(currentBase);
    applyTopicTone(currentTone);
  };

  const stopAccentAnimation = () => {
    if (!accentFrame) return;
    window.cancelAnimationFrame(accentFrame);
    accentFrame = null;
  };

  const animateAccent = (targetHex, duration = 280) => {
    const target = normalizeHex(targetHex);
    const start = currentBase;

    if (start === target) {
      applyAccent(target);
      return;
    }

    stopAccentAnimation();
    const startedAt = performance.now();
    const easeOut = (value) => 1 - Math.pow(1 - value, 3);
    const startHsl = rgbToHsl(hexToRgb(start));
    const targetHsl = rgbToHsl(hexToRgb(target));
    const useRgbInterpolation = startHsl.s < 0.06 || targetHsl.s < 0.06;

    const tick = (now) => {
      const raw = duration <= 0 ? 1 : (now - startedAt) / duration;
      const progress = Math.max(0, Math.min(1, raw));
      const eased = easeOut(progress);
      const blended = useRgbInterpolation ? mixHex(start, target, eased) : interpolateHslShortest(start, target, eased);
      applyAccent(blended);

      if (progress < 1) {
        accentFrame = window.requestAnimationFrame(tick);
        return;
      }

      accentFrame = null;
      applyAccent(target);
    };

    accentFrame = window.requestAnimationFrame(tick);
  };

  const setSiteAccent = (input, options = {}) => {
    const animate = options.animate !== false;
    const duration = typeof options.duration === 'number' ? options.duration : 280;
    const target = toHexFromInput(input);

    if (!animate || prefersReducedMotion()) {
      stopAccentAnimation();
      applyAccent(target);
      return;
    }

    animateAccent(target, duration);
  };

  const setSiteTone = (input, options = {}) => {
    const animate = options.animate !== false;
    const duration = typeof options.duration === 'number' ? options.duration : 320;
    const target = normalizeToneKey(input);

    if (!animate || prefersReducedMotion() || currentTone === target) {
      applyTopicTone(target);
      return;
    }

    root.classList.add('is-topic-transitioning');
    window.setTimeout(() => {
      root.classList.remove('is-topic-transitioning');
    }, Math.max(120, duration));
    applyTopicTone(target);
  };

  window.__setSiteAccent = setSiteAccent;
  window.__setSiteTone = setSiteTone;

  const readAccentHandoff = () => {
    const raw = safeGet(sessionStorageRef, HANDOFF_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      const from = isHexColor(parsed?.from) ? normalizeHex(parsed.from) : null;
      const to = isHexColor(parsed?.to) ? normalizeHex(parsed.to) : null;
      const ts = Number(parsed?.ts);
      if (!from || !to || Number.isNaN(ts) || Date.now() - ts > HANDOFF_MAX_AGE_MS) return null;
      return { from, to };
    } catch {
      return null;
    }
  };

  const readToneHandoff = () => {
    const raw = safeGet(sessionStorageRef, TONE_HANDOFF_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      const from = normalizeToneKey(parsed?.from);
      const to = normalizeToneKey(parsed?.to);
      const ts = Number(parsed?.ts);
      if (Number.isNaN(ts) || Date.now() - ts > HANDOFF_MAX_AGE_MS) return null;
      return { from, to };
    } catch {
      return null;
    }
  };

  const writeAccentHandoff = (targetInput) => {
    safeSet(
      sessionStorageRef,
      HANDOFF_KEY,
      JSON.stringify({
        from: currentBase,
        to: toHexFromInput(targetInput),
        ts: Date.now()
      })
    );
  };

  const writeToneHandoff = (targetInput) => {
    safeSet(
      sessionStorageRef,
      TONE_HANDOFF_KEY,
      JSON.stringify({
        from: currentTone,
        to: normalizeToneKey(targetInput),
        ts: Date.now()
      })
    );
  };

  const getInitialColorKey = () => {
    const active =
      document.querySelector("nav a[aria-current='page'][data-color]") || document.querySelector('a[data-color]');
    return active instanceof HTMLElement ? active.getAttribute('data-color') || DEFAULT_COLOR_KEY : DEFAULT_COLOR_KEY;
  };

  const getInitialToneKey = () => {
    const active =
      document.querySelector("nav a[aria-current='page'][data-tone]") || document.querySelector('a[data-tone]');
    return active instanceof HTMLElement ? active.getAttribute('data-tone') || DEFAULT_TONE_KEY : DEFAULT_TONE_KEY;
  };

  const initAccent = () => {
    const targetKey = getInitialColorKey();
    const handoff = readAccentHandoff();
    safeRemove(sessionStorageRef, HANDOFF_KEY);

    if (handoff && !prefersReducedMotion()) {
      applyAccent(handoff.from);
      window.requestAnimationFrame(() => {
        setSiteAccent(targetKey, { animate: true, duration: 300 });
      });
      return;
    }

    applyAccent(toHexFromInput(targetKey));
  };

  const initTone = () => {
    const targetKey = getInitialToneKey();
    const handoff = readToneHandoff();
    safeRemove(sessionStorageRef, TONE_HANDOFF_KEY);

    if (handoff && !prefersReducedMotion()) {
      applyTopicTone(handoff.from);
      window.requestAnimationFrame(() => {
        setSiteTone(targetKey, { animate: true, duration: 320 });
      });
      return;
    }

    applyTopicTone(targetKey);
  };

  const syncThemeWithClock = () => {
    if (root.dataset.themeSource === 'forced') return;
    const previousTheme = root.dataset.themeMode || 'dark';
    const nextTheme = applyTheme(getClockTheme());
    if (previousTheme !== nextTheme) {
      refreshThemeSensitiveState();
    }
  };

  const scheduleThemeSync = () => {
    if (themeClockTimer) {
      window.clearTimeout(themeClockTimer);
    }

    const now = new Date();
    const delay = Math.max(1000, (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 120);
    themeClockTimer = window.setTimeout(() => {
      syncThemeWithClock();
      scheduleThemeSync();
    }, delay);
  };

  const initHeaderMetrics = () => {
    const header = document.querySelector('.site-header');
    if (!(header instanceof HTMLElement)) {
      root.style.setProperty('--site-header-size', '0px');
      root.style.setProperty('--header-height', '0px');
      return;
    }

    const syncHeaderHeight = () => {
      const height = Math.max(52, Math.round(header.getBoundingClientRect().height));
      const headerMode = body.dataset.headerMode || 'pinned';
      root.style.setProperty('--site-header-size', `${height}px`);
      root.style.setProperty('--header-height', headerMode === 'peek' ? '0px' : `${height}px`);
    };

    syncHeaderHeight();

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(syncHeaderHeight);
      observer.observe(header);
    } else {
      window.addEventListener('resize', syncHeaderHeight, { passive: true });
    }
  };

  const initHeaderReveal = () => {
    const header = document.querySelector('.site-header');
    const sensor = document.querySelector('.header-peek-sensor');

    if (!(header instanceof HTMLElement) || !(sensor instanceof HTMLElement)) {
      return;
    }

    if (body.dataset.headerMode !== 'peek') {
      body.dataset.headerReveal = 'visible';
      return;
    }

    // flat surface (e.g. home timeline mode) — inline scroll logic owns header reveal
    if (body.dataset.surfaceFrame === 'flat') {
      return;
    }

    const reduced = prefersReducedMotion();
    const canHover =
      typeof window.matchMedia === 'function' ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : false;

    if (!canHover || reduced) {
      body.dataset.headerReveal = 'visible';
      return;
    }

    const TOP_LOCK_SCROLL_Y = 10;
    const HIDE_DELAY_MS = 120;
    let hideTimer = null;
    let hoveringSensor = false;
    let hoveringHeader = false;
    let headerHasFocus = false;

    const clearHideTimer = () => {
      if (!hideTimer) return;
      window.clearTimeout(hideTimer);
      hideTimer = null;
    };

    const setHeaderReveal = (nextState) => {
      if (body.dataset.headerReveal === nextState) return;
      body.dataset.headerReveal = nextState;
    };

    const shouldKeepVisible = () =>
      hoveringSensor || hoveringHeader || headerHasFocus || window.scrollY <= TOP_LOCK_SCROLL_Y;

    const showHeader = () => {
      clearHideTimer();
      setHeaderReveal('visible');
    };

    const scheduleHide = () => {
      clearHideTimer();
      if (shouldKeepVisible()) {
        setHeaderReveal('visible');
        return;
      }

      hideTimer = window.setTimeout(() => {
        if (!shouldKeepVisible()) {
          setHeaderReveal('hidden');
        }
      }, HIDE_DELAY_MS);
    };

    setHeaderReveal(window.scrollY <= TOP_LOCK_SCROLL_Y ? 'visible' : 'hidden');

    sensor.addEventListener('pointerenter', () => {
      hoveringSensor = true;
      showHeader();
    });

    sensor.addEventListener('pointerleave', () => {
      hoveringSensor = false;
      scheduleHide();
    });

    header.addEventListener('pointerenter', () => {
      hoveringHeader = true;
      showHeader();
    });

    header.addEventListener('pointerleave', () => {
      hoveringHeader = false;
      scheduleHide();
    });

    header.addEventListener('focusin', () => {
      headerHasFocus = true;
      showHeader();
    });

    header.addEventListener('focusout', () => {
      headerHasFocus = header.contains(document.activeElement);
      if (!headerHasFocus) scheduleHide();
    });

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY <= TOP_LOCK_SCROLL_Y) {
          showHeader();
          return;
        }

        scheduleHide();
      },
      { passive: true }
    );

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearHideTimer();
        return;
      }

      if (window.scrollY <= TOP_LOCK_SCROLL_Y) {
        showHeader();
        return;
      }

      scheduleHide();
    });
  };

  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  const closeMobileNav = () => {
    if (!(mobileToggle instanceof HTMLElement) || !(mobileNav instanceof HTMLElement)) return;
    mobileNav.hidden = true;
    mobileNav.style.maxHeight = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.textContent = 'Menu';
  };

  const openMobileNav = () => {
    if (!(mobileToggle instanceof HTMLElement) || !(mobileNav instanceof HTMLElement)) return;
    // Capture header bar height before nav expands to avoid circular ResizeObserver feedback
    const headerRow = document.querySelector('.site-header .header-row');
    const barHeight = headerRow ? Math.round(headerRow.getBoundingClientRect().height) : 56;
    const musicBar = document.querySelector('.site-music-bar');
    const musicBarHeight = (musicBar && !musicBar.hidden) ? Math.round(musicBar.getBoundingClientRect().height) : 0;
    mobileNav.style.maxHeight = `calc(100dvh - ${barHeight}px - ${musicBarHeight}px)`;
    mobileNav.hidden = false;
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileToggle.textContent = '×';
  };

  const initMobileNav = () => {
    if (!(mobileToggle instanceof HTMLElement) || !(mobileNav instanceof HTMLElement)) return;

    mobileToggle.addEventListener('click', () => {
      if (mobileNav.hidden) {
        openMobileNav();
        return;
      }

      closeMobileNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMobileNav();
      }
    });
  };

  const isEligibleLink = (event, link) => {
    if (event.defaultPrevented || isNavigating) return false;
    if (event instanceof MouseEvent && event.button !== 0) return false;
    if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download') || link.hasAttribute('data-no-route-transition')) return false;

    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#')) return false;

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return false;
    }

    if (url.origin !== window.location.origin) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return false;

    return true;
  };

  const handleDocumentClick = (event) => {
    if (event instanceof MouseEvent && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    const trigger = target.closest('[data-color], [data-tone]');
    if (trigger instanceof HTMLElement) {
      const color = trigger.getAttribute('data-color');
      const tone = trigger.getAttribute('data-tone');

      if (color) {
        setSiteAccent(color, { animate: true, duration: 240 });
      }

      if (tone) {
        setSiteTone(tone, { animate: true, duration: 320 });
      }

      if (trigger instanceof HTMLAnchorElement && isEligibleLink(event, trigger)) {
        if (color) writeAccentHandoff(color);
        if (tone) writeToneHandoff(tone);
      }
    }

    const link = target.closest('a[href]');
    if (!(link instanceof HTMLAnchorElement)) return;

    if (mobileNav instanceof HTMLElement && mobileNav.contains(link)) {
      closeMobileNav();
    }

    if (!isEligibleLink(event, link)) return;

    isNavigating = true;
    body.dataset.navPhase = 'exiting';
  };

  const initRoutePhase = () => {
    window.addEventListener('pageshow', () => {
      isNavigating = false;
      body.dataset.navPhase = 'idle';
      syncThemeWithClock();
      closeMobileNav();
    });
  };

  syncThemeWithClock();
  scheduleThemeSync();
  initTone();
  initAccent();
  initHeaderMetrics();
  initHeaderReveal();
  initMobileNav();
  initRoutePhase();

  document.addEventListener('click', handleDocumentClick, { capture: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      syncThemeWithClock();
    }
  });
})();
