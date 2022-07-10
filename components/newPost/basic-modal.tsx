import React, { ReactNode } from 'react';
import styles from './basic-modal.module.scss';

interface BasicModalProps {
  wide?: boolean;
  header: string;
  children: ReactNode;
  backBtn?: {
    onClickHandler: () => void;
  };
  rightBtn: {
    title: string;
    onClickHandler: () => void;
  };
}

const BasicModal: React.FC<BasicModalProps> = ({
  wide,
  header,
  children,
  backBtn,
  rightBtn,
}) => {
  return (
    <div className={`${styles.container} ${wide ? styles.wide : ''}`}>
      <header className={styles.header}>
        {backBtn && (
          <div className={styles['back-btn']}>
            <button onClick={backBtn.onClickHandler}>←</button>
          </div>
        )}
        <h4 className={styles['header-title']}>{header}</h4>
        <div className={styles['right-btn']}>
          <button onClick={rightBtn.onClickHandler}>{rightBtn.title}</button>
        </div>
      </header>
      {children}
    </div>
  );
};

export default BasicModal;
