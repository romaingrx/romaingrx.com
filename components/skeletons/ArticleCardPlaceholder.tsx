'use client';
import { Card, CardBody, Skeleton } from '@nextui-org/react';
export default function ArcticleCardPlaceholder() {
  return (
    <>
      <Card>
        <CardBody className="flex flex-col gap-3 p-0">
          <Skeleton className="h-32 w-full" />
          <div className="flex flex-col gap-2 p-3">
            <Skeleton className="h-4 w-1/2 rounded-lg" />
            <Skeleton className="h-4 w-1/4 rounded-lg" />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
