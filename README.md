# Angel Suero — Timeline / Archive Website

A modern, lo-fi, content-first personal site for **Angel Suero (a_e.s_)** built with Astro + Tailwind and designed to scale into a larger creative hub.

## Stack
- Astro
- Tailwind CSS
- Astro Content Collections (projects + writing)
- Cloudflare Pages Functions (`/functions/contact`)

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
4. Ensure the `functions/` directory is included so `/functions/contact` is deployed as a Pages Function.

## Content editing
### Identity/profile
Edit `src/content/profile.json`:
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
