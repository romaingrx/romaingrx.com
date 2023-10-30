import { globalCss } from "./stitches.config";
import { palette, spaces, fonts, fontSizes, fontWeights } from "./tokens";
import lightTheme from './themes/romaingrx-light'
import darkTheme from './themes/romaingrx-dark'

const global = {
    'box-sizing': 'border-box',
    'color' : 'var(--romaingrx-colors-typeface-primary)',
}

const selectors = ['*', '*:before', '*:after']

export const globalStyles = globalCss({
    ':root': {
        ...palette,
        ...spaces,
        ...fonts,
        ...fontSizes,
        ...fontWeights,
    },
    ...Object.fromEntries(selectors.map((selector) => [selector, global])),
    ...lightTheme,
    ...darkTheme,
});