import { defineCollection, z } from 'astro:content';

const entryMediums = ['writing', 'music', 'video', 'image', 'note', 'proposal'] as const;
const entrySources = ['substack', 'youtube', 'untitled', 'local-media', 'private-notes', 'manual', 'linktree'] as const;
const entryStatuses = ['raw', 'withheld', 'in-progress', 'published', 'featured'] as const;

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    year: z.number(),
    timeline_order: z.number().optional(),
    type: z.enum(['music', 'video', 'writing', 'civic']),
    status: z.string(),
    tools: z.array(z.string()),
    links: z.object({
      github: z.string().optional(),
      linktree: z.string().optional(),
      youtube: z.string().optional(),
      instagram: z.string().optional(),
      untitled: z.string().optional()
    }),
    featured: z.boolean().default(false),
    leadPriority: z.number().optional(),
    role: z.string().optional(),
    relatedProjects: z.array(z.string()).optional(),
    relatedThread: z.string().optional(),
    media: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional()
        })
      )
      .optional(),
    cover_image: z.string(),
    description: z.string()
  })
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    ready: z.boolean().optional(),
    tags: z.array(z.string()),
    summary: z.string()
  })
});

const entries = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    medium: z.enum(entryMediums),
    source: z.enum(entrySources),
    status: z.enum(entryStatuses),
    tags: z.array(z.string()),
    summary: z.string(),
    external_url: z.string().url().optional(),
    related_entries: z.array(z.string()).optional(),
    audience: z.string().optional(),
    institution: z.string().optional(),
    proposal_status: z.string().optional(),
    place: z.string().optional(),
    ask: z.string().optional(),
    asset: z
      .object({
        src: z.string(),
        alt: z.string().optional(),
        poster: z.string().optional(),
        caption: z.string().optional()
      })
      .optional(),
    asset_type: z.enum(['audio', 'video', 'image']).optional(),
    original_filename: z.string().optional(),
    mime_type: z.string().optional(),
    file_size: z.number().int().nonnegative().optional(),
    upload_source: z.enum(['r2', 'external']).optional(),
    thumbnail: z.string().optional(),
    duration: z.string().optional(),
    ingest: z
      .object({
        mode: z.enum(['manual', 'rss', 'local']).optional(),
        rss_url: z.string().url().optional(),
        source_id: z.string().optional()
      })
      .optional()
  })
});

export const collections = { projects, posts, entries };
