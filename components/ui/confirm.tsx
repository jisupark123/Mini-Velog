import React from 'react';
import styles from './confirm.module.scss';
import Overlay from './overlay';

interface ConfirmProps {
  message: string;
  handleCancel: () => void;
  handleOk: () => void;
}

export const initialConfirm = {
  show: false,
  message: '',
  handleOk: () => {},
};

const Comfirm: React.FC<ConfirmProps> = ({
  message,
  handleCancel,
  handleOk,
}) => {
  return (
    <Overlay onCloseHandler={handleCancel}>
      <div className={styles.container}>
        <div className={styles.question}>{message}</div>
        <div className={styles.btns}>
          <button onClick={handleCancel}>취소</button>
          <button onClick={handleOk}>OK</button>
        </div>
      </div>
    </Overlay>
  );
};

export default Comfirm;
