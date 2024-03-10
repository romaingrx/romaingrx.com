'use client';

import Button from '@/components/core/Button';
import TypeWriter from 'typewriter-effect';
import { ArrowIcon } from '../core/Icon/Icon';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import GradientBackground from '../core/GradientBackground';

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
      className="relative mb-[8rem] h-[50vh] py-16"
    >
      <div className="absolute w-2/3 inset-0 z-[0] ml-auto">
        <GradientBackground>
          <div className="h-1/3 w-1/3" />
        </GradientBackground>
      </div>
      <motion.div
        style={{
          position,
          scale,
          x: '-50%',
        }}
        className="fixed left-1/2 my-16 flex w-full flex-col items-center gap-4 md:my-32 md:gap-8"
      >
        <div
          style={{ width: 'clamp(300px, 80%, 900px)' }}
          className="flex w-full flex-col gap-8 font-wise text-2xl sm:text-3xl md:gap-16 md:text-5xl"
        >
          <div className="flex flex-col gap-0 md:gap-4">
            <div className="flex">
              <motion.span
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                Hi, I&apos;m
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
                    .pauseFor(500)
                    .typeString('a Machine Learning Engineer')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('a Software Engineer')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('a Tech Enthusiast')
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
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <Link href="/about">
                  <Button variant="secondary" endIcon={<ArrowIcon />}>
                    About me
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Link href="/blog">
                  <Button variant="secondary" endIcon={<ArrowIcon />}>
                    Blog
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
