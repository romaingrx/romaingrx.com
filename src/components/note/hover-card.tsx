import React from 'react';
import StackedAuthors from '@/components/blog/author/stacked-authors.astro';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import type { NoteWithAuthors } from '@/lib/collections';

type Props = {
  note: NoteWithAuthors;
  children: React.ReactNode;
};

export default function NoteHoverCard({ note, children }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 !z-[9999]" align="start" sideOffset={5}>
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
