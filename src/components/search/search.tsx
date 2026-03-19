import * as React from 'react';
import { FileTextIcon, Loader2Icon, NotebookIcon, SearchIcon } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';

interface SubResult {
  title: string;
  url: string;
  excerpt: string;
}

interface SearchResult {
  url: string;
  meta: { title: string };
  sub_results: SubResult[];
}

let pagefindInstance: {
  search: (query: string) => Promise<{ results: { data: () => Promise<SearchResult> }[] }>;
} | null = null;

async function loadPagefind() {
  if (pagefindInstance) return pagefindInstance;
  try {
    // Dynamic import bypassing Vite's static analysis — pagefind is generated at build time
    const pf = await new Function('return import("/pagefind/pagefind.js")')();
    await pf.init();
    pagefindInstance = pf;
    return pf;
  } catch {
    return null;
  }
}

function ResultIcon({ url }: { url: string }) {
  if (url.startsWith('/notes/'))
    return <NotebookIcon className="text-muted-foreground size-4 shrink-0" />;
  return <FileTextIcon className="text-muted-foreground size-4 shrink-0" />;
}

function ResultLabel({ url }: { url: string }) {
  if (url.startsWith('/notes/')) return 'Note';
  if (url.startsWith('/blog/')) return 'Blog';
  return 'Page';
}

export function SearchTrigger() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="size-4" />
        <span className="hidden text-xs sm:inline">Search</span>
        <Kbd className="hidden sm:inline-flex">
          <span className="text-[10px]">⌘</span>K
        </Kbd>
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) loadPagefind();
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      return;
    }
  }, [open]);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const pf = await loadPagefind();
      if (!pf) {
        setLoading(false);
        return;
      }
      const search = await pf.search(query);
      const data: SearchResult[] = await Promise.all(
        search.results.slice(0, 5).map((r: { data: () => Promise<SearchResult> }) => r.data())
      );
      setResults(data);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [query]);

  const navigate = (url: string) => {
    onOpenChange(false);
    window.location.href = url;
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search blog posts and notes"
      showCloseButton={false}
      className="top-[20%] translate-y-0 border-border/60 ring-1 ring-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] sm:max-w-lg"
    >
      <CommandInput
        placeholder="Search posts and notes..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[min(400px,50vh)]">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
          </div>
        )}
        {!loading && query.trim() && results.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {!loading && results.length > 0 && (
          <CommandGroup heading="Results">
            {results.flatMap((result) =>
              (result.sub_results ?? []).map((sub) => (
                <CommandItem
                  key={sub.url}
                  value={`${result.meta.title} ${sub.title}`}
                  onSelect={() => navigate(sub.url)}
                >
                  <ResultIcon url={result.url} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium">
                      {result.meta.title}
                      {sub.title !== result.meta.title && (
                        <span className="text-muted-foreground font-normal"> — {sub.title}</span>
                      )}
                    </span>
                    <span
                      className="text-muted-foreground line-clamp-1 text-xs [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-foreground"
                      dangerouslySetInnerHTML={{ __html: sub.excerpt }}
                    />
                  </div>
                  <CommandShortcut>
                    <ResultLabel url={result.url} />
                  </CommandShortcut>
                </CommandItem>
              ))
            )}
          </CommandGroup>
        )}
        {!loading && !query.trim() && (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-sm">
            <SearchIcon className="size-5 opacity-40" />
            <span>Type to search across all content</span>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
