import React from 'react';

export interface SmoothGradientProps {
  color1?: string;
  color2?: string;
  noiseOpacity?: number;
  rotation?: number;
  width?: string;
  height?: string;
}

const SmoothGradient: React.FC<SmoothGradientProps> = ({
  color1 = 'hsl(210, 40%, 85%)',
  color2 = 'hsl(240, 30%, 90%)',
  noiseOpacity = 0.05,
  rotation = 45,
  width = '100%',
  height = '100%',
}) => {
  const gradientId = `smooth-gradient-${Math.random().toString(36).slice(2, 11)}`;
  const noiseId = `smooth-noise-${Math.random().toString(36).slice(2, 11)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} gradientTransform={`rotate(${rotation})`}>
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
        <filter id={noiseId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.5"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
      <rect width="100%" height="100%" filter={`url(#${noiseId})`} opacity={noiseOpacity} />
    </svg>
  );
};

export default SmoothGradient;
