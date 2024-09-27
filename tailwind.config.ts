import { nextui } from '@nextui-org/react';
import typo from '@tailwindcss/typography';
import { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            content1: '#f0ebdb', // background
            content4: '#eacee0', // emphasis
          },
        },
        dark: {
          colors: {
            content1: '#21242c',
            content4: '#463654',
          },
        },
      },
    }),
    typo(),
      require("tailwindcss-animate")
],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-inter)'],
  			wise: ['var(--font-worldwise)'],
  			polysans: ['var(--font-polysans-median)', 'var(--font-polysans-neutral)', 'var(--font-polysans-slim)']
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		spacing: {
  			'1': 'var(--space-1)',
  			'2': 'var(--space-2)',
  			'3': 'var(--space-3)',
  			'4': 'var(--space-4)',
  			'5': 'var(--space-5)',
  			'6': 'var(--space-6)',
  			'7': 'var(--space-7)',
  			'8': 'var(--space-8)',
  			'9': 'var(--space-9)',
  			'10': 'var(--space-10)',
  			sm: 'var(--space-1)',
  			md: 'var(--space-2)',
  			lg: 'var(--space-3)',
  			xl: 'var(--space-4)',
  			'2xl': 'var(--space-5)',
  			'3xl': 'var(--space-6)',
  			'4xl': 'var(--space-7)',
  			'5xl': 'var(--space-8)',
  			'6xl': 'var(--space-9)',
  			'7xl': 'var(--space-10)'
  		},
  		fontSize: {
  			xs: 'var(--font-size-1)',
  			sm: 'var(--font-size-2)',
  			base: 'var(--font-size-3)',
  			lg: 'var(--font-size-4)',
  			xl: 'var(--font-size-5)',
  			'2xl': 'var(--font-size-6)',
  			'3xl': 'var(--font-size-7)'
  		},
  		colors: {
  			bob: {
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
  				default: '#da7df5'
  			},
  			'romaingrx-brand': 'var(--romaingrx-colors-brand)',
  			'romaingrx-brand-complementary': 'var(--romaingrx-colors-brand-complementary)',
  			'romaingrx-body': 'var(--romaingrx-colors-body)',
  			'romaingrx-header': 'var(--romaingrx-colors-header)',
  			'romaingrx-emphasis': 'var(--romaingrx-colors-emphasis)',
  			'romaingrx-foreground': 'var(--romaingrx-colors-foreground)',
  			'romaingrx-danger': {
  				default: 'var(--romaingrx-colors-danger)',
  				emphasis: 'var(--romaingrx-colors-danger-emphasis)'
  			},
  			'romaingrx-warning': 'var(--romaingrx-colors-warning)',
  			'romaingrx-warning-emphasis': 'var(--romaingrx-colors-warning-emphasis)',
  			'romaingrx-success': 'var(--romaingrx-colors-success)',
  			'romaingrx-success-emphasis': 'var(--romaingrx-colors-success-emphasis)',
  			'romaingrx-typeface': 'var(--romaingrx-colors-typeface-primary)',
  			'romaingrx-typeface-primary': 'var(--romaingrx-colors-typeface-primary)',
  			'romaingrx-typeface-secondary': 'var(--romaingrx-colors-typeface-secondary)',
  			'romaingrx-typeface-tertiary': 'var(--romaingrx-colors-typeface-tertiary)',
  			'romaingrx-typeface-danger': 'var(--romaingrx-colors-typeface-danger)',
  			'romainxrx-border-color': 'var(--romaingrx-border-color)',
  			'romainxrx-card-background-color': 'var(--romaingrx-card-background-color)',
  			'romaingrx-form-input-active': 'var(--romaingrx-form-input-active)',
  			'romaingrx-form-input-background': 'var(--romaingrx-form-input-background)',
  			'romaingrx-form-input-disabled': 'var(--romaingrx-form-input-disabled)',
  			'romaingrx-form-input-border': 'var(--romaingrx-form-input-border)',
  			'romaingrx-form-input-focus': 'var(--romaingrx-form-input-focus)',
  			'shadow-color': 'var(--shadow-color)',
  			'code-snippet-background': 'var(--code-snippet-background)',
  			'token-comment': 'var(--token-comment)',
  			'token-selector': 'var(--token-selector)',
  			'token-symbol': 'var(--token-symbol)',
  			'token-operator': 'var(--token-operator)',
  			'token-keyword': 'var(--token-keyword)',
  			'token-function': 'var(--token-function)',
  			'token-punctuation': 'var(--token-punctuation)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'var(--romaingrx-card-background-color)',
  				foreground: 'hsl(var(--foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	typography: {
  		DEFAULT: {
  			css: {
  				'--tw-prose-body': 'var(--romaingrx-colors-typeface-primary)',
  				'--tw-prose-headings': 'var(--romaingrx-colors-header)',
  				'--tw-prose-links': 'var(--romaingrx-colors-brand)',
  				'--tw-prose-links-hover': 'var(--romaingrx-colors-emphasis)',
  				'--tw-prose-underline': 'var(--romaingrx-colors-brand)',
  				'--tw-prose-underline-hover': 'var(--romaingrx-colors-emphasis)',
  				'--tw-prose-bold': 'var(--romaingrx-colors-typeface-primary)',
  				'--tw-prose-counters': 'var(--romaingrx-colors-emphasis)',
  				'--tw-prose-bullets': 'var(--romaingrx-colors-emphasis)',
  				'--tw-prose-hr': 'var(--romaingrx-colors-emphasis)',
  				'--tw-prose-quote-borders': 'var(--romaingrx-colors-brand)',
  				'--tw-prose-captions': 'var(--romaingrx-colors-typeface-secondary)',
  				'--tw-prose-th-borders': 'var(--romaingrx-colors-emphasis)',
  				'--tw-prose-td-borders': 'var(--romaingrx-colors-emphasis)'
  			}
  		}
  	}
  },
};
export default config;
