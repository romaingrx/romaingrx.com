import { z } from 'astro/zod';

export const platforms_enum = z.enum([
  'website',
  'github',
  'twitter',
  'linkedin',
  'huggingface',
  'arxiv',
  'zenodo',
]);
export type Platform = z.infer<typeof platforms_enum>;

interface PlatformInfo {
  icon_name: string;
  base_url?: string;
}

export const platforms_info: Record<Platform, PlatformInfo> = {
  website: {
    icon_name: 'mdi:globe',
  },
  github: {
    icon_name: 'mdi:github',
    base_url: 'https://github.com',
  },
  twitter: {
    icon_name: 'simple-icons:x',
    base_url: 'https://x.com',
  },
  linkedin: {
    icon_name: 'mdi:linkedin',
    base_url: 'https://linkedin.com',
  },
  huggingface: {
    icon_name: 'simple-icons:huggingface',
    base_url: 'https://huggingface.co',
  },
  arxiv: {
    icon_name: 'mdi:arxiv',
    base_url: 'https://arxiv.org',
  },
  zenodo: {
    icon_name: 'mdi:zenodo',
    base_url: 'https://zenodo.org',
  },
} as const;
