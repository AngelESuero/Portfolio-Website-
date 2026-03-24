'use client';

import React, { useEffect, useMemo, useState } from "react";

type Entry = {
  quote: string;
  read: string;
  incomplete?: boolean;
};

type Section = {
  key: "survival" | "stability" | "expansion";
  title: string;
  description: string;
  entries: Entry[];
};

const SECTIONS: Section[] = [
  {
    key: "survival",
    title: "Survival",
    description: "resources, debt, food, retreat, and the basic ability to function",
    entries: [
      {
        quote: "I want more access to the resources",
        read: "The opening frame — resources as the gate to everything else."
      },
      {
        quote: "clear out all my debt",
        read: "First named step in a self-described sequence."
      },
      {
        quote:
          "I just don’t really want to work out right now because I don’t have the resources to buy better food for myself",
        read: "Food scarcity as the current ceiling on physical development."
      },
      {
        quote:
          "I can’t even get food for myself, normally because I don’t have enough resources. So yeah, that sucks.",
        read: "Baseline food instability stated plainly."
      },
      {
        quote:
          "I think I’m always going backwards. I’m always trying to, like, hide away and going toward the basement.",
        read: "Pattern of retreat — named and recognized as a problem."
      },
      {
        quote:
          "The memory restaurant comes for me, but it usually doesn’t solve my problems.",
        read:
          "“Memory restaurant” is unclear — likely nostalgia or a habitual retreat into memory or comfort. Idea trails off.",
        incomplete: true
      },
      {
        quote:
          "working towards being more conscious so I can handle everything is the solution. Or kind of what I can, you know? So I can always do my best. Whatever that is.",
        read:
          "Consciousness as the practical answer to overwhelm — ends without fully landing."
      },
      {
        quote: "I don’t know, get my best food, right? Yeah. Yeah.",
        read:
          "Trailing thought — likely circling back to food as the most immediate survival need.",
        incomplete: true
      }
    ]
  },
  {
    key: "stability",
    title: "Stability",
    description: "credit, housing, health access, family support, and broader access to life",
    entries: [
      {
        quote: "fix my credit",
        read:
          "Second step in his own sequence. Named as a prerequisite to housing."
      },
      {
        quote:
          "get an apartment, but I don’t even know what, where I want to be, like where, what part I want to get",
        read: "Apartment as the goal — location still open and unresolved."
      },
      {
        quote: "I want to use the jacked plate stuff",
        read: "Weight training — wants access to real equipment."
      },
      {
        quote: "I could actually the Y.",
        read: "Likely “I could go to the Y” — sentence dropped mid-thought.",
        incomplete: true
      },
      {
        quote: "I want to get a swimming pool or get access to their swimming pool",
        read: "Pool access — part of a fuller physical life."
      },
      {
        quote: "I want, you know, to use your basketball court",
        read: "Basketball court access — part of the same physical vision."
      },
      {
        quote:
          "I want to have a better relationship with my family members, but I think the only way to do that is really just have my money",
        read:
          "Material stability named as the condition for family relationships to improve."
      },
      {
        quote: "I’m gonna provide offerings to my family in that regard",
        read:
          "Refers to healthcare and school research — support as an active offering, not just presence."
      },
      {
        quote:
          "my niece is answering kindergarten soon, and I want her to be prepared for that",
        read:
          "“Answering” likely “entering.” Care for niece’s educational start as a specific near-term responsibility."
      },
      {
        quote: "what public schools are good and what publishers are bad",
        read:
          "“Publishers” likely “schools” again — idea of researching school quality for family, sentence loses track of itself.",
        incomplete: true
      },
      {
        quote:
          "I’m sitting with my cousins, uh, a daughter. You gonna have a daughter too?",
        read:
          "Unclear — possibly his cousin is expecting a daughter, or he’s thinking about his own future child. Sentence trails off entirely.",
        incomplete: true
      },
      {
        quote:
          "I want to have access to a college like my college, just be able to be in contact with professors that I think are dope",
        read:
          "Intellectual access — staying connected to university-level thought even outside of enrollment."
      },
      {
        quote:
          "I’ve emailed a couple, but some of them haven’t responded, but even in that way, I still want to have access to an intellectual basis, a community of intellectual, that I can have discourse with, so I’m not left alone, mental state, state of intellectual confusers",
        read:
          "Active attempt already made. The fear named is intellectual isolation and confusion without community."
      },
      {
        quote:
          "I want to go visit different spaces of New York. I wanna go to some Broadway shows.",
        read: "Cultural access — New York as a resource, not just a backdrop."
      },
      {
        quote: "I want to get more information about health, healthcare",
        read:
          "Healthcare literacy — for self and family. Idea is gestured at but not developed."
      }
    ]
  },
  {
    key: "expansion",
    title: "Expansion",
    description: "music, home, intimacy, contribution, and a fuller way of showing up",
    entries: [
      {
        quote:
          "I want to make more music, but I want to make more music that’s like artistically aligned with my with truth, not even my psychological basis and likes and dislikes. Like truth itself and forwarding me forward in that direction.",
        read:
          "Music as a vehicle for truth — not taste, mood, or self-expression as habit. Direction is the standard."
      },
      {
        quote:
          "I wanna make a family, build a family home, but I want it to be alive, which I grew, like, perceptions about geometry.",
        read:
          "Family home with a spatial or health philosophy behind it — geometry as a structural principle for well-being."
      },
      {
        quote:
          "I feel like living situations are unhealthy, but I feel like people like Anita space to be kind of away from the world so that they could prepare better for the world.",
        read:
          "“Anita” likely “need a.” The idea — that healthy living spaces offer retreat so people can re-enter the world better — is present but the sentence breaks before landing cleanly.",
        incomplete: true
      },
      {
        quote:
          "a structure that’s built in a geometric way that produces and supports well-being is kind of a lot of, like, people helping to build a core tour of health",
        read:
          "“Core tour” likely “culture.” Geometric home as a contributor to a health culture — idea is there but sentence collapses before completing it.",
        incomplete: true
      },
      {
        quote:
          "I can always feel like I’m passionately supporting the people that are in my life",
        read:
          "The home as a platform for support — being able to show up for others from a stable base."
      },
      {
        quote:
          "I want a Tesla or like at least like an EV… maybe a Rivian? Because I want a truck because especially because I live in a snowy location.",
        read: "EV vehicle — snow-readiness and autonomy are the practical drivers."
      },
      {
        quote:
          "Jeep Wrangler, the one that styles drove. Oh, yeah, if there’s an EV variant of that, that’d be cool. I could drive itself. I doubt I doubt it was autonomous.",
        read:
          "“Styles” likely Tyler, the Creator. The EV Wrangler idea — vehicle autonomy mentioned then immediately walked back. Thought ends without a landing.",
        incomplete: true
      },
      {
        quote: "I want to start on my ex. Like, uh, not really, but like, sort of.",
        read:
          "Said and immediately hedged twice. Something is alive here — not finished and possibly not ready to be.",
        incomplete: true
      },
      {
        quote:
          "I want, uh, again, a girlfriend and I miss being physical with someone who I was keeping him out in love with.",
        read:
          "“Keeping him out” likely “kind of.” Longing for physical and emotional intimacy with someone he was genuinely in love with."
      },
      {
        quote:
          "I just want the connection to be kind of genuine, sort of like a Gwen Stacy and Peter Parker from the Tom Holland universe relationship, but not with all her death around and stuff like that",
        read:
          "Reference point for the kind of chemistry and warmth he wants — organic, high-chemistry, real."
      },
      {
        quote:
          "Kludos to those 2 guys, those 2 people, from being very actors. If it wasn’t true.",
        read:
          "“Kludos” = kudos. Likely: “if the chemistry wasn’t real between the actors, they were incredible at faking it.” Sentence doesn’t fully arrive.",
        incomplete: true
      },
      {
        quote: "I want to be able to stream, have a very extremely setup",
        read:
          "“Extremely” likely “extreme” or “professional.” A real streaming infrastructure — idea lands but the description cuts short.",
        incomplete: true
      },
      {
        quote:
          "I want to be able to talk to people, not so awkward, and not so isolatorial",
        read:
          "Wanting to be present with people without isolation as the default mode."
      },
      {
        quote:
          "I want to be able to look people at where they’re at, and I feel like I have to confront them about what I see",
        read:
          "A desire to be honest and perceptive with people — to see them clearly and not flinch from it."
      },
      {
        quote:
          "I want to be able to be loving and have that be accurate truth, you know, just a way to, you know, disguise my own inevitable, uh, emotional, turmoil",
        read:
          "He’s naming the risk here — that love becomes a cover for his own unresolved pain. He wants love to be real, not functional."
      },
      {
        quote:
          "I want to be able to be honest about the circumstances and explanations of life and well-being and help provide that support",
        read:
          "Honest presence as a form of contribution — not performing wellness, actually delivering it."
      },
      {
        quote:
          "I want to be a great guy so that 2 people can see and know that they’re not alone in being good guys and great guys themselves",
        read:
          "Not visibility for its own sake — modeling goodness so others feel permission to live it too."
      },
      {
        quote:
          "I want, I grew with each foundation to have more involvement with, you know, communities that are suffering. I want each foundation grow into a bigger thing.",
        read:
          "“I grew” likely “I want.” The Each Foundation as the societal vehicle — scaling real community support."
      },
      {
        quote:
          "I really think that that’s the only thing that’s gonna help the world. You know, at least it has some perspective to help the world in the correct way.",
        read:
          "The Each Foundation positioned as a genuine answer — but the framing trails off before it becomes a full claim.",
        incomplete: true
      },
      {
        quote:
          "I want my community and city government to be actually for the people",
        read: "Civic expectation — government as a system that serves life, not itself."
      },
      {
        quote:
          "I don’t want to have to deal with and get involved with Bronco’s law history of problems for the city to be better",
        read:
          "“Bronco” likely Mayor Ras Baraka. The city’s political dysfunction named as a burden he doesn’t want to absorb. Idea is present but cuts off before the full argument lands.",
        incomplete: true
      },
      {
        quote:
          "I think people should be taking responsibility for themselves and for their own life, and for their emotions, for their mind, for their body, for their everything, that they don’t leave that pressure on somebody else unconsciously",
        read:
          "Responsibility as the societal principle — individual accountability as the mechanism for collective well-being."
      },
      {
        quote: "everything about the life a conscious process",
        read:
          "The summary principle — consciousness as the meta-answer to most of what he named."
      }
    ]
  }
];

const SECTION_THEMES = {
  survival: {
    line: "rgba(245, 185, 55, 0.34)",
    accent: "rgba(247, 220, 114, 0.86)",
    wash: "rgba(245, 185, 55, 0.05)"
  },
  stability: {
    line: "rgba(124, 193, 229, 0.30)",
    accent: "rgba(182, 226, 245, 0.84)",
    wash: "rgba(124, 193, 229, 0.045)"
  },
  expansion: {
    line: "rgba(185, 172, 236, 0.30)",
    accent: "rgba(217, 208, 249, 0.84)",
    wash: "rgba(185, 172, 236, 0.045)"
  }
} as const;

const ENTRY_MARKERS = {
  base: { symbol: "◆", label: "base" },
  loop: { symbol: "↺", label: "loop" },
  build: { symbol: "⌂", label: "build" },
  bond: { symbol: "♡", label: "bond" },
  truth: { symbol: "✦", label: "truth" },
  reach: { symbol: "⚑", label: "reach" }
} as const;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => 0.5 - Math.cos(Math.PI * clamp(t, 0, 1)) / 2;

function validateSections(): void {
  console.assert(SECTIONS.length === 3, "Expected exactly three sections.");
  console.assert(clamp(-5, 0, 1) === 0, "Clamp should respect lower bound.");
  console.assert(clamp(2, 0, 1) === 1, "Clamp should respect upper bound.");
  SECTIONS.forEach((section) => {
    console.assert(section.entries.length > 0, `${section.key} should have entries.`);
    console.assert(section.description.length > 0, `${section.key} should have a description.`);
  });
}

validateSections();

function inferEntryMarker(entry: Entry, sectionKey: Section["key"]) {
  const text = `${entry.quote} ${entry.read}`.toLowerCase();

  if (text.includes("resources") || text.includes("debt") || text.includes("food")) return ENTRY_MARKERS.base;
  if (text.includes("backwards") || text.includes("hide away") || text.includes("basement") || text.includes("memory") || text.includes("awkward") || text.includes("turmoil")) return ENTRY_MARKERS.loop;
  if (text.includes("girlfriend") || text.includes("family") || text.includes("niece") || text.includes("cousin") || text.includes("ex") || text.includes("connection") || text.includes("in love")) return ENTRY_MARKERS.bond;
  if (text.includes("community") || text.includes("city") || text.includes("government") || text.includes("world") || text.includes("mayor") || text.includes("people")) return ENTRY_MARKERS.reach;
  if (text.includes("apartment") || text.includes("credit") || text.includes("home") || text.includes("house") || text.includes("geometry") || text.includes("pool") || text.includes("basketball") || text.includes("y.") || text.includes("tesla") || text.includes("rivian") || text.includes("jeep") || text.includes("truck") || text.includes("college") || text.includes("professor") || text.includes("broadway") || text.includes("healthcare")) return ENTRY_MARKERS.build;
  if (text.includes("music") || text.includes("stream") || text.includes("truth") || text.includes("conscious") || text.includes("honest") || text.includes("well-being") || text.includes("great guy")) return ENTRY_MARKERS.truth;
  if (sectionKey === "survival") return ENTRY_MARKERS.base;
  if (sectionKey === "stability") return ENTRY_MARKERS.build;
  return ENTRY_MARKERS.truth;
}

function getEntryWeight(entry: Entry, index: number): "lead" | "heavy" | "frayed" | "body" {
  if (index === 0) return "lead";
  if (entry.quote.length > 190) return "heavy";
  if (entry.incomplete) return "frayed";
  return "body";
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-white/[0.035] px-3.5 py-2.5 text-[11px] tracking-[0.16em] text-stone-300 transition hover:bg-white/[0.055]"
      style={{
        borderColor: "var(--tone-line)",
        background: "color-mix(in srgb, var(--tone-surface) 88%, transparent)",
        color: "var(--tone-muted)"
      }}
    >
      <span
        className="relative h-5 w-9 rounded-full transition"
        style={{
          background: value
            ? "color-mix(in srgb, var(--tone-accent) 18%, var(--tone-surface-strong))"
            : "color-mix(in srgb, var(--tone-line) 72%, transparent)"
        }}
      >
        <span className={`absolute top-1 h-3 w-3 rounded-full bg-stone-100 transition-transform ${value ? "translate-x-5" : "translate-x-1"}`} />
      </span>
      <span>{value ? "hide reads" : "show reads"}</span>
    </button>
  );
}

function ModelGraphic({ progress }: { progress: number }) {
  const p = ease(progress);
  const shellOpen = lerp(16, 128, p);
  const innerOpen = lerp(8, 86, p);
  const glow = lerp(0.1, 0.28, p);
  const stemY = lerp(514, 438, p);

  return (
    <svg viewBox="0 0 520 760" className="h-auto w-full" role="img" aria-label="An unfurling form that opens as progress increases.">
      <defs>
        <radialGradient id="fieldGlow" cx="50%" cy="55%" r="58%">
          <stop offset="0%" stopColor="rgba(255,244,220,0.10)" />
          <stop offset="70%" stopColor="rgba(255,244,220,0.03)" />
          <stop offset="100%" stopColor="rgba(255,244,220,0)" />
        </radialGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor={`rgba(255,240,200,${glow})`} />
          <stop offset="100%" stopColor="rgba(255,240,200,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="520" height="760" fill="url(#fieldGlow)" />
      <ellipse cx="260" cy="640" rx="150" ry="60" fill="rgba(255,255,255,0.02)" />
      <ellipse cx="260" cy="640" rx="110" ry="36" fill="rgba(255,231,184,0.10)" />
      <ellipse cx="260" cy={stemY} rx="90" ry="110" fill="url(#coreGlow)" />

      <path
        d={`M 260 618 C 210 602, 180 592, 150 575 L 160 650 C 195 660, 222 666, 260 668 C 298 666, 325 660, 360 650 L 370 575 C 340 592, 310 602, 260 618 Z`}
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1.1"
      />

      <path
        d={`M 260 604 C ${260 - shellOpen} 560, ${260 - shellOpen * 1.15} 488, ${260 - shellOpen * 0.92} 378 C ${260 - shellOpen * 0.34} 430, ${260 - shellOpen * 0.14} 512, 260 604 Z`}
        fill="rgba(255,248,238,0.68)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      <path
        d={`M 260 604 C ${260 + shellOpen} 560, ${260 + shellOpen * 1.15} 488, ${260 + shellOpen * 0.92} 378 C ${260 + shellOpen * 0.34} 430, ${260 + shellOpen * 0.14} 512, 260 604 Z`}
        fill="rgba(255,248,238,0.68)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      <path
        d={`M 260 602 C ${260 - innerOpen} 560, ${260 - innerOpen * 0.95} 508, ${260 - innerOpen * 0.72} 430 C ${260 - innerOpen * 0.24} 470, ${260 - innerOpen * 0.08} 536, 260 602 Z`}
        fill="rgba(255,243,230,0.86)"
        stroke="rgba(255,255,255,0.11)"
        strokeWidth="0.95"
      />
      <path
        d={`M 260 602 C ${260 + innerOpen} 560, ${260 + innerOpen * 0.95} 508, ${260 + innerOpen * 0.72} 430 C ${260 + innerOpen * 0.24} 470, ${260 + innerOpen * 0.08} 536, 260 602 Z`}
        fill="rgba(255,243,230,0.86)"
        stroke="rgba(255,255,255,0.11)"
        strokeWidth="0.95"
      />

      <path
        d={`M 260 604 L 260 ${lerp(556, 402, p)}`}
        stroke="rgba(255,244,220,0.62)"
        strokeWidth={lerp(2.1, 1.25, p)}
        strokeLinecap="round"
      />
      <circle cx="260" cy="604" r="4.5" fill="rgba(255,244,220,0.72)" />
    </svg>
  );
}

function ModelSectionList({ currentKey }: { currentKey: Section["key"] }) {
  return (
    <div className="space-y-2.5">
      {SECTIONS.map((section) => {
        const theme = SECTION_THEMES[section.key];
        const active = currentKey === section.key;
        return (
          <div
            key={section.key}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition"
            style={{ background: active ? theme.wash : "transparent" }}
          >
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: active ? theme.accent : "rgba(255,255,255,0.22)",
                boxShadow: active ? `0 0 0 6px ${theme.wash}` : "none"
              }}
            />
            <div className={active ? "text-stone-200" : "text-stone-500"}>{section.title}</div>
          </div>
        );
      })}
    </div>
  );
}

type QuoteEntryProps = {
  entry: Entry;
  index: number;
  sectionKey: Section["key"];
  isLast?: boolean;
  showInterpretations?: boolean;
};

function QuoteEntry({
  entry,
  index,
  sectionKey,
  isLast = false,
  showInterpretations = true
}: QuoteEntryProps) {
  const theme = SECTION_THEMES[sectionKey];
  const weight = getEntryWeight(entry, index);
  const marker = inferEntryMarker(entry, sectionKey);
  const quoteClass =
    weight === "lead"
      ? "text-[1.18rem] leading-8 sm:text-[1.28rem] sm:leading-9"
      : weight === "heavy"
        ? "text-[1.06rem] leading-8 sm:text-[1.12rem] sm:leading-8"
        : "text-[1.01rem] leading-8 sm:text-[1.05rem] sm:leading-8";

  return (
    <article className={`relative grid grid-cols-[3.75rem_minmax(0,1fr)] gap-3 px-4 py-7 sm:grid-cols-[4.25rem_minmax(0,1fr)] sm:gap-5 sm:px-8 sm:py-8 ${isLast ? "" : "border-b border-white/5"}`}>
      <div className="relative flex flex-col items-center pt-1">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border text-[0.95rem] text-stone-200 sm:h-10 sm:w-10"
          style={{
            borderColor: "var(--tone-line)",
            background: `color-mix(in srgb, ${theme.wash} 74%, var(--tone-surface))`,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
            color: "var(--tone-text)"
          }}
          aria-label={showInterpretations ? marker.label : "entry"}
          title={showInterpretations ? marker.label : "entry"}
        >
          {showInterpretations ? marker.symbol : "•"}
        </div>
        <div className="mt-2 text-[10px] tracking-[0.12em] text-stone-600">{String(index + 1).padStart(2, "0")}</div>
        <div
          className="absolute bottom-0 left-1/2 top-[3.6rem] w-px -translate-x-1/2"
          style={{
            background: isLast ? "transparent" : "linear-gradient(180deg, var(--tone-line), rgba(255,255,255,0.02))"
          }}
        />
      </div>

      <div className="min-w-0 max-w-[72ch]">
        <blockquote className="relative pl-4 sm:pl-5">
          <div className="absolute left-0 top-0 text-[1.5rem] leading-none text-white/12">“</div>
          <div className={`font-serif ${quoteClass}`} style={{ color: "var(--tone-text)" }}>{entry.quote}</div>
        </blockquote>

        {showInterpretations ? (
          <div className="mt-4 pl-4 sm:pl-5">
            {entry.incomplete ? (
              <div
                className="mb-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] tracking-[0.12em]"
                style={{
                  borderColor: "color-mix(in srgb, var(--tone-accent) 18%, var(--tone-line))",
                  background: "color-mix(in srgb, var(--tone-accent) 10%, transparent)",
                  color: "color-mix(in srgb, var(--tone-accent-glow) 70%, var(--tone-muted))"
                }}
              >
                unfinished edge
              </div>
            ) : null}
            <p className="max-w-[68ch] text-[0.95rem] leading-7" style={{ color: "var(--tone-muted)" }}>{entry.read}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

type SectionBlockProps = {
  section: Section;
  progress: number;
  showInterpretations?: boolean;
};

function SectionBlock({
  section,
  progress,
  showInterpretations = true
}: SectionBlockProps) {
  const active =
    section.key === "survival"
      ? progress < 0.28
      : section.key === "stability"
        ? progress < 0.66
        : progress >= 0.66;
  const theme = SECTION_THEMES[section.key];

  return (
    <section className="py-10 sm:py-14">
      <div
        className="relative overflow-hidden rounded-[1.6rem] border bg-white/[0.018] transition-all duration-300"
        style={{
          borderColor: active ? "color-mix(in srgb, var(--tone-line) 96%, rgba(255,255,255,0.04))" : "var(--tone-line)",
          background: active
            ? `linear-gradient(180deg, color-mix(in srgb, ${theme.wash} 82%, var(--tone-surface)), color-mix(in srgb, var(--tone-surface) 96%, transparent) 34%, color-mix(in srgb, var(--tone-surface-strong) 94%, transparent) 100%)`
            : "linear-gradient(180deg, color-mix(in srgb, var(--tone-surface) 92%, transparent), color-mix(in srgb, var(--tone-surface-strong) 94%, transparent))",
          boxShadow: active ? "0 18px 46px rgba(0,0,0,0.14)" : "none"
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.line}, transparent)` }} />

        <div className="border-b border-white/6 px-5 py-6 sm:px-8 sm:py-8">
          <div className="max-w-3xl">
            <h2 className="text-[2rem] font-medium tracking-[-0.03em] sm:text-[2.25rem]" style={{ color: "var(--tone-text)" }}>{section.title}</h2>
            <p className="mt-3 max-w-[56ch] text-[0.96rem] leading-7" style={{ color: "var(--tone-muted)" }}>{section.description}</p>
          </div>
        </div>

        <div>
          {section.entries.map((entry, index) => (
            <QuoteEntry
              key={`${section.key}-${index}`}
              entry={entry}
              index={index}
              sectionKey={section.key}
              isLast={index === section.entries.length - 1}
              showInterpretations={showInterpretations}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function UnfurlingLifeModel() {
  const [progress, setProgress] = useState(0);
  const [showInterpretations, setShowInterpretations] = useState(true);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const total = doc.scrollHeight - window.innerHeight;
        const next = total <= 0 ? 0 : window.scrollY / total;
        setProgress(clamp(next, 0, 1));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = useMemo(() => {
    if (progress < 0.28) return SECTIONS[0];
    if (progress < 0.66) return SECTIONS[1];
    return SECTIONS[2];
  }, [progress]);

  const currentTheme = SECTION_THEMES[current.key];

  return (
    <div
      className="min-h-[300vh] text-stone-100"
      style={{
        background:
          "radial-gradient(42rem 22rem at 78% 8%, color-mix(in srgb, var(--tone-sky) 12%, transparent), transparent 72%), radial-gradient(38rem 20rem at 18% 14%, color-mix(in srgb, var(--tone-accent) 12%, transparent), transparent 74%), linear-gradient(180deg, color-mix(in srgb, var(--tone-bg-deep) 90%, black), color-mix(in srgb, var(--tone-bg) 96%, black))"
      }}
    >
      <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.34fr)_minmax(320px,0.58fr)] lg:gap-16 lg:px-10">
        <div className="py-[4vh] lg:order-1 lg:pt-2 lg:pb-[8vh]">
          <div className="mb-4 flex items-center justify-end lg:mb-3">
            <Toggle value={showInterpretations} onChange={() => setShowInterpretations((value) => !value)} />
          </div>

          {SECTIONS.map((section) => (
            <SectionBlock
              key={section.key}
              section={section}
              progress={progress}
              showInterpretations={showInterpretations}
            />
          ))}
        </div>

        <div className="lg:order-2 lg:sticky lg:top-8 lg:flex lg:h-[86vh] lg:items-start">
          <div className="relative w-full">
            <div
              className="overflow-hidden rounded-[1.9rem] border bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),rgba(255,255,255,0.012)_58%,rgba(255,255,255,0)_100%)] p-5 sm:p-6"
              style={{
                borderColor: "var(--tone-line)",
                background:
                  "radial-gradient(circle at center, color-mix(in srgb, var(--tone-surface) 28%, rgba(255,255,255,0.05)), color-mix(in srgb, var(--tone-surface) 8%, transparent) 58%, rgba(255,255,255,0) 100%)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.015) inset"
              }}
            >
              <div
                className="rounded-[1.45rem] border px-4 py-5"
                style={{
                  borderColor: "var(--tone-line)",
                  background: "color-mix(in srgb, var(--tone-surface-strong) 78%, rgba(10,12,16,0.24))"
                }}
              >
                <ModelGraphic progress={progress} />
              </div>

              <div className="mt-5 space-y-5">
                <div className="h-[3px] overflow-hidden rounded-full" style={{ background: "color-mix(in srgb, var(--tone-line) 86%, transparent)" }}>
                  <div
                    className="h-full rounded-full transition-[width] duration-150"
                    style={{
                      width: `${progress * 100}%`,
                      background: `linear-gradient(90deg, ${currentTheme.accent}, rgba(255,255,255,0.42))`
                    }}
                  />
                </div>

                <div
                  className="rounded-[1.15rem] border px-4 py-4"
                  style={{
                    borderColor: "var(--tone-line)",
                    background: "color-mix(in srgb, var(--tone-surface) 84%, rgba(10,12,16,0.24))"
                  }}
                >
                  <div className="text-[1.08rem] font-medium" style={{ color: "var(--tone-text)" }}>{current.title}</div>
                  <p className="mt-2 text-[0.93rem] leading-7" style={{ color: "var(--tone-muted)" }}>{current.description}</p>
                </div>

                <div
                  className="rounded-[1.15rem] border p-2.5"
                  style={{
                    borderColor: "var(--tone-line)",
                    background: "color-mix(in srgb, var(--tone-surface) 76%, transparent)"
                  }}
                >
                  <ModelSectionList currentKey={current.key} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
