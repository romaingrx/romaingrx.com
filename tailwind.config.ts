import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';
import typo from '@tailwindcss/typography';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        bob: {
          default: '#da7df5',
          '50': '#faeffe',
          '100': '#f6defd',
          '200': '#edbefa',
          '300': '#e39df8',
          '400': '#da7df5',
          '500': '#d15cf3',
          '600': '#a74ac2',
          '700': '#7d3792',
          '800': '#542561',
          '900': '#2a1231',
        },
      },
    },
  },
  plugins: [nextui(), typo()],
};
export default config;
