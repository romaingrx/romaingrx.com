// styles
export { globalStyles } from './styles';

// themes
export { default as lightTheme } from './themes/romaingrx-light';
export { default as darkTheme } from './themes/romaingrx-dark';

// fonts
import inter from './fonts/inter';
import worldWise from './fonts/worldwise';
import {
  polySansSlim,
  polySansNeutral,
  polySansMedian,
} from './fonts/polysans';
export const fonts = [
  inter,
  worldWise,
  polySansSlim,
  polySansNeutral,
  polySansMedian,
];

// stitches.config.ts
export {
  css,
  getCssText,
  globalCss,
  keyframes,
  styled,
  theme,
} from './stitches.config';
export * from './tokens';
export type { CSS } from './stitches.config';
export type { VariantProps } from '@stitches/react';
