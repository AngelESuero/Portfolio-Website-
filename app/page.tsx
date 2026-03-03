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
    <main className="min-h-screen bg-[#4d4d4d] px-4 py-5 text-white sm:px-5 sm:py-6 md:px-8">
      <div className="mx-auto max-w-xl space-y-5">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#53545c] to-[#4d4d4d] p-5">
          <p className="text-sm text-white/60">Select minutes</p>
          <div className="mt-3 flex flex-wrap gap-2 pb-2 sm:flex-nowrap sm:overflow-x-auto sm:pr-1">
            {minuteChoices.map((choice) => (
              <button
                key={choice}
                onClick={() => setMinutes(choice)}
                className={`min-w-[4rem] rounded-full px-4 py-2 text-base sm:text-lg ${
                  minutes === choice ? "bg-white text-[#4d4d4d]" : "bg-white/10 text-white/80"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
          <button
            onClick={startSession}
            className="mt-4 w-full rounded-full bg-[#ff5f5f] px-5 py-3.5 text-center text-2xl font-medium tracking-tight sm:py-4 sm:text-3xl"
          >
            Let&apos;s BOOM!
          </button>
          <p className="mt-3 text-sm text-white/60">{message}</p>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-[#51545d] via-[#515464] to-[#c15762] p-5">
          <p className="text-white/60">Streak</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-4xl font-semibold leading-none sm:text-5xl">{tracker.streakDays} days</p>
            <p className="max-w-full text-left text-lg leading-tight text-white/90 sm:max-w-[180px] sm:text-right sm:text-2xl">
              You&apos;ve reached a miracle moment!
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-[#68618a] to-[#50525b] p-5">
          <p className="text-white/60">Life-Hopscotch</p>
          <p className="mt-2 text-3xl italic leading-tight sm:text-5xl">How are you feeling?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {moodChoices.map((mood) => (
              <button
                key={mood}
                onClick={() => setTracker((current) => ({ ...current, moodToday: mood }))}
                className={`rounded-full border px-4 py-2 text-sm ${
                  tracker.moodToday === mood
                    ? "border-white bg-white text-[#4d4d4d]"
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

        <section className="rounded-3xl bg-[#525662] p-5">
          <p className="text-xl text-white/60 sm:text-2xl">Time meditated</p>
          <p className="mt-2 text-5xl font-semibold leading-none sm:text-6xl">
            {tracker.totalMinutes}
            <span className="ml-2 text-white/50">mins</span>
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="h-3 w-full rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#76a8f9]" style={{ width: `${levelProgress}%` }} />
            </div>
            <p className="min-w-fit self-end text-lg text-white/70 sm:self-auto sm:text-xl">Level {level}</p>
          </div>
          <p className="mt-3 text-sm text-white/50">Sessions completed: {tracker.sessions}</p>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-[#545867] to-[#56545f] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xl text-white/80 sm:text-2xl">Timeline</p>
            <div className="flex flex-wrap gap-2">
              {timelineRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimelineRange(range)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    timelineRange === range ? "bg-white text-[#4d4d4d]" : "bg-white/10 text-white/70"
                  }`}
                >
                  {range}d
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <svg viewBox={`0 0 ${timelineChart.width} ${timelineChart.height}`} className="h-40 w-full overflow-visible sm:h-44">
              <defs>
                <linearGradient id="lineGlow" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#ff8282" />
                  <stop offset="100%" stopColor="#ffbc9a" />
                </linearGradient>
                <linearGradient id="areaGlow" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff8c8c" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ff8c8c" stopOpacity="0" />
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
                    <circle cx={coord.x} cy={coord.y} r={isToday ? 5.5 : 4} fill={isToday ? "#ffffff" : "#ff9999"} />
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
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/60">
            <span>
              {timelineRange} day total: <span className="text-white">{timeline.total} mins</span>
            </span>
            <span>
              Peak day: <span className="text-white">{timeline.peak} mins</span>
            </span>
            <span>
              Avg: <span className="text-white">{timeline.average} mins/day</span>
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
