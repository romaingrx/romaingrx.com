import { z } from 'astro/zod';

export const resourceTypeEnum = z.enum(['code', 'model', 'dataset', 'paper']);
export const resourceProviderEnum = z.enum(['github', 'huggingface', 'arxiv', 'zenodo']);

export type ResourceType = z.infer<typeof resourceTypeEnum>;
export type ResourceProvider = z.infer<typeof resourceProviderEnum>;

// Define provider-type compatibility matrix
export const VALID_PROVIDER_TYPES: Record<ResourceProvider, ResourceType[]> = {
  github: ['code', 'dataset'],
  huggingface: ['model', 'dataset', 'paper'],
  arxiv: ['paper'],
  zenodo: ['code', 'dataset', 'paper'],
};

export const resource_schema = z
  .object({
    type: resourceTypeEnum,
    provider: resourceProviderEnum,
    value: z.string().url(),
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
  })
  .refine(data => VALID_PROVIDER_TYPES[data.provider].includes(data.type), {
    message: 'Invalid provider and type combination',
    path: ['type', 'provider'],
  });
