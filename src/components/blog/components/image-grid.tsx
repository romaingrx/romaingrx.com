'use client';

import { cn } from '@/lib/utils';

interface ImageGridItem {
  src: string;
  label?: string;
}

interface ImageGridProps {
  images: ImageGridItem[];
  columns?: number;
  size?: number;
  className?: string;
}

export function ImageGrid({ images, columns = 4, size = 64, className }: ImageGridProps) {
  const renderSize = size * 2;

  return (
    <>
      <style>{`
        .image-grid-cols-${columns} {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 640px) {
          .image-grid-cols-${columns} {
            grid-template-columns: repeat(${columns}, minmax(0, 1fr));
          }
        }
      `}</style>
      <div className={cn(`image-grid-cols-${columns} grid gap-4`, className)}>
        {images.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="rounded bg-black p-2 flex items-center justify-center">
              <img
                src={`data:image/png;base64,${item.src}`}
                alt={item.label ?? `Image ${i + 1}`}
                width={renderSize}
                height={renderSize}
                style={{
                  width: renderSize,
                  height: renderSize,
                  imageRendering: 'pixelated',
                }}
              />
            </div>
            {item.label && (
              <span className="text-xs font-mono text-muted-foreground">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
