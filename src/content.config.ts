import { defineCollection, reference } from 'astro:content';

import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { platforms_enum } from './configs/platforms';
import { resource_schema } from './configs/resources';

// Shared schema for content entries with authors, status, and metadata
const baseContentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  authors: z.array(reference('author')),
  status: z.enum(['published', 'draft', 'archived']).default('draft'),
  published_date: z.date(),
  updated_date: z.date().optional(),
  tags: z.array(z.string()).default([]),
  resources: z.array(resource_schema).default([]),
  x_thread_id: z.url().optional(),
  bsky_thread_id: z.url().optional(),
});

const author = defineCollection({
  loader: glob({ pattern: '**/*/*.{md,mdx}', base: './src/content/author' }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string(),
        title: z.string().optional(),
        image: image(),
        socialLinks: z.record(
          platforms_enum,
          z
            .object({
              url: z.url(),
              handle: z.string().optional(),
            })
            .optional(),
        ),
      })
      .strict(),
});

const blog = defineCollection({
  loader: glob({ pattern: '*/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    baseContentSchema
      .extend({
        description: z.string(),
        cover: image().optional(),
        categories: z.array(z.string()).default([]),
        related_posts: z.array(reference('blog')).default([]),
        bibliography: z.union([z.string(), z.array(z.string())]).optional(),
        csl: z.enum(['apa', 'chicago', 'mla', 'vancouver', 'harvard1']).optional(),
        citationStyle: z.enum(['default', 'minimal', 'academic']).optional(),
      })
      .strict(),
});

export const timelineSchema = z
  .object({
    title: z.string(),
    organization: z.string(),
    organization_url: z.url().optional(),
    location: z.string(),
    startDate: z.string(), // YYYY-MM format
    endDate: z.string().optional(), // YYYY-MM format or "present"
    type: z.enum(['education', 'experience', 'project']),
    tags: z.array(z.string()).optional(),
    order: z.number().optional(),
  })
  .strict();

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/timeline' }),
  schema: timelineSchema,
});

const note = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/note' }),
  schema: baseContentSchema.strict(),
});

export const collections = { author, blog, timeline, note };

export type TimelineSchema = z.infer<typeof timelineSchema>;
export type NoteSchema = z.infer<typeof baseContentSchema>;
