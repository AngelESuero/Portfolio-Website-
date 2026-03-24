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
  return Array.from(map.values()).map((item) => ({
    ...item,
    played: item.played.sort((a, b) => a.localeCompare(b)),
    access: item.access.sort((a, b) => a.localeCompare(b)),
    total: item.played.length + item.access.length,
  }));
}

const foundation = buildFoundation();
const totalPlayed = playedGames.length;
const totalFuture = accessOnlyGames.length;

/* ── genre family structure ── */
const FAMILIES = [
  { id: "rpg",      label: "RPG",               color: "#c4883a" },
  { id: "action",   label: "Action-Adventure",   color: "#b97a2d" },
  { id: "shooter",  label: "Shooter",            color: "#587a95" },
  { id: "horror",   label: "Horror",             color: "#8b3a3a" },
  { id: "fighting", label: "Combat",             color: "#7a4a8a" },
  { id: "explore",  label: "Exploration",        color: "#3a7a6a" },
  { id: "other",    label: "Other",              color: "#5a5a6a" },
] as const;

type FamilyId = typeof FAMILIES[number]["id"];

const GENRE_TO_FAMILY: Record<string, FamilyId> = {
  "Open-World Action RPG": "rpg",
  "Open-World RPG": "rpg",
  "Action RPG \u2022 Soulslike": "rpg",
  "Action RPG \u2022 Anime": "rpg",
  "Action RPG": "rpg",
  "Action RPG \u2022 Co-op": "rpg",
  "Immersive Sim \u2022 Stealth RPG": "rpg",
  "RPG \u2022 Sci-Fi": "rpg",

  "Action Adventure \u2022 Superhero": "action",
  "Action Adventure \u2022 Mythic": "action",
  "Action Adventure \u2022 Artful": "action",
  "Action Adventure \u2022 Supernatural Shooter": "action",
  "Action Adventure \u2022 Puzzle": "action",
  "Action Adventure": "action",
  "Open-World Action Adventure": "action",
  "Open-World Action": "action",
  "Co-op Adventure": "action",
  "Narrative Action \u2022 Survival": "action",
  "Open-World Survival Action": "action",

  "Shooter \u2022 Looter \u2022 Live Service": "shooter",
  "Shooter \u2022 Looter": "shooter",
  "Shooter \u2022 Extraction \u2022 Multiplayer": "shooter",
  "Shooter \u2022 Multiplayer": "shooter",
  "Open-World Shooter": "shooter",
  "Hero Shooter \u2022 Multiplayer": "shooter",
  "Hero Shooter \u2022 Battle Royale": "shooter",
  "Tactical Shooter": "shooter",
  "Co-op Shooter": "shooter",
  "Battle Royale \u2022 Shooter": "shooter",
  "FPS \u2022 Action": "shooter",
  "FPS \u2022 Speedrun Action": "shooter",

  "Survival Horror \u2022 Action": "horror",
  "Survival Horror": "horror",
  "Survival Horror \u2022 Narrative": "horror",
  "Visual Novel \u2022 Psychological Horror": "horror",

  "Fighting \u2022 Anime Arena": "fighting",
  "Fighting": "fighting",
  "Action \u2022 Martial Arts": "fighting",
  "Action \u2022 Precision Combat": "fighting",
  "Action \u2022 Melee Multiplayer": "fighting",
  "Action \u2022 Stylish Platforming": "fighting",
  "Party \u2022 Brawler": "fighting",

  "Exploration \u2022 Puzzle Adventure": "explore",
  "Exploration \u2022 Survival": "explore",
  "Exploration \u2022 Narrative Adventure": "explore",
  "Sandbox \u2022 Survival \u2022 Crafting": "explore",

  "Roguelike \u2022 Card Strategy": "other",
  "MMO \u2022 Superhero": "other",
  "Platformer \u2022 Adventure": "other",
};

/* ── layout constants ── */
const ROOT_X = 28;
const FAM_X = 130;
const LEAF_X = 272;
const LABEL_X = LEAF_X + 11;
const ROW_H = 40;
const FAM_GAP = 18;
const SVG_PAD = 28;
const SVG_W = 700;

/* ── CSS ── */
const CSS = `
.gt-root { padding: 0; }
.gt-eyebrow { font-size: clamp(0.65rem,0.8vw,0.72rem); font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(230,214,191,0.45); margin: 0 0 0.45rem; }
.gt-heading { margin: 0 0 0.65rem; font-family: var(--font-display,serif); font-size: clamp(2rem,4vw,3rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: color-mix(in srgb,#e7b36d 60%,white 40%); }
.gt-subtitle { max-width: 46rem; margin: 0 0 1.25rem; font-size: clamp(0.88rem,1.1vw,0.96rem); line-height: 1.6; color: rgba(236,227,214,0.6); }
.gt-stats { display: flex; gap: clamp(1.5rem,3vw,2.5rem); flex-wrap: wrap; margin-bottom: 1.4rem; }
.gt-stat { display: flex; flex-direction: column; gap: 0.12rem; }
.gt-stat-num { font-family: var(--font-display,serif); font-size: clamp(1.5rem,2.5vw,2rem); font-weight: 700; line-height: 1; color: color-mix(in srgb,#e7b36d 70%,white 30%); }
.gt-stat-label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(230,214,191,0.45); }
.gt-controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 1rem; }
.gt-input { flex: 1; min-width: 180px; max-width: 340px; border-radius: 999px; border: 1px solid rgba(237,227,209,0.1); background: rgba(237,227,209,0.04); color: rgba(245,238,227,0.96); padding: 7px 14px; font-size: 13px; outline: none; box-sizing: border-box; transition: border-color 0.15s; }
.gt-input:focus { border-color: rgba(185,122,45,0.4); }
.gt-input::placeholder { color: rgba(216,203,186,0.45); }
.gt-pill { display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; border: 1px solid rgba(237,227,209,0.1); background: rgba(237,227,209,0.04); color: rgba(216,203,186,0.7); padding: 5px 12px; font-size: 12px; cursor: pointer; line-height: 1; transition: all 0.15s; white-space: nowrap; }
.gt-pill:hover { background: rgba(237,227,209,0.08); border-color: rgba(237,227,209,0.18); color: rgba(245,238,227,0.96); }
.gt-pill--on { border-color: rgba(185,122,45,0.4); background: rgba(185,122,45,0.12); color: #e7b36d; }
.gt-legend { display: flex; gap: 14px; align-items: center; margin-bottom: 10px; font-size: 11px; color: rgba(216,203,186,0.45); flex-wrap: wrap; }
.gt-legend-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.gt-tree-wrap { overflow-x: auto; overflow-y: auto; max-height: 620px; border-radius: 16px; border: 1px solid rgba(237,227,209,0.07); background: rgba(18,17,15,0.55); margin-bottom: 1.5rem; }
.gt-tree-wrap::-webkit-scrollbar { width: 5px; height: 5px; }
.gt-tree-wrap::-webkit-scrollbar-track { background: transparent; }
.gt-tree-wrap::-webkit-scrollbar-thumb { background: rgba(237,227,209,0.1); border-radius: 3px; }
.gt-tree-svg { display: block; }
.gt-tree-svg text { font-family: system-ui,-apple-system,sans-serif; }
.gt-node-leaf { cursor: pointer; }
.gt-node-leaf:hover rect.gt-leaf-bg { fill-opacity: 0.07; }
.gt-detail { border-radius: 14px; border: 1px solid rgba(237,227,209,0.1); background: rgba(28,25,20,0.75); padding: 18px 20px; margin-bottom: 2rem; }
.gt-detail-genre { font-size: 13px; font-weight: 700; color: rgba(245,238,227,0.9); margin: 0 0 10px; letter-spacing: 0.01em; }
.gt-detail-section { font-size: 9.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(216,203,186,0.38); margin: 10px 0 5px; }
.gt-detail-games { display: flex; flex-wrap: wrap; gap: 5px; }
.gt-detail-game { font-size: 12px; line-height: 1; padding: 4px 10px; border-radius: 999px; }
.gt-detail-game--played { color: #e7b36d; background: rgba(185,122,45,0.12); border: 1px solid rgba(185,122,45,0.2); }
.gt-detail-game--future { color: #7fa3bf; background: rgba(88,122,149,0.1); border: 1px solid rgba(88,122,149,0.2); font-style: italic; }
`;

/* ── layout computation ── */
interface LeafNode {
  type: "leaf";
  item: GenreItem;
  familyId: FamilyId;
  familyColor: string;
  x: number;
  y: number;
}
interface FamNode {
  type: "family";
  id: FamilyId;
  label: string;
  color: string;
  x: number;
  y: number;
  leaves: LeafNode[];
}

function computeLayout(items: GenreItem[]) {
  // Group by family
  const groups = new Map<FamilyId, GenreItem[]>();
  FAMILIES.forEach((f) => groups.set(f.id, []));
  items.forEach((item) => {
    const fid = GENRE_TO_FAMILY[item.genre] ?? "other";
    groups.get(fid)!.push(item);
  });

  const famNodes: FamNode[] = [];
  let curY = SVG_PAD;

  FAMILIES.forEach((fam) => {
    const children = groups.get(fam.id)!;
    if (children.length === 0) return;

    const leaves: LeafNode[] = children.map((item, i) => ({
      type: "leaf",
      item,
      familyId: fam.id,
      familyColor: fam.color,
      x: LEAF_X,
      y: curY + i * ROW_H + ROW_H / 2,
    }));

    const famY = (leaves[0].y + leaves[leaves.length - 1].y) / 2;
    famNodes.push({ type: "family", id: fam.id, label: fam.label, color: fam.color, x: FAM_X, y: famY, leaves });
    curY += children.length * ROW_H + FAM_GAP;
  });

  const totalH = curY - FAM_GAP + SVG_PAD;
  const rootY = totalH / 2;

  return { famNodes, totalH, rootY };
}

/* ── bezier path helper ── */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

/* ── main component ── */
export default function AngelGenreHybridTree() {
  const [query, setQuery] = useState("");
  const [showFuture, setShowFuture] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    if (!query.trim()) return foundation;
    const q = query.toLowerCase();
    return foundation.filter(
      (item) =>
        item.genre.toLowerCase().includes(q) ||
        item.played.some((g) => g.toLowerCase().includes(q)) ||
        item.access.some((g) => g.toLowerCase().includes(q))
    );
  }, [query]);

  const { famNodes, totalH, rootY } = useMemo(() => computeLayout(visible), [visible]);
  const selectedItem = visible.find((i) => i.genre === selectedGenre) ?? null;

  const handleSelect = (genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? null : genre));
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
  };

  const visibleCount = visible.length;

  return (
    <div className="gt-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Header */}
      <p className="gt-eyebrow">Game Library</p>
      <h1 className="gt-heading">Genre Ancestor Tree</h1>
      <p className="gt-subtitle">
        {totalPlayed} games played, {totalFuture} in the queue, across {foundation.length} genres — organized by ancestry.
        Click any branch to see its games.
      </p>
      <div className="gt-stats">
        {[["42", "Played"], ["31", "Future"], [String(foundation.length), "Genres"]].map(([n, l]) => (
          <div className="gt-stat" key={l}>
            <span className="gt-stat-num">{n}</span>
            <span className="gt-stat-label">{l}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="gt-controls">
        <input
          className="gt-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search genres or games…"
        />
        <button className="gt-pill" onClick={() => { setQuery(""); setSelectedGenre(null); }}>
          ↺ Reset
        </button>
        <button
          className={`gt-pill${!showFuture ? " gt-pill--on" : ""}`}
          onClick={() => setShowFuture((v) => !v)}
        >
          {showFuture ? "Hide future" : "Show future"}
        </button>
      </div>

      {/* Legend */}
      <div className="gt-legend">
        <span><span className="gt-legend-dot" style={{ background: "#b97a2d" }} />Played</span>
        {showFuture && <span><span className="gt-legend-dot" style={{ background: "#587a95" }} />Future</span>}
        {FAMILIES.map((f) => (
          <span key={f.id}>
            <span className="gt-legend-dot" style={{ background: f.color }} />
            {f.label}
          </span>
        ))}
        <span style={{ marginLeft: "auto", color: "rgba(216,203,186,0.3)" }}>{visibleCount} genres</span>
      </div>

      {/* Tree SVG */}
      <div className="gt-tree-wrap">
        <svg
          className="gt-tree-svg"
          width={SVG_W}
          height={totalH}
          viewBox={`0 0 ${SVG_W} ${totalH}`}
          aria-label="Genre ancestor tree"
        >
          {/* Root → Family curves */}
          {famNodes.map((fam) => (
            <path
              key={`rf-${fam.id}`}
              d={bezier(ROOT_X, rootY, FAM_X, fam.y)}
              fill="none"
              stroke={fam.color}
              strokeWidth={1.5}
              opacity={0.22}
            />
          ))}

          {/* Family → Leaf curves */}
          {famNodes.flatMap((fam) =>
            fam.leaves.map((leaf) => (
              <path
                key={`fl-${leaf.item.genre}`}
                d={bezier(FAM_X, fam.y, LEAF_X, leaf.y)}
                fill="none"
                stroke={selectedGenre === leaf.item.genre ? fam.color : fam.color}
                strokeWidth={selectedGenre === leaf.item.genre ? 1.8 : 1}
                opacity={selectedGenre === leaf.item.genre ? 0.7 : 0.18}
              />
            ))
          )}

          {/* Family nodes */}
          {famNodes.map((fam) => {
            const famPlayed = fam.leaves.reduce((s, l) => s + l.item.played.length, 0);
            return (
              <g key={`fn-${fam.id}`}>
                {/* Family label (left) */}
                <text
                  x={FAM_X - 10}
                  y={fam.y + 3}
                  textAnchor="end"
                  fontSize={9}
                  fontWeight={700}
                  letterSpacing="0.09em"
                  fill={fam.color}
                  opacity={0.75}
                >
                  {fam.label.toUpperCase()}
                </text>
                {/* Family count */}
                <text
                  x={FAM_X - 10}
                  y={fam.y + 15}
                  textAnchor="end"
                  fontSize={8}
                  fill={fam.color}
                  opacity={0.4}
                >
                  {fam.leaves.length}g · {famPlayed}p
                </text>
                {/* Family circle */}
                <circle cx={FAM_X} cy={fam.y} r={6} fill={fam.color} opacity={0.9} />
              </g>
            );
          })}

          {/* Root node */}
          <circle cx={ROOT_X} cy={rootY} r={9} fill="#b97a2d" stroke="rgba(185,122,45,0.3)" strokeWidth={3} />
          <text x={ROOT_X} y={rootY - 14} textAnchor="middle" fontSize={9} fontWeight={700} fill="#e7b36d" opacity={0.65} letterSpacing="0.1em">
            GAMES
          </text>

          {/* Leaf nodes */}
          {famNodes.flatMap((fam) =>
            fam.leaves.map((leaf) => {
              const sel = selectedGenre === leaf.item.genre;
              const hasPlayed = leaf.item.played.length > 0;
              const hasFuture = leaf.item.access.length > 0;
              const nodeOpacity = hasPlayed ? 1 : 0.45;

              return (
                <g
                  key={`leaf-${leaf.item.genre}`}
                  className="gt-node-leaf"
                  onClick={() => handleSelect(leaf.item.genre)}
                >
                  {/* Hit area + selection highlight */}
                  <rect
                    className="gt-leaf-bg"
                    x={LEAF_X - 6}
                    y={leaf.y - ROW_H / 2 + 2}
                    width={SVG_W - LEAF_X + 4}
                    height={ROW_H - 4}
                    rx={6}
                    fill={sel ? fam.color : "white"}
                    fillOpacity={sel ? 0.1 : 0}
                  />

                  {/* Leaf dot */}
                  <circle
                    cx={LEAF_X}
                    cy={leaf.y}
                    r={sel ? 5.5 : 4}
                    fill={fam.color}
                    opacity={sel ? 1 : nodeOpacity * 0.85}
                    stroke={sel ? "#fff" : "none"}
                    strokeWidth={sel ? 1.2 : 0}
                  />

                  {/* Genre label */}
                  <text
                    x={LABEL_X}
                    y={leaf.y + 4}
                    fontSize={11.5}
                    fontWeight={sel ? 700 : 500}
                    fill={sel ? "#fff" : hasPlayed ? "rgba(240,232,220,0.88)" : "rgba(200,190,178,0.5)"}
                  >
                    {leaf.item.genre}
                  </text>

                  {/* Played count badge */}
                  {hasPlayed && (
                    <text
                      x={SVG_W - 38}
                      y={leaf.y + 4}
                      textAnchor="end"
                      fontSize={9.5}
                      fill={sel ? "#e7b36d" : "#b97a2d"}
                      opacity={sel ? 1 : 0.65}
                    >
                      {leaf.item.played.length}p
                    </text>
                  )}

                  {/* Future count badge */}
                  {showFuture && hasFuture && (
                    <text
                      x={SVG_W - 10}
                      y={leaf.y + 4}
                      textAnchor="end"
                      fontSize={9.5}
                      fill={sel ? "#7fa3bf" : "#587a95"}
                      opacity={sel ? 0.9 : 0.5}
                    >
                      {leaf.item.access.length}f
                    </text>
                  )}
                </g>
              );
            })
          )}
        </svg>
      </div>

      {/* Detail panel */}
      <div ref={detailRef}>
        {selectedItem && (
          <div className="gt-detail">
            <div className="gt-detail-genre">
              {selectedItem.genre}
            </div>

            {selectedItem.played.length > 0 && (
              <>
                <div className="gt-detail-section">Played ({selectedItem.played.length})</div>
                <div className="gt-detail-games">
                  {selectedItem.played.map((g) => (
                    <span key={g} className="gt-detail-game gt-detail-game--played">{g}</span>
                  ))}
                </div>
              </>
            )}

            {showFuture && selectedItem.access.length > 0 && (
              <>
                <div className="gt-detail-section">In the Queue ({selectedItem.access.length})</div>
                <div className="gt-detail-games">
                  {selectedItem.access.map((g) => (
                    <span key={g} className="gt-detail-game gt-detail-game--future">{g}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
