import { keyframes } from '@emotion/react';

interface GradientElement {
  from: string;
  to: string;
  key: string;
}

interface GradientBackgroundProps {
  elements: GradientElement[];
  children: React.ReactNode;
}
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export function createGradientElem({
  from,
  to,
  key,
}: {
  from: string;
  to: string;
  key: string;
}) {
  return (
    <div
      key={key}
      className="absolute bottom-auto left-auto right-auto top-auto z-[3] h-[40%] w-[20%]"
      style={{
        backgroundImage: `radial-gradient(circle farthest-corner at 80% 60%, ${from} 38%, ${to})`,
        animation: `${rotate} 10s linear infinite`,
      }}
    />
  );
}

export default function GradientBackground({
  elements,
  children,
}: GradientBackgroundProps) {
  return (
    <div className="relative h-full w-full">
      <div
        id="gradient-container"
        className="absolute bottom-auto left-auto right-auto top-auto z-[1] flex h-full w-full items-center justify-center "
        style={{
          transform:
            'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
        }}
      >
        <div
          id="gradient-panel"
          className={
            'before:bg-[url(http://localhost:3000/noise/light.png), repeat] before:bg[size-10%] relative z-[2] flex items-center justify-center before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:contents before:bg-blend-soft-light before:blur-sm'
          }
        >
          {elements.map((elem, index) =>
            createGradientElem({ ...elem, key: `gradient-${index}` }),
          )}
        </div>
      </div>
      <div className="relative z-[3]">{children}</div>
    </div>
  );
}
