import type { ShikiConfig } from 'astro';

import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';

import cudaLanguageConfig from '../assets/shiki-lang/cuda-cpp.json' with { type: 'json' };
import nixLanguageConfig from '../assets/shiki-lang/nix.json' with { type: 'json' };

export const shikiConfig: ShikiConfig = {
  langs: [
    nixLanguageConfig,
    // @ts-expect-error The JSON import infers literal types that do not overlap Shiki's grammar type.
    { ...cudaLanguageConfig, aliases: ['cu', 'cuh', 'cuda'] },
  ],
  transformers: [transformerColorizedBrackets()],
};
