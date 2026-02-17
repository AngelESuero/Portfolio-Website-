# Angel Suero — Timeline / Archive Website

A modern, lo-fi, content-first personal site for **Angel Suero (a_e.s_)** built with Astro + Tailwind and designed to scale into a larger creative hub.

## Stack
- Astro
- Tailwind CSS
- Astro Content Collections (projects + writing)
- Cloudflare Pages Functions (`/contact`, `/api/agi`)

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
4. Ensure the `functions/` directory is included so `/contact` and `/api/agi` are deployed as Pages Functions.

## AGI Timeline setup
The AGI timeline uses two pieces:
- Pages Function API: `GET /api/agi` (reads from KV)
- Scheduled Worker: `workers/agi-sync.ts` (hourly fetch from official X API and writes to KV)

### 1) Create KV namespace
Create a KV namespace and bind it as `AGI_KV`:
- In Cloudflare Pages project settings: add KV binding `AGI_KV`
- In worker config: update `wrangler.agi.toml` with the namespace id

### 2) Configure X API bearer token
Set the secret on the sync worker:
```bash
npx wrangler secret put X_BEARER_TOKEN -c wrangler.agi.toml
```

Optional manual sync token (for `POST/GET /sync` on worker):
```bash
npx wrangler secret put AGI_SYNC_TOKEN -c wrangler.agi.toml
```

### 3) Deploy the hourly sync worker
```bash
npx wrangler deploy -c wrangler.agi.toml
```

Cron is configured hourly in `wrangler.agi.toml`:
```toml
[triggers]
crons = ["0 * * * *"]
```

### 4) Curated allowlist
Edit handles in:
- `src/data/agi-handles.ts`

Each new item is stored in KV with shape:
- `id`, `author_name`, `author_handle`, `created_at`, `text`, `url`, optional `metrics`, optional `tags`

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

## Notes
- SEO basics are included via shared layout metadata.
- RSS feed is available at `/rss.xml`.
- Sitemap is generated automatically.
- `robots.txt` is in `/public/robots.txt`.
