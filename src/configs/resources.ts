import { z } from 'astro/zod';

import { platforms_enum } from './platforms';
import { site } from './site';

export const resourceTypeEnum = z.enum(['code', 'model', 'dataset', 'paper']);
export const resourceProviderEnum = platforms_enum;

export type ResourceType = z.infer<typeof resourceTypeEnum>;
export type ResourceProvider = z.infer<typeof resourceProviderEnum>;

// Define provider-type compatibility matrix
export const VALID_PROVIDER_TYPES: Record<ResourceProvider, ResourceType[]> = {
  website: ['code', 'model', 'dataset', 'paper'],
  github: ['code', 'dataset'],
  twitter: [],
  linkedin: [],
  huggingface: ['model', 'dataset', 'paper'],
  arxiv: ['paper'],
  zenodo: ['code', 'model', 'dataset', 'paper'],
  hackernews: [],
};

export const resource_schema = z
  .object({
    type: resourceTypeEnum,
    provider: resourceProviderEnum,
    value: z.union([z.url(), z.string().startsWith('./')]),
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
  })
  .refine((data) => VALID_PROVIDER_TYPES[data.provider].includes(data.type), {
    message: 'Invalid provider and type combination',
    path: ['type', 'provider'],
  });

export type Resource = z.infer<typeof resource_schema>;

const branch = process.env.WORKERS_CI_BRANCH ?? 'main';

/**
 * Resolve a resource value to a full URL. Relative paths (starting with ./)
 * are resolved against the content entry's location in the GitHub repo.
 */
export function resolveResourceValue(
  value: string,
  { collection, entryId }: { collection: string; entryId: string },
): string {
  if (!value.startsWith('./')) return value;
  const relativePath = value.slice(2);
  return `https://github.com/${site.repo}/tree/${branch}/src/content/${collection}/${entryId}/${relativePath}`;
}
