# Spatial Web Architecture

## Vision
Build a lived-in digital arcade that feels like a hallway of rooms and machines, while keeping the site fully usable in a plain, readable normal mode.

## Core Principles
- Keep existing content and voice unchanged; evolve interface and navigation layers.
- Ship free-first integrations (static data, RSS, public embeds, no paid APIs).
- Preserve accessibility as a hard requirement, with Normal mode always readable and stable.
- Design for Cloudflare Pages static hosting with lightweight client-side enhancement.

## Tri-Modal Hallway Model

### 1. Normal
- Default mode for accessibility and clarity.
- Shows existing page content with minimal interaction overhead.
- Works without animation-heavy effects.

### 2. Walkthrough
- Guided path through key destinations (work, writing, social, AGI, contact).
- Step controls with persisted progress.
- Useful for first-time visitors and structured portfolio review.

### 3. Explore
- Fast-jump mode for room-based browsing.
- Prominent room links and category affordances.
- Optimized for discovery and non-linear traversal.

## Rendering + State Strategy
- Apply mode as early as possible in `<head>` to prevent visual flicker:
  - read saved mode from `localStorage`
  - set `<html data-mode="normal|walk|explore">` before paint
- Keep a small runtime API for switching modes from footer settings.
- Use CSS hooks (`html[data-mode="walk"]`, `html[data-mode="explore"]`) to control visibility and layout.

## World Layer (Hallway Backdrop)
- Global background stack behind content:
  - vignette
  - fog
  - grain
  - neon edge glow
- Subtle cursor aura with complementary color from active room accent.
- Respect `prefers-reduced-motion` and keep effects low amplitude for readability.

## Color System
- Route-aware accent selection via nav/room color tokens.
- Maintain an Isha-inspired token map for deterministic accents.
- Derive complementary cursor aura color from active accent to create depth without overpowering text.

## Rooms and Machines (Data-Driven)
- Source of truth: `src/data/rooms.json`.
- Each room defines:
  - metadata (title, theme color, description)
  - machines/cards
  - destination strategy:
    - native route
    - embed wrapper
    - external link with strong CTA
- `/social` acts as the arcade index rendering room machines from data.
- `/room/[slug]` renders room-specific content and wrappers from the same data model.

## Thread Reliability
- Every thread card must resolve to a real destination.
- If a destination is not implemented yet, provide a lightweight internal fallback route to avoid dead UI.

## Media Consoles
- Music console:
  - Untitled embed wrapper
  - Spotify playlist embed wrapper
- Writing console:
  - Substack RSS fetched at build time
  - latest items rendered as native cards
- Consoles share consistent world-wrapped styling for cohesion.

## AGI Timeline MVP
- Local schema in `src/data/agi.events.json`:
  - `date`
  - `title`
  - `summary`
  - `tags`
  - `source_url`
- `/agi` renders a filterable, citation-first timeline list.
- Add TODO hooks for optional GitHub Action automation later.

## Deployment Fit (Cloudflare Pages)
- Static-first rendering with optional client-side enhancements.
- No auth and no paid API dependencies required for MVP.
- Keep build output deterministic and lightweight.
