import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerRenderWhitespace,
} from '@shikijs/transformers';
import cudaLanguageConfig from '../assets/shiki-lang/cuda-cpp.json';
import nixLanguageConfig from '../assets/shiki-lang/nix.json';

export const shikiConfig = {
  transformers: [transformerColorizedBrackets()],
};

export const themes = {
  light: 'solarized-light',
  dark: 'one-dark-pro',
} as const;
