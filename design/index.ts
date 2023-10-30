// styles
export { globalStyles } from './styles';

// themes
export { default as lightTheme } from './themes/romaingrx-light';

// fonts
import inter from './fonts/inter';
import worldWise from './fonts/worldwise';
export const fonts = [
    inter,
    worldWise,
];


// stitches.config.ts
export { css, getCssText, globalCss, keyframes, styled, theme } from './stitches.config';
export type { CSS } from './stitches.config';
export type { VariantProps } from '@stitches/react';