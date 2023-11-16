'use client';
import { Transition } from '@/components/backgrounds/PixelBackground';
import { AnimatePresence } from 'framer-motion';
import TypeWriter from 'typewriter-effect';
import Layout from '@/components/core/layout';

function Home() {
  return (
    <AnimatePresence>
      <Transition>
        <Layout>
          <span className="text-3xl font-bold md:text-5xl">
            Hi, I&apos;m Romain, a&nbsp;
            <span className="inline-block">
              <TypeWriter
                options={{
                  cursor: '&#x275A;',
                }}
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(1)
                    .typeString('Machine Learning Engineer.')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('Software Engineer.')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('Human.')
                    .start();
                }}
              />
            </span>
          </span>
        </Layout>
      </Transition>
    </AnimatePresence>
  );
}

export default Home;
