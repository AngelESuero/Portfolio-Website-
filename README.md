# Angel Suero — Timeline / Archive Website

A modern, lo-fi, content-first personal site for **Angel Suero (a_e.s_)** built with Astro + Tailwind and designed to scale into a larger creative hub.

## Stack
- Astro
- Tailwind CSS
- Astro Content Collections (projects + writing)
- Cloudflare Pages Functions (`/contact`, `/api/agi`, `/api/agi-x`)

## Local development
```bash
npm install
npm run dev
```
Open `http://localhost:4321`.

## Build
```bash
npm run build
```

## Deploy on Cloudflare Pages
1. Push this repo to GitHub.
2. In Cloudflare Pages, create a new project and connect the repo.
3. Use these build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Ensure the `functions/` directory is included so `/contact`, `/api/agi`, and `/api/agi-x` are deployed as Pages Functions.

## AGI Timeline setup
The AGI timeline uses two pieces:
- Pages Function APIs:
  - `GET /api/agi` for web-source timeline (enabled now)
  - `GET /api/agi-x` for optional researcher timeline from X (disabled by default)
- Scheduled Worker: `workers/agi-sync.ts` (parses sources and writes normalized items to KV)

### 1) Create KV namespace
Create a KV namespace and bind it as `AGI_KV`:
- In Cloudflare Pages project settings: add KV binding `AGI_KV`
- In worker config: update `wrangler.agi.toml` with the namespace id

### 2) Optional manual sync token (for `/sync` on worker)
```bash
npx wrangler secret put AGI_SYNC_TOKEN -c wrangler.agi.toml
```

### 3) Deploy the scheduled sync worker
```bash
npx wrangler deploy -c wrangler.agi.toml
```

Cron is configured every 3 hours in `wrangler.agi.toml`:
```toml
[triggers]
crons = ["0 */3 * * *"]
```

### 4) Source lists
Web sources:
- `src/data/agi-web-sources.ts`

Optional X handle allowlist:
- `src/data/agi-handles.ts`

Each item in KV follows:
- `id`, `source_name`, `title`, `date`, `summary`, `url`, `tags[]`
- optional for X items: `author_handle`, `tweet_url`

### 5) Optional X module (disabled by default)
When you want to enable X ingestion:
1. Set worker secret:
```bash
npx wrangler secret put X_BEARER_TOKEN -c wrangler.agi.toml
```
2. Set worker variable `AGI_X_ENABLED=true`
3. Set Pages env var `AGI_X_ENABLED=true` so `/api/agi-x` serves data

## Content editing
### Identity/profile
Edit `src/data/profile.json`:
- `name`, `location`, `roles`, `mottos`, `short_bio`, `long_bio`
- `social_links`
- `link_hub_url`

### Projects
Add/edit files in `src/content/projects/*.md` with frontmatter:
- `title`, `year`, `type` (`music|video|writing|civic`), `status`, `tools`
- `links` (`github`, `linktree`, `youtube`, `instagram`, `untitled`)
- `featured`, `cover_image`, `description`

### Writing
Add/edit `src/content/posts/*.mdx`:
- `title`, `date`, `tags`, `summary`

### Seasonal updates
Edit `src/pages/now.astro`.

### Instagram archive (local files)
1. Put exported media in:
   - `public/ig/<year>/YYYY-MM-DD_slug.ext`
2. Generate/update manifest:
```bash
npm run ig:manifest
```
3. Curate metadata in:
   - `src/data/ig.json`

Item schema:
- `id`, `date`, `year`, `type` (`photo|reel|carousel|video`), `series`, `tags[]`, `src`
- optional: `caption`, `ig_url`

### Social pages (free-first)
- Hub: `/social`
- Dynamic platform pages: `/social/[slug]`
- Direct routes: `/youtube`, `/soundcloud`, `/substack`, `/x`, `/threads`, `/tiktok`, `/twitch`
- Config:
  - `src/data/social.json`
- RSS proxy endpoint for supported platforms:
  - `GET /api/social-rss?slug=<platform>`

## Notes
- SEO basics are included via shared layout metadata.
- RSS feed is available at `/rss.xml`.
- Sitemap is generated automatically.
- `robots.txt` is in `/public/robots.txt`.
