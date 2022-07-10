import React from 'react';
import styles from './display-length.module.scss';

interface DisplayLengthProps {
  limit: number;
  value: number;
}

const DisplayLength: React.FC<DisplayLengthProps> = ({ limit, value }) => {
  return (
    <div className={styles.container}>
      <span
        className={`${styles['length']} ${
          value > limit ? styles['over-limit'] : ''
        }`}
      >
        {value}
      </span>
      /<span className={styles['limit-length']}>{limit}</span>
    </div>
  );
};

export default DisplayLength;
