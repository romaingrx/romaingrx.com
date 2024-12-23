import { format } from 'date-fns';

import type { BlogPostWithAuthors } from '@/lib/collections';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPostWithAuthors;
  className?: string;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getPastelColor(seed: string) {
  const hash = hashString(seed);
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 90%)`;
}

export function BlogCard({ post, className }: BlogCardProps) {
  const backgroundColor = getPastelColor(post.id);
  const readingTime = '5 min read';

  return (
    <article
      className={cn(
        'group relative overflow-hidden',
        'rounded-2xl transition-all duration-200',
        'hover:shadow-md',
        'max-w-2xl',
        className
      )}
    >
      <div className="relative aspect-[2.5] w-full" style={{ backgroundColor }}>
        {post.data.cover && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <img
              src={post.data.cover.src}
              width={post.data.cover.width}
              height={post.data.cover.height}
              alt=""
              className="h-full w-auto max-w-full object-contain"
            />
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <time
            dateTime={post.data.published_date.toISOString()}
            className="text-sm font-medium text-purple-500"
          >
            {format(post.data.published_date, 'MMM d, yyyy')}
          </time>
          <span className="text-xs text-muted-foreground">{readingTime}</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight">{post.data.title}</h2>
          <p className="line-clamp-2 text-xs text-muted-foreground">{post.data.description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {post.data.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium transition-colors hover:bg-black/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <a href={`/blog/${post.id}`} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </a>
    </article>
  );
}
