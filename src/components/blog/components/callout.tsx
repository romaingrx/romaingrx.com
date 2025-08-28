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
import {
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Info,
  Lightbulb,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle, type AlertVariant } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export type CalloutVariant = Exclude<AlertVariant, 'default'>;

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  className?: string;
  class?: string;
  icon?: LucideIcon;
  children: ReactNode;
}

const calloutConfig: Record<CalloutVariant, { icon: LucideIcon; defaultTitle: string }> = {
  note: {
    icon: Info,
    defaultTitle: 'Note',
  },
  destructive: {
    icon: AlertCircle,
    defaultTitle: 'Alert',
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
  question: {
    icon: HelpCircle,
    defaultTitle: 'Question',
  },
};

export function Callout({
  variant = 'note',
  title,
  className,
  class: astroClass,
  icon,
  children,
}: CalloutProps) {
  if (!Object.keys(calloutConfig).includes(variant)) {
    console.warn(`Unknown callout variant: ${variant}, defaulting to "note"`);
    variant = 'note';
  }
  const config = calloutConfig[variant];
  const Icon = icon ?? config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <Alert variant={variant} className={cn('my-6', className, astroClass)}>
      <AlertTitle className="mb-4 flex gap-2 items-end">
        <Icon className="h-4 w-4" />
        <span className="font-semibold text-md">{displayTitle}</span>
      </AlertTitle>
      <AlertDescription className="[&_p]:mb-0 [&_p:not(:last-child)]:mb-3">
        {children}
      </AlertDescription>
    </Alert>
  );
}

export default Callout;
