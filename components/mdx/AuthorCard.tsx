import { Author } from '@/.contentlayer/generated';
import { cn } from '@nextui-org/react';
import Image from 'next/image';

export default function AuthorCard({
  author,
  type = 'preview',
}: {
  author: Author;
  type?: 'preview' | 'description';
}): JSX.Element {
  const elem = (
    <div className="flex items-center gap-2 rounded-md p-1 hover:bg-romaingrx-emphasis">
      <Image
        className={cn("rounded-full", type === 'preview' ? 'h-6 w-6' : 'h-12 w-12')}
        src={author.avatar.src}
        alt={author.avatar.alt || ''}
        width={128}
        height={128}
      />
      <div className="flex flex-col justify-start">
        <div className="text-sm">{author.name}</div>
        {type === 'preview' && (
          <div className="text-xs text-default-500">@{author.handle}</div>
        )}
        {type === 'description' && (
          <div className="text-xs text-default-500">{author.description}</div>
        )}
      </div>
    </div>
  );

  return author.url ? (
    <a href={author.url.url} target="_blank" rel="noopener noreferrer">
      {elem}
    </a>
  ) : (
    elem
  );
}
