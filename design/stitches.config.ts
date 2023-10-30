import { createStitches, CSS as StitchesCSS } from '@stitches/react';

const { config, css, getCssText, globalCss, keyframes, styled, theme } = createStitches();
export type CSS = StitchesCSS<typeof config>;

export { css, getCssText, globalCss, keyframes, styled, theme };