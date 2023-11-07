'use client';
import { Transition } from '@/components/backgrounds/PixelBackground';
import { AnimatePresence } from 'framer-motion';
import { TypeWriterOptions } from '@/components/typewritter/TypeWriterOptions';

function Home() {
  return (
    <AnimatePresence>
      <Transition>
        <div id="offset" className="h-12 md:h-16" />
        <span className="text-3xl font-bold md:text-5xl">
          Hi, I&apos;m Romain, a&nbsp;
          <span className="inline-block">
            <TypeWriterOptions
              cursor={'&#x275A;'}
              strings={['Machine Learning Engineer.', 'Software Engineer.']}
            />
          </span>
        </span>
      </Transition>
    </AnimatePresence>
  );
}

export default Home;
