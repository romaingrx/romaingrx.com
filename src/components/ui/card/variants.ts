/** Card part classes, shared by the Astro parts and the React twin. */
export const cardClasses = {
  root: 'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
  header:
    '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
  title: 'leading-none font-semibold',
  description: 'text-sm text-muted-foreground',
  action: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
  content: 'px-6',
  footer: 'flex items-center px-6 [.border-t]:pt-6',
} as const;
