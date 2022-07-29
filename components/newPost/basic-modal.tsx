import React, { ReactNode } from 'react';
import styles from './basic-modal.module.scss';

interface BasicModalProps {
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
  header,
  children,
  backBtn,
  rightBtn,
}) => {
  return (
    <div className={`${styles.container}`}>
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
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default BasicModal;
