import { SpringOptions } from 'framer-motion';

export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const scrollSpringConfig: SpringOptions = {
  damping: 100,
  stiffness: 1000,
  restSpeed: 0.1,
  restDelta: 0.1,
};

export const springConfigs = {
  scroll: scrollSpringConfig,
};
