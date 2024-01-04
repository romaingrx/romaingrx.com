import { SpringOptions } from 'framer-motion';

const scrollSpringConfig: SpringOptions = {
  damping: 100,
  stiffness: 1000,
  restSpeed: 0.1,
  restDelta: 0.1,
};

export const springConfigs = {
  scroll: scrollSpringConfig,
};
