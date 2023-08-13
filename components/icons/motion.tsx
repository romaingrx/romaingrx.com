import { motion, AnimatePresence } from 'framer-motion';

export function MotionCheckIcon({
  isVisible,
  duration = 0.3,
  initial = true,
  strokeWidth = 1.5,
  ...props
}: {
  isVisible: boolean;
  duration?: number;
  initial?: boolean;
  strokeWidth?: number;
  props?: any;
}) {
  return (
    <AnimatePresence initial={initial}>
      {isVisible && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          {...props}
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{
              type: 'tween',
              duration: duration,
              ease: isVisible ? 'easeOut' : 'easeIn',
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      )}
    </AnimatePresence>
  );
}
