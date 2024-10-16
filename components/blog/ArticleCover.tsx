import { Article } from '@/.contentlayer/generated';
import Image from 'next/image';
import BlogPostBackground from './BlogPostBackground';

function ArticleCoverWithBg({ article }: { article: Article }) {
  if (!article.cover) return null;

  return (
    <div className="relative left-0 top-0 h-48 w-full sm:h-48">
      <BlogPostBackground title={article.title} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[80%] h-[80%]">
          <Image
            src={article.cover.src}
            alt={article.title}
            fill={true}
            objectFit="contain"
            className="rounded-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default ArticleCoverWithBg;
