import React from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import styles from './input-helper.module.scss';

interface InputHelperProps {
  show: boolean;
  advice: JSX.Element | string;
  display?: string;
}

const variants: Variants = {
  initial: {
    opacity: 0,
    y: -10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ease: 'easeIn', duration: 0.125 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { ease: 'easeIn', duration: 0.125 },
  },
};

const InputHelper: React.FC<InputHelperProps> = ({ advice, display, show }) => {
  const displaying = display?.length !== 0;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`${styles.container} ${
            displaying ? styles.displaying : ''
          }`}
          variants={variants}
          initial='initial'
          animate='animate'
          exit='exit'
        >
          {displaying ? display : advice}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InputHelper;
