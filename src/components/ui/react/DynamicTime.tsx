import { formatCompactDate, formatISO } from '@/lib/format';
import { cn } from '@/lib/utils';

interface DynamicTimeProps extends Omit<React.HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  date: Date | string;
  formatStr?: string;
  className?: string;
}

const DynamicTime: React.FC<DynamicTimeProps> = ({ date, className, formatStr, ...props }) => {
  return (
    <time
      dateTime={formatISO(date)}
      className={cn('text-xs whitespace-nowrap text-muted-foreground', className)}
      {...props}
    >
      {formatCompactDate(date, formatStr)}
    </time>
  );
};

export default DynamicTime;
