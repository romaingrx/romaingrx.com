import * as React from 'react';
import { Menu } from 'lucide-react';
import Logo from '@/components/logo/logo';
import { cn } from '@/lib/utils';
import { Button } from '../../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';

export interface NavItem {
  name: string;
  href: string;
}

interface MobileNavProps {
  navigation: NavItem[];
  currentPath: string;
  className?: string;
}

const isActive = (href: string, pathname: string) => {
  if (href === '//' || href === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(href);
};

export function MobileNav({ navigation, currentPath, className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('h-8 w-8 px-0 md:hidden', className)}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
        {/* Header with logo/brand */}
        <div className="border-b border-border bg-background/50 font-semibold capitalize">
          <div className="flex items-center justify-between p-1">
            <Logo />
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors',
                  isActive(item.href, currentPath)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                )}
                aria-current={isActive(item.href, currentPath) ? 'page' : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
