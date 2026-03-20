import React, { useMemo, useRef, useState } from "react";

const playedGames = [
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
  ["God of War Ragnarök", "Action Adventure / Mythic"],
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

const accessOnlyGames = [
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

function normalizeGenre(genre) {
  return genre.split("/").map((part) => part.trim()).join(" • ");
}

function buildFoundation(played, access) {
  const map = new Map();
  const ensure = (genre) => {
    const key = normalizeGenre(genre);
    if (!map.has(key)) map.set(key, { genre: key, played: [], access: [] });
    return map.get(key);
  };
  played.forEach(([game, genre]) => ensure(genre).played.push(game));
  access.forEach(([game, genre]) => ensure(genre).access.push(game));
  return Array.from(map.values())
    .map((item) => ({
      ...item,
      played: item.played.sort((a, b) => a.localeCompare(b)),
      access: item.access.sort((a, b) => a.localeCompare(b)),
      total: item.played.length + item.access.length,
    }))
    .sort((a, b) => b.played.length - a.played.length || b.total - a.total || a.genre.localeCompare(b.genre));
}

function filterFoundation(items, query) {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items
    .map((item) => {
      const genreMatch = item.genre.toLowerCase().includes(q);
      const played = genreMatch ? item.played : item.played.filter((g) => g.toLowerCase().includes(q));
      const access = genreMatch ? item.access : item.access.filter((g) => g.toLowerCase().includes(q));
      if (!genreMatch && played.length === 0 && access.length === 0) return null;
      return { ...item, played, access, genreMatch };
    })
    .filter(Boolean);
}

function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function curvePath(start, end, bend = 0.42) {
  const midY = start.y + (end.y - start.y) * bend;
  return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
}

function leafPath(x, y, side = 1, size = 11) {
  return `M ${x} ${y} C ${x + side * size * 0.2} ${y - size * 0.7}, ${x + side * size} ${y - size * 0.4}, ${x + side * size} ${y} C ${x + side * size} ${y + size * 0.4}, ${x + side * size * 0.2} ${y + size * 0.7}, ${x} ${y}`;
}

const s = {
  chip: (tone) => ({
    display: "inline-block",
    border: `1px solid ${tone === "played" ? "#6ee7b7" : "#93c5fd"}`,
    background: tone === "played" ? "#ecfdf5" : "#eff6ff",
    color: tone === "played" ? "#064e3b" : "#1e3a8a",
    borderRadius: 12,
    padding: "3px 8px",
    fontSize: 11,
    lineHeight: 1.4,
  }),
};

function GameChip({ label, tone }) {
  return <div style={s.chip(tone)}>{label}</div>;
}

function GenrePanel({ item, showAccess }) {
  return (
    <section style={{ minWidth: 320, maxWidth: 320, borderRadius: 22, border: "1px solid #fef3c7", background: "rgba(255,255,255,0.96)", padding: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
      <div style={{ margin: "0 auto 12px", display: "flex", width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "4px solid #15803d", background: "#dcfce7", fontSize: 9, fontWeight: 600, color: "#052e16" }}>Root</div>
      <div style={{ margin: "0 auto 16px", height: 16, width: 4, background: "#15803d" }} />
      <div style={{ margin: "0 auto 16px", width: "fit-content", borderRadius: 16, border: "1px solid #fcd34d", background: "#fffbeb", padding: "8px 12px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#92400e" }}>{item.genre}</div>
      <div style={{ display: "grid", gridTemplateColumns: showAccess ? "1fr 1fr" : "1fr", gap: 12 }}>
        <div style={{ borderRadius: 16, border: "1px solid #a7f3d0", background: "rgba(236,253,245,0.7)", padding: 12 }}>
          <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#065f46" }}>Played</div>
          <div style={{ display: "grid", gap: 6 }}>{item.played.map((game) => <GameChip key={game} label={game} tone="played" />)}</div>
        </div>
        {showAccess && (
          <div style={{ borderRadius: 16, border: "1px solid #bfdbfe", background: "rgba(239,246,255,0.7)", padding: 12 }}>
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#1e40af" }}>Future</div>
            <div style={{ display: "grid", gap: 6 }}>{item.access.map((game) => <GameChip key={game} label={game} tone="future" />)}</div>
          </div>
        )}
      </div>
    </section>
  );
}

const foundation = buildFoundation(playedGames, accessOnlyGames);

export default function AngelGenreHybridTree() {
  const [query, setQuery] = useState("");
  const [showAccess, setShowAccess] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [zoomArmed, setZoomArmed] = useState(false);
  const svgScrollerRef = useRef(null);
  const cardsScrollerRef = useRef(null);
  const positionsRef = useRef({});
  const dragRef = useRef({ active: false, startX: 0, startY: 0, left: 0, top: 0 });
  const visible = useMemo(() => filterFoundation(foundation, query), [query]);

  const playedLabelCount = zoom >= 1.45 ? 4 : zoom >= 1.22 ? 3 : zoom >= 1.02 ? 2 : 0;
  const futureLabelCount = zoom >= 1.55 ? 3 : zoom >= 1.28 ? 2 : zoom >= 1.08 ? 1 : 0;
  const showCountBadges = zoom >= 0.95;
  const showFutureNodes = zoom >= 0.9 && showAccess;
  const showSecondaryHalo = zoom >= 1.15;

  const jumpToGenre = (genre) => {
    const pos = positionsRef.current[genre];
    if (!pos) return;
    if (svgScrollerRef.current) {
      svgScrollerRef.current.scrollTo({
        left: Math.max(pos.x * zoom - svgScrollerRef.current.clientWidth / 2, 0),
        top: Math.max(pos.y * zoom - 120, 0),
        behavior: "smooth",
      });
    }
    if (cardsScrollerRef.current) {
      cardsScrollerRef.current.scrollTo({
        left: Math.max(pos.cardLeft - 16, 0),
        behavior: "smooth",
      });
    }
  };

  const panX = (delta) => {
    svgScrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const onDragStart = (e) => {
    if (!svgScrollerRef.current) return;
    svgScrollerRef.current.focus();
    setZoomArmed(true);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      left: svgScrollerRef.current.scrollLeft,
      top: svgScrollerRef.current.scrollTop,
    };
    setDragging(true);
  };

  const onDragMove = (e) => {
    if (!dragRef.current.active || !svgScrollerRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    svgScrollerRef.current.scrollLeft = dragRef.current.left - dx;
    svgScrollerRef.current.scrollTop = dragRef.current.top - dy;
  };

  const onDragEnd = () => {
    dragRef.current.active = false;
    setDragging(false);
  };

  const onViewportWheel = (e) => {
    if (!zoomArmed) return;
    e.preventDefault();
    const nextZoom = e.deltaY < 0 ? Math.min(2, zoom + 0.08) : Math.max(0.72, zoom - 0.08);
    setZoom(nextZoom);
  };

  const cx = 840;
  const baseY = 760;
  const crownY = 500;
  const startAngle = -86;
  const endAngle = 86;
  const angles = visible.map((_, i) => startAngle + ((endAngle - startAngle) * i) / Math.max(visible.length - 1, 1));

  const card: React.CSSProperties = { borderRadius: 28, border: "1px solid #d1fae5", background: "rgba(255,255,255,0.94)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: 24, marginBottom: 24 };
  const btn = (active = false): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    borderRadius: 999, border: `1px solid ${active ? "#6ee7b7" : "#e2e8f0"}`,
    background: active ? "#ecfdf5" : "white", color: active ? "#065f46" : "#334155",
    padding: "6px 14px", fontSize: 13, cursor: "pointer", lineHeight: 1,
  });

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, #eefcf4, #eff6ff 45%, #f8fafc)", padding: "2rem 1rem" }}>
      <div style={{ margin: "0 auto", maxWidth: 1750 }}>

        {/* Header card */}
        <div style={card}>
          <h1 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", margin: "0 0 8px", color: "#0f172a" }}>Angel&apos;s Genre Ancestor Tree — Hybrid</h1>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "#64748b", margin: "0 0 16px", maxWidth: 680 }}>
            Click inside the canopy to arm wheel-zoom. Then scroll to zoom in or out, and drag while holding to pan left, right, up, or down.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 480 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14 }}>⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a genre or game..."
                style={{ width: "100%", borderRadius: 999, border: "1px solid #e2e8f0", padding: "7px 14px 7px 32px", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <button style={btn()} onClick={() => setQuery("")}>↺ Reset</button>
            <button style={btn()} onClick={() => setShowAccess((v) => !v)}>{showAccess ? "Hide future" : "Show future"}</button>
          </div>
        </div>

        {/* Body grid */}
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(220px,340px) 1fr" }}>

          {/* Genre scroller */}
          <div style={{ ...card, marginBottom: 0, position: "sticky", top: 16, alignSelf: "start" }}>
            <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#0f172a" }}>Genre scroller</h2>
            <div style={{ maxHeight: "68vh", overflowY: "auto", borderRadius: 16, border: "1px solid #e2e8f0", padding: 8 }}>
              <div style={{ display: "grid", gap: 6 }}>
                {visible.map((item) => (
                  <button key={item.genre} onClick={() => jumpToGenre(item.genre)}
                    style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "white", padding: "8px 12px", textAlign: "left", cursor: "pointer", width: "100%" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{item.genre}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.played.length} played • {item.access.length} future</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "grid", gap: 24 }}>

            {/* Canopy card */}
            <div style={card}>
              <h2 style={{ fontSize: 18, margin: "0 0 12px", color: "#0f172a" }}>Decorative ancestor canopy</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                <button style={btn()} onClick={() => panX(-180)}>← Left</button>
                <button style={btn()} onClick={() => panX(180)}>Right →</button>
                <button style={btn()} onClick={() => setZoom((z) => Math.max(0.72, z - 0.1))}>− Zoom out</button>
                <button style={btn()} onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>+ Zoom in</button>
                <div style={btn(zoomArmed)}>{Math.round(zoom * 100)}% {zoomArmed ? "• wheel zoom armed" : "• click canopy to arm"}</div>
              </div>
              <div
                ref={svgScrollerRef}
                tabIndex={0}
                onClick={() => setZoomArmed(true)}
                onBlur={() => setZoomArmed(false)}
                onWheel={onViewportWheel}
                onMouseDown={onDragStart}
                onMouseMove={onDragMove}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                style={{
                  height: 500, overflowX: "scroll", overflowY: "auto",
                  borderRadius: 24, border: "1px solid #d1fae5",
                  background: "linear-gradient(180deg,#dbeafe 0%,#ecfeff 16%,#eefcf4 38%,#ffffff 82%)",
                  padding: 12, outline: "none", cursor: dragging ? "grabbing" : "grab",
                  userSelect: dragging ? "none" : "auto",
                }}
              >
                <div style={{ width: `${980 * zoom}px`, height: `${560 * zoom}px` }}>
                  <svg viewBox="200 150 1180 660" style={{ width: `${980 * zoom}px`, height: `${560 * zoom}px`, display: "block" }}>
                    <defs>
                      <linearGradient id="trunkGradHybrid" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#65a30d" />
                        <stop offset="100%" stopColor="#14532d" />
                      </linearGradient>
                    </defs>
                    <ellipse cx={cx} cy="780" rx="135" ry="12" fill="#d1fae5" opacity="0.9" />
                    <ellipse cx={cx} cy="355" rx="380" ry="90" fill="#99f6e4" opacity="0.10" />
                    {showFutureNodes && <ellipse cx={cx} cy="305" rx="470" ry="88" fill="#93c5fd" opacity="0.08" />}
                    <path d={`M ${cx - 26} 772 C ${cx - 22} 700, ${cx - 16} 625, ${cx - 8} ${crownY} C ${cx - 4} 470, ${cx - 2} 452, ${cx} 440 C ${cx + 2} 452, ${cx + 4} 470, ${cx + 8} ${crownY} C ${cx + 16} 625, ${cx + 22} 700, ${cx + 26} 772 Z`} fill="url(#trunkGradHybrid)" />
                    {visible.map((item, i) => {
                      const angle = angles[i];
                      const genreNode = polar(cx, baseY, 200, angle);
                      positionsRef.current[item.genre] = { x: genreNode.x, y: genreNode.y, cardLeft: i * 336 };
                      const trunkNode = { x: cx, y: crownY + 6 };
                      const playedPath = curvePath(trunkNode, genreNode, 0.38);
                      const playedWeight = item.played.length;
                      const futureWeight = item.access.length;
                      const playedWidth = 2.5 + Math.min(playedWeight, 6) * 0.85;
                      const genreRadius = 5 + Math.min(playedWeight, 6) * 0.8;
                      const fontSize = 9.5 + Math.min(playedWeight, 5) * 0.45;
                      const labelColor = item.genreMatch ? "#9f1239" : playedWeight >= 3 ? "#0f5132" : "#134e4a";
                      return (
                        <g key={item.genre}>
                          {showSecondaryHalo && <circle cx={genreNode.x} cy={genreNode.y} r={genreRadius + 5} fill="none" stroke="#fcd34d" strokeOpacity="0.35" strokeWidth="2" />}
                          <path d={playedPath} fill="none" stroke={item.genreMatch ? "#e11d48" : "#0f766e"} strokeWidth={playedWidth} strokeLinecap="round" opacity={0.7 + Math.min(playedWeight, 5) * 0.06} />
                          <circle cx={genreNode.x} cy={genreNode.y} r={genreRadius} fill="#f59e0b" stroke="#b45309" strokeWidth="1.8" />
                          <text x={genreNode.x} y={genreNode.y - 12} textAnchor="middle" fontSize={fontSize} fontWeight="700" fill={labelColor}>{item.genre}</text>
                          {showCountBadges && (
                            <>
                              <rect x={genreNode.x - 22} y={genreNode.y + 8} rx="8" ry="8" width="18" height="14" fill="#dcfce7" stroke="#86efac" />
                              <text x={genreNode.x - 13} y={genreNode.y + 18} textAnchor="middle" fontSize="8" fontWeight="700" fill="#166534">{playedWeight}</text>
                            </>
                          )}
                          {showFutureNodes && futureWeight > 0 && (
                            <>
                              {showCountBadges && (
                                <>
                                  <rect x={genreNode.x + 4} y={genreNode.y + 8} rx="8" ry="8" width="18" height="14" fill="#dbeafe" stroke="#93c5fd" />
                                  <text x={genreNode.x + 13} y={genreNode.y + 18} textAnchor="middle" fontSize="8" fontWeight="700" fill="#1d4ed8">{futureWeight}</text>
                                </>
                              )}
                              {(() => {
                                const futureNode = polar(cx, baseY, 285, angle);
                                const accessPath = curvePath(genreNode, futureNode, 0.48);
                                return (
                                  <g>
                                    <path d={accessPath} fill="none" stroke={item.genreMatch ? "#fb7185" : "#2563eb"} strokeWidth={1.8 + Math.min(futureWeight, 5) * 0.35} strokeLinecap="round" opacity="0.85" strokeDasharray="3 4" />
                                    <circle cx={futureNode.x} cy={futureNode.y} r={3.5 + Math.min(futureWeight, 3)} fill="#2563eb" />
                                    {item.access.slice(0, futureLabelCount).map((game, ai) => {
                                      const spread = (ai - (futureLabelCount - 1) / 2) * 9;
                                      const leaf = polar(futureNode.x, futureNode.y, 24 + ai * 14, angle + spread);
                                      const side = leaf.x < cx ? -1 : 1;
                                      return (
                                        <g key={`future-${item.genre}-${game}`}>
                                          <path d={leafPath(leaf.x, leaf.y, side, 7)} fill="#bfdbfe" stroke="#2563eb" strokeWidth="1" />
                                          <text x={leaf.x + side * 10} y={leaf.y + 3} textAnchor={side < 0 ? "end" : "start"} fontSize="7.4" fill="#1e3a8a">{game}</text>
                                        </g>
                                      );
                                    })}
                                  </g>
                                );
                              })()}
                            </>
                          )}
                          {item.played.slice(0, playedLabelCount).map((game, gi) => {
                            const spread = (gi - (playedLabelCount - 1) / 2) * 10;
                            const leaf = polar(genreNode.x, genreNode.y, 26 + gi * 14, angle + spread);
                            const side = leaf.x < cx ? -1 : 1;
                            return (
                              <g key={`played-${item.genre}-${game}`}>
                                <path d={leafPath(leaf.x, leaf.y, side, 8)} fill="#a7f3d0" stroke="#0f766e" strokeWidth="1" />
                                <text x={leaf.x + side * 12} y={leaf.y + 3} textAnchor={side < 0 ? "end" : "start"} fontSize="7.8" fill="#14532d">{game}</text>
                              </g>
                            );
                          })}
                        </g>
                      );
                    })}
                    <circle cx={cx} cy={crownY - 16} r="10" fill="#14532d" stroke="#166534" strokeWidth="2" />
                    <text x={cx} y={crownY - 36} textAnchor="middle" fontSize="11" fontWeight="700" fill="#052e16">Genre foundation</text>
                  </svg>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "8px 0 0" }}>Click the canopy once to arm wheel zoom. After that, scroll zooms and click-drag pans. More leaf labels appear as you zoom in.</p>
            </div>

            {/* Strip card */}
            <div style={card}>
              <h2 style={{ fontSize: 18, margin: "0 0 12px", color: "#0f172a" }}>Family-tree strip</h2>
              <div ref={cardsScrollerRef} style={{ overflowX: "auto", borderRadius: 22, border: "1px solid #e2e8f0", background: "white", padding: 12 }}>
                <div style={{ display: "flex", width: "max-content", gap: 16, paddingRight: 16 }}>
                  {visible.map((item) => <GenrePanel key={item.genre} item={item} showAccess={showAccess} />)}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
