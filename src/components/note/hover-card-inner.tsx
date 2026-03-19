import React from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

type Props = {
  title: string;
  description?: string;
  readingTime: string;
  authors?: React.ReactNode;
  children: React.ReactNode;
};

export default function NoteHoverCardInner({
  title,
  description,
  readingTime,
  authors,
  children,
}: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="!z-[9999] w-80" align="start" sideOffset={5}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">{title}</h4>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex items-center justify-between">
            {authors}
            <span className="text-sm text-muted-foreground">{readingTime}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
