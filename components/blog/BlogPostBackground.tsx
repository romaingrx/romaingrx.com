import React from 'react';
import SmoothGradient, { SmoothGradientProps } from '../backgrounds/SmoothGradient';

export interface BlogPostBackgroundProps {
  title: string;
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
  const hue2 = (hue1 + 40) % 360;

  return {
    color1: `hsl(${hue1}, 40%, 85%)`,
    color2: `hsl(${hue2}, 30%, 90%)`,
    noiseOpacity: 0.05,
    rotation: seed % 360,
  };
}

const BlogPostBackground: React.FC<BlogPostBackgroundProps> = ({ title, width = '100%', height = '100%' }) => {
  const smoothGradientProps = generateSmoothGradientProps(title);

  return (
    <div style={{ width, height, position: 'relative' }}>
      <SmoothGradient {...smoothGradientProps} width={width} height={height} />
    </div>
  );
};

export default BlogPostBackground;
