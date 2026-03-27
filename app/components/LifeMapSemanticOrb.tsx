'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";

type RegionPhase = "platform" | "emergence" | "offering";

type RegionRoute = {
  label: string;
  href: string;
  note: string;
};

type Region = {
  id: string;
  name: string;
  phase: RegionPhase;
  accent: string;
  description: string;
  supports: string[];
  opens: string[];
  angle: number;
  elevation: number;
  question: string;
  excerpt: string;
  routes: RegionRoute[];
};

type Rotation = {
  pitch: number;
  yaw: number;
};

type ProjectedPoint = {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  visible: boolean;
};

type Connection = {
  key: string;
  kind: "supports" | "opens";
  from: string;
  to: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const roundForRender = (value: number, precision = 4) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const PHASE_ORDER: RegionPhase[] = ["platform", "emergence", "offering"];

const PHASE_META: Record<
  RegionPhase,
  { label: string; blurb: string; glow: string }
> = {
  platform: {
    label: "Platform",
    blurb:
      "Material support and structure that keep life from collapsing into immediate scarcity.",
    glow: "rgba(216, 193, 143, 0.22)"
  },
  emergence: {
    label: "Emergence",
    blurb:
      "Capabilities that open once the floor of life is steadier and attention can widen.",
    glow: "rgba(159, 212, 178, 0.18)"
  },
  offering: {
    label: "Offering",
    blurb:
      "What becomes shareable and public when enough of the inner system can hold.",
    glow: "rgba(200, 176, 232, 0.18)"
  }
};

const REGIONS: Region[] = [
  {
    id: "resources",
    name: "Resources",
    phase: "platform",
    accent: "#d8c18f",
    description: "Material stability, support, access, and what keeps life from collapsing into immediate scarcity.",
    supports: [],
    opens: ["order", "work", "wellbeing"],
    angle: 232,
    elevation: -18,
    question: "What does a life actually need in order to stop operating from immediate lack?",
    excerpt:
      "Resources are not just money. They are the floor of material support, access, and survivability that keep the rest of life from folding inward.",
    routes: [
      {
        label: "Survival OS",
        href: "/survival-os",
        note: "Systems thinking around stability and adaptation."
      },
      {
        label: "Work page",
        href: "/work",
        note: "How income and labor meet the reality of living."
      },
      {
        label: "Writing",
        href: "/writing",
        note: "Essays and notes touching economic and structural pressure."
      }
    ]
  },
  {
    id: "order",
    name: "Order",
    phase: "platform",
    accent: "#d8c18f",
    description: "Structure, orientation, rhythm, and the conditions that let a life hold shape over time.",
    supports: ["resources"],
    opens: ["growth", "relationships"],
    angle: 308,
    elevation: -28,
    question: "What keeps life from becoming noise?",
    excerpt:
      "Order is not rigidity for its own sake. It is the patterning that lets attention, effort, and recovery stop leaking in every direction.",
    routes: [
      {
        label: "Map",
        href: "/map",
        note: "Return to the system view and orient the whole field."
      },
      {
        label: "Writing",
        href: "/writing",
        note: "Method, structure, and the archive that holds the work together."
      },
      {
        label: "Essay Codex",
        href: "/writing",
        note: "A route into early structure and self-organization."
      }
    ]
  },
  {
    id: "work",
    name: "Work",
    phase: "platform",
    accent: "#d8c18f",
    description: "Labor, continuity, contribution, and the survival-facing mechanics of staying involved with the world.",
    supports: ["resources", "order"],
    opens: ["activity", "society"],
    angle: 28,
    elevation: -4,
    question: "How does a person stay economically real without collapsing their inner life?",
    excerpt:
      "Work is where survival becomes scheduled. In this material it shows up as continuity, pressure, fit, and exit: the need for income, the search for roles that match actual capacities, and the recognition that staying employed is not the same as building a life.",
    routes: [
      {
        label: "Job Search for Angel Suero",
        href: "https://docs.google.com/document/d/1gOz5KOWlWNi06K4GUWa2hPzfzhXfqC4hQDl1qkrie6Y",
        note: "A concrete search outward into cultural, educational, content, and freelance paths."
      },
      {
        label: "Expanded Job Search Parameters",
        href: "https://docs.google.com/document/d/1g3WAN_cw7mpPWHxVlQucTSC-GM9KAhzlo1l3PxQj9nM",
        note: "The wider field: museums, education, media, AV, community work, and NYC expansion."
      },
      {
        label: "Museum Engagement Survey",
        href: "https://drive.google.com/file/d/1SDEjY3B9TEeOQ7CtFxIha_hJ7Zac3Q4c",
        note: "Useful pressure document: strong cultural fit, weaker compensation and career advancement."
      }
    ]
  },
  {
    id: "wellbeing",
    name: "Well-Being",
    phase: "platform",
    accent: "#d8c18f",
    description: "The quality of inner and bodily condition that everything else quietly depends on.",
    supports: ["resources"],
    opens: ["growth", "relationships", "creativity"],
    angle: 116,
    elevation: 22,
    question: "What is the condition of a life before any output is asked of it?",
    excerpt:
      "Well-being is not an optional bonus added after survival. Here it appears as the quality of inner and bodily condition that determines whether life is lived from steadiness, fragmentation, clarity, or compensation.",
    routes: [
      {
        label: "Isha Kriya Effects and Concerns",
        href: "https://drive.google.com/file/d/1jDXJzTtmv6mTfpLB2kw5LzCFC8mGfWJH",
        note: "Best anchor for an honest wellbeing thread: benefits, risks, and the question of fragmentation."
      },
      {
        label: "Isha Kriya: Effects and Mechanisms",
        href: "https://docs.google.com/document/d/1hwq1GHod53nFVHSzuGGE5i_Vq8wFxLpdJu1j3Q2vUd0",
        note: "Strongest articulation of interoception, inner alignment, and the release of fear and tension."
      },
      {
        label: "Isha Kriya & Miracle of Mind",
        href: "https://drive.google.com/file/d/1BaMCQSwj6-P4cQY0ORDquw5iimu9RkpY",
        note: "A bridge between contemplative practice, apps, scale, and digital packaging."
      },
      {
        label: "Human Suffering and Practice",
        href: "/writing/human-suffering-and-practice",
        note: "The draft note that names the problem directly and keeps the practice response in view."
      }
    ]
  },
  {
    id: "growth",
    name: "Growth",
    phase: "emergence",
    accent: "#9fd4b2",
    description: "Learning, expansion, revision, and the opening that becomes possible once life is steadier.",
    supports: ["order", "wellbeing"],
    opens: ["creativity"],
    angle: 320,
    elevation: 10,
    question: "What begins to open once life is no longer only about holding itself together?",
    excerpt:
      "Growth appears here less as self-improvement branding and more as revision: moving beyond inherited roles, testing wider intellectual frameworks, and discovering that survival alone is not the whole shape of a life.",
    routes: [
      {
        label: "Rationale",
        href: "https://docs.google.com/document/d/1PGdTHy7lqtLU6i5EkaUiQ9VuGw7o_6RX9OOdlg7Vo_k",
        note: "The strongest direct statement of becoming beyond history, family ties, and academic containment."
      },
      {
        label: "Systemic Humanist Corpus",
        href: "https://docs.google.com/document/d/1Qof-2J0GMbK47mFQDrho-lpGLlUZiGMXIzsoA4eZPxM",
        note: "A long-view developmental reading of the archive from formalism to interdisciplinary humanism."
      },
      {
        label: "Art of Survival rationale",
        href: "https://drive.google.com/file/d/16pehoFJhl9QKityk9vuHqGuU-sutk511",
        note: "A parallel formulation of growth through identity, study, and artistic emergence."
      }
    ]
  },
  {
    id: "relationships",
    name: "Relationships",
    phase: "emergence",
    accent: "#9fd4b2",
    description: "Reciprocity, intimacy, belonging, and the living field between self and others.",
    supports: ["wellbeing", "order"],
    opens: ["society"],
    angle: 104,
    elevation: 14,
    question: "What kind of connection becomes possible when one is not only surviving?",
    excerpt:
      "Relationships show up here not as generic social contact, but as attachment, devouring, care, distance, and the attempt to recover a fuller self from the people and structures that shaped it.",
    routes: [
      {
        label: "Sensitive Child / archive reading",
        href: "https://docs.google.com/document/d/1QW2kTavKWzvbBS9X_SBXNkJdxbd45swpM7U5GKN4RxY",
        note: "The strongest relational artifact in the archive: family, damage, recovery, and the struggle to reclaim one’s parts."
      },
      {
        label: "Rationale",
        href: "https://docs.google.com/document/d/1PGdTHy7lqtLU6i5EkaUiQ9VuGw7o_6RX9OOdlg7Vo_k",
        note: "Family ties, separation, and the question of who one is beyond inherited closeness."
      },
      {
        label: "Systemic Humanist Corpus",
        href: "https://docs.google.com/document/d/1Qof-2J0GMbK47mFQDrho-lpGLlUZiGMXIzsoA4eZPxM",
        note: "Useful for tracing how intimacy, community, and belonging recur beneath the archive’s public concerns."
      }
    ]
  },
  {
    id: "activity",
    name: "Activity",
    phase: "emergence",
    accent: "#9fd4b2",
    description: "Motion, practice, exertion, and the physical expression of an activated life.",
    supports: ["work", "wellbeing"],
    opens: ["growth", "creativity"],
    angle: 208,
    elevation: -14,
    question: "How does life move once it has enough structure to act?",
    excerpt:
      "Activity appears here as applied movement: not just having ideas, but entering institutions, rotating through roles, building proposals, and turning lived pressure into practical action.",
    routes: [
      {
        label: "GH+ Proposal",
        href: "https://docs.google.com/document/d/1hm9GvMKo1r3JEeaIaX4IgKgIuaguczqZsxuYicrUfn4",
        note: "The clearest applied-action document: care, cross-training, AV support, and institutional renewal from lived experience."
      },
      {
        label: "GH+ Proposal PDF",
        href: "https://drive.google.com/file/d/1kFE_NAS5Ctf3F5vK5hGQV9nEeptUphqT",
        note: "A second route into the same action framework, useful as a presentation-facing version."
      },
      {
        label: "Newark Museum income generation strategies",
        href: "https://docs.google.com/document/d/1m8cYNe1GmpD8gpbm_pwnc7n-8Rae0fh29SsdLR8vgNE",
        note: "Shows activity at the systems level: practical strategy, partnership, and institutional leverage."
      }
    ]
  },
  {
    id: "creativity",
    name: "Creativity",
    phase: "offering",
    accent: "#c8b0e8",
    description: "Expression, making, art, and what starts to become sharable once deeper layers hold.",
    supports: ["growth", "activity", "wellbeing"],
    opens: ["society"],
    angle: 338,
    elevation: 6,
    question: "What spills outward when life is not only defending itself?",
    excerpt:
      "Creativity is not treated here as a hobby layer. It is where deprogramming, vulnerability, sound, story, and lived experience become form—music, screenplay, allegory, and expression that another person can actually receive.",
    routes: [
      {
        label: "Following Sound",
        href: "https://docs.google.com/document/d/1gMbp364uA-l41Ht0De0ZHHYANcf_Sf4lyaYZkzLJT1o",
        note: "A direct creative anchor: sound, performance, experimental structure, and the experience of being moved by music."
      },
      {
        label: "Rationale",
        href: "https://docs.google.com/document/d/1PGdTHy7lqtLU6i5EkaUiQ9VuGw7o_6RX9OOdlg7Vo_k",
        note: "Names the bridge between sociological study and music, poetry, film, and screenplay work."
      },
      {
        label: "Untitled stream",
        href: "https://untitled.stream/library/project/W9oQWS6klQAAftkyx28QL",
        note: "A direct route out of theory and into actual musical output."
      }
    ]
  },
  {
    id: "society",
    name: "Society",
    phase: "offering",
    accent: "#c8b0e8",
    description: "The public field, systems, culture, and what a life contributes beyond itself.",
    supports: ["work", "relationships", "creativity"],
    opens: [],
    angle: 138,
    elevation: 18,
    question: "What does a life touch once it begins to move beyond itself?",
    excerpt:
      "Society appears here as the outward field where labor, art, media, AI, public systems, and collective consequence meet. It is where private thinking turns into public critique, proposal, or intervention.",
    routes: [
      {
        label: "Systemic Humanist Corpus",
        href: "https://docs.google.com/document/d/1Qof-2J0GMbK47mFQDrho-lpGLlUZiGMXIzsoA4eZPxM",
        note: "The strongest long-view social reading: capitalism, media, hegemony, art, AI, and collective consequence."
      },
      {
        label: "X/Twitter data",
        href: "https://docs.google.com/document/d/1VYvQhnxrFLipXFK1dtuyY1z5Z8QsuUROoWMBt_MxKuo",
        note: "Shows the public-facing voice in motion: AI questions, platform critique, feature requests, and civic pressure."
      },
      {
        label: "AI Accountability Pledge draft",
        href: "/writing",
        note: "A route into ethics, governance, and public responsibility around AI use."
      }
    ]
  }
];

function curvePath(
  a: { x: number; y: number },
  b: { x: number; y: number },
  bend = 0.16
) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cx = roundForRender(mx - dy * bend);
  const cy = roundForRender(my + dx * bend);
  return `M ${roundForRender(a.x)} ${roundForRender(a.y)} Q ${cx} ${cy} ${roundForRender(b.x)} ${roundForRender(b.y)}`;
}

function projectPoint(
  angle: number,
  elevation: number,
  radius: number,
  rotation: Rotation
): ProjectedPoint {
  const elevationRad = (elevation * Math.PI) / 180;
  const angleRad = (angle * Math.PI) / 180;

  const x = radius * Math.cos(elevationRad) * Math.sin(angleRad);
  const y = radius * Math.sin(elevationRad);
  const z = radius * Math.cos(elevationRad) * Math.cos(angleRad);

  const yaw = (rotation.yaw * Math.PI) / 180;
  const pitch = (rotation.pitch * Math.PI) / 180;

  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const y1 = y;

  const y2 = y1 * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = y1 * Math.sin(pitch) + z1 * Math.cos(pitch);
  const x2 = x1;

  const distance = 720;
  const perspective = distance / (distance - z2);

  return {
    x: roundForRender(x2 * perspective),
    y: roundForRender(y2 * perspective),
    z: roundForRender(z2),
    scale: roundForRender(clamp(perspective, 0.72, 1.55)),
    opacity: roundForRender(clamp(0.26 + (z2 + radius) / (radius * 2), 0.2, 1), 6),
    visible: z2 > -radius * 0.98
  };
}

function shapeToShell(point: ProjectedPoint, zoom: number) {
  const distanceFromCenter = Math.hypot(point.x, point.y);
  const minimumCoreRadius = 112 * zoom;
  const pushOut =
    distanceFromCenter < minimumCoreRadius
      ? minimumCoreRadius / Math.max(distanceFromCenter, 1)
      : 1;

  return {
    ...point,
    x: roundForRender(point.x * pushOut),
    y: roundForRender(point.y * pushOut)
  };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return reduced;
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function LifeMapSemanticOrb() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollResetRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);

  const [rotation, setRotation] = useState<Rotation>({ pitch: -10, yaw: 18 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [showOpens, setShowOpens] = useState(true);
  const [scrollPaused, setScrollPaused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const dragRef = useRef({
    pointerId: -1,
    x: 0,
    y: 0,
    startPitch: -10,
    startYaw: 18,
    moved: 0
  });

  const regionById = useMemo(() => {
    return Object.fromEntries(REGIONS.map((region) => [region.id, region])) as Record<
      string,
      Region
    >;
  }, []);

  const phaseGroups = useMemo(
    () =>
      PHASE_ORDER.map((phase) => ({
        phase,
        meta: PHASE_META[phase],
        regions: REGIONS.filter((region) => region.phase === phase)
      })),
    []
  );

  const allConnections = useMemo(() => {
    const edges: Connection[] = [];

    REGIONS.forEach((region) => {
      region.supports.forEach((sourceId) => {
        if (!regionById[sourceId]) return;

        edges.push({
          key: `supports:${sourceId}:${region.id}`,
          kind: "supports",
          from: sourceId,
          to: region.id
        });
      });

      region.opens.forEach((targetId) => {
        if (!regionById[targetId]) return;

        edges.push({
          key: `opens:${region.id}:${targetId}`,
          kind: "opens",
          from: region.id,
          to: targetId
        });
      });
    });

    return edges;
  }, [regionById]);

  const focusRegionId = selectedRegionId;
  const selectedRegion = selectedRegionId ? regionById[selectedRegionId] : null;
  const previewRegion = selectedRegion;

  const focusRelatedIds = useMemo(() => {
    const ids = new Set<string>();

    if (!focusRegionId) return ids;

    ids.add(focusRegionId);

    const region = regionById[focusRegionId];
    region.supports.forEach((id) => ids.add(id));
    region.opens.forEach((id) => ids.add(id));

    REGIONS.forEach((candidate) => {
      if (
        candidate.supports.includes(focusRegionId) ||
        candidate.opens.includes(focusRegionId)
      ) {
        ids.add(candidate.id);
      }
    });

    return ids;
  }, [focusRegionId, regionById]);

  useEffect(() => {
    if (reducedMotion || dragging || selectedRegionId || scrollPaused) return undefined;

    let frame = 0;
    let lastTick = 0;

    const tick = (time: number) => {
      if (time - lastTick >= 120) {
        lastTick = time;
        setRotation((current) => ({ ...current, yaw: current.yaw + 0.08 }));
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [dragging, reducedMotion, scrollPaused, selectedRegionId]);

  useEffect(() => {
    const onScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        setScrollPaused(true);
      }

      if (scrollResetRef.current !== null) {
        window.clearTimeout(scrollResetRef.current);
      }

      scrollResetRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        setScrollPaused(false);
        scrollResetRef.current = null;
      }, 160);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollResetRef.current !== null) {
        window.clearTimeout(scrollResetRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target && ["INPUT", "TEXTAREA"].includes(target.tagName);

      if (typing) return;

      if (event.key === "Escape") {
        setSelectedRegionId(null);
      }

      if (event.key === "+" || event.key === "=") {
        setZoom((value) => clamp(value + 0.12, 0.86, 1.8));
      }

      if (event.key === "-") {
        setZoom((value) => clamp(value - 0.12, 0.86, 1.8));
      }

      if (event.key.toLowerCase() === "r") {
        setSelectedRegionId(null);
        setZoom(1);
        setRotation({ pitch: -10, yaw: 18 });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setTimeout(() => {
      if (!hasInteracted) {
        focusRegionInternal("resources");
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const focusRegionInternal = (regionId: string) => {
    const region = regionById[regionId];
    if (!region) return;
    setSelectedRegionId(regionId);
    setZoom((value) => Math.max(value, 1.06));
    setRotation({
      pitch: clamp(-region.elevation, -38, 38),
      yaw: -region.angle
    });
  };

  const focusRegion = (regionId: string) => {
    const region = regionById[regionId];
    if (!region) return;

    setHasInteracted(true);
    setSelectedRegionId(regionId);
    setZoom((value) => Math.max(value, 1.06));
    setRotation({
      pitch: clamp(-region.elevation, -38, 38),
      yaw: -region.angle
    });
  };

  const resetView = () => {
    setHasInteracted(true);
    setSelectedRegionId(null);
    setZoom(1);
    setRotation({ pitch: -10, yaw: 18 });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setHasInteracted(true);
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
      pitch: clamp(dragRef.current.startPitch - dy * 0.12, -48, 48),
      yaw: dragRef.current.startYaw + dx * 0.16
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;

    containerRef.current?.releasePointerCapture?.(event.pointerId);
    dragRef.current.pointerId = -1;
    setDragging(false);
  };

  const handleShellClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (dragRef.current.moved > 6) return;
    if (selectedRegionId) setSelectedRegionId(null);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.shiftKey) {
      return;
    }

    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const distanceFromCenter = Math.hypot(pointerX - centerX, pointerY - centerY);
    const interactiveRadius =
      Math.min(bounds.width, bounds.height) * 0.5 - 24;

    if (distanceFromCenter > interactiveRadius) {
      return;
    }

    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    setZoom((value) => clamp(value + delta, 0.86, 1.8));
  };

  const shellRadius = 196 * zoom;
  const frameSize = 620;
  const center = frameSize / 2;

  const projectedRegions = useMemo(() => {
    return REGIONS.map((region) => ({
      region,
      point: shapeToShell(
        projectPoint(region.angle, region.elevation, shellRadius, rotation),
        zoom
      )
    })).sort((a, b) => a.point.z - b.point.z);
  }, [rotation, shellRadius, zoom]);

  const pointById = useMemo(() => {
    return Object.fromEntries(
      projectedRegions.map(({ region, point }) => [region.id, point])
    ) as Record<string, ProjectedPoint>;
  }, [projectedRegions]);

  const visibleConnections = useMemo(() => {
    return allConnections
      .filter((connection) => showOpens || connection.kind === "supports")
      .map((connection) => {
        const from = pointById[connection.from];
        const to = pointById[connection.to];

        if (!from || !to || !from.visible || !to.visible) return null;

        const focused = Boolean(
          focusRegionId &&
            (connection.from === focusRegionId || connection.to === focusRegionId)
        );
        const adjacent = Boolean(
          focusRegionId &&
            focusRelatedIds.has(connection.from) &&
            focusRelatedIds.has(connection.to)
        );

        return {
          connection,
          from,
          to,
          focused,
          adjacent
        };
      })
      .filter(Boolean) as Array<{
      connection: Connection;
      from: ProjectedPoint;
      to: ProjectedPoint;
      focused: boolean;
      adjacent: boolean;
    }>;
  }, [allConnections, focusRegionId, focusRelatedIds, pointById, showOpens]);

  const visibleRouteCount = previewRegion?.routes.length || 0;

  return (
    <div className="w-full overflow-x-hidden">
      <style>{`
        @keyframes semanticPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.72; transform: scale(1.06); }
        }

        .orb-region {
          cursor: pointer;
        }

        .orb-region .orb-region-ring,
        .orb-region .orb-region-dot,
        .orb-region .orb-region-label,
        .orb-region .orb-region-phase {
          transition:
            opacity 120ms ease,
            transform 120ms ease,
            stroke-opacity 120ms ease;
          transform-box: fill-box;
          transform-origin: center;
        }

        .orb-region:hover .orb-region-ring {
          opacity: 0.72 !important;
        }

        .orb-region:hover .orb-region-dot {
          transform: scale(1.18);
        }

        .orb-region:hover .orb-region-label {
          opacity: 1 !important;
        }

        .orb-region:hover .orb-region-phase {
          opacity: 0.9 !important;
        }

        .orb-sidebar-panel {
          border-top: 1px solid var(--tone-line);
          padding: 1.25rem 0;
        }

        .orb-sidebar-panel + .orb-sidebar-panel {
          margin-top: 0;
        }

        .orb-panel-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.28em;
          color: var(--tone-accent);
          margin-bottom: 0.75rem;
        }

        .orb-node-btn {
          border-radius: 9999px;
          border: 1px solid var(--tone-line);
          background: transparent;
          padding: 0.2rem 0.65rem;
          font-size: 0.72rem;
          color: var(--tone-muted);
          transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
          cursor: pointer;
        }

        .orb-node-btn:hover {
          border-color: color-mix(in srgb, var(--tone-accent) 40%, var(--tone-line));
          color: var(--tone-text);
        }

        .orb-node-btn.is-active {
          color: var(--tone-text);
        }

        .orb-route-link {
          display: block;
          border-top: 1px solid var(--tone-line);
          padding: 0.75rem 0;
          text-decoration: none;
          transition: color 120ms ease;
        }

        .orb-route-link:first-child {
          border-top: none;
        }

        .orb-route-link:hover .orb-route-title {
          color: var(--tone-text);
        }

        .orb-route-title {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--tone-text);
          opacity: 0.84;
          transition: opacity 120ms ease;
        }

        .orb-route-link:hover .orb-route-title {
          opacity: 1;
        }

        .orb-route-note {
          margin-top: 0.2rem;
          font-size: 0.72rem;
          line-height: 1.5;
          color: var(--tone-muted);
          opacity: 0.72;
        }

        .orb-hint {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--tone-muted);
          opacity: 0.5;
        }

        .orb-preview-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--tone-text);
        }

        .orb-preview-desc {
          font-size: 0.72rem;
          line-height: 1.5;
          color: var(--tone-muted);
          opacity: 0.8;
          margin-top: 0.2rem;
        }

        .orb-legend-hint {
          font-size: 0.72rem;
          color: var(--tone-muted);
          opacity: 0.6;
        }
      `}</style>

      <div className="relative">
        <main className="relative z-10 mx-auto grid max-w-[1440px] items-start gap-0 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-6">
          <section className="relative self-start overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-4 py-3">
              <span className="orb-hint">Drag to rotate</span>
              <span className="orb-hint">R to reset · +/− to zoom</span>
            </div>

            <div className="absolute bottom-4 left-4 z-20 max-w-[200px]">
              {previewRegion ? (
                <>
                  <div className="orb-preview-name">{previewRegion.name}</div>
                  <div className="orb-preview-desc">{previewRegion.description}</div>
                </>
              ) : (
                <div className="orb-legend-hint">
                  Solid — what it needs.{" "}<br />Dashed — what it opens.
                </div>
              )}
            </div>

            <div
              ref={containerRef}
              className="relative flex min-h-[520px] items-center justify-center p-4 select-none md:min-h-[640px] lg:min-h-[680px]"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onClick={handleShellClick}
              onWheel={handleWheel}
              style={{
                cursor: dragging ? "grabbing" : "grab",
                touchAction: "pan-y",
                userSelect: "none"
              }}
            >
              <svg
                viewBox={`0 0 ${frameSize} ${frameSize}`}
                className="aspect-square h-auto w-full max-w-[720px]"
                aria-label="Life Map semantic orb"
              >
                <defs>
                  <radialGradient id="orb-warm-glow" cx="44%" cy="38%" r="62%" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="rgba(185,147,87,0.07)" />
                    <stop offset="65%" stopColor="rgba(155,120,70,0.03)" />
                    <stop offset="100%" stopColor="rgba(110,85,50,0.1)" />
                  </radialGradient>
                  <radialGradient id="orb-core-fill" cx="50%" cy="40%" r="60%" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="rgba(185,147,87,0.06)" />
                    <stop offset="100%" stopColor="rgba(120,95,55,0.04)" />
                  </radialGradient>
                </defs>

                {/* Outer sphere - warm subtle fill */}
                <circle cx={center} cy={center} r={248} fill="url(#orb-warm-glow)" />

                {/* Concentric guide rings — theme-aware via CSS var */}
                <circle cx={center} cy={center} r={248} fill="none" style={{ stroke: 'var(--tone-line)', strokeOpacity: 0.8 }} />
                <circle cx={center} cy={center} r={208} fill="none" style={{ stroke: 'var(--tone-line)', strokeOpacity: 0.5 }} />
                <circle cx={center} cy={center} r={168} fill="none" style={{ stroke: 'var(--tone-line)', strokeOpacity: 0.35 }} />
                <circle cx={center} cy={center} r={128} fill="none" style={{ stroke: 'var(--tone-line)', strokeOpacity: 0.25 }} />

                {/* Inner core */}
                <circle cx={center} cy={center} r={88} fill="url(#orb-core-fill)" style={{ stroke: 'var(--tone-line)', strokeOpacity: 0.5 }} />

                {/* Connection lines */}
                <g style={{ color: 'var(--tone-muted)' }}>
                  {visibleConnections.map(({ connection, from, to, focused, adjacent }) => {
                    const dimmed = Boolean(focusRegionId) && !adjacent;

                    return (
                      <path
                        key={connection.key}
                        d={curvePath(
                          { x: center + from.x, y: center + from.y },
                          { x: center + to.x, y: center + to.y },
                          connection.kind === "supports" ? 0.14 : 0.1
                        )}
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity={dimmed ? 0.05 : focused ? 0.55 : connection.kind === "supports" ? 0.22 : 0.14}
                        strokeWidth={focused ? 1.8 : connection.kind === "supports" ? 1.2 : 0.9}
                        strokeDasharray={connection.kind === "opens" ? "4 5" : undefined}
                      />
                    );
                  })}
                </g>

                {/* Center core marker */}
                <g transform={`translate(${center} ${center})`}>
                  <circle
                    r={48}
                    fill="none"
                    style={{ stroke: 'var(--tone-line)', strokeOpacity: 0.5 }}
                    strokeWidth={1}
                    strokeDasharray="3 4"
                    {...(!reducedMotion ? { style: { stroke: 'var(--tone-line)', strokeOpacity: 0.5, animation: "semanticPulse 4s ease-in-out infinite" } } : { style: { stroke: 'var(--tone-line)', strokeOpacity: 0.5 } })}
                  />
                  <line x1={0} x2={0} y1={-36} y2={36} style={{ stroke: 'var(--tone-line)', strokeOpacity: 0.4 }} strokeWidth={0.8} />
                  <line x1={-36} x2={36} y1={0} y2={0} style={{ stroke: 'var(--tone-line)', strokeOpacity: 0.4 }} strokeWidth={0.8} />
                  <circle r={5} style={{ fill: 'var(--tone-accent)', opacity: 0.55 }} />
                  {previewRegion && (
                    <text
                      y={72}
                      textAnchor="middle"
                      fontSize={11}
                      letterSpacing="0.12em"
                      style={{ fill: 'var(--tone-muted)', opacity: 0.7 }}
                    >
                      {previewRegion.name.toUpperCase()}
                    </text>
                  )}
                </g>

                {/* Region nodes */}
                {projectedRegions.map(({ region, point }) => {
                  if (!point.visible) return null;

                  const isSelected = selectedRegionId === region.id;
                  const related = focusRelatedIds.has(region.id);
                  const dimmed = Boolean(focusRegionId) && !related;
                  const x = center + point.x;
                  const y = center + point.y;
                  const ringRadius = isSelected ? 24 : 16;
                  const dotRadius = isSelected ? 10 : 7;
                  const labelAbove = point.y > 64;
                  const labelY = labelAbove ? -28 : 28;
                  const labelOpacity = dimmed ? 0.25 : point.opacity;

                  return (
                    <g
                      key={region.id}
                      className="orb-region"
                      data-selected={isSelected ? "true" : "false"}
                      transform={`translate(${x} ${y}) scale(${point.scale})`}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() =>
                        isSelected ? setSelectedRegionId(null) : focusRegion(region.id)
                      }
                    >
                      {/* Outer glow ring */}
                      <circle
                        className="orb-region-ring"
                        r={ringRadius}
                        fill="none"
                        stroke={region.accent}
                        strokeWidth={isSelected ? 1.5 : 1}
                        opacity={dimmed ? 0.18 : isSelected ? 0.65 : 0.38}
                      />
                      {/* Inner dot */}
                      <circle
                        className="orb-region-dot"
                        r={dotRadius}
                        fill={region.accent}
                        opacity={labelOpacity}
                        style={{ stroke: 'var(--tone-bg)', strokeOpacity: 0.5 }}
                        strokeWidth={isSelected ? 1.2 : 0.8}
                      />

                      {/* Selected pulse ring */}
                      {isSelected && (
                        <circle
                          r={32}
                          fill="none"
                          stroke={region.accent}
                          strokeOpacity={0.22}
                          strokeWidth={1}
                          style={
                            reducedMotion
                              ? undefined
                              : { animation: "semanticPulse 2.4s ease-in-out infinite" }
                          }
                        />
                      )}

                      {/* Node label */}
                      <text
                        className="orb-region-label"
                        pointerEvents="none"
                        y={labelY}
                        textAnchor="middle"
                        fontSize={isSelected ? 14 : 12}
                        fontWeight={isSelected ? 600 : 500}
                        style={{ fill: 'var(--tone-text)', stroke: 'var(--tone-bg)' }}
                        strokeWidth={5}
                        paintOrder="stroke"
                        opacity={labelOpacity}
                      >
                        {region.name}
                      </text>

                      {/* Phase label (selected only) */}
                      {isSelected && (
                        <text
                          className="orb-region-phase"
                          pointerEvents="none"
                          y={labelY + (labelAbove ? -15 : 16)}
                          textAnchor="middle"
                          fontSize={9}
                          letterSpacing="0.2em"
                          style={{ fill: 'var(--tone-muted)', stroke: 'var(--tone-bg)' }}
                          strokeWidth={3}
                          paintOrder="stroke"
                          opacity={labelOpacity * 0.85}
                        >
                          {PHASE_META[region.phase].label.toUpperCase()}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>

          <aside
            className="flex flex-col pt-6 lg:pt-0 lg:pl-6"
            style={{ borderTop: '1px solid var(--tone-line)', borderLeft: 'none' }}
          >
            <style>{`
              @media (min-width: 1024px) {
                .orb-aside { border-top: none !important; border-left: 1px solid var(--tone-line) !important; }
              }
            `}</style>

            <div className="orb-sidebar-panel" style={{ borderTop: 'none', paddingTop: 0 }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="text-base font-medium" style={{ color: 'var(--tone-text)' }}>
                  {previewRegion ? previewRegion.name : "Click any node"}
                </div>

                {previewRegion && (
                  <div
                    className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]"
                    style={{
                      borderColor: `${previewRegion.accent}55`,
                      color: previewRegion.accent,
                      marginTop: '0.15rem'
                    }}
                  >
                    {PHASE_META[previewRegion.phase].label}
                  </div>
                )}
              </div>

              <p className="text-xs leading-6" style={{ color: 'var(--tone-muted)' }}>
                {previewRegion
                  ? previewRegion.excerpt
                  : "Drag the sphere to rotate it. Each node is a region of a life — click one to see what it depends on and what it makes possible."}
              </p>

              {previewRegion && (
                <p className="mt-2 text-xs leading-5 italic" style={{ color: 'var(--tone-muted)', opacity: 0.7 }}>
                  {previewRegion.question}
                </p>
              )}
            </div>

            {previewRegion && (
              <div className="orb-sidebar-panel">
                <div className="flex items-center justify-between mb-3">
                  <div className="orb-panel-label">Connections</div>
                  <button
                    type="button"
                    onClick={() => setSelectedRegionId(null)}
                    className="text-[11px] transition-colors"
                    style={{ color: 'var(--tone-muted)', opacity: 0.6 }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; }}
                  >
                    ← Back
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--tone-muted)', opacity: 0.6 }}>
                      Built on
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {previewRegion.supports.length === 0 ? (
                        <span className="text-[11px]" style={{ color: 'var(--tone-muted)', opacity: 0.5 }}>Foundation</span>
                      ) : (
                        previewRegion.supports.map((id) => (
                          <button key={id} type="button" onClick={() => focusRegion(id)} className="orb-node-btn">
                            {regionById[id].name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--tone-muted)', opacity: 0.6 }}>
                      Opens
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {previewRegion.opens.length === 0 ? (
                        <span className="text-[11px]" style={{ color: 'var(--tone-muted)', opacity: 0.5 }}>Outer edge</span>
                      ) : (
                        previewRegion.opens.map((id) => (
                          <button key={id} type="button" onClick={() => focusRegion(id)} className="orb-node-btn">
                            {regionById[id].name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {previewRegion && previewRegion.routes.length > 0 && (
              <div className="orb-sidebar-panel">
                <div className="orb-panel-label">Go deeper</div>
                <div>
                  {previewRegion.routes.map((route) => (
                    <a
                      key={`${previewRegion.id}-${route.label}`}
                      href={route.href}
                      target={isExternalHref(route.href) ? "_blank" : undefined}
                      rel={isExternalHref(route.href) ? "noreferrer" : undefined}
                      className="orb-route-link"
                    >
                      <div className="orb-route-title">
                        {route.label} {isExternalHref(route.href) ? "↗" : "→"}
                      </div>
                      <div className="orb-route-note">{route.note}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="orb-sidebar-panel">
              <div className="orb-panel-label">All regions</div>
              <div className="space-y-3">
                {phaseGroups.map(({ phase, meta, regions }) => (
                  <div key={phase}>
                    <div className="text-[10px] uppercase tracking-[0.18em] mb-1.5"
                      style={{ color: regions[0]?.accent ? `${regions[0].accent}99` : 'var(--tone-muted)' }}>
                      {meta.label}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {regions.map((region) => {
                        const active = selectedRegionId === region.id;
                        return (
                          <button
                            key={region.id}
                            type="button"
                            onClick={() => focusRegion(region.id)}
                            className="orb-node-btn is-active"
                            style={
                              active
                                ? { borderColor: `${region.accent}66`, background: `${region.accent}14`, color: region.accent }
                                : undefined
                            }
                          >
                            {region.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
