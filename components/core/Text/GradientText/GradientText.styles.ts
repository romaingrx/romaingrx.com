import { keyframes, styled } from '@/design';

const SmokyKeyframe = keyframes({
  to: {
    backgroundPosition: 'var(--bg-size) 0',
  },
});

const StyledGradientText = styled('span', {
  '--bg-size': '200%',
  '--color-one': 'var(--romaingrx-colors-brand)',
  '--color-two': 'var(--romaingrx-colors-brand-complementary)',
  background:
    'linear-gradient(var(--gradient-angle, 90deg), var(--color-one), var(--color-two), var(--color-one)) 0 0 / var(--bg-size) 100%',
  color: 'transparent',
  backgroundClip: 'text',

  variants: {
    variant: {
      steady: {},
      smoky: {
        animation: `${SmokyKeyframe} 4s infinite linear`,
      },
      'radial-smoky': {
        backgroundImage: 'radial-gradient(var(--color-one), var(--color-two))',
        animation: `${SmokyKeyframe} 4s infinite linear`,
      },
    },
  },
});

export { StyledGradientText };
