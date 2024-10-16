import { cn } from '@/lib/utils';
import { Children } from 'react';

export interface ColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  space?: 'around' | 'between' | 'evenly';
  spread?: true;
}

export function Columns({
  children,
  space = 'between',
  spread,
  className,
  ...props
}: ColumnsProps) {
  const child = Children.toArray(children);
  const columns = child.length;

  if (columns > 4) {
    console.warn(
      "Columns greater than 4 won't look good on every screen size. Consider using a different number of columns.",
    );
  }

  const justify = {
    around: 'md:justify-around',
    between: 'md:justify-between',
    evenly: 'md:justify-evenly',
  }[space];

  return (
    <div
      className={cn(
        `grid grid-cols-1 md:grid-cols-${columns} md:flex md:flex-row ${justify} gap-4`,
        className,
      )}
      {...props}
    >
      {child.map((child, index) => (
        <div key={index} className={cn(spread && "flex-1")}>
          {child}
        </div>
      ))}
    </div>
  );
}
