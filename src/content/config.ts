import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    year: z.number(),
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
    cover_image: z.string(),
    description: z.string()
  })
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    summary: z.string()
  })
});

export const collections = { projects, posts };
