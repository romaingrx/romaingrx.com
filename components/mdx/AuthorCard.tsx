import { Author } from '@/.contentlayer/generated';
import Image from 'next/image';

export default function AuthorCard({
  author,
}: {
  author: Author;
}): JSX.Element {
  return (
    <>
      <div className="flex w-full items-center gap-3 rounded-md p-4 bg-romaingrx-emphasis">
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
          <div className="text-base font-medium">
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
