import ArcticleCardPlaceholder from "./ArticleCardPlaceholder";

export default function ArticlesPlaceholder({ n }: { n: number }): JSX.Element {
  return <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {[...Array(n)].map((_, index) => (
          <div className="p-4" key={index}>
            <ArcticleCardPlaceholder />
          </div>
        ))}
      </div>
  </>;
}
