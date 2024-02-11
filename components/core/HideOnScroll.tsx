'use client';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  Variants,
} from 'framer-motion';
import { useState } from 'react';

const defaultVariants: Variants = {
  hidden: { opacity: 1, y: -100 },
  visible: { opacity: 1, y: 0 },
};

type HideOnScrollProps = {
  children: React.ReactNode;
  active?: boolean;
  padding?: number;
  variants?: Variants;
};

function HideOnScroll({
  children,
  active = true,
  padding = 150,
  variants = defaultVariants,
}: HideOnScrollProps): JSX.Element {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > padding) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return active ? (
    <motion.div
      variants={variants}
      initial="visible"
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  ) : (
    <>{children}</>
  );
}

export default HideOnScroll;
