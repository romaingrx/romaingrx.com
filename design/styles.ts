import { globalCss } from './stitches.config';
import {
  palette,
  spaces,
  radius,
  fonts,
  fontSizes,
  fontWeights,
} from './tokens';
import lightTheme from './themes/romaingrx-light';
import darkTheme from './themes/romaingrx-dark';

const global = {
  'box-sizing': 'border-box',
};

const selectors = ['*', '*:before', '*:after'];

export const globalStyles = globalCss({
  ':root': {
    ...palette,
    ...spaces,
    ...radius,
    ...fonts,
    ...fontSizes,
    ...fontWeights,
  },
  ...Object.fromEntries(selectors.map((selector) => [selector, global])),
  ...lightTheme,
  ...darkTheme,
});
