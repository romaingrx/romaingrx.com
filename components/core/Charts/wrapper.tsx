import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import React from 'react';

interface ChartWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function ChartWrapper({
  title,
  description,
  children,
}: ChartWrapperProps) {
  return (
    <Card className="flex flex-col gap-0">
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="w-full">{children}</CardContent>
    </Card>
  );
}
