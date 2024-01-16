'use client';
import { Card, CardBody, Skeleton } from '@nextui-org/react';
export default function ArcticleCardPlaceholder() {
  return (
    <>
      <Card className="h-64">
        <CardBody className="p-0">
          <div className="flex flex-col">
            <Skeleton className="h-32 w-full" />
            <div className="flex flex-col gap-4 p-3 justify-between">
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-full rounded-lg" />
                <Skeleton className="w-3/4 h-3 rounded-lg" />
              </div>
              <div className="flex flex-row items-center gap-2">
                <Skeleton className="h-4 w-1/4 rounded-lg" />
                <Skeleton className="h-4 w-1/4 rounded-lg" />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
