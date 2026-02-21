"use client";

import { useEffect, useMemo, useState } from "react";

const minuteChoices = [7, 12, 15, 21, 30];
const moodChoices = ["Calm", "Focused", "Drained", "Grateful", "Energized"];
const timelineRanges = [7, 14, 30] as const;

type TrackerState = {
  totalMinutes: number;
  streakDays: number;
  sessions: number;
  lastSessionDate: string | null;
  moodToday: string | null;
  dailyMinutes: Record<string, number>;
};

const initialState: TrackerState = {
  totalMinutes: 9971,
  streakDays: 350,
  sessions: 601,
  lastSessionDate: null,
  moodToday: null,
  dailyMinutes: {}
};

const storageKey = "meditation-tracker-v1";

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(previousDate: string, currentDate: string) {
  const start = new Date(previousDate + "T00:00:00");
  const end = new Date(currentDate + "T00:00:00");
  return Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
}

function getRecentDays(count: number) {
  const days: string[] = [];
  const current = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(current);
    d.setDate(current.getDate() - i);
    days.push(todayKey(d));
  }
  return days;
}

function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

export default function HomePage() {
  const [minutes, setMinutes] = useState(7);
  const [tracker, setTracker] = useState<TrackerState>(initialState);
  const [timelineRange, setTimelineRange] = useState<(typeof timelineRanges)[number]>(14);
  const [message, setMessage] = useState("Select minutes and lock in your session.");

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as TrackerState;
      setTracker({ ...initialState, ...parsed });
    } catch {
      setTracker(initialState);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tracker));
  }, [tracker]);

  const level = useMemo(() => Math.max(1, Math.floor(tracker.totalMinutes / 380)), [tracker.totalMinutes]);
  const levelProgress = useMemo(() => Math.min(100, ((tracker.totalMinutes % 380) / 380) * 100), [tracker.totalMinutes]);
  const timeline = useMemo(() => {
    const days = getRecentDays(timelineRange);
    const points = days.map((day) => ({
      day,
      label: new Date(day + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" }),
      axisLabel: new Date(day + "T00:00:00").toLocaleDateString(undefined, { month: "numeric", day: "numeric" }),
      minutes: tracker.dailyMinutes[day] ?? 0
    }));
    const peak = Math.max(...points.map((point) => point.minutes), 1);
    const total = points.reduce((sum, point) => sum + point.minutes, 0);
    const average = Math.round((total / points.length) * 10) / 10;
    const labelStride = timelineRange === 30 ? 5 : timelineRange === 14 ? 2 : 1;
    return { points, peak, total, average, labelStride };
  }, [timelineRange, tracker.dailyMinutes]);
  const timelineChart = useMemo(() => {
    const width = 560;
    const height = 190;
    const left = 10;
    const right = width - 10;
    const top = 14;
    const bottom = height - 36;
    const span = Math.max(1, timeline.points.length - 1);
    const coords = timeline.points.map((point, index) => {
      const x = left + (index / span) * (right - left);
      const y = bottom - (point.minutes / timeline.peak) * (bottom - top);
      return { ...point, x, y };
    });
    const line = buildSmoothPath(coords);
    const area = `${line} L ${right} ${bottom} L ${left} ${bottom} Z`;
    const averageY = bottom - (timeline.average / timeline.peak) * (bottom - top);
    return { width, height, left, right, top, bottom, coords, line, area, averageY };
  }, [timeline]);

  const startSession = () => {
    const today = todayKey();
    const last = tracker.lastSessionDate;
    let nextStreak = tracker.streakDays;
    if (!last) nextStreak = 1;
    else {
      const delta = daysBetween(last, today);
      if (delta === 1) nextStreak += 1;
      else if (delta > 1) nextStreak = 1;
    }

    setTracker((current) => ({
      ...current,
      totalMinutes: current.totalMinutes + minutes,
      sessions: current.sessions + 1,
      streakDays: nextStreak,
      lastSessionDate: today,
      dailyMinutes: {
        ...current.dailyMinutes,
        [today]: (current.dailyMinutes[today] ?? 0) + minutes
      }
    }));
    setMessage(`Session complete: +${minutes} min. Keep the streak alive.`);
  };

  return (
    <main className="min-h-screen bg-black px-5 py-6 text-white md:px-8">
      <div className="mx-auto max-w-xl space-y-5">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#090b16] to-black p-5">
          <p className="text-sm text-white/60">Select minutes</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {minuteChoices.map((choice) => (
              <button
                key={choice}
                onClick={() => setMinutes(choice)}
                className={`min-w-16 rounded-full px-4 py-2 text-lg ${
                  minutes === choice ? "bg-white text-black" : "bg-white/10 text-white/80"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
          <button
            onClick={startSession}
            className="mt-4 w-full rounded-full bg-[#ff1a1a] px-5 py-4 text-center text-3xl font-medium tracking-tight"
          >
            Let&apos;s BOOM!
          </button>
          <p className="mt-3 text-sm text-white/60">{message}</p>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-[#070b18] via-[#060b22] to-[#a60f1f] p-5">
          <p className="text-white/60">Streak</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-5xl font-semibold">{tracker.streakDays} days</p>
            <p className="max-w-[180px] text-right text-2xl text-white/90">You&apos;ve reached a miracle moment!</p>
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-[#271d58] to-[#050814] p-5">
          <p className="text-white/60">Life-Hopscotch</p>
          <p className="mt-2 text-5xl italic">How are you feeling?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {moodChoices.map((mood) => (
              <button
                key={mood}
                onClick={() => setTracker((current) => ({ ...current, moodToday: mood }))}
                className={`rounded-full border px-4 py-2 text-sm ${
                  tracker.moodToday === mood
                    ? "border-white bg-white text-black"
                    : "border-white/30 bg-white/10 text-white"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-white/70">
            Today&apos;s mood: <span className="font-semibold text-white">{tracker.moodToday ?? "Not tracked yet"}</span>
          </p>
        </section>

        <section className="rounded-3xl bg-[#080d1f] p-5">
          <p className="text-2xl text-white/60">Time meditated</p>
          <p className="mt-2 text-6xl font-semibold">
            {tracker.totalMinutes}
            <span className="ml-2 text-white/50">mins</span>
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="h-3 w-full rounded-full bg-white/15">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${levelProgress}%` }} />
            </div>
            <p className="min-w-fit text-xl text-white/70">Level {level}</p>
          </div>
          <p className="mt-3 text-sm text-white/50">Sessions completed: {tracker.sessions}</p>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-[#0a1126] to-[#0d0a1a] p-5">
          <div className="flex items-end justify-between gap-4">
            <p className="text-2xl text-white/80">Timeline</p>
            <div className="flex gap-2">
              {timelineRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimelineRange(range)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    timelineRange === range ? "bg-white text-black" : "bg-white/10 text-white/70"
                  }`}
                >
                  {range}d
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <svg viewBox={`0 0 ${timelineChart.width} ${timelineChart.height}`} className="h-44 w-full overflow-visible">
              <defs>
                <linearGradient id="lineGlow" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#ff4d4d" />
                  <stop offset="100%" stopColor="#ff9f6e" />
                </linearGradient>
                <linearGradient id="areaGlow" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff5b5b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ff5b5b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line
                x1={timelineChart.left}
                y1={timelineChart.bottom}
                x2={timelineChart.right}
                y2={timelineChart.bottom}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="4 4"
              />
              <line
                x1={timelineChart.left}
                y1={timelineChart.averageY}
                x2={timelineChart.right}
                y2={timelineChart.averageY}
                stroke="rgba(255,255,255,0.35)"
                strokeDasharray="5 5"
              />
              <path d={timelineChart.area} fill="url(#areaGlow)" />
              <path d={timelineChart.line} fill="none" stroke="url(#lineGlow)" strokeWidth="3.5" strokeLinecap="round" />
              <text
                x={timelineChart.right - 2}
                y={Math.max(12, timelineChart.averageY - 6)}
                textAnchor="end"
                fontSize="10"
                fill="rgba(255,255,255,0.75)"
              >
                avg {timeline.average}m
              </text>
              {timelineChart.coords.map((coord) => {
                const isToday = coord.day === todayKey();
                return (
                  <g key={coord.day}>
                    <circle cx={coord.x} cy={coord.y} r={isToday ? 5.5 : 4} fill={isToday ? "#ffffff" : "#ff6d6d"} />
                    <title>{`${coord.day}: ${coord.minutes} mins`}</title>
                  </g>
                );
              })}
              {timelineChart.coords.map((coord, index) => {
                const shouldShow = index % timeline.labelStride === 0 || index === timelineChart.coords.length - 1;
                if (!shouldShow) return null;
                return (
                  <text key={`label-${coord.day}`} x={coord.x} y={timelineChart.height - 8} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.55)">
                    {coord.axisLabel}
                  </text>
                );
              })}
            </svg>
          </div>
          <p className="mt-2 text-sm text-white/60">
            {timelineRange} day total: <span className="text-white">{timeline.total} mins</span> | Peak day:{" "}
            <span className="text-white">{timeline.peak} mins</span> | Avg: <span className="text-white">{timeline.average} mins/day</span>
          </p>
        </section>
      </div>
    </main>
  );
}
