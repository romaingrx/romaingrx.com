'use client';

import Button from '@/components/core/Button';
import TypeWriter from 'typewriter-effect';
import { ArrowIcon } from '../core/Icon/Icon';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['end end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0.5, 0.9], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.9], [1, 0.8]);
  const position = useTransform(scrollYProgress, (pos) =>
    pos === 1 ? 'relative' : 'fixed',
  );

  return (
    <motion.section
      style={{ opacity }}
      ref={targetRef}
      className="relative mb-[8rem] h-[40vh] py-16"
    >
      <motion.div
        style={{
          position,
          scale,
          x: '-50%',
        }}
        className="fixed left-1/2 my-16 md:my-32 flex w-full flex-col items-center gap-4 md:gap-8"
      >
        <div
          style={{ width: 'clamp(300px, 80%, 900px)' }}
          className="flex w-full flex-col gap-16 font-wise text-2xl md:text-5xl"
        >
          <div className='flex flex-col gap-4'>
            <div className="flex">
              <motion.span
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                Hi, I'm
              </motion.span>
              &nbsp;
              <motion.span
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Romain
              </motion.span>
              &nbsp;
              <motion.span
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Graux,
              </motion.span>
            </div>
            <motion.span
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TypeWriter
                options={{
                  cursor: '&#x275A;',
                }}
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(1)
                    .typeString('a Machine Learning Engineer')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('a Software Engineer')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('a Human')
                    .start();
                }}
              />
            </motion.span>
          </div>
          <motion.div
            transition={{ staggerChildren: 1 }}
            className="flex w-full justify-between"
          >
            <div className="flex justify-start gap-4">
              <motion.a
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                href="/about"
              >
                <Button variant="secondary" endIcon={<ArrowIcon />}>
                  About me
                </Button>
              </motion.a>
              <motion.a
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                href="/blog"
              >
                <Button variant="secondary" endIcon={<ArrowIcon />}>
                  Blog
                </Button>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
