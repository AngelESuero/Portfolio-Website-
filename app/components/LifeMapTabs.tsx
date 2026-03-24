'use client';

import React, { startTransition, useEffect, useState } from "react";
import LifeMapSemanticOrb from "./LifeMapSemanticOrb";
import UnfurlingLifeModel from "./UnfurlingLifeModel";

type MapView = "atlas" | "unfurling";

const isMapView = (value: string | null): value is MapView =>
  value === "atlas" || value === "unfurling";

const VIEW_META: Record<
  MapView,
  { label: string; eyebrow: string; description: string; accent: string }
> = {
  atlas: {
    label: "Atlas",
    eyebrow: "Spatial systems view",
    description:
      "The original orbital map. Rotate through dependencies, openings, and the regions that hold the rest together.",
    accent: "#d8c18f"
  },
  unfurling: {
    label: "Unfurling",
    eyebrow: "Verbatim reading view",
    description:
      "A scroll-linked pass through survival, stability, and expansion, with quotes intact and plain-language reading underneath.",
    accent: "#e7cba7"
  }
};

export default function LifeMapTabs() {
  const [view, setView] = useState<MapView>("atlas");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryView = params.get("view");
    const hashView = window.location.hash.replace("#", "");
    const initialView = isMapView(queryView)
      ? queryView
      : isMapView(hashView)
        ? hashView
        : null;

    if (initialView) {
      setView(initialView);
    }
  }, []);

  const activateView = (nextView: MapView) => {
    if (nextView === view) return;

    startTransition(() => {
      setView(nextView);
    });
  };

  const current = VIEW_META[view];

  return (
    <div className="pb-10">
      <section className="mx-auto max-w-[1440px] px-4 pt-5 lg:px-6">
        <div
          className="rounded-[1.4rem] border p-4 sm:p-5"
          style={{
            borderColor: "var(--tone-line)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.018))"
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p
                className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.24em]"
                style={{ color: current.accent }}
              >
                {current.eyebrow}
              </p>
              <h2
                className="mt-2 text-[1.35rem] font-medium tracking-[-0.03em] sm:text-[1.7rem]"
                style={{ color: "var(--tone-text)" }}
              >
                {current.label}
              </h2>
              <p
                className="mt-3 max-w-3xl text-[0.94rem] leading-7"
                style={{ color: "var(--tone-muted)" }}
              >
                Switch between the spatial atlas and the new unfurling read. Both live inside the same life-map area, but each emphasizes a different way of seeing the material.
              </p>
            </div>

            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Life map views"
            >
              {(Object.entries(VIEW_META) as [MapView, typeof VIEW_META[MapView]][]).map(
                ([key, meta]) => {
                  const active = key === view;

                  return (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls={`map-view-panel-${key}`}
                      id={`map-view-tab-${key}`}
                      onClick={() => activateView(key)}
                      className="rounded-full border px-4 py-2 text-[0.78rem] font-medium uppercase tracking-[0.16em] transition-colors duration-150"
                      style={{
                        borderColor: active ? `${meta.accent}66` : "var(--tone-line)",
                        background: active ? `${meta.accent}12` : "rgba(255,255,255,0.02)",
                        color: active ? meta.accent : "var(--tone-muted)"
                      }}
                    >
                      {meta.label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <p
            className="mt-4 max-w-[60rem] text-[0.84rem] leading-6 sm:text-[0.88rem]"
            style={{ color: "var(--tone-muted)", opacity: 0.88 }}
          >
            {current.description}
          </p>
        </div>
      </section>

      <div
        role="tabpanel"
        id={`map-view-panel-${view}`}
        aria-labelledby={`map-view-tab-${view}`}
        className="mt-4"
      >
        {view === "atlas" ? <LifeMapSemanticOrb /> : <UnfurlingLifeModel />}
      </div>
    </div>
  );
}
