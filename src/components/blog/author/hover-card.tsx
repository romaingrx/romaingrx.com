import React from 'react';

import { Icon } from '@iconify/react';

import type { Author } from '@/lib/collections';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/react/hover-card';
import { Link } from '@/components/ui/react/link';
import { platforms_info, type Platform } from '@/configs/platforms';

type Props = {
  author: Author;
  children: React.ReactNode;
};

export default function AuthorHoverCard({ author, children }: Props) {
  const socialLinks = Object.entries(author.data.socialLinks).flatMap(([platform, social]) =>
    social ? [{ platform: platform as Platform, ...social }] : [],
  );
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="inline-flex cursor-default">{children}</span>
      </HoverCardTrigger>
      <HoverCardContent className="!z-[9999] w-80" align="start" sideOffset={5}>
        <div className="flex justify-start space-x-4">
          <div className="space-y-1 text-left">
            <h4 className="text-sm font-semibold">{author.data.name}</h4>
            <p className="text-sm text-muted-foreground">{author.data.title}</p>
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map(({ platform, url }) => (
                <Link
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  size="icon"
                  aria-label={`Follow ${author.data.name} on ${platform}`}
                  title={`Follow ${author.data.name} on ${platform}`}
                >
                  <Icon icon={platforms_info[platform].icon_name} className="size-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
