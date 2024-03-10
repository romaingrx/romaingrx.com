import { Author } from '@/.contentlayer/generated';
import Image from 'next/image';

export default function AuthorCard({
  author,
}: {
  author: Author;
}): JSX.Element {
  const elem = (
    <div className="flex items-center gap-2 rounded-md p-1 hover:bg-romaingrx-emphasis">
      <div className="flex-shrink-0">
        <Image
          className="h-6 w-6 rounded-full"
          src={author.avatar.src}
          alt={author.avatar.alt || ''}
          width={128}
          height={128}
        />
      </div>
      <div className="flex flex-col justify-start">
        <div className="text-sm">{author.name}</div>
        <div className="text-xs text-default-500">
          @{author.handle}
        </div>
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
