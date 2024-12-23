import type { Author } from '@/lib/collections';
import { cn } from '@/lib/utils';

interface StackedAuthorsProps {
  authors: Author[];
  size?: number;
  className?: string;
}

export function StackedAuthors({ authors, size = 32, className }: StackedAuthorsProps) {
  if (!authors.length) return null;

  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="flex -space-x-3 hover:-space-x-1 transition-all duration-200">
        {authors.map((author, i) => (
          <div
            key={author.id}
            className={cn(
              'relative rounded-full border-2 border-background overflow-hidden',
              'transition-all duration-200 hover:z-10',
              'group'
            )}
            style={{
              width: size,
              height: size,
              zIndex: authors.length - i,
            }}
          >
            <img
              src={author.data.image}
              alt={author.data.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-center h-full">
                <span className="text-white text-xs font-medium truncate px-1">
                  {author.data.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {authors.length > 1 && (
        <span className="ml-4 text-sm text-muted-foreground">{authors.length} authors</span>
      )}
    </div>
  );
}
