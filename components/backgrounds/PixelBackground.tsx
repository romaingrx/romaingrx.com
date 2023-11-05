'use client';

import { AnimatePresence, TargetAndTransition, motion } from 'framer-motion';
import clsx from 'clsx';

type PixelBackgroundProps = {
  columns?: number;
  className?: string;
  backgroundColor?: string;
};

type CorePixelBackgroundProps = PixelBackgroundProps & {
  variants: {
    initial: ({
      row,
      column,
      rows,
      columns,
    }: {
      row: number;
      column: number;
      rows: number;
      columns: number;
    }) => TargetAndTransition;
    animate: ({
      row,
      column,
      rows,
      columns,
    }: {
      row: number;
      column: number;
      rows: number;
      columns: number;
    }) => TargetAndTransition;
    exit: ({
      row,
      column,
      rows,
      columns,
    }: {
      row: number;
      column: number;
      rows: number;
      columns: number;
    }) => TargetAndTransition;
  };
};

function CorePixelBackground({
  className,
  columns = 20,
  variants = {
    initial: () => ({ opacity: 1 }),
    animate: () => ({ opacity: 0 }),
    exit: () => ({ opacity: 1 }),
  },
  backgroundColor = 'var(--romaingrx-colors-emphasis)', // backgroundColor = "red",
}: CorePixelBackgroundProps): JSX.Element {
  const { innerWidth = 1600, innerHeight = 1600 } =
    typeof window !== 'undefined' ? window : {};
  const pixelSize = innerWidth / columns;
  const rows = Math.ceil(innerHeight / pixelSize);

  return (
    <>
      <div className={clsx(className, 'flex h-full')} onClick={() => {}}>
        {Array.from(Array(columns).keys()).map((_, column) => {
          return (
            <div
              key={`${column}`}
              className="h-full"
              style={{
                width: `${100 / columns}vw`,
              }}
            >
              {Array.from(Array(rows).keys()).map((_, row) => {
                return (
                  <motion.div
                    key={`${row}-${column}`}
                    className="h-full"
                    variants={variants}
                    initial={'initial'}
                    animate={'animate'}
                    exit={'exit'}
                    custom={{ row, column, rows, columns }}
                    style={{
                      height: `${pixelSize}px`,
                      width: `${100 / columns}vw`,
                      backgroundColor: backgroundColor,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

type TransformFunctionProps = PixelBackgroundProps & {
  delay?: number;
  duration?: number;
};

const RandomPixelBackground = ({
  className,
  delay = 0.5,
  duration = 0.1,
}: TransformFunctionProps): JSX.Element => {
  return (
    <CorePixelBackground
      className={className}
      columns={Math.floor(Math.random() * 10) + 1}
      variants={{
        initial: () => ({
          opacity: 1,
        }),
        animate: () => ({
          opacity: 0,
          transition: {
            duration: duration,
            delay: delay * Math.random(),
          },
        }),
        exit: () => ({
          opacity: 1,
          transition: {
            duration: duration,
            delay: delay * Math.random(),
          },
        }),
      }}
    />
  );
};

function DownToUpPixelBackground({
  className,
  delay = 0.5,
  duration = 0.1,
}: TransformFunctionProps): JSX.Element {
  return (
    <CorePixelBackground
      className={className}
      columns={20}
      variants={{
        initial: () => ({
          opacity: 1,
        }),
        animate: ({ row, rows }) => ({
          opacity: 0,
          transition: {
            duration: duration,
            delay: (rows * (1 + 0.2 * Math.random()) - row) * delay,
          },
        }),
        exit: ({ column, columns }) => ({
          opacity: 1,
          transition: {
            duration: duration,
            delay: Math.abs(columns / 2 - column) * delay,
          },
        }),
      }}
    />
  );
}

interface TransitionProps extends TransformFunctionProps {
  children: React.ReactNode;
  transitionFunction?: (props: TransformFunctionProps) => JSX.Element;
}

function OldTransition({
  children,
  delay = 0.02,
  duration = 0.5,
  transitionFunction = DownToUpPixelBackground,
}: TransitionProps): JSX.Element {
  const TransitionFunction = transitionFunction;
  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-[10000000000000000000] h-full w-full">
        <AnimatePresence>
          <TransitionFunction
            delay={delay}
            duration={duration}
            className="h-full w-full"
          />
        </AnimatePresence>
      </div>
      {children}
    </>
  );
}

function Transition({ children, ...props }: TransitionProps) {
    // TODO : work on a better transition than pixel background
  return children;
}

export default CorePixelBackground;
export type {
  CorePixelBackgroundProps,
  PixelBackgroundProps,
  TransformFunctionProps,
};
export { RandomPixelBackground, Transition };
