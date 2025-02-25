import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

export type ExamplesProps = {
  examples: Record<string, string>[];
};

export default function Examples({ examples }: ExamplesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex flex-col gap-4">
      {examples.length > 1 && (
        <div className="mt-4 flex justify-end gap-2">
          {examples.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={clsx(
                'h-2 w-2 rounded-full',
                index === currentSlide ? 'bg-primary' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      )}
      <Carousel className="w-full" orientation="horizontal" setApi={setApi}>
        <CarouselContent>
          {examples.map((example, index) => (
            <CarouselItem key={index} className="w-full">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(example).map(([key, value], i) => (
                          <tr key={i} className={clsx(i % 2 === 0 && 'bg-muted')}>
                            <td className="p-4 font-semibold">{key}</td>
                            <td className="p-4">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
