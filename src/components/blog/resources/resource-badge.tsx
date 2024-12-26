import { Icon } from '@iconify/react';
import { cva } from 'class-variance-authority';

import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import { platforms_info } from '@/configs/platforms';
import type { ResourceProvider, ResourceType } from '@/configs/resources';

interface ResourceBadgeProps {
  type: ResourceType;
  provider: ResourceProvider;
  title: string;
  value: string;
  description?: string;
  className?: string;
}

const badgeVariants = cva('transition-all duration-300 cursor-pointer font-medium', {
  variants: {
    type: {
      code: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20',
      model: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20',
      dataset: 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20',
      paper: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20',
    },
  },
});

const typeIcons: Record<ResourceType, string> = {
  code: 'material-symbols:code-rounded',
  model: 'tabler:cube',
  dataset: 'material-symbols:database-outline',
  paper: 'akar-icons:paper',
};

export function ResourceBadge({
  type,
  provider,
  title,
  value,
  description,
  className,
}: ResourceBadgeProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href={value} target="_blank" rel="noopener noreferrer" className="inline-block">
          <Badge variant="outline" className={cn(badgeVariants({ type }), className)}>
            <Icon icon={typeIcons[type]} className="mr-2 h-4 w-4" />
            {title}
          </Badge>
        </a>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80">
        <div className="flex flex-col gap-3 text-left">
          <h4 className="font-semibold">{title}</h4>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(badgeVariants({ type }), 'cursor-default')}>
              <Icon icon={typeIcons[type]} className="mr-1.5 h-3.5 w-3.5" />
              {type}
            </Badge>
            <Badge variant="outline" className="bg-background/50">
              <Icon icon={platforms_info[provider].icon_name} className="mr-1.5 h-3.5 w-3.5" />
              {provider}
            </Badge>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
