import { Author } from '@/.contentlayer/generated';
import Image from 'next/image';

export default function AuthorCard({
  author,
}: {
  author: Author;
}): JSX.Element {
  return (
    <>
      <div className="flex w-full items-center gap-3 rounded-md bg-black/10 p-4 dark:bg-white/10">
        <div className="flex-shrink-0">
          <Image
            className="h-16 w-16 rounded-full"
            src={author.avatar.src}
            alt={author.avatar.alt || ''}
            width={512}
            height={512}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-base font-medium text-gray-800 dark:text-gray-100">
            {author.name}
          </div>
          <div className="text-sm font-medium text-gray-500">
            {author.description}
          </div>
        </div>
      </div>
    </>
  );
}
