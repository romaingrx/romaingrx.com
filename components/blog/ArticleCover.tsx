import { Article } from '@/.contentlayer/generated';
import LiquidGradient, {
  LiquidGradientProps,
} from '../backgrounds/LiquidGradient';
import Image from 'next/image';

function nextRandomInt(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return Math.abs(Math.floor(x));
}

function HashArticleLiquidGradientProps({
  article,
}: {
  article: Article;
}): LiquidGradientProps {
  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash + char) >>> 0; // Convert to 32bit positive integer
    }
    return hash;
  };

  const hslSeed = (seed: number) => {
    const ranges = [
      // Pink
      {
        value: 315,
        range: 30,
      },
      // Blue
      {
        value: 227,
        range: 30,
      },
      // Orange
      {
        value: 25,
        range: 30,
      },
    ];

    const range = ranges[seed % ranges.length];
    return range.value - range.range / 2 + (seed % range.range);
  };

  const seed = hash(article.title);
  const seed2 = nextRandomInt(seed);

  const props = {
    seed: seed,
    rotation: seed % 180,
    color1: `hsl(${hslSeed(seed)}, 100%, 72%)`,
    color2: `hsl(${hslSeed(seed2) + 1}, 100%, 50%)`,
    // baseFrequency: `${seed % 0.01} ${seed % 0.01}`,
    // numOctaves: seed % 5,
    // stdDeviation: `${seed % 30} ${seed % 20}`,
    mode: 'color-dodge',
    x: '0%',
    y: '0%',
    width: '100%',
    height: '100%',
  };
  return props;
}

function ArticleCoverWithBg({ article }: { article: Article }) {
  if (!article.cover) return null;
  const liquidProps = article.cover.liquidGradientProps || HashArticleLiquidGradientProps({ article });

  return (
    <div className="relative left-0 top-0 h-4/5 w-full bg-opacity-70">
      <div className="absolute inset-0 h-full w-full" id="test">
        <LiquidGradient {...liquidProps} />
      </div>
      <div className="relative left-0 top-0">
        <div className="relative m-3 h-[128px]">
          <Image
            src={article.cover.src}
            alt={article.title}
            fill={true}
            objectFit="cover"
            className="rounded-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default ArticleCoverWithBg;
