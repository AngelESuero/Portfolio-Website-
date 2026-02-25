export interface XFallbackItem {
  title: string;
  url: string;
  publishedAt: string;
  summary: string;
}

const xFallbackItems: XFallbackItem[] = [
  {
    title: "Now: what I am building and tracking this week",
    url: "/now",
    publishedAt: "2026-02-19T12:00:00.000Z",
    summary: "Current focus areas across archive updates, experiments, and live process."
  },
  {
    title: "AGI timeline: latest signal snapshot",
    url: "/agi",
    publishedAt: "2026-02-18T12:00:00.000Z",
    summary: "Recent signal entries and monitoring notes from the AGI tracker."
  },
  {
    title: "Newark civic mapping thread",
    url: "/work/newark-civic-mapping",
    publishedAt: "2026-02-15T12:00:00.000Z",
    summary: "Field notes and documentation for place-based mapping work."
  },
  {
    title: "Music production sessions archive",
    url: "/work/music-production-sessions",
    publishedAt: "2026-02-12T12:00:00.000Z",
    summary: "Session snapshots, process clips, and in-progress material."
  },
  {
    title: "Archive method notes",
    url: "/writing/archive-method",
    publishedAt: "2026-02-10T12:00:00.000Z",
    summary: "How the archive is structured and updated in public."
  },
  {
    title: "Survival OS: current operating notes",
    url: "/survival-os",
    publishedAt: "2026-02-08T12:00:00.000Z",
    summary: "Framework updates for routines, systems, and project cadence."
  }
];

export default xFallbackItems;
