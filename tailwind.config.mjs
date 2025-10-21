/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './content/**/*.{md,mdx,astro,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-slow': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        'up-down': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        ripple: {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(0.9)',
          },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'up-down': 'up-down 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        ripple: 'ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        dots: 'radial-gradient(circle, #000 1px, transparent 1px)',
        'dots-dark': 'radial-gradient(circle, #fff 1px, transparent 1px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: {
            DEFAULT: 'hsl(var(--chart-1))',
            foreground: 'hsl(var(--chart-1-foreground))',
          },
          2: {
            DEFAULT: 'hsl(var(--chart-2))',
            foreground: 'hsl(var(--chart-2-foreground))',
          },
          3: {
            DEFAULT: 'hsl(var(--chart-3))',
            foreground: 'hsl(var(--chart-3-foreground))',
          },
          4: {
            DEFAULT: 'hsl(var(--chart-4))',
            foreground: 'hsl(var(--chart-4-foreground))',
          },
          5: {
            DEFAULT: 'hsl(var(--chart-5))',
            foreground: 'hsl(var(--chart-5-foreground))',
          },
        },
      },
    },
  },
  plugins: [
    import('tailwindcss-animate'),
    function ({ addVariant }) {
      addVariant('theme-light', 'html[data-theme="light"] &');
      addVariant('theme-dark', 'html[data-theme="dark"] &');
      addVariant('theme-system', 'html[data-theme="system"] &');
    },
  ],
};
