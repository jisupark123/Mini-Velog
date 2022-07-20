import { AnimatePresence, motion, Variants } from 'framer-motion';
import React, { useEffect } from 'react';
import styles from './notice.module.scss';

interface NoticeProps {
  show: boolean;
  isSuccessed: boolean;
  header: string;
  message: string;
  closeNotice: () => void;
}

export const initialNotice = {
  show: false,
  isSuccessed: true,
  header: '',
  message: '',
};

const variants: Variants = {
  initial: {
    opacity: 0,
    // y: -30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ease: 'easeInOut', duration: 0.3 },
  },
  exit: {
    opacity: 0,
    // y: -30,
    transition: { ease: 'easeInOut', duration: 0.5 },
  },
};

const Notice: React.FC<NoticeProps> = ({
  show,
  isSuccessed,
  header,
  message,
  closeNotice,
}) => {
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        console.log('aa');
        closeNotice();
      }, 3000);
    }
  }, [closeNotice, show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`${styles.container} ${
            isSuccessed ? styles.successed : styles.failed
          }`}
          variants={variants}
          initial='initial'
          animate='animate'
          exit='exit'
        >
          <div className={styles.header}>
            <div className={styles.result}>{header}</div>
            <button onClick={closeNotice}>✕</button>
          </div>
          <div className={styles.message}>{message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notice;
