import React from 'react';
import SmoothGradient, {
  type SmoothGradientProps,
} from '@/components/backgrounds/smooth-gradient.tsx';

export interface BlogPostBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  value: string;
  width?: string;
  height?: string;
}

function generateSmoothGradientProps(title: string): SmoothGradientProps {
  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash + char) >>> 0;
    }
    return hash;
  };

  const seed = hash(title);
  const hue1 = seed % 360;
  const hue2 = (hue1 + 60) % 360;

  return {
    color1: `hsl(${hue1}, 70%, 85%)`,
    color2: `hsl(${hue2}, 60%, 90%)`,
    noiseOpacity: 0.15,
    rotation: (seed % 360) - 180,
  };
}

const BlogPostBackground: React.FC<BlogPostBackgroundProps> = ({
  value,
  width = '100%',
  height = '100%',
  ...props
}) => {
  const smoothGradientProps = generateSmoothGradientProps(value);

  return (
    <div style={{ width, height, position: 'relative' }} {...props}>
      <SmoothGradient {...smoothGradientProps} width={width} height={height} />
    </div>
  );
};

export default BlogPostBackground;
