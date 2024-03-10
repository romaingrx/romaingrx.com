import localFont from 'next/font/local';

const polySansSlim = localFont({
  src: '../../assets/fonts/PolySans/PolySans-Slim.woff2',
  variable: '--font-polysans-slim',
  weight: '400',
});

const polySansNeutral = localFont({
  src: '../../assets/fonts/PolySans/PolySans-Neutral.woff2',
  variable: '--font-polysans-neutral',
  weight: '400',
});

const polySansMedian = localFont({
  src: '../../assets/fonts/PolySans/PolySans-Median.woff2',
  variable: '--font-polysans-median',
  weight: '400',
});

export { polySansSlim, polySansNeutral, polySansMedian };
export default polySansMedian;
