/**
 * GitHub-style Callout Component
 *
 * Usage in Astro:
 * <Callout variant="note" title="Custom Note">
 *   This is a note callout with custom title.
 * </Callout>
 *
 * <Callout variant="tip">
 *   This is a tip callout with default title.
 * </Callout>
 *
 * Available variants: note, tip, important, warning, caution
 */

import type { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, Info, Lightbulb, Star, type LucideIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export type CalloutVariant = 'note' | 'tip' | 'important' | 'warning' | 'caution';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  className?: string;
  class?: string;
  children: ReactNode;
}

const calloutConfig: Record<CalloutVariant, { icon: LucideIcon; defaultTitle: string }> = {
  note: {
    icon: Info,
    defaultTitle: 'Note',
  },
  tip: {
    icon: Lightbulb,
    defaultTitle: 'Tip',
  },
  important: {
    icon: Star,
    defaultTitle: 'Important',
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: 'Warning',
  },
  caution: {
    icon: AlertCircle,
    defaultTitle: 'Caution',
  },
};

export function Callout({
  variant = 'note',
  title,
  className,
  class: astroClass,
  children,
}: CalloutProps) {
  const config = calloutConfig[variant];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <Alert variant={variant} className={cn('my-6', className, astroClass)}>
      <Icon className="h-4 w-4" />
      <AlertTitle className="mb-2 font-semibold">{displayTitle}</AlertTitle>
      <AlertDescription className="[&_p]:mb-0 [&_p:not(:last-child)]:mb-3">
        {children}
      </AlertDescription>
    </Alert>
  );
}

export default Callout;
