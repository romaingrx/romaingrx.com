'use client';
import { Transition } from '@/components/backgrounds/PixelBackground';
import { AnimatePresence } from 'framer-motion';
import TypeWriter from '@/components/typewritter/TypeWriter';
import Layout from '@/components/layout';

function Home() {
  return (
    <AnimatePresence>
      <Transition>
        <Layout>
          <span className="text-3xl font-bold md:text-5xl">
            Hi, I&apos;m Romain, a&nbsp;
            <span className="inline-block">
              <TypeWriter
                cursor={'&#x275A;'}
                strings={['Machine Learning Engineer.', 'Software Engineer.']}
              />
            </span>
          </span>
        </Layout>
      </Transition>
    </AnimatePresence>
  );
}

export default Home;
