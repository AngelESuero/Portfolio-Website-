import React, { useMemo, useRef, useState } from "react";

/* ── game data ── */
const playedGames: [string, string][] = [
  ["DRAGON BALL: Sparking! ZERO", "Fighting / Anime Arena"],
  ["Terraria", "Sandbox / Survival / Crafting"],
  ["ARC Raiders", "Shooter / Extraction / Multiplayer"],
  ["Warframe", "Shooter / Looter / Live Service"],
  ["Marvel Rivals", "Hero Shooter / Multiplayer"],
  ["Marvel's Spider-Man Remastered", "Action Adventure / Superhero"],
  ["Doki Doki Literature Club Plus", "Visual Novel / Psychological Horror"],
  ["The Last of Us Part I", "Narrative Action / Survival"],
  ["HELLDIVERS 2", "Co-op Shooter"],
  ["Cyberpunk 2077", "Open-World Action RPG"],
  ["Destiny 2", "Shooter / Looter / Live Service"],
  ["Sifu", "Action / Martial Arts"],
  ["God of War Ragnarok", "Action Adventure / Mythic"],
  ["SAND LAND", "Action RPG / Anime"],
  ["Split Fiction", "Co-op Adventure"],
  ["ELDEN RING", "Action RPG / Soulslike"],
  ["Fallout 4", "Open-World RPG"],
  ["VALORANT", "Tactical Shooter"],
  ["DRAGON BALL FighterZ", "Fighting / Anime Arena"],
  ["TEKKEN 8", "Fighting"],
  ["DRAGON BALL XENOVERSE 2", "Action RPG / Anime"],
  ["Marvel's Spider-Man 2", "Action Adventure / Superhero"],
  ["Fortnite", "Battle Royale / Shooter"],
  ["Outer Wilds", "Exploration / Puzzle Adventure"],
  ["Horizon Forbidden West", "Open-World Action RPG"],
  ["Horizon Zero Dawn", "Open-World Action RPG"],
  ["Bloodborne", "Action RPG / Soulslike"],
  ["DAYS GONE", "Open-World Survival Action"],
  ["FINAL FANTASY VII REMAKE", "Action RPG"],
  ["No Man's Sky", "Exploration / Survival"],
  ["Control", "Action Adventure / Supernatural Shooter"],
  ["Ghost of Tsushima", "Open-World Action Adventure"],
  ["The Last of Us Part II", "Narrative Action / Survival"],
  ["Borderlands 3", "Shooter / Looter"],
  ["DOOM Eternal", "FPS / Action"],
  ["Grand Theft Auto V", "Open-World Action"],
  ["Gang Beasts", "Party / Brawler"],
  ["RESIDENT EVIL 3", "Survival Horror / Action"],
  ["DEATH STRANDING", "Exploration / Narrative Adventure"],
  ["Sekiro: Shadows Die Twice", "Action / Precision Combat"],
  ["The Witcher 3: Wild Hunt", "Open-World RPG"],
  ["Red Dead Redemption 2", "Open-World Action Adventure"],
];

const accessOnlyGames: [string, string][] = [
  ["Assassin's Creed Freedom Cry", "Action Adventure"],
  ["For Honor", "Action / Melee Multiplayer"],
  ["Just Cause 3", "Open-World Action"],
  ["Deus Ex: Mankind Divided", "Immersive Sim / Stealth RPG"],
  ["Diablo IV", "Action RPG"],
  ["Killing Floor 3", "Co-op Shooter"],
  ["Mass Effect Legendary Edition", "RPG / Sci-Fi"],
  ["Dead Space", "Survival Horror"],
  ["Tunic", "Action Adventure / Puzzle"],
  ["THE KING OF FIGHTERS XV", "Fighting"],
  ["Alan Wake 2", "Survival Horror / Narrative"],
  ["Lies of P", "Action RPG / Soulslike"],
  ["Neon White", "FPS / Speedrun Action"],
  ["Bomb Rush Cyberfunk", "Action / Stylish Platforming"],
  ["Balatro", "Roguelike / Card Strategy"],
  ["Ghostrunner 2", "Action / Precision Combat"],
  ["Psychonauts 2", "Platformer / Adventure"],
  ["RoboCop: Rogue City", "FPS / Action"],
  ["PAYDAY 3", "Co-op Shooter"],
  ["God of War III Remastered", "Action Adventure / Mythic"],
  ["Shadow of the Colossus", "Action Adventure / Artful"],
  ["Where Winds Meet", "Open-World Action RPG"],
  ["Apex Legends", "Hero Shooter / Battle Royale"],
  ["Tom Clancy's Rainbow Six Siege", "Tactical Shooter"],
  ["Monster Hunter World: Iceborne", "Action RPG / Co-op"],
  ["Skyrim", "Open-World RPG"],
  ["Mass Effect: Andromeda", "RPG / Sci-Fi"],
  ["Dying Light: The Following - Enhanced Edition", "Open-World Survival Action"],
  ["Far Cry 4", "Open-World Shooter"],
  ["Plants vs. Zombies Garden Warfare", "Shooter / Multiplayer"],
  ["DC Universe Online", "MMO / Superhero"],
];

/* ── helpers ── */
function normalizeGenre(genre: string) {
  return genre.split("/").map((p) => p.trim()).join(" \u2022 ");
}

interface GenreItem {
  genre: string;
  played: string[];
  access: string[];
  total: number;
}

function buildFoundation(): GenreItem[] {
  const map = new Map<string, { genre: string; played: string[]; access: string[] }>();
  const ensure = (genre: string) => {
    const key = normalizeGenre(genre);
    if (!map.has(key)) map.set(key, { genre: key, played: [], access: [] });
    return map.get(key)!;
  };
  playedGames.forEach(([game, genre]) => ensure(genre).played.push(game));
  accessOnlyGames.forEach(([game, genre]) => ensure(genre).access.push(game));
  return Array.from(map.values())
    .map((item) => ({
      ...item,
      played: item.played.sort((a, b) => a.localeCompare(b)),
      access: item.access.sort((a, b) => a.localeCompare(b)),
      total: item.played.length + item.access.length,
    }))
    .sort((a, b) => b.played.length - a.played.length || b.total - a.total || a.genre.localeCompare(b.genre));
}

const foundation = buildFoundation();
const totalPlayed = playedGames.length;
const totalFuture = accessOnlyGames.length;

/* ── layout constants for vertical tree ── */
const COL_W = 260;
const ROW_H = 52;
const TRUNK_X = 60;
const BRANCH_START_Y = 80;
const NODE_R = 4;

const CSS = `
.gt-root { padding: 0; }
.gt-eyebrow { font-size: clamp(0.65rem, 0.8vw, 0.72rem); font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(230,214,191,0.55); margin: 0 0 0.5rem; }
.gt-heading { margin: 0 0 0.75rem; font-family: var(--font-display, serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: color-mix(in srgb, #e7b36d 60%, white 40%); }
.gt-subtitle { max-width: 48rem; margin: 0 0 1.5rem; font-size: clamp(0.88rem, 1.1vw, 0.98rem); line-height: 1.62; color: rgba(236,227,214,0.65); }
.gt-stats { display: flex; gap: clamp(1.5rem, 3vw, 2.5rem); flex-wrap: wrap; margin-bottom: 1.5rem; }
.gt-stat { display: flex; flex-direction: column; gap: 0.15rem; }
.gt-stat-num { font-family: var(--font-display, serif); font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 700; line-height: 1; color: color-mix(in srgb, #e7b36d 70%, white 30%); }
.gt-stat-label { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(230,214,191,0.5); }
.gt-controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 1.5rem; }
.gt-input {
  flex: 1; min-width: 180px; max-width: 360px; border-radius: 999px;
  border: 1px solid rgba(237,227,209,0.1); background: rgba(237,227,209,0.04);
  color: rgba(245,238,227,0.96); padding: 7px 14px; font-size: 13px;
  outline: none; box-sizing: border-box; transition: border-color 0.15s;
}
.gt-input:focus { border-color: rgba(185,122,45,0.4); }
.gt-input::placeholder { color: rgba(216,203,186,0.5); }
.gt-pill {
  display: inline-flex; align-items: center; gap: 4px; border-radius: 999px;
  border: 1px solid rgba(237,227,209,0.1); background: rgba(237,227,209,0.04);
  color: rgba(216,203,186,0.78); padding: 5px 12px; font-size: 12px;
  cursor: pointer; line-height: 1; transition: all 0.15s; white-space: nowrap;
}
.gt-pill:hover { background: rgba(237,227,209,0.08); border-color: rgba(237,227,209,0.18); color: rgba(245,238,227,0.96); }
.gt-pill--on { border-color: rgba(185,122,45,0.4); background: rgba(185,122,45,0.12); color: #e7b36d; }
.gt-tree-wrap {
  overflow-x: auto; border-radius: 16px;
  border: 1px solid rgba(237,227,209,0.08);
  background: rgba(20,19,17,0.6);
  padding: 0; margin-bottom: 2rem;
}
.gt-tree-wrap::-webkit-scrollbar { height: 6px; }
.gt-tree-wrap::-webkit-scrollbar-track { background: transparent; }
.gt-tree-wrap::-webkit-scrollbar-thumb { background: rgba(237,227,209,0.12); border-radius: 3px; }
.gt-tree-svg { display: block; }
.gt-tree-svg text { font-family: system-ui, -apple-system, sans-serif; }
.gt-tree-node { cursor: pointer; }
.gt-tree-node:hover .gt-node-bg { fill: rgba(185,122,45,0.12); }
.gt-detail { margin-top: -0.5rem; }
.gt-detail-title { font-size: 14px; font-weight: 600; color: rgba(245,238,227,0.92); margin: 0 0 8px; }
.gt-detail-section { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(216,203,186,0.4); margin: 10px 0 4px; }
.gt-detail-game { font-size: 12px; line-height: 1.5; padding: 2px 0; }
.gt-detail-game--played { color: #e7b36d; }
.gt-detail-game--future { color: #7fa3bf; font-style: italic; }
.gt-detail-game::before { content: ''; display: inline-block; width: 5px; height: 5px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }
.gt-detail-game--played::before { background: #b97a2d; }
.gt-detail-game--future::before { background: #587a95; }
.gt-legend { display: flex; gap: 16px; margin-bottom: 12px; font-size: 11px; color: rgba(216,203,186,0.5); }
.gt-legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; vertical-align: middle; }
`;

/* ── main component ── */
export default function AngelGenreHybridTree() {
  const [query, setQuery] = useState("");
  const [showFuture, setShowFuture] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    if (!query.trim()) return foundation;
    const q = query.toLowerCase();
    return foundation.filter((item) =>
      item.genre.toLowerCase().includes(q) ||
      item.played.some((g) => g.toLowerCase().includes(q)) ||
      item.access.some((g) => g.toLowerCase().includes(q))
    );
  }, [query]);

  const selectedItem = visible.find((i) => i.genre === selectedGenre) || null;

  const handleSelect = (genre: string) => {
    setSelectedGenre((prev) => prev === genre ? null : genre);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  /* ── compute SVG dimensions ── */
  const rowCount = visible.length;
  const svgH = BRANCH_START_Y + rowCount * ROW_H + 40;
  const svgW = Math.max(COL_W + TRUNK_X + 120, 500);

  return (
    <div className="gt-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Header */}
      <p className="gt-eyebrow">Game Library</p>
      <h1 className="gt-heading">Genre Ancestor Tree</h1>
      <p className="gt-subtitle">
        {totalPlayed} games played, {totalFuture} in the queue, across {foundation.length} genres.
        Click a branch to see its games.
      </p>
      <div className="gt-stats">
        <div className="gt-stat">
          <span className="gt-stat-num">{totalPlayed}</span>
          <span className="gt-stat-label">Played</span>
        </div>
        <div className="gt-stat">
          <span className="gt-stat-num">{totalFuture}</span>
          <span className="gt-stat-label">Future</span>
        </div>
        <div className="gt-stat">
          <span className="gt-stat-num">{foundation.length}</span>
          <span className="gt-stat-label">Genres</span>
        </div>
      </div>

      {/* Controls */}
      <div className="gt-controls">
        <input className="gt-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search genres or games..." />
        <button className="gt-pill" onClick={() => { setQuery(""); setSelectedGenre(null); }}>{"\u21ba"} Reset</button>
        <button className={`gt-pill ${!showFuture ? "gt-pill--on" : ""}`} onClick={() => setShowFuture((v) => !v)}>
          {showFuture ? "Hide future" : "Show future"}
        </button>
      </div>

      {/* Legend */}
      <div className="gt-legend">
        <span><span className="gt-legend-dot" style={{ background: "#b97a2d" }} />Played</span>
        {showFuture && <span><span className="gt-legend-dot" style={{ background: "#587a95" }} />Future</span>}
        <span style={{ marginLeft: "auto", color: "rgba(216,203,186,0.35)" }}>{visible.length} genres</span>
      </div>

      {/* Tree SVG */}
      <div className="gt-tree-wrap">
        <svg className="gt-tree-svg" width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          {/* Trunk line */}
          <line x1={TRUNK_X} y1={20} x2={TRUNK_X} y2={svgH - 20} stroke="#5a3a14" strokeWidth={3} />

          {/* Root label */}
          <circle cx={TRUNK_X} cy={36} r={6} fill="#b97a2d" stroke="#8a5a1e" strokeWidth={1.5} />
          <text x={TRUNK_X + 14} y={40} fontSize={11} fontWeight={700} fill="#e7b36d">Genre Foundation</text>

          {/* Branches */}
          {visible.map((item, i) => {
            const y = BRANCH_START_Y + i * ROW_H + ROW_H / 2;
            const isSelected = selectedGenre === item.genre;
            const playedW = item.played.length;
            const futureW = item.access.length;
            const maxW = Math.max(...foundation.map((f) => f.total), 1);
            const barScale = 120 / maxW;
            const branchEnd = TRUNK_X + 30;
            const barStart = branchEnd + 8;

            return (
              <g key={item.genre} className="gt-tree-node" onClick={() => handleSelect(item.genre)}>
                {/* Hover/select bg */}
                <rect
                  className="gt-node-bg"
                  x={0} y={y - ROW_H / 2 + 2} width={svgW} height={ROW_H - 4} rx={6}
                  fill={isSelected ? "rgba(185,122,45,0.1)" : "transparent"}
                />

                {/* Branch line from trunk */}
                <line x1={TRUNK_X} y1={y} x2={branchEnd} y2={y}
                  stroke={isSelected ? "#e7b36d" : "#5a3a14"}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />

                {/* Node dot */}
                <circle cx={branchEnd} cy={y} r={NODE_R}
                  fill={isSelected ? "#e7b36d" : "#b97a2d"}
                  stroke={isSelected ? "#e7b36d" : "#8a5a1e"} strokeWidth={1.2}
                />

                {/* Played bar */}
                {playedW > 0 && (
                  <rect x={barStart} y={y - 5} width={playedW * barScale} height={4} rx={2} fill="#b97a2d" opacity={isSelected ? 1 : 0.7} />
                )}

                {/* Future bar */}
                {showFuture && futureW > 0 && (
                  <rect x={barStart + playedW * barScale + 1} y={y - 5} width={futureW * barScale} height={4} rx={2} fill="#587a95" opacity={isSelected ? 0.9 : 0.5} />
                )}

                {/* Genre label */}
                <text x={barStart} y={y + 14} fontSize={11.5} fontWeight={isSelected ? 700 : 500}
                  fill={isSelected ? "#e7b36d" : "rgba(236,227,214,0.82)"}>
                  {item.genre}
                </text>

                {/* Counts */}
                <text x={barStart + (playedW + (showFuture ? futureW : 0)) * barScale + 8} y={y - 1}
                  fontSize={10} fill="rgba(216,203,186,0.45)">
                  {playedW}{showFuture ? ` / ${futureW}` : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      {selectedItem && (
        <div className="gt-detail" ref={detailRef}>
          <div style={{ borderRadius: 16, border: "1px solid rgba(237,227,209,0.1)", background: "rgba(31,27,23,0.7)", padding: "16px 20px" }}>
            <div className="gt-detail-title">{selectedItem.genre}</div>

            {selectedItem.played.length > 0 && (
              <>
                <div className="gt-detail-section">Played ({selectedItem.played.length})</div>
                {selectedItem.played.map((g) => <div key={g} className="gt-detail-game gt-detail-game--played">{g}</div>)}
              </>
            )}

            {showFuture && selectedItem.access.length > 0 && (
              <>
                <div className="gt-detail-section">Future ({selectedItem.access.length})</div>
                {selectedItem.access.map((g) => <div key={g} className="gt-detail-game gt-detail-game--future">{g}</div>)}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
