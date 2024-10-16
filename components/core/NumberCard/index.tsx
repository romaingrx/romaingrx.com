import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '..';
import { ArrowIcon } from '../Icon/Icon';
import Link from 'next/link';

export interface NumberCardProps {
  title: string;
  value: number;
  description?: string;
  link?: string;
}

export default function NumberCard({
  title,
  value,
  description,
  link,
}: NumberCardProps) {
  return (
    <Card>
      <div className="flex flex-row justify-between">
        <CardHeader className="relative">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        {link && (
          <div className="mt-3 mr-3">
            <Link href={link}>
              <Button
                variant="secondary"
                contentType="icon"
                css={{
                  '--translateX': '2px;',
                  '--translateY': '-2px;',
                }}
              >
                <ArrowIcon angle={45} />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <CardContent>
        <p className="flex items-center justify-center text-4xl font-bold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
