'use client';

import { motion } from 'framer-motion';

interface GradientElement {
  from: string;
  to: string;
  animationClockwise?: boolean;
  key: string;
}

interface GradientBackgroundProps {
  elements?: GradientElement[];
  children: React.ReactNode;
}

export function createGradientElem({
  from,
  to,
  animationClockwise = true,
  key,
}: GradientElement) {
  const initialPosition =
    Array(2)
      .fill(0)
      .map(() => Math.floor((Math.random() - 0.5) * 50))
      .join('% ') + '%';

  return (
    <motion.div
      key={key}
      className="max-w-1/2 absolute bottom-auto left-auto right-auto top-auto aspect-square h-1/2 rounded-full opacity-50 blur-3xl"
      style={{
        backgroundImage: `radial-gradient(circle farthest-corner at 80% 60%, ${from} 38%, ${to})`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        translate: initialPosition,
      }}
      animate={{
        rotateX: animationClockwise ? 36 : -36,
        rotateZ: animationClockwise ? 180 : -180,
        translateX: animationClockwise ? 10 : -10,
        translateY: animationClockwise ? 5 : -5,
      }}
      transition={{
        duration: 20,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
  );
}

export default function GradientBackground({
  elements = [
    {
      from: 'var(--romaingrx-colors-brand)',
      to: 'var(--romaingrx-colors-foreground)',
      key: 'default-gradient',
    },
    {
      from: 'var(--romaingrx-colors-brand-complementary)',
      to: 'var(--romaingrx-colors-foreground)',
      key: 'default-gradient-2',
      animationClockwise: false,
    },
  ],
  children,
}: GradientBackgroundProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        id="gradient-container"
        className="absolute inset-0 z-[1] mx-auto my-auto flex h-full w-full items-center justify-center"
        style={{
          transform:
            'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) skew(0deg, 0deg)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        animate={{
          rotateZ: [0, 360],
        }}
        transition={{
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        <motion.div
          id="gradient-panel"
          className={
            'before:bg-size[10%] dark:before:bg-[url(/noise/dark.png)]before:bg-[url(/noise/light.png) relative z-[2] flex h-full w-full items-center justify-center blur-sm before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:aspect-square before:bg-repeat before:bg-blend-soft-light before:blur-sm'
          }
        >
          {elements.map((elem, index) =>
            createGradientElem({ ...elem, key: `gradient-${index}` }),
          )}
        </motion.div>
      </motion.div>
      <div className="relative z-[3]">{children}</div>
    </div>
  );
}
