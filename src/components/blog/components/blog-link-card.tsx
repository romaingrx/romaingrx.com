import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

type Props = {
  href: string;
  title: string;
  description: string;
  date: string;
  readingTime?: string;
  children: React.ReactNode;
};

export default function BlogLinkCard({
  href,
  title,
  description,
  date,
  readingTime,
  children,
}: Props) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a href={href}>{children}</a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 !z-[9999]" align="start" sideOffset={6}>
        <div className="space-y-1.5">
          <p className="text-sm font-medium leading-snug">{title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <span>{date}</span>
            {readingTime && (
              <>
                <span>·</span>
                <span>{readingTime}</span>
              </>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
