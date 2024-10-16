import { Author } from '@/.contentlayer/generated';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function AuthorPreview({ author }: { author: Author }) {
  const btn = (
    <Button variant="link" className="m-0 p-0 text-base font-normal">
      {author.name}
    </Button>
  );

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {author.url ? (
          <a href={author.url.url} target="_blank" rel="noopener noreferrer">
            {btn}
          </a>
        ) : (
          btn
        )}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-romaingrx-card-background">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={author.avatar.src} alt={author.avatar.alt} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <h4 className="text-sm font-semibold">{author.name}</h4>
            {author.description && (
              <p className="text-left text-sm text-romaingrx-typeface-secondary">
                {author.description}
              </p>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
