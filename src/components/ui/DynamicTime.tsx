import { formatCompactDate, formatISO } from '@/lib/format';
import { cn } from '@/lib/utils';

interface DynamicTimeProps extends Omit<React.HTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  date: Date | string;
  className?: string;
}

const DynamicTime: React.FC<DynamicTimeProps> = ({ date, className, ...props }) => {
  return (
    <time
      dateTime={formatISO(date)}
      className={cn('whitespace-nowrap text-xs text-muted-foreground', className)}
      {...props}
    >
      {formatCompactDate(date)}
    </time>
  );
};

export default DynamicTime;
