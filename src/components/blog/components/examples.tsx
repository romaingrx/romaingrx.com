import { useCallback, useEffect, useState } from 'react';

import { Card, CardContent } from '@/components/ui/react/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/react/carousel';
import { cn } from '@/lib/utils';

export type ExamplesProps = {
  examples: Record<string, string>[];
};

export default function Examples({ examples }: ExamplesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const syncCurrentSlide = useCallback(() => {
    if (api) setCurrentSlide(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    // oxlint-disable-next-line react/set-state-in-effect -- read the initial selection after Embla mounts
    syncCurrentSlide();
    api.on('select', syncCurrentSlide);
    api.on('reInit', syncCurrentSlide);

    return () => {
      api.off('select', syncCurrentSlide);
      api.off('reInit', syncCurrentSlide);
    };
  }, [api, syncCurrentSlide]);

  if (examples.length === 0) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        No examples are available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Carousel
        aria-label="Code examples"
        className="w-full"
        orientation="horizontal"
        setApi={setApi}
      >
        <CarouselContent>
          {examples.map((example, index) => (
            // eslint-disable-next-line react/no-array-index-key -- no unique id on generic records
            <CarouselItem
              key={index}
              className="w-full"
              aria-label={`Example ${index + 1} of ${examples.length}`}
              aria-current={index === currentSlide ? 'true' : undefined}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(example).map(([key, value], i) => (
                          <tr key={key} className={cn(i % 2 === 0 && 'bg-muted')}>
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
        {examples.length > 1 && (
          <div className="flex items-center justify-between gap-3" data-pagefind-ignore>
            <CarouselPrevious className="static translate-y-0" data-pagefind-ignore="" />
            <output className="text-sm text-muted-foreground" aria-live="polite">
              Example {currentSlide + 1} of {examples.length}
            </output>
            <CarouselNext className="static translate-y-0" data-pagefind-ignore="" />
          </div>
        )}
      </Carousel>
    </div>
  );
}
