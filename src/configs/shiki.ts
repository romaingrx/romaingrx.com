import type { ShikiConfig } from 'astro';
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';
import cudaLanguageConfig from '../assets/shiki-lang/cuda-cpp.json' with { type: 'json' };
import nixLanguageConfig from '../assets/shiki-lang/nix.json' with { type: 'json' };

// Start of Selection
export const shikiConfig: ShikiConfig = {
  langs: [
    nixLanguageConfig,
    // @ts-expect-error
    {
      ...cudaLanguageConfig,
      aliases: ['cu', 'cuh', 'cuda'],
    },
  ],
  transformers: [transformerColorizedBrackets()],
};
