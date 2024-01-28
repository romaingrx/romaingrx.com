export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto my-6 flex max-w-4xl flex-col gap-4 px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      {children}
    </div>
  );
}

export function ArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto my-6 flex max-w-4xl flex-col gap-4 px-4 pt-16 sm:px-6 md:pt-32 xl:max-w-5xl xl:px-0">
      {children}
    </div>
  );
}
