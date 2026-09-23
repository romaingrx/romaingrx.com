import { z } from 'astro/zod';

import { platform_names } from './platforms';

export const platforms_enum = z.enum(platform_names);
