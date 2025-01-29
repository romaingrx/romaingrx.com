import { glob } from 'astro/loaders';
import { defineCollection, reference, z } from 'astro:content';

import { platforms_enum } from './configs/platforms';
import { resource_schema } from './configs/resources';

// Define the author collection schema
const author = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './content/author' }),
  schema: z
    .object({
      name: z.string(),
      title: z.string().optional(),
      description: z.string(),
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

// Export collections
export const collections = {
  author,
  blog,
  timeline,
};

// Export types
export type TimelineSchema = z.infer<typeof timelineSchema>;
