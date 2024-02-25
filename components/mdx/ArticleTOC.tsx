'use client';
import { Article } from '@/.contentlayer/generated';
import { Variants, motion, useScroll, useSpring } from 'framer-motion';
import useScrollSpy from 'react-use-scrollspy';
import { RefObject, useEffect, useMemo, useState } from 'react';

interface Heading {
  level: number;
  text: string;
  slug: string;
  active?: boolean;
}

const OFFSET = 150;

const underlineVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  underline: {
    scaleX: 1,
    originX: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: {
    scaleX: 0,
    originX: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export default function ArticleTOC({
  article,
}: {
  article: Article;
}): JSX.Element {
  const { scrollYProgress } = useScroll();
  const [sectionRefs, setSectionRefs] = useState<RefObject<HTMLElement>[]>([]);

  useEffect(() => {
    setSectionRefs(
      article.headings.map(({ slug }: Heading) => ({
        current: document.getElementById(slug),
      })),
    );
  }, [article]);
  const readingProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
  });

  const activeHeading = useScrollSpy({
    sectionElementRefs: sectionRefs,
    offsetPx: -OFFSET,
  }) as number;

  const headings: Heading[] = useMemo(
    () =>
      article.headings.map((heading: Heading, idx: number) => ({
        ...heading,
        active: idx === activeHeading,
      })),
    [article.headings, activeHeading],
  );

  return (
    <div className="sticky top-8 hidden h-[50vh] gap-3 pt-16 lg:flex ">
      <div className="relative w-[0.15rem] overflow-hidden rounded-sm bg-romaingrx-emphasis">
        <motion.div
          className="absolute left-0 top-0 h-full w-full bg-romaingrx-brand"
          style={{ scaleY: readingProgress, originY: 0 }}
        />
      </div>
      <ul className="gap-2: h-fit flex-col">
        {headings.map(({ level, text, slug, active }: Heading) => (
          <li
            key={slug}
            className={'flex w-fit flex-col gap-0 text-sm'}
            style={{ marginLeft: `${level - 1}rem` }}
          >
            <button
              onClick={() => {
                const elem = document.getElementById(slug);
                if (elem) {
                  window.scroll({
                    top: elem.offsetTop + OFFSET,
                    left: 0,
                    behavior: 'smooth',
                  });
                  elem.style.width = 'fit-content';

                  // From left to right underline and then back to left
                  const absolute = document.createElement('div');
                  elem.style.position = 'relative';
                  absolute.style.position = 'absolute';
                  absolute.style.bottom = '0.3rem';
                  absolute.style.left = '0';

                  const rect = elem.getBoundingClientRect();
                  absolute.style.width = `${rect.width}px`;
                  // absolute.style.height = `${rect.height}px`;
                  absolute.style.height = '0.1rem';
                  absolute.style.borderRadius = '0.2rem';
                  absolute.style.overflow = 'hidden';

                  const underline = document.createElement('div');
                  underline.style.height = '100%';
                  underline.style.width = '100%';
                  underline.style.backgroundColor =
                    'var(--romaingrx-colors-brand)';
                  underline.style.transformOrigin = 'left';
                  underline.style.zIndex = '1';
                  underline.style.transform = 'scaleX(0)';

                  absolute.appendChild(underline);
                  elem.appendChild(absolute);
                  underline.animate(
                    [
                      { transform: 'translateX(-100%)', offset: 0 },
                      { transform: 'translateX(0)', offset: 0.5 },
                      { transform: 'translateX(0)', offset: 0.75 },
                      { transform: 'translateX(100%)', offset: 1 },
                    ],
                    {
                      duration: 1000,
                      iterations: 1,
                      delay: 0.1,
                      easing: 'linear',
                    },
                  );

                  // Remove the underline after the animation
                  setTimeout(() => {
                    underline.remove();
                    absolute.remove();
                  }, 1100);
                }
              }}
            >
              {text}
            </button>
            <motion.div
              variants={underlineVariants}
              whileHover="underline"
              initial="initial"
              animate={active ? 'underline' : 'initial'}
              exit="exit"
              className="h-[0.1rem] w-full bg-romaingrx-brand"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
