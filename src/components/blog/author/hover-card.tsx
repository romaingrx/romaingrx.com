import { Image } from 'astro:assets';
import React from 'react';

import { Icon } from '@iconify/react';

import type { Author } from '@/lib/collections';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { platforms_info, type Platform } from '@/configs/platforms';

type Props = {
  author: Author;
  with_image?: boolean;
  children: React.ReactNode;
};

export default function AuthorHoverCard({ author, children, with_image = true }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="!z-[9999] w-80" align="start" sideOffset={5}>
        <div className="flex justify-start space-x-4">
          <div className="space-y-1 text-left">
            <h4 className="text-sm font-semibold">{author.data.name}</h4>
            <p className="text-sm text-muted-foreground">{author.data.title}</p>
            <div className="flex items-center gap-2 pt-2">
              {Object.entries(author.data.socialLinks)
                .filter(([, v]) => v)
                .map(([platform, social]) => {
                  return (
                    <a
                      key={`${platform}-${social!.handle}`}
                      href={social!.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon
                        icon={platforms_info[platform as Platform].icon_name}
                        className="size-4"
                      />
                    </a>
                  );
                })}
            </div>
          </div>
          {with_image && (
            <Image
              src={author.data.image}
              alt={author.data.name}
              class="size-12 rounded-lg border object-cover"
            />
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
