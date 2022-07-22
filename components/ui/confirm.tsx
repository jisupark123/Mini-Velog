import React from 'react';
import { useConfirm } from '../../store/confirm-context';
import styles from './confirm.module.scss';
import Overlay from './overlay';

const Comfirm: React.FC = () => {
  const { show, message, okClicked, cancelClicked } = useConfirm();
  return (
    <>
      {show && (
        <Overlay onCloseHandler={cancelClicked} onTop={true}>
          <div className={styles.container}>
            <div className={styles.question}>{message}</div>
            <div className={styles.btns}>
              <button onClick={cancelClicked}>취소</button>
              <button onClick={okClicked}>OK</button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
};

export default Comfirm;
