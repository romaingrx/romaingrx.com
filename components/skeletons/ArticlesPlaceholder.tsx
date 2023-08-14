import ArcticleCardPlaceholder from "./ArticleCardPlaceholder";

export default function ArticlesPlaceholder({ n }: { n: number }): JSX.Element {
  return <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(n)].map((article: number) => (
          <div className="p-4" key={article}>
            <ArcticleCardPlaceholder />
          </div>
        ))}
      </div>
  </>;
}
