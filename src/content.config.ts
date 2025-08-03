import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { platforms_enum } from './configs/platforms';
import { resource_schema } from './configs/resources';

// Define the author collection schema
const author = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/author' }),
  schema: z
    .object({
      name: z.string(),
      title: z.string().optional(),
      image: z.string(),
      socialLinks: z.array(
        z.object({
          platform: platforms_enum,
          url: z.string().url(),
        })
      ),
    })
    .strict(),
});

// Define the blog collection schema
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        cover: image().optional(),
        authors: z.array(reference('author')),
        status: z.enum(['published', 'draft', 'archived']).default('draft'),
        published_date: z.date(),
        updated_date: z.date().optional(),
        tags: z.array(z.string()),
        categories: z.array(z.string()),
        related_posts: z.array(reference('blog')).optional(),
        resources: z.array(resource_schema).optional(),
        bibliography: z.union([z.string(), z.array(z.string())]).optional(),
      })
      .strict(),
});

// Define the timeline collection schema
export const timelineSchema = z
  .object({
    title: z.string(),
    organization: z.string(),
    organization_url: z.string().url().optional(),
    location: z.string(),
    startDate: z.string(), // YYYY-MM format
    endDate: z.string().optional(), // YYYY-MM format or "present"
    type: z.enum(['education', 'experience', 'project']),
    tags: z.array(z.string()).optional(),
    order: z.number().optional(), // For manual ordering if needed
  })
  .strict();

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/timeline' }),
  schema: timelineSchema,
});

// Define the note collection schema
const noteSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    authors: z.array(reference('author')),
    status: z.enum(['published', 'draft', 'archived']).default('draft'),
    published_date: z.date(),
    updated_date: z.date().optional(),
    tags: z.array(z.string()),
    resources: z.array(resource_schema).optional(),
  })
  .strict();

const note = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/note' }),
  schema: noteSchema,
});

// Export collections
export const collections = {
  author,
  blog,
  timeline,
  note,
};

// Export types
export type TimelineSchema = z.infer<typeof timelineSchema>;
export type NoteSchema = z.infer<typeof noteSchema>;
