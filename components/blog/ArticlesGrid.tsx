'use client';
import { Article } from 'contentlayer/generated';
import { ArticleCard, animateVariants } from '@/components/blog/ArticleCard';
import { motion } from 'framer-motion';

export default function ArticlesGrid({ articles }: { articles: Article[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
      variants={animateVariants}
      initial="initial"
      animate="animate"
    >
      {articles.map((article: Article) => (
        <div className="p-4" key={article.slug}>
          <a href={`/blog/post/${article.slug}`} className="h-64">
            <ArticleCard article={article} />
          </a>
        </div>
      ))}
    </motion.div>
  );
}
