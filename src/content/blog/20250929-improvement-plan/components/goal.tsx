import { GoalIcon } from 'lucide-react';
import Callout from '@/components/blog/components/callout';

export default function Goal({ children }: { children: React.ReactNode }) {
  return (
    <Callout variant="tip" icon={GoalIcon} title="Ultimate goal">
      {children}
    </Callout>
  );
}
