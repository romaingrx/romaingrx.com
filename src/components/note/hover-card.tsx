import React from 'react';

import type { NoteWithAuthors } from '@/lib/collections';

import StackedAuthors from '@/components/blog/author/stacked-authors.astro';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

type Props = {
  note: NoteWithAuthors;
  children: React.ReactNode;
};

export default function NoteHoverCard({ note, children }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="!z-[9999] w-80" align="start" sideOffset={5}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">{note.data.title}</h4>
            {note.data.description && (
              <p className="text-sm text-muted-foreground">{note.data.description}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <StackedAuthors authors={note.authors} show_name={false} />
            <span className="text-sm text-muted-foreground">{note.readingTime}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
